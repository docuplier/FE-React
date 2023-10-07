import { useQuery } from '@apollo/client';
import {
  Box,
  Button,
  Grid,
  IconButton,
  Typography,
  makeStyles,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { ReactComponent as EyeIcon } from 'assets/svgs/eye-icon.svg';
import StudentAssignmentSubmissionDrawer from 'components/Courses/CourseDetails/StudentAssignmentSubmissionDrawer';
import { GET_ASSIGNMENT_BY_ID } from 'graphql/queries/courses';
import DFAAssignmentDetailLayout from 'Layout/DFALayout/DFAAssignmentDetailLayout';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import Empty from 'reusables/Empty';
import FilePreview from 'reusables/FilePreview';
import LoadingView from 'reusables/LoadingView';
import { useNotification } from 'reusables/NotificationBanner';
import { PrivatePaths } from 'routes';
import { formatFileName, getFileExtension } from 'utils/TransformationUtils';
import { EnrolmentStatus } from 'utils/constants';
import { colors } from '../../Css';
import { getTime } from 'date-fns/esm';

const DFAStudentAssignmentDetail = () => {
  const [openSubmittedAssignmentDrawer, setOpenSubmittedAssignmentDrawer] = useState(false);
  const { assignmentId, courseId } = useParams();
  const history = useHistory();
  const notification = useNotification();
  const { pathname } = useLocation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const classes = useStyles();

  const { data, loading, refetch } = useQuery(GET_ASSIGNMENT_BY_ID, {
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

  const assignmentItem = data?.assignment;
  const isOverDue =
    getTime(new Date(assignmentItem?.dueDate).setUTCHours(23, 59, 59, 999)) <
    getTime(new Date().setUTCHours(23, 59, 59, 999), 'yyyy-MM-dd');

  useEffect(() => {
    refetch();
  }, [data, refetch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const dfaLinks = [
    { title: 'Home', to: '/' },
    { title: 'Course', to: `${PrivatePaths.DFA_COURSE_DETAILS}/${courseId}` },
    { title: 'Introduction to Graphics', to: `${PrivatePaths.DFA_COURSE_DETAILS}/${courseId}` },
    {
      title: `Assignment`,
      to: '',
    },
  ];

  const handleStartAssignment = () => {
    history.push({
      pathname: `${pathname}/start-assignment`,
      state: {
        title: assignmentItem?.title,
        dueDate: assignmentItem?.dueDate,
      },
    });
  };

  const renderAssignmentDetails = () => {
    return (
      <Grid item xs={12} md={8}>
        <Box pr={10}>
          <Box display="flex" alignItems="center" mb={12}>
            <IconButton size="small" onClick={() => history.goBack()}>
              <CloseIcon style={{ color: '#267939' }} />
            </IconButton>
            <Box ml={8}>
              <Typography className={classes.root} variant="body1">
                Exit Assignment
              </Typography>
            </Box>
          </Box>
          <Typography variant="body1" style={{ minHeight: 300 }}>
            {isOverDue ? 'End date of assignment has passed' : assignmentItem?.body}
          </Typography>
          {assignmentItem?.course?.enrolled === EnrolmentStatus.ENROL && (
            <Box display="flex" flexDirection={isSmallScreen ? 'column' : 'row'} mt={20}>
              <Button
                variant="contained"
                className={classes.actionButton}
                style={{ marginRight: 40 }}
                disabled={assignmentItem?.submission || isOverDue}
                onClick={handleStartAssignment}
                fullWidth={isSmallScreen ? true : false}
              >
                Start Assignment
              </Button>
              <Button
                variant="outlined"
                style={{
                  background: '#D4F7DC',
                  color: '#3CAE5C',
                }}
                disableElevation
                disabled={!assignmentItem?.submission}
                onClick={() => setOpenSubmittedAssignmentDrawer(true)}
                fullWidth={isSmallScreen ? true : false}
              >
                View Submission
              </Button>
            </Box>
          )}
        </Box>
      </Grid>
    );
  };

  const renderAttachments = () => {
    return (
      <Grid item xs={12} md={4} className={classes.attachments}>
        <Box pl={10} pr={10}>
          <Box mb={12}>
            <Typography variant="h6">Attachments</Typography>
          </Box>
          {assignmentItem?.files?.length ? (
            assignmentItem?.files?.map(({ file, fileSize, id }) => (
              <Box mb={4} key={id}>
                <FilePreview
                  file={{
                    name: formatFileName(file),
                    type: getFileExtension(file),
                    url: file,
                    size: fileSize,
                  }}
                  rightContent={
                    <Box onClick={() => window.open(file)} style={{ cursor: 'pointer' }}>
                      <EyeIcon />
                    </Box>
                  }
                  limitInformationToSize
                />
              </Box>
            ))
          ) : (
            <Empty
              title={'No Attachments'}
              description={'No Attachments have been added for this assignment.'}
            />
          )}
        </Box>
      </Grid>
    );
  };

  return (
    <LoadingView isLoading={loading}>
      <DFAAssignmentDetailLayout links={dfaLinks}>
        <Grid container>
          {renderAssignmentDetails()}
          {renderAttachments()}
        </Grid>
      </DFAAssignmentDetailLayout>
      <StudentAssignmentSubmissionDrawer
        open={openSubmittedAssignmentDrawer}
        onClose={() => setOpenSubmittedAssignmentDrawer(false)}
      />
    </LoadingView>
  );
};

const useStyles = makeStyles((theme) => ({
  attachments: {
    borderLeft: `1px solid ${colors.seperator}`,
    [theme.breakpoints.down('sm')]: {
      marginTop: 30,
    },
  },
  actionButton: {
    marginRight: 40,
    background: '#3CAE5C',
    color: colors.white,
    [theme.breakpoints.down('sm')]: {
      marginBottom: 10,
      marginRight: 0,
    },
  },
  root: {
    color: '#267939',
  },
}));
export default DFAStudentAssignmentDetail;
