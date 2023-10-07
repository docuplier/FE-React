import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Card, Typography, Box, Link } from '@material-ui/core';
import PropTypes from 'prop-types';

import { colors, boxShadows, spaces, fontFamily, fontWeight, fontSizes } from '../../Css';

export default function ProfileCard({ profile }) {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <Avatar style={{ height: 100, width: 100 }} />
      <Box className="info" mb={`${spaces.medium}px`} mt={`${spaces.large}px`}>
        <Typography className="name">
          {profile.title}. {profile.name}
        </Typography>
        <Typography className="level">{profile.level}</Typography>
      </Box>
      <Link to={profile.link} className="view-more">
        View More
      </Link>
    </Card>
  );
}

ProfileCard.prototype = {
  profile: PropTypes.shape({
    name: PropTypes.string.isRequired,
    level: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }),
};

const useStyles = makeStyles({
  card: {
    zIndex: 5,
    boxShadow: boxShadows.primary,
    borderRadius: '8px',
    borderTop: '8px solid #BB6BD9',
    textAlign: 'center',
    minWidth: 'max-content',
    padding: spaces.medium,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    background: colors.white,
    maxHeight: 'max-content',
    '& .info': { width: 250 },
    '& .name': {
      fontFamily: fontFamily.primary,
      fontWeight: fontWeight.medium,
      fontSize: fontSizes.xlarge,
      color: colors.secondaryBlack,
    },
    '& .level': {
      fontFamily: fontFamily.primary,
      fontSize: fontSizes.large,
      color: colors.grey,
      textTransform: 'uppercase',
    },
    '& .view-more': {
      fontFamily: fontFamily.primary,
      fontSize: fontSizes.medium,
      color: colors.primary,
    },
    '&:not(:last-child)': {
      marginRight: spaces.large,
    },
  },
});
