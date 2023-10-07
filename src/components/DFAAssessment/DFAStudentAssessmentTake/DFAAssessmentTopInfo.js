import { Box, Paper, Typography, useMediaQuery, useTheme, makeStyles } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import HeaderItems from 'assets/svgs/headerItems.svg';
import { borderRadius, colors, fontWeight, spaces } from '../../../Css';

const DFAAssessmentTopInfo = ({ assessment, duration, activeIndex, title }) => {
  const classes = useStyles();
  const theme = useTheme();
  const isXsScreen = useMediaQuery(theme.breakpoints.down('xs'));
  return (
    <Box component={Paper} className={classes.description} square>
      <Box className="box" display="flex" justifyContent="space-between" alignItems="center" px={9}>
        <Box>
          <Typography variant="body1" color="#fff" style={{ fontWeight: fontWeight.bold }}>
            {assessment?.title || title || 'General Assessment'}
          </Typography>
        </Box>
      </Box>
      <Box
        className="duration"
        display="flex"
        justifyContent="space-between"
        flexDirection={isXsScreen ? 'column' : 'row'}
        alignItems={isXsScreen ? 'flex-start' : 'center'}
        px={9}
      >
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
      color: '#fff',
      background: 'var(--PrimaryGreenDFA, #3CAE5C)',
      backgroundImage: `url(${HeaderItems})`,
      backgroundSize: 'cover',
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
  header: {
    backgroundImage: `url(${HeaderItems})`,
    backgroundSize: 'cover',
  },
}));

DFAAssessmentTopInfo.propTypes = {
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
  title: PropTypes.string,
  durationFormat: PropTypes.shape({
    formattedDuration: PropTypes.number,
    done: PropTypes.bool,
  }),
  activeIndex: PropTypes.number,
}.isRequired;

export default DFAAssessmentTopInfo;
