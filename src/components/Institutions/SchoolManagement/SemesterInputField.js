import { memo } from 'react';
import PropTypes from 'prop-types';
import { TextField, Typography, Box, makeStyles } from '@material-ui/core';

import { borderRadius, colors, fontWeight } from '../../../Css';
import { convertPositionToNthValue } from 'utils/TransformationUtils';

const SemesterInputField = ({ value, position, error, onChange }) => {
  const classes = useStyles();

  const handleChange = (key) => (evt) => {
    onChange({
      ...value,
      [key]: evt.target.value,
    });
  };

  return (
    <Box p={8} className={classes.container}>
      <Typography color="textPrimary" style={{ fontWeight: fontWeight.bold }}>
        {position}
        {convertPositionToNthValue(position)} Semester{' '}
      </Typography>
      <Box mt={8}>
        <TextField
          label="Start Date"
          type="date"
          value={value.startDate}
          fullWidth
          variant="outlined"
          error={Boolean(error?.startDate)}
          helperText={error?.startDate}
          onChange={handleChange('startDate')}
        />
      </Box>
      <Box mt={8}>
        <TextField
          label="End Date"
          type="date"
          value={value.endDate}
          fullWidth
          variant="outlined"
          error={Boolean(error?.endDate)}
          helperText={error?.endDate}
          onChange={handleChange('endDate')}
        />
      </Box>
    </Box>
  );
};

const useStyles = makeStyles({
  container: {
    background: '#F1F2F6',
    border: `1px dashed ${colors.secondaryLightGrey}`,
    borderRadius: borderRadius.small,
  },
});

SemesterInputField.propTypes = {
  value: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string,
  }),
  position: PropTypes.number,
  error: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string,
  }),
  onChange: PropTypes.func,
};

export default memo(SemesterInputField);
