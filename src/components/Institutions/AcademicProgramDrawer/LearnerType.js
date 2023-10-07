import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, makeStyles, Button } from '@material-ui/core';
import { CheckCircleOutline } from '@material-ui/icons';
import classNames from 'classnames';

import { colors, fontSizes, fontWeight, spaces } from '../../../Css';
import { ProgramType } from 'utils/constants';
import { convertToSentenceCase } from 'utils/TransformationUtils';

const LearnerType = ({ value: valueFromProps, onChange }) => {
  const classes = useStyles();
  const [valueFromState, setValueFromState] = useState(null);

  const value = useMemo(() => {
    return valueFromProps !== undefined ? valueFromProps : valueFromState;
  }, [valueFromProps, valueFromState]);

  const isActiveLearnerType = (option) => {
    return option === value;
  };

  const handleChange = (selectedOption) => () => {
    setValueFromState(selectedOption);
    onChange?.(selectedOption);
  };

  return (
    <Box className={classes.learner}>
      <Box mb={5}>
        <Typography>Program type</Typography>
      </Box>
      {Object.values(ProgramType).map((option) => {
        return (
          <Button
            className={classNames({
              [`${classes.activeBtn}`]: isActiveLearnerType(option),
              [`${classes.btn}`]: !isActiveLearnerType(option),
            })}
            key={option}
            variant="outlined"
            size="small"
            color={isActiveLearnerType(option) ? 'primary' : 'default'}
            onClick={handleChange(option)}>
            <Box display="flex" alignItems="center" maxHeight="max-content">
              {convertToSentenceCase(option)}
              <CheckCircleOutline
                style={{ fontSize: fontSizes.xlarge, marginLeft: spaces.small }}
              />
            </Box>
          </Button>
        );
      })}
    </Box>
  );
};

const useStyles = makeStyles({
  learner: {
    '& > *': {
      color: colors.black,
      fontWeight: fontWeight.medium,
      fontSize: fontSizes.large,
    },
  },
  btn: {
    color: colors.grey,
    fontSize: fontSizes.large,
    fontWeight: fontWeight.regular,
    marginRight: spaces.small,
  },
  activeBtn: {
    color: colors.primary,
    fontSize: fontSizes.large,
    fontWeight: fontWeight.regular,
    marginRight: spaces.small,
  },
});

LearnerType.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default React.memo(LearnerType);
