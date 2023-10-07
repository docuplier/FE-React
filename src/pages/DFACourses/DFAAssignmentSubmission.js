import { useMutation } from '@apollo/client';
import { Box, Button, Grid, IconButton, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import classNames from 'classnames';
import { CREATE_ASSIGNMENT_SUBMISSION } from 'graphql/mutations/courses';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import ConfirmationDialog from 'reusables/ConfirmationDialog';
import FileUpload from 'reusables/FileUpload';
import LoadingButton from 'reusables/LoadingButton';
import MaxWidthContainer from 'reusables/MaxWidthContainer';
import { useNotification } from 'reusables/NotificationBanner';
import Wysiwyg from 'reusables/Wysiwyg';
import { AssignmentUploadFormats } from 'utils/constants';
import { borderRadius, colors, fontSizes, fontWeight } from '../../Css';

const DFAAssignmentSubmission = () => {
  const history = useHistory();
  const classes = useStyles();
  const notification = useNotification();
  const [isConfirmationDialogVisible, setIsConfirmationDialogVisible] = useState(false);

  const { assignmentId } = useParams();
  const { handleSubmit, control } = useForm();

  const {
    state: { title, dueDate },
  } = useLocation();

  const onSubmit = (values) => {
    createAssignmentSubmission({
      variables: {
        newAssignmentsubmission: {
          assignment: assignmentId,
          body: values?.assignmentContent?.html,
        },
        files: values?.file ? [values?.file] : undefined,
      },
    });
  };

  const [createAssignmentSubmission, { loading }] = useMutation(CREATE_ASSIGNMENT_SUBMISSION, {
    onCompleted: ({ createAssignmentSubmission: { ok, errors } }) => {
      if (ok) {
        notification.success({
          message: 'Assignment submitted successfully',
        });
        history.goBack();
        return;
      }

      notification.error({
        message: errors?.map((error) => error.messages).join('. '),
      });
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const renderSecondaryHeader = () => {
    return (
      <Box mb={15} py={10} style={{ background: colors.xLightGrey }}>
        <MaxWidthContainer>
          <Box display="flex" alignItems="center">
            <IconButton onClick={() => history.goBack()} size="small">
              <CloseIcon />
            </IconButton>
            <Box ml={8}>
              <Typography variant="body1" color="textPrimary" className={classes.boldText}>
                Assignment
              </Typography>
            </Box>
          </Box>
        </MaxWidthContainer>
      </Box>
    );
  };

  const renderRightContent = () => {
    return (
      <Grid item xs={12} sm={4}>
        <Box py={8} px={10} className={classes.attachments} style={{ minHeight: 250 }}>
          <Controller
            name="file"
            control={control}
            render={({ onChange, value, ...rest }) => (
              <FileUpload
                accept={AssignmentUploadFormats}
                onChange={(file) => onChange(file)}
                file={value}
                {...rest}
              />
            )}
          />
        </Box>
      </Grid>
    );
  };

  return (
    <div className={classes.wrapper}>
      {renderSecondaryHeader()}
      <MaxWidthContainer>
        <form onSubmit={handleSubmit(onSubmit)} className="form-container">
          <Box py={4} pl={8} className={classNames(classes.greyBackground, 'borderBottom')}>
            <Typography className={classes.assignmentTitle}>{title}</Typography>
            <Typography>Due Date: {dueDate}</Typography>
          </Box>
          <Box py={10} px={8} style={{ background: `${colors.white}` }}>
            <Grid container spacing={10}>
              <Grid item xs={12} sm={8}>
                <Controller
                  name="assignmentContent"
                  control={control}
                  rules={{ required: true }}
                  render={({ value, onChange }) => <Wysiwyg onChange={onChange} value={value} />}
                />
              </Grid>
              {renderRightContent()}
            </Grid>
          </Box>
          <Box
            display="flex"
            justifyContent="flex-end"
            py={8}
            pr={8}
            style={{ background: '#FAFAFA' }}
          >
            <Button
              variant="contained"
              style={{ marginRight: 16 }}
              onClick={() => setIsConfirmationDialogVisible(true)}
            >
              Cancel
            </Button>
            <LoadingButton
              disableElevation
              className={classes.submitButton}
              variant="contained"
              type="submit"
              color="primary"
              isLoading={loading}
            >
              Submit
            </LoadingButton>
          </Box>
        </form>
      </MaxWidthContainer>
      <ConfirmationDialog
        open={isConfirmationDialogVisible}
        title={`You will lose unsaved data`}
        description="Lorem ipsum dolor amet connecteur"
        okText="Exit and lose data"
        onOk={() => history.goBack()}
        cancelText="Continue editing"
        onClose={() => setIsConfirmationDialogVisible(false)}
      />
    </div>
  );
};

const useStyles = makeStyles(() => ({
  greyBackground: {
    background: colors.xLightGrey,
    '&.borderTop': {
      borderTop: `1px solid ${colors.seperator}`,
    },
    '&.borderBottom': {
      borderBottom: `1px solid ${colors.seperator}`,
    },
  },
  wrapper: {
    '& .form-container': {
      border: `1px solid ${colors.seperator}`,
      borderRadius: borderRadius.small,
      boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
    },
    '& .rdw-editor-toolbar.toolbarClassName': {
      background: colors.xLightGrey,
    },
  },
  attachments: {
    borderRadius: borderRadius.default,
    background: colors.xLightGrey,
    border: `1px solid ${colors.seperator}`,
  },
  boldText: {
    fontWeight: fontWeight.bold,
    fontSize: fontSizes.xlarge,
  },
  assignmentTitle: {
    fontWeight: fontWeight.medium,
    fontSize: fontSizes.large,
  },
}));

export default DFAAssignmentSubmission;
