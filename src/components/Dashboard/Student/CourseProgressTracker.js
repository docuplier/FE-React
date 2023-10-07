import React from 'react';
import { Box, Typography, makeStyles, LinearProgress } from '@material-ui/core';
import { colors } from '../../../Css';

const CourseProgressTracker = ({
  courseTitle,
  percentageCompletion,
  totalNumberOfLessons,
  numberOfLessonsCompleted,
  onClick,
}) => {
  const classes = useStyles();

  return (
    <Box mb={12} onClick={onClick} style={{ cursor: 'pointer' }}>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="body2">{courseTitle}</Typography>
        <Typography variant="body2">{percentageCompletion}% Complete</Typography>
      </Box>
      <Box mt={4} mb={4}>
        <LinearProgress
          variant="buffer"
          value={percentageCompletion}
          classes={{
            root: percentageCompletion === 100 ? classes.green : classes.yellow,
          }}
          color="primary"
        />
      </Box>
      <Typography variant="caption">
        {numberOfLessonsCompleted} 0f {totalNumberOfLessons} lessons completed
      </Typography>
    </Box>
  );
};

const useStyles = makeStyles((theme) => ({
  green: {
    height: 10,
    borderRadius: 5,
    width: '100%',
    '& .MuiLinearProgress-barColorPrimary': {
      background: colors.textSuccess,
    },
    '& .MuiLinearProgress-colorPrimary': {
      backgroundColor: 'lightgrey',
    },
  },
  yellow: {
    height: 10,
    borderRadius: 5,
    width: '100%',
    '& .MuiLinearProgress-barColorPrimary': {
      background: '#FFC453',
    },
    '& .MuiLinearProgress-colorPrimary': {
      backgroundColor: 'lightgrey',
    },
  },
}));

export default CourseProgressTracker;
