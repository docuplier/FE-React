import { useQuery } from '@apollo/client';
import { Box, Drawer, Grid, IconButton, Paper, Typography } from '@material-ui/core';
import { Visibility } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import { format } from 'date-fns';
import { GET_ASSIGNMENT_SUBMISSIONS } from 'graphql/queries/courses';
import RegistrationLayout from 'Layout/RegistrationLayout';
import React from 'react';
import { useParams } from 'react-router-dom';
import Empty from 'reusables/Empty';
import FilePreview from 'reusables/FilePreview';
import LoadingView from 'reusables/LoadingView';
import NavigationBar from 'reusables/NavigationBar';
import useNotification from 'reusables/NotificationBanner/useNotification';
import { formatFileName, getFileExtension } from 'utils/TransformationUtils';
import { fontSizes, spaces } from '../../../Css';

const StudentAssignmentSubmissionDrawer = ({ open, onClose }) => {
  const classes = useStyles();
  const notification = useNotification();
  const handleCloseDrawer = () => {
    onClose();
  };

  const { assignmentId } = useParams();

  const { data, loading } = useQuery(GET_ASSIGNMENT_SUBMISSIONS, {
    variables: {
      assignmentId,
    },
    onError: (error) => {
      notification.error({
        message: 'Error!',
        description: error?.message,
      });
    },
  });

  const assignmentSubmission = data?.assignmentSubmissions?.results[0];

  const renderScoreCard = () => {
    return (
      <>
        {assignmentSubmission?.score || assignmentSubmission?.remark ? (
          <Box bgcolor="#F7F8F9" p={10} borderRadius={8}>
            <Box py={10} bb={10}>
              <Typography
                color="textPrimary"
                style={{ fontWeight: 500, fontSize: fontSizes.title }}
                variant="body1">
                {assignmentSubmission?.score}
              </Typography>
              <Typography color="inherit" variant="body2">
                Score
              </Typography>
            </Box>
            <Box py={10}>
              <Typography
                color="textPrimary"
                variant="body1"
                style={{ marginBottom: spaces.small }}>
                Remark
              </Typography>
              <Typography color="textPrimary" variant="body2">
                {assignmentSubmission?.remark ?? 'No lecturer remarks'}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box bgcolor="#F7F8F9" mt={10} p={10} pl={5} pb={24} borderRadius={8}>
            <Empty
              title={'Score & Remarks'}
              description={'This assignment has not been graded yet.'}
            />
          </Box>
        )}
      </>
    );
  };

  const renderBoxHeading = () => {
    return (
      <Box bgcolor="#F7F8F9" padding={10} style={{ borderBottom: '1px solid #E7E7ED' }}>
        <Typography color="textPrimary" style={{ fontWeight: 'bold' }} variant="body1">
          {assignmentSubmission?.assignment?.title}
        </Typography>
        <Typography color="inherit" variant="body2">
          Due Date: {assignmentSubmission?.assignment?.dueDate} / Submission Date:{' '}
          {format(new Date(assignmentSubmission?.createdAt || null), 'yyyy-LL-dd')}
        </Typography>
      </Box>
    );
  };

  const renderDocumentIcon = (file) => {
    return (
      <div className={classes.rightContent}>
        <IconButton style={{ padding: 0, cursor: 'pointer' }} onClick={() => window.open(file)}>
          <Visibility className="visibility-icon" style={{ fontSize: fontSizes.xxlarge }} />
        </IconButton>
      </div>
    );
  };

  const renderSubmittedFiles = () => {
    return (
      <Box mt={20} p={10} bgcolor="#F7F8F9" borderRadius={4} border="1px solid #E7E7ED">
        {assignmentSubmission?.files?.length &&
          assignmentSubmission?.files?.map(({ file, fileSize, id }) => (
            <Box my={4} key={id}>
              <FilePreview
                file={{
                  name: formatFileName(file),
                  type: getFileExtension(file),
                  url: file,
                  size: fileSize,
                }}
                rightContent={renderDocumentIcon(file)}
                fileInformation={<span>{fileSize}</span>}
                style={{ background: 'transparent' }}
              />
            </Box>
          ))}
      </Box>
    );
  };

  const renderSubmittedAssignment = () => {
    return (
      <Box>
        <Typography
          variant="body2"
          color="textPrimary"
          dangerouslySetInnerHTML={{ __html: assignmentSubmission?.body }}
        />
      </Box>
    );
  };

  return (
    <Drawer open={open} anchor="bottom">
      <NavigationBar />
      <LoadingView isLoading={loading} size={60}>
        <RegistrationLayout
          onClose={handleCloseDrawer}
          title="Assignment Response"
          headerButtons={[]}
          hasHeaderButton>
          <Box className={classes.content}>
            <Paper elevation={1} style={{ minHeight: 500 }}>
              {renderBoxHeading()}
              <Box p={10} pb={0}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={8}>
                    <Box p={10} py={0} width="80%">
                      {renderSubmittedAssignment()}
                      {renderSubmittedFiles()}
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    {renderScoreCard()}
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Box>
        </RegistrationLayout>
      </LoadingView>
    </Drawer>
  );
};

const useStyles = makeStyles({
  rightContent: {
    display: 'flex',
    justifyContent: 'flex-end',
    '& .visibility-icon': {
      marginRight: 10,
    },
  },
});

export default React.memo(StudentAssignmentSubmissionDrawer);
