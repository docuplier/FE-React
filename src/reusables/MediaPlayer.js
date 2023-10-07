import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import ReactPlayer from 'react-player';
import { useNotification } from 'reusables/NotificationBanner';

const MediaPlayer = ({ url }) => {
  const classes = useStyles();
  const notification = useNotification();

  useEffect(() => {
    if (!ReactPlayer.canPlay(url)) {
      handleError();
    }
    // eslint-disable-next-line
  }, [url]);

  const handleError = () => {
    notification.error({
      message: 'Failed to play media',
      description: 'Please check the media type',
    });
  };

  return (
    <ReactPlayer
      className={classes.playerContainer}
      url={url}
      width="100%"
      height="100%"
      controls={true}
      pip={true}
      onError={handleError}
    />
  );
};

const useStyles = makeStyles({
  playerContainer: {
    background: '#F0F3F4',
  },
});

MediaPlayer.propTypes = {
  url: PropTypes.string.isRequired,
};

export default React.memo(MediaPlayer);
