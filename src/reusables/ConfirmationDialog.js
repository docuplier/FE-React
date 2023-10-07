import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, makeStyles, Box, Typography, useMediaQuery, useTheme } from '@material-ui/core';

import LoadingButton from './LoadingButton';
import { ReactComponent as WarningIcon } from 'assets/svgs/warning_icon.svg';
import { fontWeight } from '../Css';

const ConfirmationDialog = ({
  title,
  description,
  cancelText,
  cancelButtonProps,
  okText,
  onOk,
  okButtonProps,
  icon = <WarningIcon />,
  onClose,
  gif,
  ...rest
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const isXsScreen = useMediaQuery(theme.breakpoints.down('xs'));

  const renderFooter = () => {
    return (
      <Box display="flex" flexDirection={isXsScreen ? 'column' : 'row'}>
        <LoadingButton
          onClick={onClose}
          {...cancelButtonProps}
          fullWidth={isXsScreen ? true : false}
          style={{ marginBottom: isXsScreen ? 20 : 0 }}>
          {cancelText}
        </LoadingButton>
        <Box ml={isXsScreen ? 0 : 12}>
          <LoadingButton onClick={onOk} {...okButtonProps} fullWidth={isXsScreen ? true : false}>
            {okText}
          </LoadingButton>
        </Box>
      </Box>
    );
  };

  return (
    <Dialog aria-labelledby="dialog-title" {...rest} className={classes.dialog}>
      <Box display="flex" alignItems="center" className={classes.container}>
        <Box mb={10}>{gif ? <img src={gif} alt="gif" style={{ width: '200px' }} /> : icon}</Box>
        <Box textAlign="center" className={classes.wordContainer}>
          <Typography color="textPrimary" variant="h6" className={classes.boldText}>
            {title}
          </Typography>
        </Box>
        <Box mt={8} mb={8} textAlign="center" className={classes.wordContainer}>
          <Typography color="inherit" variant="body1">
            {description}
          </Typography>
        </Box>
        {renderFooter()}
      </Box>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  dialog: {
    '& .MuiDialog-paper': {
      [theme.breakpoints.down('xs')]: {
        padding: 20,
      },
    },
  },
  container: {
    flexDirection: 'column',
    width: 600,
    overflowX: 'hidden',
    padding: 0,
    boxSizing: 'border-box',
    [theme.breakpoints.down('xs')]: {
      width: 'auto',
    },
  },
  boldText: {
    fontWeight: fontWeight.medium,
  },
  wordContainer: {
    [theme.breakpoints.up('sm')]: {
      maxWidth: 400,
    },
  },
}));

ConfirmationDialog.propTypes = {
  ...Dialog.propTypes,
  title: PropTypes.string.isRequired,
  description: PropTypes.node.isRequired,
  cancelText: PropTypes.string,
  cancelButtonProps: PropTypes.shape({
    ...LoadingButton.propTypes,
  }),
  okText: PropTypes.string,
  onOk: PropTypes.func,
  okButtonProps: PropTypes.shape({
    ...LoadingButton.propTypes,
  }),
  icon: PropTypes.node,
  gif: PropTypes.any,
};

ConfirmationDialog.defaultProps = {
  cancelText: 'Cancel',
  cancelButtonProps: {
    variant: 'outlined',
  },
  okButtonProps: {
    variant: 'contained',
    danger: true,
  },
};

export default React.memo(ConfirmationDialog);
