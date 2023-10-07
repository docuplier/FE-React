import React from 'react';
import { useForm, Controller } from 'react-hook-form';

import AssignmentDetailLayout from 'Layout/AssignmentDetailLayout';
import { ArrowBackIos, Visibility } from '@material-ui/icons';
import { useHistory, useParams } from 'react-router-dom';
import { Box, Grid, IconButton, Paper, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { fontWeight, spaces } from '../../Css';
import FilePreview from 'reusables/FilePreview';
import LoadingButton from 'reusables/LoadingButton';
import Empty from 'reusables/Empty';
import { PrivatePaths } from 'routes';
import { GET_ASSIGNMENT_SUBMISSION_BY_ID } from 'graphql/queries/courses';
import useNotification from 'reusables/NotificationBanner/useNotification';
import { useMutation, useQuery } from '@apollo/client';
import LoadingView from 'reusables/LoadingView';
import { convertIsoDateTimeToDateTime } from 'utils/TransformationUtils';
import { UPDATE_ASSIGNMENT_SUBMISSION } from 'graphql/mutations/courses';
import { getFormError } from 'utils/formError';

const AssignmentGrade = () => {
  const classes = useStyles();
  const history = useHistory();
  const { courseId } = useParams();
  const { assignmentId, enrolleeId } = useParams();
  const notification = useNotification();
  const { handleSubmit, errors, control, reset } = useForm();

  const { data, loading } = useQuery(GET_ASSIGNMENT_SUBMISSION_BY_ID, {
    variables: {
      submissionId: enrolleeId,
    },
    onCompleted: (data) => {
      const { remark, score = 0 } = data?.assignmentSubmission || {};
      reset({
        number: score,
        note: remark,
      });
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });
  const assignmentData = data?.assignmentSubmission;
  const assignmentSubmittor = data?.assignmentSubmission?.submitedBy;
  const linkData = data?.assignmentSubmission?.assignment;

  const [updateAssignment, { loading: isPerformingUpdate }] = useMutation(
    UPDATE_ASSIGNMENT_SUBMISSION,
    {
      onCompleted: () => {
        notification.success({
          message: 'Assignment updated successfully',
        });
        history.goBack();
      },
      onError: (error) => {
        notification.error({
          message: error?.message,
        });
      },
    },
  );

  const links = [
    { title: 'Home', to: '/' },
    { title: 'Course', to: `${PrivatePaths.COURSES}` },
    {
      title: `${linkData?.course?.title}`,
      to: `${PrivatePaths.COURSES}/${courseId}`,
    },
    { title: 'Assignment', to: `${PrivatePaths.COURSES}/${courseId}/assignmentss/${assignmentId}` },
    { title: `${linkData?.title}`, to: '#' },
  ];

  const handlePreview = (url) => {
    window.open(url);
  };

  const onSubmit = (value) => {
    updateAssignment({
      variables: {
        id: enrolleeId, //@same as submittion id
        files: assignmentData?.files,
        body: assignmentData?.body,
        score: value.number || assignmentData?.score,
        remark: value.note || assignmentData?.remark,
        assignment: assignmentId, //@same as assignmentId
      },
    });
  };

  const renderTopDetail = () => {
    return (
      <Box className={classes.detailText} py={12} px={15} mt={12}>
        <Typography variant="h6" color="textPrimary">
          {assignmentSubmittor?.firstname} {assignmentSubmittor?.middlename}
          {assignmentSubmittor?.lastname}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Submitted on {convertIsoDateTimeToDateTime(assignmentData?.createdAt)}
        </Typography>
      </Box>
    );
  };

  const renderEmpty = () => {
    return (
      <Box>
        <Empty title="No files" description="No files attached" />
      </Box>
    );
  };

  const renderAssignmentDetail = () => {
    return (
      <LoadingView isLoading={loading}>
        <Grid container>
          <Grid item xs={8}>
            <Box py={15} px={15} component={Paper} square className={classes.description}>
              <Typography
                variant="body1"
                color="textPrimary"
                dangerouslySetInnerHTML={{ __html: assignmentData?.body }}
              />
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box component={Paper} square px={12} py={12} className={classes.fileSection}>
              <Box className="learners-name">
                <Typography variant="h6" color="textPrimary">
                  {assignmentSubmittor?.firstname && `${assignmentSubmittor?.firstname}’s`} Note
                </Typography>
              </Box>
              {Boolean(assignmentData?.files?.length)
                ? assignmentData?.files?.map((file) => {
                    const fileNameArray = file?.file?.split('/');
                    const fileName = fileNameArray[fileNameArray.length - 1];
                    return (
                      <Box mb={5}>
                        <FilePreview
                          file={{
                            name: fileName,
                            type: file.type,
                            size: file.fileSize,
                            url: file.file,
                          }}
                          limitInformationToSize={true}
                          rightContent={
                            <IconButton onClick={() => handlePreview(file.file)}>
                              <Visibility />
                            </IconButton>
                          }
                        />
                      </Box>
                    );
                  })
                : renderEmpty()}
            </Box>
          </Grid>
        </Grid>
      </LoadingView>
    );
  };

  const renderRemarkdetail = () => {
    const maxScore = assignmentData?.assignment?.maxScore;
    return (
      <Box>
        <Box className={classes.remarksection} py={12} px={12}>
          <Typography varaint="h6">
            Overall Score: {assignmentData?.assignment?.maxScore}
          </Typography>
        </Box>
        <Box py={12} px={12} component={Paper} square>
          <Typography variant="body1" color="textPrimary" className={classes.review}>
            Review
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="number"
              control={control}
              rules={{
                required: true,
                max: {
                  value: maxScore,
                  message: `score must not be greater than ${maxScore}`,
                },
              }}
              render={({ ref, ...rest }) => (
                <TextField
                  {...rest}
                  inputRef={ref}
                  type="number"
                  name="number"
                  label="score"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  error={getFormError('number', errors).hasError}
                  helperText={getFormError('number', errors).message}
                />
              )}
            />

            <Controller
              name="note"
              label="Note"
              control={control}
              render={({ ref, ...rest }) => (
                <TextField
                  {...rest}
                  fullWidth
                  inputRef={ref}
                  multiline
                  name="note"
                  rows={6}
                  variant="outlined"
                  label="Note"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={getFormError('note', errors).hasError}
                  helperText={getFormError('note', errors).message}
                />
              )}
            />
            <LoadingButton
              isLoading={isPerformingUpdate}
              type="submit"
              color="primary"
              variant="contained"
              style={{ float: 'right' }}>
              Update
            </LoadingButton>
          </form>
        </Box>
      </Box>
    );
  };

  return (
    <AssignmentDetailLayout
      links={links}
      isLoading={loading}
      headerText={
        <Typography className={classes.nav} onClick={() => history.goBack()}>
          <ArrowBackIos /> Back to assignment details
        </Typography>
      }>
      <div style={{ paddingBottom: 80 }}>
        {renderTopDetail()}
        {renderAssignmentDetail()}
        {renderRemarkdetail()}
      </div>
    </AssignmentDetailLayout>
  );
};

const useStyles = makeStyles(() => ({
  nav: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  detailText: {
    background: '#F7F8F9',
    borderRadius: '8px 8px 0px 0px',
    boxSizing: 'border-box',
    '&:nth-child(1)': {
      fontWeight: fontWeight.bold,
    },
  },
  description: {
    height: 348,
    overflowY: 'hidden',
    '&:hover': {
      overflowY: 'scroll',
    },
  },
  fileSection: {
    height: 360,
    overflowY: 'hidden',
    position: 'relative',
    background: '#F1F2F6',
    '&:hover': {
      overflowY: 'scroll',
    },
    '& .learners-name': {
      height: 50,
    },
  },
  remarksection: {
    background: '#F7F8F9',
    border: '1px solid #E7E7ED',
    boxSizing: 'border-box',
    '& > *': {
      fontWeight: fontWeight.bold,
    },
  },
  form: {
    marginBottom: 80,
    '& > *': {
      display: 'block',
      marginBottom: spaces.medium,
    },
  },
  review: {
    fontWeight: fontWeight.medium,
    paddingBottom: spaces.medium,
  },
}));

export default AssignmentGrade;
