// This components handle the notification view using material ui Snackbar
// It also handles notification queues and stacks them in a queue so they popup one after the other

import React, { useState } from 'react';
import { Snackbar, makeStyles } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import PropTypes from 'prop-types';

import { usePrevious } from 'hooks/usePrevious';
import { useUpdateEffect } from 'hooks/useUpdateEffect';
import { fontWeight } from '../../Css';

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const DefaultNotificationView = ({ style, message, description, id, duration = 'long' }) => {
  const [isBannerHidden, setIsBannerHidden] = useState(true);
  const queueRef = React.useRef([]);
  const [messageInfo, setMessageInfo] = React.useState(undefined);
  const previousId = usePrevious(id);
  const classes = useStyles();

  useUpdateEffect(() => {
    if (id !== previousId) {
      queueRef.current.push({
        style,
        message,
        description,
        id,
        duration,
      });
    }

    if (isBannerHidden === false) {
      setIsBannerHidden(true);
    } else {
      processQueue();
    }
  }, [id]);

  const processQueue = () => {
    if (queueRef.current.length > 0) {
      setMessageInfo(queueRef.current.shift());
      setIsBannerHidden(false);
    }
  };

  const handleCloseBanner = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsBannerHidden(true);
  };

  const handleExited = () => {
    processQueue();
  };

  let snackbarDuration = messageInfo ? (messageInfo.duration === 'short' ? 1000 : 5000) : 1000;
  return (
    <Snackbar
      key={messageInfo ? messageInfo.id : undefined}
      onExited={handleExited}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isBannerHidden === false}
      autoHideDuration={snackbarDuration}
      onClose={handleCloseBanner}
      style={{ zIndex: 99999 }}
      className={classes.container}>
      {messageInfo && (
        <Alert onClose={handleCloseBanner} severity={messageInfo.style}>
          {messageInfo.message && <p className="title">{messageInfo.message}</p>}
          {messageInfo.description && (
            <p dangerouslySetInnerHTML={{ __html: messageInfo.description }} />
          )}
        </Alert>
      )}
    </Snackbar>
  );
};

const useStyles = makeStyles({
  container: {
    '& p': {
      margin: 0,
    },
    '& p.title': {
      fontWeight: fontWeight.bold,
    },
  },
});

DefaultNotificationView.prototype = {
  text: PropTypes.string,
  style: PropTypes.oneOf(['success', 'warning', 'error', 'info']),
  id: PropTypes.number,
  duration: PropTypes.oneOf(['long', 'short', PropTypes.number]),
};

export default React.memo(DefaultNotificationView);
