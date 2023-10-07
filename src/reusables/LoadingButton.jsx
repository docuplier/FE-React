import React from 'react';
import { Button, CircularProgress, makeStyles } from '@material-ui/core';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { spaces, colors } from '../Css';

const LoadingButton = ({
  isLoading,
  variant = 'contained',
  color,
  danger,
  children,
  className,
  ...props
}) => {
  const classes = useStyles();

  return (
    <Button
      variant={variant}
      disabled={isLoading}
      color={color}
      {...props}
      className={classNames(
        classes.root,
        {
          danger: danger,
          loading: isLoading,
        },
        className,
      )}>
      {isLoading && (
        <CircularProgress size={20} color="primary" style={{ marginRight: spaces.medium }} />
      )}
      {children}
    </Button>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    //handle scenarios where danger prop is passed to button irrespective of variant
    '&.MuiButton-contained.danger': {
      background: colors.error,
      color: colors.white,
      borderColor: colors.error,
      '&:hover': {
        background: colors.error,
        color: colors.white,
        borderColor: colors.error,
      },
    },
    '&.MuiButton-outlined.danger': {
      color: colors.error,
      borderColor: colors.error,
      '&:hover': {
        color: colors.error,
        borderColor: colors.error,
      },
    },
    '&.MuiButton-text.danger': {
      color: colors.error,
      '&:hover': {
        color: colors.error,
      },
    },
    //handle loading on the button irrespective of the variant
  },
}));

LoadingButton.propTypes = {
  ...Button.propTypes,
  isLoading: PropTypes.bool,
  danger: PropTypes.bool,
};

export default LoadingButton;
