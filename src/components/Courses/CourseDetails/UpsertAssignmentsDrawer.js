import React, { useEffect, useState } from 'react';
import { Box, Drawer, Grid, Typography, TextField, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useForm, Controller } from 'react-hook-form';

import NavigationBar from 'reusables/NavigationBar';
import LoadingView from 'reusables/LoadingView';
import RegistrationLayout from 'Layout/RegistrationLayout';
import { fontWeight, fontSizes, fontFamily, colors, spaces } from '../../../Css';
import { getFormError } from 'utils/formError';
import FileUpload from 'reusables/FileUpload';
import { ImageUploadFormats, CourseStatus } from 'utils/constants';
import { CREATE_ASSIGNMENT, UPDATE_ASSIGNMENT } from 'graphql/mutations/courses';
import { useMutation, useQuery } from '@apollo/client';
import { convertToSentenceCase, formatFileName, getFileExtension } from 'utils/TransformationUtils';
import useNotification from 'reusables/NotificationBanner/useNotification';
import { GET_ASSIGNMENT_BY_ID } from 'graphql/queries/courses';

const UpsertAssignmentsDrawer = ({ open, onClose, course, assignmentId, onCompletedCallback }) => {
  const classes = useStyles();
  const { errors, control, handleSubmit, reset, watch } = useForm();
  const { startDate, dueDate } = watch();
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const notification = useNotification();

  const {
    isLoading: isAssignmetLoading,
    data: assignmentData,
    refetch,
  } = useQuery(GET_ASSIGNMENT_BY_ID, {
    variables: { assignmentId },
    onError: (error) => {
      notification.error({
        message: 'Error!',
        description: error?.message,
      });
    },
    skip: !assignmentId,
  });

  const [createAssignment, { loading: newAssignmentLoading }] = useMutation(CREATE_ASSIGNMENT, {
    onCompleted: (response) => onCompleted(response.createAssignment),
    onError,
  });

  const [updateAssignment, { loading: updateAssignmentLoading }] = useMutation(UPDATE_ASSIGNMENT, {
    onCompleted: (response) => onCompleted(response.updateAssignment),
    onError,
  });

  const publishingAssignmentLoading = () => {
    return (
      (newAssignmentLoading || updateAssignmentLoading) && selectedStatus === CourseStatus.PUBLISHED
    );
  };

  useEffect(() => {
    const { assignment } = assignmentData || {};
    if (assignment && open) {
      reset({
        ...assignment,
        files: assignment?.files?.map((file) => ({
          name: formatFileName(file.file),
          size: file.fileSize,
          type: getFileExtension(file.file),
          url: file.file,
          id: file.id,
        })),
      });
    }
    // eslint-disable-next-line
  }, [assignmentData, open]);

  function onCompleted(response) {
    const { ok, errors, assignment } = response;
    const status = ok === false ? 'error' : 'success';
    notification[status]({
      message: `${convertToSentenceCase(status)}!`,
      description: getNotificationMsg({ errors, assignment }),
    });
    handleCloseDrawer();
    onCompletedCallback?.();
    refetch();
  }

  function getNotificationMsg({ errors, assignment }) {
    return errors
      ? errors?.map((error) => error.messages).join('. ')
      : !assignmentId
      ? `Assignment has been ${
          assignment?.status === CourseStatus.DRAFT ? 'saved as draft' : 'created successfully'
        }`
      : 'Assignment has been updated successfully';
  }

  function onError(error) {
    notification.error({
      message: 'Error!',
      description: error?.message,
    });
  }

  const handleCloseDrawer = () => {
    onClose();
  };

  const getHeaderButtonProps = () => {
    return [
      {
        text: 'Save as draft',
        variant: 'outlined',
        isLoading:
          (newAssignmentLoading || updateAssignmentLoading) &&
          selectedStatus === CourseStatus.DRAFT,
        onClick: handleSubmit((variables) => {
          setSelectedStatus(CourseStatus.DRAFT);
          onSubmit(variables, CourseStatus.DRAFT);
        }),
      },
      {
        text: 'Publish assignment',
        variant: 'contained',
        disabled: publishingAssignmentLoading(),
        isLoading: publishingAssignmentLoading(),
        color: 'primary',
        onClick: handleSubmit((variables) => {
          setSelectedStatus(CourseStatus.PUBLISHED);
          onSubmit(variables, CourseStatus.PUBLISHED);
        }),
      },
    ];
  };

  const onSubmit = (variables, status) => {
    const values = {
      ...variables,
      status,
    };

    let files = [];
    variables.files?.forEach((file) => {
      if (file instanceof File) {
        files.push(file);
      }
    });
    delete values.files; // Endpoint doesnt accept file as part of newAssignment object fields.

    if (!!assignmentId) {
      updateAssignment({
        variables: {
          files,
          deleteFiles: deletedFiles,
          assignmentId,
          newAssignment: {
            ...values,
          },
        },
      });
      return;
    }

    createAssignment({
      variables: { ...values, files, course: course.id },
    });
  };

  const onRemoveFile = (id) => {
    if (!deletedFiles.includes(id)) {
      setDeletedFiles((prevState) => [...prevState, id]);
    }
  };

  return (
    <Drawer open={open} anchor="bottom">
      <NavigationBar />
      <LoadingView isLoading={isAssignmetLoading} size={60}>
        <RegistrationLayout
          onClose={handleCloseDrawer}
          title={!!assignmentId ? 'Edit Assignment' : 'Add New'}
          hasHeaderButton
          headerButtons={getHeaderButtonProps()}>
          <Box className={classes.content}>
            <Box className={classes.container} mb={10}>
              <Typography className="header">
                {!!assignmentId ? 'Edit Assignment' : 'Create assignment'}
              </Typography>
              <Typography variant="body1" color="textPrimary">
                The Prunedge Smart Toolbar groups all actions by scope into 4 categories.
              </Typography>
            </Box>
            <Box mt={25}>
              <form className={classes.form}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={9}>
                    <Box className={classes.form} style={{ maxWidth: 700 }}>
                      <Controller
                        name="title"
                        control={control}
                        rules={{ required: 'Assignment title is required' }}
                        render={({ ref, ...rest }) => (
                          <TextField
                            {...rest}
                            inputRef={ref}
                            fullWidth
                            variant="outlined"
                            label="Assignment title"
                            error={getFormError('title', errors).hasError}
                            helperText={getFormError('title', errors).message}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        )}
                      />
                      <Controller
                        name="body"
                        control={control}
                        rules={{ required: 'Assignment details is required' }}
                        render={({ ref, ...rest }) => (
                          <TextField
                            {...rest}
                            multiline
                            rows={8}
                            inputRef={ref}
                            fullWidth
                            variant="outlined"
                            label="Assignment details"
                            error={getFormError('body', errors).hasError}
                            helperText={getFormError('body', errors).message}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        )}
                      />
                      <Controller
                        name="files"
                        control={control}
                        render={({ onChange, value, ...rest }) => (
                          <FileUpload
                            accept={ImageUploadFormats}
                            multiple
                            onChange={(files) => onChange(files)}
                            files={value}
                            onRemove={(file) =>
                              file instanceof File ? null : onRemoveFile(file.id)
                            }
                            id="files"
                            {...rest}
                          />
                        )}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box
                      border="1px solid #CDCED9"
                      borderRadius={8}
                      p={10}
                      className={classes.form}>
                      <Controller
                        name="maxScore"
                        control={control}
                        rules={{ required: 'Maximum score is required' }}
                        render={({ ref, ...rest }) => (
                          <TextField
                            {...rest}
                            inputRef={ref}
                            fullWidth
                            type="number"
                            variant="outlined"
                            label="Assignment overall score"
                            error={getFormError('maxScore', errors).hasError}
                            helperText={getFormError('maxScore', errors).message}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        )}
                      />
                      <Box py={5}>
                        <Divider />
                      </Box>
                      <Controller
                        name="startDate"
                        control={control}
                        rules={{
                          max: {
                            value: dueDate,
                            message: 'Start date cannot be more than end date',
                          },
                        }}
                        render={({ ref, ...rest }) => (
                          <TextField
                            {...rest}
                            inputRef={ref}
                            type="date"
                            variant="outlined"
                            label="Start date"
                            defaultValue="Due date"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            fullWidth
                            error={getFormError('startDate', errors).hasError}
                            helperText={getFormError('startDate', errors).message}
                          />
                        )}
                      />
                      <Controller
                        name="dueDate"
                        control={control}
                        rules={{
                          min: {
                            value: startDate,
                            message: 'End date cannot be less than start date',
                          },
                        }}
                        render={({ ref, ...rest }) => (
                          <TextField
                            {...rest}
                            inputRef={ref}
                            type="date"
                            variant="outlined"
                            label="End date"
                            defaultValue="Due date"
                            InputLabelProps={{
                              shrink: true,
                            }}
                            fullWidth
                            error={getFormError('dueDate', errors).hasError}
                            helperText={getFormError('dueDate', errors).message}
                          />
                        )}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </Box>
        </RegistrationLayout>
      </LoadingView>
    </Drawer>
  );
};

const useStyles = makeStyles({
  container: {
    maxWidth: 800,
    '& .header': {
      fontWeight: fontWeight.medium,
      fontSize: fontSizes.title,
      color: colors.black,
      fontFamily: fontFamily.primary,
      padding: 0,
    },
  },
  form: {
    '& .MuiTextField-root': {
      marginBottom: spaces.medium,
    },
  },
  rightContent: {
    display: 'flex',
    justifyContent: 'flex-end',
    '& .visibility-icon': {
      marginRight: 10,
    },
  },
});

export default React.memo(UpsertAssignmentsDrawer);
