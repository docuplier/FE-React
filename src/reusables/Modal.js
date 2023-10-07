import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {
  Dialog,
  Box,
  DialogActions,
  DialogTitle,
  DialogContent,
  Typography,
  makeStyles,
  Button,
} from '@material-ui/core';
import HighlightOffOutlinedIcon from '@material-ui/icons/HighlightOffOutlined';
import LoadingButton from './LoadingButton';

import { fontWeight, fontSizes, colors } from '../Css';

const Modal = ({ title, okButtonProps, okText, onClose, children, ...rest }) => {
  const classes = useStyles();

  return (
    <Dialog aria-labelledby="dialog-title" {...rest}>
      <DialogTitle id="dialog-title" className={classes.title}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography className="title" variant="body1" color="textPrimary">
            {title}
          </Typography>
          <Button className="closeButton" onClick={onClose}>
            <HighlightOffOutlinedIcon />
          </Button>
        </Box>
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions className={classes.footer}>
        <LoadingButton
          color="primary"
          {...okButtonProps}
          className={classNames('okButton', okButtonProps?.className)}>
          {okText}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

const useStyles = makeStyles({
  title: {
    '& .title': {
      fontWeight: fontWeight.bold,
    },
    '& .closeButton': {
      padding: 0,
      minWidth: 'max-content',
      minHeight: 'max-content',
      '& svg': {
        fontSize: fontSizes.xlarge,
        color: colors.grey,
      },
    },
  },
  footer: {
    '& .okButton': {
      width: '100%',
    },
  },
});

Modal.propTypes = {
  ...Dialog.propTypes,
  okButtonProps: PropTypes.shape({
    ...LoadingButton.propTypes,
  }),
  okText: PropTypes.node,
  title: PropTypes.string,
  children: PropTypes.node,
};

export default React.memo(Modal);
