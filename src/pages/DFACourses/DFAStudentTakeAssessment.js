import { Box, Paper, Typography } from '@material-ui/core';
import { Clear } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import React, { useState, useEffect, useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import LoadingView from 'reusables/LoadingView';
// import { PrivatePaths } from 'routes';
import { fontSizes, fontWeight } from '../../Css';
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
import { AssessmentCompletionStatus, AssessmentQuestionType, UserRoles } from 'utils/constants';
import {
  countDownTimer,
  formatAssessmentSubmissionsResponse,
  canTakeAssessment,
  AssessmentFailureReasons,
} from 'utils/StudentTakeAssessmentUtils';
import { convertTimeSpentToDuration } from 'utils/TransformationUtils';
import DFAAssessmentTopInfo from 'components/DFAAssessment/DFAStudentAssessmentTake/DFAAssessmentTopInfo';
import DFAAssessment from 'components/DFAAssessment/DFAStudentAssessmentTake/DFAAssessment';
import DFAAssessmentLayout from 'Layout/DFALayout/DFAAssessmentLayout';
import HeaderItems from 'assets/svgs/headerItems.svg';
import { GET_USER_DETAIL } from 'graphql/queries/users';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import DFAConfirmationDialog from 'reusables/DFAConfirmationDialog';
import { green } from '@material-ui/core/colors';
import { navigateToActualURL } from 'utils/RouteUtils';
import { PublicPaths } from 'routes';
import YouthResult from './YouthResult';
import CivilServantResult from './CivilServantResult';
import K12TeacherResult from './K12TeacherResult';
import K12StudentResult from './K12StudentResult';

const Actions = {
  submit: 'SUBMIT',
  cancel: 'CANCEL',
};

const DFAStudentTakeAssessment = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [actionType, setActionType] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [duration, setDuration] = useState();
  const classes = useStyles();
  const history = useHistory();
  const notification = useNotification();
  const { assessmentId, courseId } = useParams();
  const { userDetails } = useAuthenticatedUser();
  const id = userDetails?.id;

  const { data } = useQuery(GET_USER_DETAIL, {
    variables: {
      userId: id,
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const userName = data?.user?.firstname;
  const selectedRole = userDetails?.selectedRole;

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
      skip: !assessmentId, // Skip the query if assessmentId is not available
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
    history.goBack();
  };

  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const [isConfirmationConfirmed, setIsConfirmationConfirmed] = useState(false);
  const [showExitSuccess, setShowExitSuccess] = useState(false);

  const handleConfirmDialogOkClick = () => {
    switch (actionType) {
      case Actions.submit:
      case Actions.cancel:
        markAssessmentAsCompletedMutation();
        break;
      default:
        setIsConfirmationDialogOpen(false);
        setIsConfirmationConfirmed(true);
        setShowExitSuccess(true);

        break;
    }
  };

  const handleSelectOption = (changeset) => {
    setSelectedOptions((prevState) => ({
      ...prevState,
      ...changeset,
    }));
  };

  const handleSubmitAnswer = () => {
    setShowExitSuccess(true);
    setIsConfirmationConfirmed(true);
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
      navigateToActualURL(PublicPaths.DFA_INTERMEDIATE_ASSESSMENT);
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
      canTakeAssessmentMemoizedValue.value &&
      assessment?.completed === AssessmentCompletionStatus.STARTED
    ) {
      setActionType(Actions.cancel);
    } else {
      // Open the confirmation dialog
      setIsConfirmationDialogOpen(true);
    }
  };

  // const renderConfirmDialog = () => {
  //   return (
  //     <ConfirmationDialog
  //       {...confirmationDialogProps}
  //       onOk={handleConfirmDialogOkClick}
  //       open={Boolean(actionType)}
  //       onClose={() => setActionType(null)}
  //     />
  //   );
  // };

  const renderAssessmentFailureUI = () => {
    return (
      <Box textAlign="center" py={100} px={30}>
        <Typography variant="h5" color="textPrimary" style={{ fontWeight: fontWeight.bold }}>
          {getFailureMessage()}
        </Typography>
      </Box>
    );
  };

  const ExitSuccessContent = () => {
    const renderButtons = () => {
      switch (selectedRole) {
        case UserRoles.YOUTH:
          return <YouthResult />;
        case UserRoles.CIVIL_SERVANT:
          return <CivilServantResult />;
        case UserRoles.K12_TEACHER:
          return <K12TeacherResult activeIndex={0} />;
        case UserRoles.SCHOOL_ADMIN:
          return <K12StudentResult activeIndex={0} />;
        default:
          return null;
      }
    };

    return renderButtons();
  };

  const renderExitSuccess = () => {
    return <ExitSuccessContent role={selectedRole} userName={userName} />;
  };

  const renderBody = () => {
    if (
      (canTakeAssessmentMemoizedValue.value &&
        assessment.completed === AssessmentCompletionStatus.STARTED) ||
      !assessmentId
    ) {
      return (
        <>
          <DFAAssessmentTopInfo
            assessment={assessment}
            activeIndex={currentQuestionIndex}
            duration={convertTimeSpentToDuration(duration)}
          />
          <DFAAssessment
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
    <DFAAssessmentLayout
      isLoading={isLoadingAssessment}
      headerText={
        (isConfirmationConfirmed && showExitSuccess) || (
          <Typography variant="body2" className={classes.headerText} onClick={handleExit}>
            <Clear /> Exit Assessment
          </Typography>
        )
      }
    >
      <LoadingView isLoading={isLoadingAssessment || isLoadingAssessmentGrades}>
        <Box>
          {isConfirmationConfirmed && showExitSuccess ? (
            renderExitSuccess()
          ) : (
            <Box component={Paper} square px={8}>
              {renderBody()}
            </Box>
          )}

          {/* {renderConfirmDialog()} */}
          {isConfirmationDialogOpen && (
            <DFAConfirmationDialog
              title={'Are you sure you want to exit this assessment'}
              description={`Your current progress will be submitted, and you won't have access to retake the assessment`}
              okText={'Continue assessment'}
              cancelText={'Yes, exit assessment'}
              onOk={() => setIsConfirmationDialogOpen(false)}
              open={isConfirmationDialogOpen}
              onClose={handleConfirmDialogOkClick}
            />
          )}
        </Box>
      </LoadingView>
    </DFAAssessmentLayout>
  );
};

const useStyles = makeStyles((theme) => ({
  description: {
    width: '100%',
    height: 'auto',
    display: 'grid',
    placeItems: 'center',
    '& .box': {
      width: '100%',
      height: 77,
      color: '#fff',
      background: 'var(--PrimaryGreenDFA, #3CAE5C)',
      backgroundImage: `url(${HeaderItems})`,
      backgroundSize: 'cover',
      [theme.breakpoints.down('xs')]: {
        width: '90%',
      },
    },
  },
  header: {
    padding: theme.spacing(12),
    borderRadius: theme.spacing(1),
    color: '#fff',
    background: 'var(--PrimaryGreenDFA, #3CAE5C)',
    backgroundImage: `url(${HeaderItems})`,
    backgroundSize: 'cover',
    fontSize: fontSizes.large,
    fontWeight: fontWeight.medium,
    boxShadow: theme.shadows[2],
    textAlign: 'start',
    [theme.breakpoints.down('xs')]: {
      textAlign: 'start',
      padding: theme.spacing(12),
    },
  },
  headerText: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    color: '#267939',
  },
  wrapper: {
    padding: theme.spacing(28),
    borderRadius: theme.spacing(1),
    width: '65%',
    textAlign: 'center',
    [theme.breakpoints.down('xs')]: {
      textAlign: 'center',
      padding: theme.spacing(3),
    },
  },
  title: {
    padding: theme.spacing(6),
    fontSize: fontSizes.xlarge,
    fontWeight: fontWeight.bold,
    color: 'var(--TextDFA, #083A55)',
    [theme.breakpoints.down('xs')]: {
      fontSize: fontSizes.large,
    },
  },
  text: {
    padding: theme.spacing(6),
    fontSize: fontSizes.large,
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',

    fontWeight: fontWeight.regular,
    [theme.breakpoints.down('xs')]: {
      fontSize: fontSizes.medium,
    },
  },
  button: {
    marginTop: 12,
    fontSize: fontSizes.large,
    fontWeight: fontWeight.medium,
    color: '#fff',
    backgroundColor: '#3CAE5C',
    '&:hover': {
      backgroundColor: green[700],
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: fontSizes.medium,
      marginTop: 12,
    },
  },
  button1: {
    marginTop: 24,
    fontSize: fontSizes.large,
    fontWeight: fontWeight.medium,
    color: green[700],
    paddingLeft: 50,
    paddingRight: 50,

    backgroundColor: '#EBFFF0',
    '&:hover': {
      backgroundColor: green[500],
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: fontSizes.medium,
      marginTop: 12,
      marginBottom: 12,
    },
  },
}));

export default React.memo(DFAStudentTakeAssessment);
