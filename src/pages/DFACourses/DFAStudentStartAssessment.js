import { Box, Paper, Typography } from '@material-ui/core';
import { Clear } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useMemo } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useHistory, useLocation, useParams } from 'react-router-dom';

import LoadingButton from 'reusables/LoadingButton';
import AssignmentDetailLayout from 'Layout/AssignmentDetailLayout';
import { PrivatePaths } from 'routes';
import { GET_ASSESSMENT_GRADES, GET_COURSE_ASSESSMENT_BY_ID } from 'graphql/queries/courses';
import useNotification from 'reusables/NotificationBanner/useNotification';
import { START_ASSESSMENT } from 'graphql/mutations/courses';
import { AssessmentFailureReasons, canTakeAssessment } from 'utils/StudentTakeAssessmentUtils';
import { fontWeight } from '../../Css';
import { AssessmentCompletionStatus, EnrolmentStatus } from 'utils/constants';
import { assessmentStartText } from 'pages/mockData';
import DFAAssignmentDetailLayout from 'Layout/DFALayout/DFAAssignmentDetailLayout';

const DFAStudentStartAssessment = () => {
  const classes = useStyles();
  const history = useHistory();
  const notification = useNotification();
  const { courseId, assessmentId } = useParams();
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  const { data: assessmentData, loading: isLoadingAssessment } = useQuery(
    GET_COURSE_ASSESSMENT_BY_ID,
    {
      // fetchPolicy: 'cache-and-network',
      variables: {
        assessmentId,
      },
      onError: (error) => {
        notification.error({
          message: error?.message,
        });
      },
    },
  );
  const assessment = assessmentData?.assessment || {};

  const { data: assessmentGradesData, loading: isLoadingAssessmentGrades } = useQuery(
    GET_ASSESSMENT_GRADES,
    {
      fetchPolicy: 'network-only',
      variables: {
        assessmentId,
        offset: 0,
        limit: 2000,
      },
    },
  );

  const assessmentGrade = assessmentGradesData?.assessmentGrade?.results?.[0] || {};

  const [startAssessment, { loading: isStartingAssessment }] = useMutation(START_ASSESSMENT, {
    onCompleted: ({ startAssessment: { ok } }) => {
      if (ok) {
        history.push(
          isGlobalAssessment
            ? `${PrivatePaths.DFA_ASSESSMENTS}/${assessmentId}/take-assessment`
            : `${PrivatePaths.COURSES}/${courseId}/assessments/${assessmentId}/take-assessment`,
        );
      }
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  // do a check here to check if it is global accessment
  // if true, set the routes and privatepaths to pick the unique value to global accessment
  const isGlobalAssessment = assessment?.isGlobalAssessment;

  const links = useMemo(
    () =>
      [
        { title: 'Home', to: isGlobalAssessment ? '/dfa-assessments' : '/dfa-main-dashboard' },
        !isGlobalAssessment && {
          title: `${assessment?.course?.title}`,
          to: PrivatePaths.COURSES,
        },
        !isGlobalAssessment && {
          title: `${assessment?.title}`,
          to: `${PrivatePaths.COURSES}/${courseId}`,
        },
      ].filter((link) => link)[(isGlobalAssessment, assessment, courseId)],
  ); // Remove falsy link values

  const handleStartAssessment = () => {
    startAssessment({
      variables: {
        assessmentId,
      },
    });
  };

  const renderStartAssessmentUI = () => {
    return (
      <Box
        py={12}
        px={5}
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        component={Paper}
        square
      >
        <Box>
          <Typography variant="body1" color="textPrimary">
            Welcome! <br /> Are you ready to start your assessment? If yes, Please note the
            following
          </Typography>
          <ul>
            {assessmentStartText.map((text) => (
              <li key={text} style={{ marginBottom: 8 }}>
                {text}
              </li>
            ))}
          </ul>
        </Box>
        {/* conditionally render the screen for either global assessment or a course */}
        {(assessment?.course?.enrolled === EnrolmentStatus.ENROL ||
          assessment?.isGlobalAssessment) && (
          <Box mt={10}>
            <LoadingButton
              style={{ backgroundColor: '#3CAE5C', color: 'white' }}
              type="submit"
              isLoading={isStartingAssessment}
              onClick={handleStartAssessment}
            >
              Start Assessment
            </LoadingButton>
          </Box>
        )}
      </Box>
    );
  };

  const renderAssessmentFailureUI = (message) => {
    return (
      <Box
        height={300}
        display="flex"
        justifyContent="center"
        alignItems="center"
        component={Paper}
        px={10}
        square
      >
        <Typography variant="h5" color="textPrimary" style={{ fontWeight: fontWeight.bold }}>
          {message}
        </Typography>
      </Box>
    );
  };

  const renderBody = () => {
    let {
      startDate,
      startTime,
      dueDate,
      dueTime,
      completed: completionStatus,
      duration,
    } = assessment;
    let { createdAt } = assessmentGrade;
    let { value, reason } = canTakeAssessment({
      startDate,
      startTime,
      dueDate,
      dueTime,
      completionStatus,
      startedAt: createdAt,
      duration,
    });

    if (value && startDate && completionStatus !== AssessmentCompletionStatus.STARTED)
      return renderStartAssessmentUI();

    switch (reason) {
      case AssessmentFailureReasons.START_DATE_NOT_REACHED:
        return renderAssessmentFailureUI(
          'You cannot start this assessment as the start date has not been reached',
        );
      case AssessmentFailureReasons.END_DATE_PASSED:
        return renderAssessmentFailureUI('End date of assessment has passed');
      case AssessmentFailureReasons.TIME_ELAPSED:
        return renderAssessmentFailureUI(
          'You can no longer take this assessment as your time has elapsed',
        );
      case AssessmentFailureReasons.CANNOT_TAKE_MORE_THAN_ONCE:
        return renderAssessmentFailureUI('You cannot take this assessment more than once');
      default:
        return renderAssessmentFailureUI('');
    }
  };

  return (
    <DFAAssignmentDetailLayout
      isLoading={isLoadingAssessment || isLoadingAssessmentGrades}
      links={links}
      headerText={
        <Typography
          variant="body2"
          style={{ cursor: 'pointer', color: '#3CAE5C' }}
          onClick={() => history.goBack()}
        >
          <Box display="flex" alignItems="center">
            <Clear /> Exit Assessment
          </Box>
        </Typography>
      }
    >
      {renderBody()}
    </DFAAssignmentDetailLayout>
  );
};

const useStyles = makeStyles(() => ({
  headerText: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
}));

export default DFAStudentStartAssessment;
