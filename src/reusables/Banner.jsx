import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormControlLabel, FormGroup, Typography } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/styles';

import { fontWeight } from '../Css';
import CustomSwitch from './Switch';

export default function Banner({
  message,
  title,
  severity,
  checked: checkedFromProps,
  onToggleSwitch,
  showSwitch,
  ...props
}) {
  const [checkedFromState, setCheckedFromState] = React.useState(true);
  const classes = useStyles({ severity });

  const checked = useMemo(() => {
    return checkedFromProps !== undefined ? checkedFromProps : checkedFromState;
  }, [checkedFromProps, checkedFromState]);

  const handleChange = (event) => {
    setCheckedFromState(event.target.checked);
    onToggleSwitch?.(event.target.checked);
  };

  const renderTitle = () => {
    return (
      <Typography variant="body2" color="textPrimary" style={{ fontWeight: fontWeight.bold }}>
        {title}
      </Typography>
    );
  };

  return (
    <Alert severity={severity} {...props} className={classes.alert}>
      {showSwitch ? (
        <FormGroup>
          <FormControlLabel
            control={<CustomSwitch isOn={checked} edge="end" handleChange={handleChange} />}
            label={renderTitle()}
          />
        </FormGroup>
      ) : (
        renderTitle()
      )}
      <Typography variant="caption" color="textPrimary" component="p" className={classes.message}>
        {message}
      </Typography>
    </Alert>
  );
}

Banner.propTypes = {
  ...Alert.propTypes,
  message: PropTypes.node.isRequired,
  title: PropTypes.node,
  checked: PropTypes.bool,
  onToggleSwitch: PropTypes.func,
  showSwitch: PropTypes.bool,
};

Banner.defaultProps = {
  severity: 'success',
  icon: false,
};

const borderColors = {
  success: '#5ACA75',
  info: '#458FFF',
  error: '#DA1414',
};

const useStyles = makeStyles({
  alert: {
    minWidth: '100%',
    border: (props) => `1px solid ${borderColors[props.severity]}`,
    borderRadius: 8,
  },
  message: {
    lineHeight: 1.3,
  },
});
