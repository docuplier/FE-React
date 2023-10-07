import {
  Box,
  FormControlLabel,
  RadioGroup,
  Typography,
  Radio,
  makeStyles,
} from '@material-ui/core';
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import LoadingButton from 'reusables/LoadingButton';
import { fontWeight, spaces } from '../../../Css';
import Wysiwyg from 'reusables/Wysiwyg';
import { AssessmentQuestionType } from 'utils/constants';
import { randomizeOptions } from 'utils/StudentTakeAssessmentUtils';
import { green } from '@material-ui/core/colors';

const DFAAssessment = ({
  question,
  questionId,
  selectedOptions,
  activeIndex,
  isLastQuestion,
  handleBackward,
  handleSubmit,
  handleSelectOption,
}) => {
  const classes = useStyles();

  const randomizedOptions = useMemo(() => {
    return randomizeOptions(question?.options);
  }, [question]);

  const renderTheoryTextField = () => {
    return (
      <Box mt={10}>
        <Wysiwyg
          value={selectedOptions[questionId]}
          onChange={(value) => handleSelectOption({ [questionId]: value })}
        />
      </Box>
    );
  };

  const renderFeedBack = () => {
    if (question?.type === AssessmentQuestionType.MULTI_CHOICE) {
      return (
        <RadioGroup
          name="radio"
          onChange={(evt) => handleSelectOption({ [questionId]: evt.target.value })}
          value={selectedOptions[questionId] || null}
        >
          {randomizedOptions?.map((option) => (
            <FormControlLabel
              key={option.id}
              value={option.id}
              control={<Radio color="primary" />}
              label={option.body}
            />
          ))}
        </RadioGroup>
      );
    }
    return renderTheoryTextField();
  };

  return (
    <Box>
      <Box py={22}>
        <Typography
          variant="body1"
          color="textPrimary"
          style={{ fontWeight: fontWeight.bold }}
          className={classes.questionBody}
          dangerouslySetInnerHTML={{ __html: `${activeIndex + 1}. ${question?.body}` } || 'Hello'}
        />
        <Box>{renderFeedBack()}</Box>
      </Box>
      <Box display="flex" justifyContent="flex-start" alignItems="center" pb={22}>
        <LoadingButton
          disabled={activeIndex === 0}
          color="primary"
          onClick={handleBackward}
          style={{ marginRight: spaces.large }}
        >
          Back
        </LoadingButton>
        <LoadingButton
          type="submit"
          className={classes.button}
          isLoading={false}
          onClick={handleSubmit}
        >
          {isLastQuestion ? 'Submit' : 'Next'}
        </LoadingButton>
      </Box>
    </Box>
  );
};

const useStyles = makeStyles({
  questionBody: {
    '&>p:first-child': {
      display: 'inline',
    },
  },
  button: {
    fontWeight: fontWeight.medium,
    color: '#fff',
    backgroundColor: '#3CAE5C',
    '&:hover': {
      backgroundColor: green[700],
    },
  },
});

DFAAssessment.prototypes = {
  question: PropTypes.string,
  questionId: PropTypes.string,
  selectedOptions: PropTypes.string,
  activeIndex: PropTypes.number,
  isLastQuestion: PropTypes.bool,
  handleBackward: PropTypes.func,
  handleSubmit: PropTypes.func,
  handleSelectOption: PropTypes.func,
};

export default DFAAssessment;
