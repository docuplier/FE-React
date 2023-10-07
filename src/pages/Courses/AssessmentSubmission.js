import { Box, Paper, Typography, Button } from '@material-ui/core';
import { ArrowBackIos } from '@material-ui/icons';
import React, { useCallback, useMemo } from 'react';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from '@apollo/client';

import AssignmentDetailLayout from 'Layout/AssignmentDetailLayout';
import { PrivatePaths } from 'routes';
import LoadingButton from 'reusables/LoadingButton';
import AccessControl from 'reusables/AccessControl';
import { AssessmentGradeStatus, UserRoles } from 'utils/constants';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import {
  GET_ASSESSMENT_GRADES,
  GET_ASSESSMENT_GRADE_BY_ID,
  GET_ASSESSMENT_SUBMISSIONS,
  GET_COURSE_ASSESSMENT_BY_ID,
} from 'graphql/queries/courses';
import useNotification from 'reusables/NotificationBanner/useNotification';
import AssessmentSubmissionQuestions from 'components/Courses/Assessments/AssessmentSubmissionQuestions';
import { UPDATE_ASSESSMENT_GRADE } from 'graphql/mutations/courses';
import {
  formatAssessmentGradeResponse,
  formatAssessmentSubmissionResponse,
} from 'utils/AssessmentUtils';
import LoadingView from 'reusables/LoadingView';
import AssessmentSubmissionInfoHeader from 'components/Courses/Assessments/AssessmentSubmissionInfoHeader';

const AssessmentSubmission = () => {
  const history = useHistory();
  const notification = useNotification();
  const { assessmentId } = useParams();
  const { control, errors, handleSubmit, reset } = useForm();
  const { userDetails } = useAuthenticatedUser();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const enrolleeId = params.get('enrolleeId');
  const assessmentGradeId = params.get('assessmentGradeId');

  const { data: assessmentData } = useQuery(GET_COURSE_ASSESSMENT_BY_ID, {
    skip: userDetails?.selectedRole === UserRoles.STUDENT,
    variables: {
      assessmentId,
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });
  const assessment = useMemo(() => assessmentData?.assessment || {}, [assessmentData]);
  const isGlobalAssessment = assessment?.isGlobalAssessment;

  const { data: assessmentSubmissions, loading: isLoadingSubmissions } = useQuery(
    GET_ASSESSMENT_SUBMISSIONS,
    {
      // fetchPolicy: 'network-only',
      variables: {
        assessmentId,
        userId: enrolleeId,
        offset: 0,
        limit: 2000,
      },
    },
  );

  const { data: assessmentGrade, loading: isLoadingAssessmentGrade } = useQuery(
    GET_ASSESSMENT_GRADE_BY_ID,
    {
      skip: userDetails?.selectedRole === UserRoles.STUDENT,
      // fetchPolicy: 'network-only',
      variables: {
        assessmentGradeId,
      },
    },
  );

  const { data: assessmentGrades, loading: isLoadingAssessmentGrades } = useQuery(
    GET_ASSESSMENT_GRADES,
    {
      skip: userDetails?.selectedRole !== UserRoles.STUDENT,
      // fetchPolicy: 'network-only',
      variables: {
        assessmentId,
        offset: 0,
        limit: 2000,
      },
    },
  );

  const [updateAssessmentGrade, { loading: isUpdatingAssessmentGrade }] = useMutation(
    UPDATE_ASSESSMENT_GRADE,
    {
      onCompleted: () => {
        notification.success({
          message: 'Assessment grade updated successfully',
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

  const getInitialReviewedScores = useCallback((submissions) => {
    return Object.keys(submissions).reduce((acc, questionId) => {
      acc[questionId] = submissions[questionId]?.reviewedScore;
      return acc;
    }, {});
  }, []);

  const submissions = useMemo(() => {
    const { results } = assessmentSubmissions?.assessmentSubmissions || {};

    if (results) {
      let formattedSubmissions = formatAssessmentSubmissionResponse(results);
      let initialReviewedScores = getInitialReviewedScores(formattedSubmissions);

      reset(initialReviewedScores);
      return formattedSubmissions;
    }
    return [];
    // eslint-disable-next-line
  }, [assessmentSubmissions]);

  const grade = useMemo(() => {
    if (assessmentGrades || assessmentGrade) {
      const result =
        assessmentGrades?.assessmentGrades?.results?.[0] || assessmentGrade?.assessmentGrade;

      if (result) {
        return formatAssessmentGradeResponse(result);
      }
      return {};
    }
  }, [assessmentGrades, assessmentGrade]);

  const onSubmit = (values) => {
    const questionIds = Object.keys(values);

    const submissions = questionIds.map((questionId) => ({
      question: questionId,
      score: Number(values[questionId]),
    }));

    updateAssessmentGrade({
      variables: {
        submissionDetails: {
          assessmentGrade: assessmentGradeId,
          submissions: questionIds.length === 0 ? [] : submissions,
        },
      },
    });
  };

  const renderCTAButton = () => {
    return (
      grade?.gradeStatus === AssessmentGradeStatus.PENDING && (
        <AccessControl
          allowedRoles={
            isGlobalAssessment
              ? [UserRoles.SCHOOL_ADMIN]
              : [UserRoles.LECTURER, UserRoles.SCHOOL_ADMIN]
          }
        >
          <Box display="flex" justifyContent="flex-end" p={10}>
            <Button
              variant="outlined"
              color="inherit"
              style={{ marginRight: 20 }}
              onClick={() => history.goBack()}
            >
              Cancel
            </Button>
            <LoadingButton
              color="primary"
              type="submit"
              disableElevation
              isLoading={isUpdatingAssessmentGrade}
              onClick={handleSubmit(onSubmit)}
            >
              Save & Exit
            </LoadingButton>
          </Box>
        </AccessControl>
      )
    );
  };

  return (
    <AssignmentDetailLayout
      links={[
        { title: 'Home', to: '/' },
        { title: 'Course', to: PrivatePaths.COURSES },
      ]}
      headerText={
        <Typography variant="body2" style={{ cursor: 'pointer' }} onClick={() => history.goBack()}>
          <Box display="flex" alignItems="center">
            <ArrowBackIos /> Back to assessment details
          </Box>
        </Typography>
      }
    >
      <LoadingView
        isLoading={isLoadingSubmissions || isLoadingAssessmentGrade || isLoadingAssessmentGrades}
      >
        <Box component={Paper} square>
          <AssessmentSubmissionInfoHeader
            gradeStatus={grade?.gradeStatus}
            earnedScore={grade?.earnedScore}
            assessment={grade?.assessment}
            questionStats={grade?.questionStats}
          />
          <AssessmentSubmissionQuestions
            isStudent={userDetails?.selectedRole === UserRoles.STUDENT}
            isAssessmentGraded={grade?.gradeStatus !== AssessmentGradeStatus.PENDING}
            control={control}
            errors={errors}
            submissions={submissions}
            questions={grade?.assessmentQuestions}
            isGlobalAssessment={isGlobalAssessment}
          />
          {renderCTAButton()}
        </Box>
      </LoadingView>
    </AssignmentDetailLayout>
  );
};

export default AssessmentSubmission;
