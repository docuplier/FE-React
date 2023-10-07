import React, { useRef, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Paper, Typography, IconButton } from '@material-ui/core';
import PropTypes from 'prop-types';

import ProfileCard from 'reusables/ProfileCardsScrollview/ProfileCard';
import { spaces, colors, fontSizes, fontFamily } from '../../Css';
import {
  ArrowBackIos as ArrowBackIcon,
  ArrowForwardIos as ArrowForwardIcon,
} from '@material-ui/icons';

export default function ProfileCardsScroll({ profiles, caption, title }) {
  const [leftOffset, setLeftOffset] = useState(0);
  const classes = useStyles();
  const scrollViewRef = useRef({});

  useEffect(() => {
    if (scrollViewRef.current) scrollViewRef.current.addEventListener('scroll', handleScrollEvent);
    return () => {
      scrollViewRef.current.removeEventListener('scroll', handleScrollEvent);
    };
  }, []);

  const handleScrollEvent = () => {
    setLeftOffset(scrollViewRef.current.scrollLeft);
  };

  function handleSlide(direction) {
    let scrollAmount = 0;
    let step = 20;
    let scrollDistance = 100;

    if (scrollViewRef.current)
      var slideTimer = setInterval(function () {
        if (direction == 'left') {
          scrollViewRef.current.scrollLeft -= step;
        } else {
          scrollViewRef.current.scrollLeft += step;
        }
        scrollAmount += step;
        if (scrollAmount >= scrollDistance) {
          window.clearInterval(slideTimer);
        }
      }, 25);
  }

  return (
    <Paper style={{ padding: spaces.large }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography className={classes.title}>{title}</Typography>
          <Typography className={classes.caption}>{caption}</Typography>
        </Box>
        <Box>
          <IconButton
            onClick={() => handleSlide('left')}
            aria-label="upload picture"
            component="span"
            disabled={leftOffset === 0}>
            <ArrowBackIcon />
          </IconButton>
          <IconButton
            onClick={() => handleSlide('right')}
            aria-label="upload picture"
            component="span">
            <ArrowForwardIcon />
          </IconButton>
        </Box>
      </Box>
      <Box display="flex" ref={scrollViewRef} className={classes.card}>
        {profiles.map((profile) => {
          return <ProfileCard key={profile.id} profile={profile} />;
        })}
      </Box>
    </Paper>
  );
}

ProfileCardsScroll.propTypes = {
  profiles: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      level: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
    }),
  ),
  title: PropTypes.string,
  caption: PropTypes.string,
};

const useStyles = makeStyles({
  card: {
    padding: spaces.large,
    paddingRight: 0,
    paddingLeft: 0,
    overflowY: 'hidden',
    overflowX: 'scroll',
    '&::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'none',
      backgroundColor: 'transparent',
    },
    '&::-webkit-scrollbar': {
      width: 4,
      height: 1,
      backgroundColor: 'transparent',
    },

    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'transparent',
      width: 4,
    },
  },
  title: {
    color: colors.secondaryBlack,
    fontWeight: 800,
    fontSize: fontSizes.xxlarge,
    fontFamily: fontFamily.primary,
  },
  caption: {
    color: colors.grey,
    fontSize: fontSizes.large,
    fontFamily: fontFamily.primary,
  },
});
