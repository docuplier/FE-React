import { Box, Paper, Typography } from '@material-ui/core';
import { Clear } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import React, { useState, useEffect, useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import LoadingView from 'reusables/LoadingView';
import AssignmentDetailLayout from 'Layout/AssignmentDetailLayout';
import { PrivatePaths } from 'routes';
import { fontWeight } from '../../Css';
import ConfirmationDialog from 'reusables/ConfirmationDialog';
import { useMutation, useQuery } from '@apollo/client';
import {
  GET_ASSESSMENT_GRADES,
  GET_ASSESSMENT_SUBMISSIONS,
  GET_COURSE_ASSESSMENT_BY_ID,
} from 'graphql/queries/courses';
import useNotification from 'reusables/NotificationBanner/useNotification';
import {
  CREATE_ASSESSMENT_SUBMISSION,
  MARK_ASSESSMENT_AS_COMPLETED,
} from 'graphql/mutations/courses';
import { AssessmentCompletionStatus, AssessmentQuestionType } from 'utils/constants';
import AssessmentTopInfo from 'components/Courses/Assessments/StudentAssessmentTake/AssessmentTopInfo';
import Assessment from 'components/Courses/Assessments/StudentAssessmentTake/Assessment';
import {
  countDownTimer,
  formatAssessmentSubmissionsResponse,
  canTakeAssessment,
  AssessmentFailureReasons,
} from 'utils/StudentTakeAssessmentUtils';
import { convertTimeSpentToDuration } from 'utils/TransformationUtils';

const Actions = {
  submit: 'SUBMIT',
  cancel: 'CANCEL',
};

const StudentTakeAssessment = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [actionType, setActionType] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [duration, setDuration] = useState();
  const classes = useStyles();
  const history = useHistory();
  const notification = useNotification();
  const { assessmentId, courseId } = useParams();

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
  const assessment = useMemo(() => assessmentData?.assessment || {}, [assessmentData]);

  const { data: assessmentGradesData, loading: isLoadingAssessmentGrades } = useQuery(
    GET_ASSESSMENT_GRADES,
    {
      // fetchPolicy: 'network-only',
      variables: {
        assessmentId,
        offset: 0,
        limit: 2000,
      },
    },
  );
  const assessmentGrade = useMemo(
    () => assessmentGradesData?.assessmentGrades?.results?.[0] || {},
    [assessmentGradesData],
  );

  useQuery(GET_ASSESSMENT_SUBMISSIONS, {
    // fetchPolicy: 'cache-and-network',
    variables: {
      assessmentId,
      offset: 0,
      limit: 2000,
    },
    onCompleted: ({ assessmentSubmissions: { results } }) => {
      setSelectedOptions(formatAssessmentSubmissionsResponse(results));
    },
  });

  const [createSubmission] = useMutation(CREATE_ASSESSMENT_SUBMISSION, {
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const [markAssessmentAsCompleted] = useMutation(MARK_ASSESSMENT_AS_COMPLETED, {
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const confirmationDialogProps = useMemo(() => {
    switch (actionType) {
      case Actions.cancel:
        return {
          title: 'Are you sure you want to exit this assessment?',
          description:
            "You will loose all unsaved data and won't be able to take this assessment again",
          okText: 'Exit and loose data',
          cancelText: 'Continue assessment',
        };
      case Actions.submit:
        return {
          title: 'Are you sure you want to submit this assessment?',
          description: 'You can not undo this action',
          okText: 'Submit Assessment',
          cancelText: 'Continue assessment',
        };
      default:
        return {
          title: null,
          description: null,
          okText: null,
          cancelText: null,
        };
    }
  }, [actionType]);

  const canTakeAssessmentMemoizedValue = useMemo(() => {
    let {
      startDate,
      startTime,
      dueDate,
      dueTime,
      completed: completionStatus,
      duration,
    } = assessment;
    let { createdAt } = assessmentGrade;

    return canTakeAssessment({
      startDate,
      startTime,
      dueDate,
      dueTime,
      completionStatus,
      startedAt: createdAt,
      duration,
    });
  }, [assessment, assessmentGrade]);

  useEffect(() => {
    let { value } = canTakeAssessmentMemoizedValue;
    let intervalRef = null;

    if (value && assessment?.completed === AssessmentCompletionStatus.STARTED) {
      intervalRef = countDownTimer(
        assessmentGrade?.createdAt,
        assessment?.duration,
        displayDuration,
      );
    }

    return () => {
      clearInterval(intervalRef);
    };
    // eslint-disable-next-line
  }, [assessmentGrade, assessment]);

  // do a check here to check if it is global accessment
  // if true, set the routes and privatepaths to pick the unique value to global accessment
  const isGlobalAssessment = assessment?.isGlobalAssessment;
  const links = useMemo(
    () =>
      [
        { title: 'Home', to: isGlobalAssessment ? '/assessments' : '/dashboard' },
        !isGlobalAssessment && { title: `${assessment?.course?.title}`, to: PrivatePaths.COURSES },
        !isGlobalAssessment && {
          title: `${assessment?.title}`,
          to: `${PrivatePaths.COURSES}/${courseId}`,
        },
      ].filter((link) => link),
    [isGlobalAssessment, assessment, courseId],
  ); // Remove falsy link values

  const displayDuration = ({ durationLeftInSeconds, done }) => {
    if (done) {
      markAssessmentAsCompletedMutation();
      return;
    }

    setDuration(durationLeftInSeconds);
  };

  const markAssessmentAsCompletedMutation = () => {
    markAssessmentAsCompleted({
      variables: {
        assessmentId,
      },
    });
    assessment?.isGlobalAssessment ? history.push(`${PrivatePaths.DASHBOARD}`) : history.goBack();
  };

  const handleConfirmDialogOkClick = () => {
    switch (actionType) {
      case Actions.submit:
      case Actions.cancel:
        return markAssessmentAsCompletedMutation();
      default:
        return null;
    }
  };

  const handleSelectOption = (changeset) => {
    setSelectedOptions((prevState) => ({
      ...prevState,
      ...changeset,
    }));
  };

  const handleSubmitAnswer = () => {
    const question = assessment?.assessmentQuestions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === assessment?.assessmentQuestions.length - 1;

    if (selectedOptions[question?.id]) {
      createSubmission({
        variables: {
          newAssessmentsubmission: {
            assessment: assessmentId,
            question: question?.id,
            answer:
              question.type === AssessmentQuestionType.MULTI_CHOICE
                ? null
                : selectedOptions[question?.id]?.html,
            option:
              question.type === AssessmentQuestionType.MULTI_CHOICE
                ? selectedOptions[question?.id]
                : null,
          },
        },
      });
    }

    if (isLastQuestion) {
      setActionType(Actions.submit);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const getFailureMessage = () => {
    switch (canTakeAssessmentMemoizedValue.reason) {
      case AssessmentFailureReasons.START_DATE_NOT_REACHED:
        return `Assessment will be ready on ${assessment?.startDate} ${assessment?.startTime}`;
      case AssessmentFailureReasons.END_DATE_PASSED:
        return `End date of assessment has passed`;
      case AssessmentFailureReasons.TIME_ELAPSED:
        return `You can no longer take this assessment as your time has elapsed`;
      case AssessmentFailureReasons.CANNOT_TAKE_MORE_THAN_ONCE:
        return `You cannot take this assessment more than once`;
      default:
        return '';
    }
  };

  const handleExit = () => {
    if (
      (canTakeAssessmentMemoizedValue.value &&
        assessment?.completed === AssessmentCompletionStatus.STARTED) ||
      (assessment?.isGlobalAssessment &&
        assessment.completed === AssessmentCompletionStatus.STARTED)
    ) {
      setActionType(Actions.cancel);
      return;
    }

    history.goBack();
  };

  const renderConfirmDialog = () => {
    return (
      <ConfirmationDialog
        {...confirmationDialogProps}
        onOk={handleConfirmDialogOkClick}
        open={Boolean(actionType)}
        onClose={() => setActionType(null)}
      />
    );
  };

  const renderAssessmentFailureUI = () => {
    return (
      <Box textAlign="center" py={100} px={30}>
        <Typography variant="h5" color="textPrimary" style={{ fontWeight: fontWeight.bold }}>
          {getFailureMessage()}
        </Typography>
      </Box>
    );
  };
  //render body if the assessment is global assessment or the course meets all the requirements of the assessment
  const renderBody = () => {
    if (
      (canTakeAssessmentMemoizedValue.value &&
        assessment?.completed === AssessmentCompletionStatus.STARTED) ||
      (assessment?.isGlobalAssessment &&
        assessment?.completed === AssessmentCompletionStatus.STARTED)
    ) {
      return (
        <>
          <AssessmentTopInfo
            assessment={assessment}
            activeIndex={currentQuestionIndex}
            duration={convertTimeSpentToDuration(duration)}
          />
          <Assessment
            question={assessment?.assessmentQuestions?.[currentQuestionIndex]}
            questionId={assessment?.assessmentQuestions?.[currentQuestionIndex]?.id}
            selectedOptions={selectedOptions}
            activeIndex={currentQuestionIndex}
            isLastQuestion={currentQuestionIndex === assessment?.assessmentQuestions?.length - 1}
            handleBackward={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
            handleSubmit={handleSubmitAnswer}
            handleSelectOption={handleSelectOption}
          />
        </>
      );
    }

    return renderAssessmentFailureUI();
  };

  return (
    <AssignmentDetailLayout
      isLoading={isLoadingAssessment}
      links={links}
      headerText={
        <Typography variant="body2" className={classes.headerText} onClick={handleExit}>
          <Clear /> Exit Assesment
        </Typography>
      }
    >
      <LoadingView isLoading={isLoadingAssessment || isLoadingAssessmentGrades}>
        <Box component={Paper} square px={8}>
          {renderBody()}
          {renderConfirmDialog()}
        </Box>
      </LoadingView>
    </AssignmentDetailLayout>
  );
};

const useStyles = makeStyles(() => ({
  headerText: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
}));

export default React.memo(StudentTakeAssessment);
