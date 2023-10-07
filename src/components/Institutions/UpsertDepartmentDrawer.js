import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { TextField, Box, Typography } from '@material-ui/core';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQuery } from '@apollo/client';

import Drawer from 'reusables/Drawer';
import FileUpload from 'reusables/FileUpload';
import { WorksheetUploadFormats } from 'utils/constants';
import { getFormError } from 'utils/formError';
import Banner from 'reusables/Banner';
import { GET_DEPARTMENT_BY_ID_QUERY } from 'graphql/queries/institution';
import { useNotification } from 'reusables/NotificationBanner';
import LoadingView from 'reusables/LoadingView';
import { CREATE_DEPARTMENT, UPDATE_DEPARTMENT } from 'graphql/mutations/institution';
import DepartmentCSVSample from 'assets/csv/department-csv-sample.csv';
import { BULK_UPLOAD_RESOURCE } from 'graphql/mutations/courses';

const CurrentActiveState = {
  ACTIVE: `active`,
  IN_ACTIVE: `in_active`,
};

const UpsertDepartmentDrawer = ({
  open,
  onClose,
  departmentId,
  facultyId,
  onCompletedCallback,
}) => {
  const isEditing = Boolean(departmentId);
  const notification = useNotification();

  const { data, loading, refetch } = useQuery(GET_DEPARTMENT_BY_ID_QUERY, {
    variables: {
      departmentId,
    },
    skip: !departmentId,
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const [createDepartment, { loading: isLoadingCreateDepartment }] = useMutation(
    CREATE_DEPARTMENT,
    {
      onCompleted: (data) => {
        if (!data?.createDepartment?.ok) {
          return notification.error({
            message: data?.createDepartment?.errors?.messages,
          });
        }
        notification.success({
          message: 'Department created successfully',
        });
        onCompletedCallback?.(data);
        onClose();
      },
    },
  );

  const [updateDepartment, { loading: isLoadingUpdateDepartment }] = useMutation(
    UPDATE_DEPARTMENT,
    {
      onCompleted: (data) => {
        onCompletedCallback?.(data);
        refetch();
        notification.success({
          message: 'Department updated successfully',
        });
        onClose();
      },
    },
  );

  const [uploadResourceMutation, { loading: isLoadingUploadDepartment }] = useMutation(
    BULK_UPLOAD_RESOURCE,
    {
      onCompleted: (response) => {
        const { success, errors } = response.bulkUpload;
        if (success) {
          onCompletedCallback?.(data);
          notification.success({
            message: 'Departments uploaded successfully',
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
        name: data?.department?.name,
        abbreviation: data?.department?.abbreviation,
        description: data?.department?.description,
        isActive: data?.department?.isActive
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
            resourceName: 'department',
            file: values.file,
          },
        },
      });
      return;
    }

    isEditing
      ? updateDepartment({
          variables: {
            newDepartment: {
              ...values,
              isActive: values.isActive === CurrentActiveState.ACTIVE ? true : false,
              id: departmentId,
            },
          },
        })
      : createDepartment({
          variables: {
            newDepartment: {
              ...values,
              facultyId,
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
                    message="When a user deactivates a department, all the learners and instructors attached to the department should be notified of the action (by email and In-app notification)"
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
          control={control}
          rules={{ required: true }}
          render={({ ref, ...rest }) => (
            <TextField
              {...rest}
              label="Department name"
              variant="outlined"
              required
              fullWidth
              inputRef={ref}
              error={getFormError('name', errors).hasError}
              helperText={getFormError('name', errors).message}
            />
          )}
        />
        <Box mt={5}>
          <Controller
            name="abbreviation"
            control={control}
            rules={{ required: true }}
            render={({ ref, ...rest }) => (
              <TextField
                {...rest}
                label="Department code"
                variant="outlined"
                required
                fullWidth
                inputRef={ref}
                error={getFormError('abbreviation', errors).hasError}
                helperText={getFormError('abbreviation', errors).message}
              />
            )}
          />
        </Box>
        <Box mt={5}>
          <Controller
            name="description"
            control={control}
            rules={{ required: true, maxLength: 250 }}
            render={({ ref, ...fieldProps }) => (
              <TextField
                {...fieldProps}
                variant="outlined"
                label="Department description"
                required
                inputProps={{
                  maxlength: 250,
                }}
                fullWidth
                multiline
                rows={5}
                inputRef={ref}
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
            fileSample={DepartmentCSVSample}
            file={value}
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
      title={isEditing ? 'Edit Department' : 'Add New Department'}
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
        isLoading:
          isLoadingCreateDepartment || isLoadingUpdateDepartment || isLoadingUploadDepartment,
      }}>
      <LoadingView isLoading={loading}>{isEditing && renderSingleUpload()}</LoadingView>
    </Drawer>
  );
};

UpsertDepartmentDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  departmentId: PropTypes.string,
  facultyId: PropTypes.string,
  onCompletedCallback: PropTypes.func,
};

export default React.memo(UpsertDepartmentDrawer);
