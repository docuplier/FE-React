import React, { memo } from 'react';
import { makeStyles, Select, MenuItem, InputLabel, FormControl } from '@material-ui/core';
import PropTypes from 'prop-types';

import { colors, fontSizes } from '../../../Css';

const CustomFilter = ({ options, inputLabel, value, onChange, defaultText, disabled }) => {
  const classes = useStyles();

  return (
    <FormControl className={classes.formControl}>
      <InputLabel id="demo-simple-select-label" style={{ fontSize: fontSizes.medium }}>
        {inputLabel}
      </InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={value || ''}
        disabled={disabled}
        onChange={onChange}>
        <MenuItem value={defaultText} key={defaultText}>
          {defaultText}
        </MenuItem>
        {options?.map((opt) => {
          return (
            <MenuItem key={opt.id} value={opt.id}>
              {opt?.name}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    background: colors.white,
  },
}));

CustomFilter.propTypes = {
  options: PropTypes.array,
  value: PropTypes.string,
  defaultText: PropTypes.string,
  inputLabel: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
};
export default memo(CustomFilter);
