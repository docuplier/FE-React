import { Box, Paper, Typography, useMediaQuery, useTheme, makeStyles } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';

import { borderRadius, colors, fontWeight, spaces } from '../../../../Css';

const AssessmentTopInfo = ({ assessment, duration, activeIndex }) => {
  const classes = useStyles();
  const theme = useTheme();
  const isXsScreen = useMediaQuery(theme.breakpoints.down('xs'));
  return (
    <Box component={Paper} className={classes.description} square>
      <Box className="box" display="flex" justifyContent="space-between" alignItems="center" px={9}>
        <Box>
          <Typography variant="body1" color="textPrimary" style={{ fontWeight: fontWeight.bold }}>
            {assessment?.title}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Due Date: {assessment?.dueDate}
          </Typography>
        </Box>
      </Box>
      <Box
        className="duration"
        display="flex"
        justifyContent="space-between"
        flexDirection={isXsScreen ? 'column' : 'row'}
        alignItems={isXsScreen ? 'flex-start' : 'center'}
        px={9}>
        <Typography>Time Remaining: {duration}</Typography>
        <Typography>
          Questions: {activeIndex + 1} of {assessment?.assessmentQuestions?.length}
        </Typography>
      </Box>
    </Box>
  );
};

const useStyles = makeStyles(() => ({
  description: {
    width: '100%',
    height: 'auto',
    display: 'grid',
    placeItems: 'center',
    '& .box': {
      width: '100%',
      height: 77,
      background: '#F7F8F9',
    },
    '& .duration': {
      background: '#6B6C7E',
      width: '100%',
      minHeight: 40,
      color: colors.white,
    },
  },
  attachment: {
    border: `dashed 1px ${colors.primary}`,
    background: colors.white,
    color: colors.primary,
    padding: spaces.small,
    cursor: 'pointer',
    borderRadius: borderRadius.small,
  },
}));

AssessmentTopInfo.propTypes = {
  assessment: PropTypes.shape({
    title: PropTypes.string,
    dueDate: PropTypes.string,
    assessmentQuestions: PropTypes.shape([
      {
        body: PropTypes.string,
        id: PropTypes.string,
        type: PropTypes.string,
        score: PropTypes.string,
        options: PropTypes.array,
      },
    ]),
  }),
  durationFormat: PropTypes.shape({
    formattedDuration: PropTypes.number,
    done: PropTypes.bool,
  }),
  activeIndex: PropTypes.number,
}.isRequired;

export default AssessmentTopInfo;
