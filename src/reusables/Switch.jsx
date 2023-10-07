import React from 'react';
import PropTypes from 'prop-types';
import { Switch } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

export default function CustomSwitch({ isOn, handleChange, name, ...props }) {
  const StyledSwitch = withStyles((theme) => ({
    root: {
      width: 42,
      height: 26,
      padding: 0,
      display: 'flex',
      margin: theme.spacing(4), //8px
    },
    switchBase: {
      padding: 2,
      color: theme.palette.grey[500],
      '&$checked': {
        transform: 'translateX(16px)',
        color: theme.palette.common.white,
        '& + $track': {
          opacity: 1,
          backgroundColor: theme.palette.primary.main,
          borderColor: theme.palette.primary.main,
        },
      },
    },
    thumb: {
      width: 22,
      height: 22,
      boxShadow: 'none',
    },
    track: {
      borderRadius: 26 / 2,
      opacity: 1,
      backgroundColor: theme.palette.common.white,
    },
    checked: {},
  }))(Switch);

  return <StyledSwitch checked={isOn} onChange={handleChange} name={name} {...props} />;
}

CustomSwitch.prototype = {
  isOn: PropTypes.bool.isRequired,
};

CustomSwitch.defaultProps = {
  isOn: true,
};
