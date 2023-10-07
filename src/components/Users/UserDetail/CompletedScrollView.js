import React, { useRef, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Paper, Typography, IconButton } from '@material-ui/core';

import { spaces, colors, fontSizes, fontFamily } from '../../../Css';
import {
  ArrowBackIos as ArrowBackIcon,
  ArrowForwardIos as ArrowForwardIcon,
} from '@material-ui/icons';
import { courses } from 'pages/Users/mockData';
import CourseProgressCard from 'reusables/CourseProgressCard';
import MaxWidthContainer from 'reusables/MaxWidthContainer';

export default function ProfileCardsScroll() {
  const [leftOffset, setLeftOffset] = useState(0);
  const classes = useStyles();
  const scrollViewRef = useRef({});

  const completed = courses?.filter((course) => course.progress === 100);

  useEffect(() => {
    handleScrollEvent();
    // if (scrollViewRef.current) scrollViewRef.current.addEventListener('scroll', handleScrollEvent);
    // return () => {
    //   scrollViewRef.current.removeEventListener('scroll', handleScrollEvent);
    // };
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
        if (direction === 'left') {
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
    <Paper square>
      <MaxWidthContainer>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography
              variant="h6"
              color="textPrimary"
              style={{ marginBottom: '-35px' }}
              fontWeight="700">
              Completed Courses
              <Typography component="span" className={classes.viewAll}>
                View all
              </Typography>
            </Typography>
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
          {completed?.map((course, index) => {
            return (
              <Box elevation={1}>
                <CourseProgressCard
                  key={index}
                  courseCode={'cs-101'}
                  title={course.title}
                  description={course.desc}
                  imageSrc={course.image}
                  progress={course.progress}
                  chipProp={{
                    label: course.status,
                    color: course.status === 'Enrolled' ? 'success' : 'warning',
                  }}
                />
              </Box>
            );
          })}
        </Box>
      </MaxWidthContainer>
    </Paper>
  );
}

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
