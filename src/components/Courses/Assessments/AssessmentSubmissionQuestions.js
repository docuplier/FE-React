import { memo } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  withStyles,
  makeStyles,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { Controller } from 'react-hook-form';

import { AssessmentQuestionType, UserRoles } from 'utils/constants';
import { getFormError } from 'utils/formError';
import { colors, fontWeight } from '../../../Css';
import AccessControl from 'reusables/AccessControl';

const AssessmentSubmissionQuestions = ({
  submissions,
  questions,
  isAssessmentGraded,
  isStudent,
  control,
  errors,
  isGlobalAssessment,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const getDefaultRadioButton = (checked, optionId) => {
    return (
      <Radio
        checked={checked}
        inputProps={{ 'aria-label': optionId }}
        name={optionId}
        color="primary"
      />
    );
  };

  const getRadioButtonForGradedAssessment = ({ optionId, isAnswer, selectedOptionId }) => {
    if (isAnswer) {
      return <GreenRadio checked={true} />;
    } else if (optionId === selectedOptionId && !isAnswer) {
      return <RedRadio checked={true} />;
    }

    return getDefaultRadioButton(false, optionId);
  };

  const renderRadio = ({ selectedOptionId, isAnswer, optionId }) => {
    if (!isAssessmentGraded) {
      return getDefaultRadioButton(optionId === selectedOptionId, optionId);
    }
    return getRadioButtonForGradedAssessment({ optionId, selectedOptionId, isAnswer });
  };

  const renderFeedback = (question) => {
    if (question.type === AssessmentQuestionType.MULTI_CHOICE) {
      return (
        <RadioGroup name="radio">
          {question.options.map((option) => (
            <FormControlLabel
              key={option.id}
              value={option.id}
              control={renderRadio({
                selectedOptionId: submissions[question.id]?.selectedOptionId,
                isAnswer: option.isAnswer,
                optionId: option.id,
              })}
              label={option.body}
            />
          ))}
        </RadioGroup>
      );
    }

    return (
      <Typography
        variant="body1"
        color="textSecondary"
        dangerouslySetInnerHTML={{ __html: submissions[question.id]?.answer || 'N/A' }}
      />
    );
  };

  const renderEssayGrade = ({ attainableScore, reviewedScore, questionId, type }) => {
    return (
      type === AssessmentQuestionType.TEXT_ESSAY && (
        <Box mt={10} display="flex" flexDirection={isSmallScreen ? 'column' : 'row'}>
          <TextField
            label={isStudent ? 'Score' : 'Attainable Score'}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            disabled
            value={isStudent ? reviewedScore : attainableScore}
          />
          <AccessControl
            allowedRoles={
              isGlobalAssessment
                ? [UserRoles.SCHOOL_ADMIN]
                : [UserRoles.LECTURER, UserRoles.SCHOOL_ADMIN]
            }
          >
            <Box ml={isSmallScreen ? 0 : 10} mt={isSmallScreen ? 5 : 0}>
              <Controller
                name={questionId}
                control={control}
                rules={{
                  required: { value: true, message: 'This is required' },
                  max: {
                    value: attainableScore,
                    message: 'Review score cannot be more than attainable',
                  },
                }}
                render={({ ref, ...rest }) => (
                  <TextField
                    {...rest}
                    type="number"
                    disabled={isAssessmentGraded}
                    label="Reviewed Score"
                    variant="outlined"
                    inputRef={ref}
                    error={getFormError(questionId, errors).hasError}
                    helperText={getFormError(questionId, errors).message}
                    fullWidth
                  />
                )}
              />
            </Box>
          </AccessControl>
        </Box>
      )
    );
  };

  return (
    <Box>
      {questions?.map((question, index) => {
        return (
          <>
            <Box p={10}>
              <Typography
                variant="body1"
                color="textPrimary"
                style={{ fontWeight: fontWeight.bold }}
                className={classes.questionBody}
                dangerouslySetInnerHTML={{ __html: `${index + 1}. ${question.body}` }}
              />
              <Box mt={5}>{renderFeedback(question)}</Box>
              {renderEssayGrade({
                attainableScore: question.attainableScore,
                reviewedScore: submissions[question.id]?.reviewedScore,
                questionId: question.id,
                type: question.type,
              })}
            </Box>
            <Divider />
          </>
        );
      })}
    </Box>
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

const RedRadio = withStyles({
  root: {
    color: colors.grey,
    '&$checked': {
      color: 'red',
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

AssessmentSubmissionQuestions.propTypes = {
  submissions: PropTypes.objectOf(
    PropTypes.shape({
      selectedOptionId: PropTypes.string,
      questionType: PropTypes.oneOf(Object.values(AssessmentQuestionType)),
      reviewedScore: PropTypes.number,
      answer: PropTypes.string,
    }),
  ),
  questions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      body: PropTypes.string.isRequired,
      attainableScore: PropTypes.number,
      type: PropTypes.oneOf(Object.values(AssessmentQuestionType)),
      options: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          body: PropTypes.string.isRequired,
          isAnswer: PropTypes.bool.isRequired,
        }),
      ),
    }),
  ),
  isAssessmentGraded: PropTypes.bool,
  isStudent: PropTypes.bool,
  control: PropTypes.any,
  errors: PropTypes.object,
};

const useStyles = makeStyles({
  questionBody: {
    '&>*:first-child': {
      display: 'inline',
    },
  },
});

export default memo(AssessmentSubmissionQuestions);
