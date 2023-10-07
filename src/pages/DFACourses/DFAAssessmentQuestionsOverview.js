import {
  Box,
  FormControlLabel,
  Paper,
  RadioGroup,
  Typography,
  Radio,
  Divider,
} from '@material-ui/core';
import { ArrowBackIos } from '@material-ui/icons';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import React, { useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { PrivatePaths } from 'routes';
import { GET_COURSE_ASSESSMENT_BY_ID } from 'graphql/queries/courses';
import useNotification from 'reusables/NotificationBanner/useNotification';
import { colors, fontWeight } from '../../Css';
import DFAAssignmentDetailLayout from 'Layout/DFALayout/DFAAssignmentDetailLayout';

const DFAAssessmentQuestionsOverview = () => {
  const classes = useStyles();
  const history = useHistory();
  const { courseId, assessmentId } = useParams();
  const notification = useNotification();
  const { data: assessmentdata } = useQuery(GET_COURSE_ASSESSMENT_BY_ID, {
    variables: {
      assessmentId,
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });
  const assessment = assessmentdata?.assessment;
  const assessmentQuestions = assessment?.assessmentQuestions;

  // do a check here to check if it is global accessment
  // if true, set the routes and privatepaths to pick the unique value to global accessment
  const isGlobalAssessment = assessment?.isGlobalAssessment;

  const Links = useMemo(
    () =>
      [
        { title: 'Home', to: isGlobalAssessment ? '/dfa-assessments' : '/dfa-main-dashboard' },
        !isGlobalAssessment && {
          title: `${assessment?.course?.title}`,
          to: PrivatePaths.COURSES,
        },
        !isGlobalAssessment && {
          title: `${assessment?.title}`,
          to: `${PrivatePaths.COURSES}/${courseId}/assessments/${assessmentId}`,
        },
      ].filter((link) => link),
    [isGlobalAssessment, assessment, courseId, assessmentId],
  ); // Remove falsy link values

  const renderAssessmentInfoAndDuration = () => {
    return (
      <Box component={Paper} className={classes.description} square>
        <Box
          className="box"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          pl={20}
        >
          <Box ml={-10}>
            <Typography variant="body1" color="textPrimary" style={{ fontWeight: fontWeight.bold }}>
              {assessment?.title}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {assessment?.totalQuestions} question in total •{' '}
              {assessment?.multichoiceQuestionCount} multichoice • {assessment?.textQuestionCount}{' '}
              text & essay
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  const renderOption = (question) => {
    if (question?.type === 'MULTI_CHOICE') {
      return (
        <RadioGroup name="radio">
          {question?.options.map((option) => (
            <FormControlLabel
              key={option.id}
              value={option.id}
              control={<GreenRadio checked={option?.isAnswer} />}
              label={option?.body}
            />
          ))}
        </RadioGroup>
      );
    }
  };

  const renderQuestions = () => {
    return (
      <Box>
        {assessmentQuestions?.map((question, index) => {
          return (
            <Box pt={22}>
              <Typography
                variant="body1"
                color="textPrimary"
                className={classes.questionBody}
                style={{ fontWeight: fontWeight.bold }}
                dangerouslySetInnerHTML={{ __html: `${index + 1}. ${question.body}` }}
              />
              <Typography variant="body1" color="textSecondary" style={{ paddingTop: 15 }}>
                {question.answer && question.answer}
              </Typography>
              <Box pb={10}>{renderOption(question)}</Box>
              {index !== assessmentQuestions.length - 1 && <Divider />}
            </Box>
          );
        })}
      </Box>
    );
  };

  return (
    <DFAAssignmentDetailLayout
      links={Links}
      headerText={
        <Typography
          variant="body2"
          style={{ cursor: 'pointer', color: '#3CAE5C' }}
          onClick={() => history.goBack()}
        >
          <Box display="flex" alignItems="center">
            <ArrowBackIos /> Back to assessment details
          </Box>
        </Typography>
      }
    >
      <Box component={Paper} square px={10} pb={20} mb={20}>
        {renderAssessmentInfoAndDuration()}
        {renderQuestions()}
      </Box>
    </DFAAssignmentDetailLayout>
  );
};

const GreenRadio = withStyles({
  root: {
    color: colors.grey,
    '&$checked': {
      color: '#287D3C',
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

const useStyles = makeStyles(() => ({
  headerText: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  description: {
    width: '100%',
    height: 'auto',
    display: 'grid',
    placeItems: 'center',
    '& .box': {
      width: '100%',
      height: 77,
      background: '#F7F8F9',
    },
  },
  questionBody: {
    '&>*:first-child': {
      display: 'inline',
    },
  },
}));

export default DFAAssessmentQuestionsOverview;
