import { Box, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { borderRadius, fontWeight, spaces, colors } from '../Css';
import React from 'react';
import PropTypes from 'prop-types';

import TruncateText from 'reusables/TruncateText';
import profileImg from 'assets/svgs/profile-img.png';
import { ReactComponent as Unit } from 'assets/svgs/unit-svg.svg';
import { ReactComponent as TimeClock } from 'assets/svgs/time-clock-svg.svg';
import { ReactComponent as StudentIcon } from 'assets/svgs/student-icon-svg.svg';
import { convertTimeSpentToDuration } from 'utils/TransformationUtils';
import Chip from './Chip';

const CourseDescriptionCard = ({
  imgSrc = profileImg,
  title,
  courseCode,
  description,
  unitCount,
  studentCount,
  duration,
  chip,
  onClick,
}) => {
  const classes = useStyles({ chipColor: chip?.color });

  return (
    <Grid
      container
      spacing={10}
      style={{ marginTop: 20 }}
      onClick={onClick}
      className={classes.grid}
    >
      <Grid item className={classes.wrapper} xs={12} sm={4} md={3} alignItems="center">
        {chip && <Chip roundness="md" label={chip?.label} className={classes.chip} />}
        <img src={imgSrc} alt={imgSrc} className={classes.image} />
      </Grid>
      <Grid
        item
        xs={12}
        sm={8}
        md={9}
        className={classes.description || 'No Description Avalaible'}
      >
        <Box className="title-text">
          <span>{courseCode}: </span>
          <Typography variant="body1" display="inline" style={{ fontWeight: fontWeight.medium }}>
            {title}
          </Typography>{' '}
        </Box>

        <TruncateText text={description} mb={8} />
        <Box display="flex" justifyContent="flex-start" alignItems="center" mt={2}>
          <Typography
            variant="body2"
            color="textSecondary"
            style={{ paddingRight: 10 }}
            className="icon-align"
          >
            <Unit className="icon" /> {unitCount} units
          </Typography>
          {Boolean(studentCount) && (
            <Typography variant="body2" color="textSecondary" className="icon-align">
              <StudentIcon className="icon" /> {studentCount} students
            </Typography>
          )}
          {Boolean(duration) && Boolean(studentCount) === false && (
            <Typography variant="body2" color="textSecondary" className="icon-align">
              <TimeClock className="icon" /> {convertTimeSpentToDuration(duration)}
            </Typography>
          )}
        </Box>
        {Boolean(duration) && Boolean(studentCount) && (
          <Typography variant="body2" color="textSecondary" className="icon-align">
            <TimeClock className="icon" /> {convertTimeSpentToDuration(duration)}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles(() => ({
  image: {
    width: '100%',
    borderRadius: borderRadius.default,
    height: 120,
    objectFit: 'cover',
  },
  wrapper: {
    position: 'relative',
    paddingTop: 50,
  },
  description: {
    '& .title-text': {
      fontWeight: fontWeight.medium,
      paddingBottom: 3,
    },
    '& .icon-align': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingRight: 10,
    },
    '& .icon': {
      paddingRight: spaces.small,
    },
  },
  chip: (props) => ({
    position: 'absolute',
    left: 20,
    top: 20,
    color: colors.black,
    height: 25,
    backgroundColor: props.chipColor,
  }),
  grid: {
    cursor: 'pointer',
  },
}));

CourseDescriptionCard.propTypes = {
  description: PropTypes.string,
  courseCode: PropTypes.string,
  title: PropTypes.string,
  imageSrc: PropTypes.string,
  duration: PropTypes.number,
  chipLabel: PropTypes.string,
  color: PropTypes.string,
}.isRequired;

export default CourseDescriptionCard;
