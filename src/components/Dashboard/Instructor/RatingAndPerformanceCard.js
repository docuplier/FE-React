import {
  Box,
  Grid,
  LinearProgress,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import PropTypes from 'prop-types';

import { fontSizes, fontWeight } from '../../../Css';
import Chip from 'reusables/Chip';
import CountCard from '../CountCard';
import Rating from 'reusables/Rating';

const RatingAndPerformanceCard = ({
  course,
  chipLabel,
  countCardProps,
  averagePerformance,
  instructor,
  onClick,
}) => {
  const getProgressBarColor = () => {
    if (averagePerformance >= 50) return '#287D3C';
    return '#FFC453';
  };
  const theme = useTheme();
  const isXsScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const classes = useStyles({ getProgressBarColor });
  return (
    <Box onClick={onClick} style={{ cursor: 'pointer' }} p={12} component={Paper} elevation={0}>
      <Box display="flex" justifyContent="space-between" alignItems="baseline" mb={4}>
        <Typography className={classes.courseName}>{course?.name}</Typography>
        <Chip label={chipLabel} size="md" roundness="sm" color={chipLabel.toLowerCase()} />
      </Box>
      <Grid container>
        <Grid item xs={12} sm={3}>
          <CountCard
            label={countCardProps.label}
            count={countCardProps.count}
            icon={countCardProps.icon}
          />
        </Grid>
        <Grid item xs={12} sm={9}>
          <Box ml={isXsScreen ? 0 : 12} mt={isXsScreen ? 12 : 0}>
            <Box>
              <LinearProgress
                variant="buffer"
                value={averagePerformance}
                classes={{ root: classes.root }}
                color="primary"
              />
              <Box pt={4} display="flex" justifyContent="space-between">
                <Box pb={8}>
                  <Typography
                    style={{ fontWeight: fontWeight.bold }}
                    variant="body2"
                    color="textSecondary">
                    Average performance
                  </Typography>
                </Box>
                <Box pb={8}>
                  <Typography
                    style={{ fontWeight: fontWeight.bold }}
                    variant="body2"
                    color="textSecondary">
                    {averagePerformance}%
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Box>
                <Typography style={{ fontSize: fontSizes.medium }}>{course.ratingLabel}</Typography>
                <Rating useNumberedLabel={course.useNumberedLabel} value={course.rating} readOnly />
              </Box>
              <Box>
                <Typography style={{ fontSize: fontSizes.medium }}>
                  {instructor.ratingLabel}
                </Typography>
                <Rating
                  useNumberedLabel={instructor.useNumberedLabel}
                  value={instructor.rating}
                  readOnly
                />
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

RatingAndPerformanceCard.propTypes = {
  averagePerformance: PropTypes.number,
  course: PropTypes.shape({
    name: PropTypes.string,
    ratingLabel: PropTypes.number,
    useNumberedLabel: PropTypes.bool,
  }),
  chipLabel: PropTypes.string,
  countCardProps: PropTypes.shape({
    label: PropTypes.string,
    count: PropTypes.number,
    icon: PropTypes.node,
  }),
  instructor: PropTypes.shape({
    ratingLabel: PropTypes.number,
    useNumberedLabel: PropTypes.bool,
  }),
};

RatingAndPerformanceCard.defaultProps = {
  averagePerformance: 70,
  course: {
    name: 'course 1',
    ratingLabel: 'Course rating',
    useNumberedLabel: true,
    rating: 4.5,
  },
  chipLabel: 'Active',
  countCardProps: {
    label: 'Student',
    count: 234,
  },
  instructor: {
    ratingLabel: 'Instructor rating',
    useNumberedLabel: true,
    rating: 4.5,
  },
};

const useStyles = makeStyles((theme) => ({
  courseName: {
    fontSize: fontSizes.medium,
    fontWeight: fontWeight.bold,
    color: '#111C55',
    paddingBottom: 24,
  },
  root: {
    height: 10,
    borderRadius: 5,
    width: '100%',
    '& .MuiLinearProgress-barColorPrimary': {
      background: (props) => props.getProgressBarColor(),
    },
    '& .MuiLinearProgress-colorPrimary': {
      backgroundColor: 'lightgrey',
    },
  },
}));

export default RatingAndPerformanceCard;
