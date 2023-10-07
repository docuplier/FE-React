import { useMutation, useQuery } from '@apollo/client';
import { Box, TextField, Typography } from '@material-ui/core';
import { CREATE_FACULTY, UPDATE_FACULTY } from 'graphql/mutations/institution';
import { GET_FACULTY_BY_ID_QUERY } from 'graphql/queries/institution';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Banner from 'reusables/Banner';
import Drawer from 'reusables/Drawer';
import FileUpload from 'reusables/FileUpload';
import { WorksheetUploadFormats } from 'utils/constants';
import LoadingView from 'reusables/LoadingView';
import { useNotification } from 'reusables/NotificationBanner';
import { getFormError } from 'utils/formError';
import { BULK_UPLOAD_RESOURCE } from 'graphql/mutations/courses';
import FacultyCSVSample from 'assets/csv/faculty-csv-sample.csv';

const CurrentActiveState = {
  ACTIVE: `active`,
  IN_ACTIVE: `in_active`,
};

const UpsertFaculty = ({ open, onClose, facultyId, institutionId, onCompletedCallback }) => {
  const isEditing = Boolean(facultyId);
  const notification = useNotification();

  const { data, loading, refetch } = useQuery(GET_FACULTY_BY_ID_QUERY, {
    variables: {
      facultyId,
    },
    skip: !facultyId,
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const [createFaculty, { loading: isLoadingCreateFaculty }] = useMutation(CREATE_FACULTY, {
    onCompleted: ({ createFaculty: { ok, errors } }) => {
      if (ok) {
        notification.success({
          message: 'Faculty created successfully',
        });
        onCompletedCallback?.(data);
        onClose();
        return;
      }

      notification.error({
        message: errors?.messages,
      });
    },
  });

  const [updateFaculty, { loading: isLoadingUpdateFaculty }] = useMutation(UPDATE_FACULTY, {
    onCompleted: (data) => {
      refetch();
      onCompletedCallback();
      notification.success({
        message: 'Faculty updated successfully',
      });
      onClose();
    },
  });

  const [uploadResourceMutation, { loading: isLoadingUploadFaculty }] = useMutation(
    BULK_UPLOAD_RESOURCE,
    {
      onCompleted: (response) => {
        const { success, errors } = response.bulkUpload;
        if (success) {
          onCompletedCallback?.(data);
          notification.success({
            message: 'Faculties uploaded successfully',
          });
          onClose();
        }
        if (errors) {
          notification.error({
            message: errors.messages,
          });
        }
      },
    },
  );

  const { handleSubmit, control, watch, errors, reset } = useForm();
  const descriptionLength = watch('description', '')?.length;

  useEffect(() => {
    if (data) {
      reset({
        name: data?.faculty?.name,
        abbreviation: data?.faculty?.abbreviation,
        description: data?.faculty?.description,
        isActive: data?.faculty?.isActive
          ? CurrentActiveState.ACTIVE
          : CurrentActiveState.IN_ACTIVE,
      });
    }
    // eslint-disable-next-line
  }, [data]);

  const onSubmit = (values) => {
    if (Boolean(values.file)) {
      uploadResourceMutation({
        variables: {
          uploadDetails: {
            resourceName: 'faculty',
            file: values.file,
          },
        },
      });
      return;
    }

    isEditing
      ? updateFaculty({
          variables: {
            newFaculty: {
              ...values,
              isActive: values.isActive === CurrentActiveState.ACTIVE ? true : false,
              id: facultyId,
            },
          },
        })
      : createFaculty({
          variables: {
            newFaculty: {
              ...values,
              institutionId,
            },
          },
        });
  };

  const renderSwitch = () => {
    return (
      isEditing && (
        <Box mb={5}>
          <Controller
            name="isActive"
            control={control}
            rules={{ required: true }}
            render={({ onChange, value }) => {
              const isActive = value === CurrentActiveState.ACTIVE;

              return (
                <Box mb={5}>
                  <Banner
                    showSwitch={true}
                    title={isActive ? 'Active' : 'Inactive'}
                    message="When a user deactivates a school, all the learners and instructors attached to the school should be notified of the action (by email and In-app notification)"
                    checked={isActive ? true : false}
                    onToggleSwitch={(value) =>
                      onChange(value ? CurrentActiveState.ACTIVE : CurrentActiveState.IN_ACTIVE)
                    }
                    severity={isActive ? 'success' : 'error'}
                  />
                </Box>
              );
            }}
          />
        </Box>
      )
    );
  };

  const renderSingleUpload = () => {
    return (
      <form noValidate autoComplete="off">
        {renderSwitch()}
        <Controller
          name="name"
          defaultValue=""
          control={control}
          rules={{ required: true }}
          render={({ ref, ...fieldProps }) => (
            <TextField
              {...fieldProps}
              inputRef={ref}
              label="Faculty name"
              variant="outlined"
              required
              fullWidth
              error={getFormError('name', errors).hasError}
              helperText={getFormError('name', errors).message}
            />
          )}
        />
        <Box mt={5}>
          <Controller
            name="abbreviation"
            defaultValue=""
            control={control}
            rules={{ required: true }}
            render={({ ref, ...fieldProps }) => (
              <TextField
                {...fieldProps}
                inputRef={ref}
                label="Faculty code"
                variant="outlined"
                required
                fullWidth
                error={getFormError('abbreviation', errors).hasError}
                helperText={getFormError('abbreviation', errors).message}
              />
            )}
          />
        </Box>
        <Box mt={5}>
          <Controller
            name="description"
            defaultValue=""
            control={control}
            rules={{ required: true, maxLength: 250 }}
            render={({ ref, ...fieldProps }) => (
              <TextField
                {...fieldProps}
                inputProps={{
                  maxlength: 250,
                }}
                inputRef={ref}
                variant="outlined"
                label="Faculty description"
                required
                fullWidth
                multiline
                rows={5}
                error={getFormError('description', errors).hasError}
                helperText={getFormError('description', errors).message}
              />
            )}
          />
          <Box mt={1} display="flex" justifyContent="flex-end">
            <Typography color="textSecondary" variant="body2">
              Character {descriptionLength}/250
            </Typography>
          </Box>
        </Box>
      </form>
    );
  };

  const renderBulkUpload = () => {
    return (
      <Controller
        name="file"
        control={control}
        rules={{ required: true }}
        render={({ onChange, value, ...rest }) => (
          <FileUpload
            accept={WorksheetUploadFormats}
            onChange={(file) => onChange(file)}
            file={value}
            fileSample={FacultyCSVSample}
            {...rest}
          />
        )}
      />
    );
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={isEditing ? 'Edit Faculty' : 'Add New Faculty'}
      tabList={
        !isEditing
          ? [
              { label: 'Single', panel: renderSingleUpload() },
              { label: 'Bulk Upload', panel: renderBulkUpload() },
            ]
          : null
      }
      okText={isEditing ? 'Update' : 'Create'}
      onOk={handleSubmit(onSubmit)}
      okButtonProps={{
        isLoading: isLoadingCreateFaculty || isLoadingUpdateFaculty || isLoadingUploadFaculty,
      }}>
      <LoadingView isLoading={loading}>{isEditing && renderSingleUpload()}</LoadingView>
    </Drawer>
  );
};

UpsertFaculty.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  facultyId: PropTypes.string,
  institutionId: PropTypes.string,
  onCompletedCallback: PropTypes.func,
};

export default React.memo(UpsertFaculty);
