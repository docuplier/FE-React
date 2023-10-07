import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography, Avatar } from '@material-ui/core';
import PropTypes from 'prop-types';
import { formatDistance } from 'date-fns';

import { fontWeight } from '../Css';

const AnnouncementCard = ({ announcement }) => {
  const classes = useStyles();

  return (
    <Box className={classes.question}>
      <Box display="flex" justifyContent="flex-start" alignItems="center">
        <Avatar alt="avatar" src={announcement?.posterAvatar} />
        <Box ml={10}>
          <Typography color="primary" variant="body1">
            {announcement?.poster}
          </Typography>
          <Typography color="textSecondary" variant="body2">
            posted an announcement ·{' '}
            {formatDistance(new Date(announcement?.datePosted), new Date(), { addSuffix: true })}
          </Typography>
        </Box>
      </Box>
      <Box my={8}>
        <Typography color="textPrimary" variant="body1" className="announcement-title">
          {announcement?.title}
        </Typography>
        <Typography
          color="textSecondary"
          variant="body2"
          dangerouslySetInnerHTML={{ __html: announcement?.descriptionHtml }}></Typography>
      </Box>
    </Box>
  );
};

const useStyles = makeStyles(() => ({
  question: {
    width: '100%',
    '& .announcement-title': {
      fontWeight: fontWeight.medium,
      marginBottom: 16,
    },
  },
}));

AnnouncementCard.propTypes = {
  announcement: PropTypes.shape({
    posterAvatar: PropTypes.string,
    poster: PropTypes.string,
    datePosted: PropTypes.string,
    title: PropTypes.string,
    descriptionHtml: PropTypes.string,
  }),
};
export default AnnouncementCard;
