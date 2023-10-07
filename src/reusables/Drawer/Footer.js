import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Paper } from '@material-ui/core';

import LoadingButton from 'reusables/LoadingButton';
import { colors } from '../../Css';

const Footer = ({ okText, onOk, cancelButtonProps, cancelText, onClose, okButtonProps }) => {
  const classes = useStyles();

  return (
    <Paper elevation={0} className={classes.footer} square>
      <LoadingButton variant="outlined" {...cancelButtonProps} onClick={onClose}>
        {cancelText}
      </LoadingButton>
      <LoadingButton
        className="okButton"
        color="primary"
        disableElevation
        {...okButtonProps}
        onClick={onOk}>
        {okText}
      </LoadingButton>
    </Paper>
  );
};

const useStyles = makeStyles((theme) => ({
  footer: {
    padding: theme.spacing(4, 8), //8px 16px
    textAlign: 'right',
    position: 'absolute',
    width: '100%',
    bottom: 0,
    left: 0,
    boxSizing: 'border-box',
    borderTop: `1px solid ${colors.seperator}`,
    '& .okButton': {
      marginLeft: theme.spacing(4), //8px
    },
  },
}));

Footer.propTypes = {
  okText: PropTypes.node,
  onOk: PropTypes.func,
  okButtonProps: PropTypes.shape({
    ...LoadingButton.propTypes,
  }),
  cancelButtonProps: PropTypes.shape({
    ...LoadingButton.propTypes,
  }),
  cancelText: PropTypes.node,
  onClose: PropTypes.func,
};

export default React.memo(Footer);
