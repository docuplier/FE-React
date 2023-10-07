import { memo } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@material-ui/core';

import SemesterInputField from './SemesterInputField';

const SemesterListInputField = ({ value, onChange, errors }) => {
  const handleChange = (position) => (newSemesterValue) => {
    const newSemesters = value.map((semester) => {
      if (semester.position === position) {
        return {
          ...semester,
          ...newSemesterValue,
        };
      }
      return semester;
    });

    onChange(newSemesters);
  };

  return (
    <Box>
      {value.map((semester) => {
        return (
          <Box mt={8} key={semester.position}>
            <SemesterInputField
              value={{
                startDate: semester.startDate,
                endDate: semester.endDate,
              }}
              position={semester.position}
              onChange={handleChange(semester.position)}
              error={errors?.[semester.position]}
            />
          </Box>
        );
      })}
    </Box>
  );
};

SemesterListInputField.propTypes = {
  value: PropTypes.arrayOf(
    PropTypes.shape({
      ...SemesterInputField.propTypes,
      position: PropTypes.number,
    }),
  ),
  onChange: PropTypes.func,
  errors: PropTypes.objectOf(
    PropTypes.shape({
      startDate: PropTypes.string,
      endDate: PropTypes.string,
    }),
  ),
};

export default memo(SemesterListInputField);
