import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  LinearProgress,
  makeStyles,
  Typography,
} from '@material-ui/core';
import TruncateText from 'reusables/TruncateText';
import { borderRadius, colors, fontSizes, fontWeight, spaces } from '../Css';
import Chip from './Chip';

const ChipColor = {
  SUCCESS: 'success',
  WARNING: 'warning',
  DEFAULT: 'default',
};

const CourseProgressCard = ({
  description,
  courseCode,
  title,
  imageSrc,
  progress,
  footerText,
  chipProp,
  iconText,
  onClick,
}) => {
  const getStatusText = () => {
    switch (progress) {
      case 100:
        return ' Completed';
      case 0:
        return ' Not started';
      default:
        return `${progress}% Complete`;
    }
  };

  const setBackGroundColor = () => {
    switch (chipProp?.color) {
      case ChipColor.SUCCESS:
        return '#5AcA75';
      case ChipColor.WARNING:
        return '#F2994A';
      case ChipColor.DEFAULT:
        return '#FFF';
      default:
        break;
    }
  };

  const classes = useStyles({ chipColor: chipProp?.color, setBackGroundColor });

  return (
    <Card className={classes.card} square onClick={onClick}>
      <CardMedia image={imageSrc} className={classes.img}>
        {chipProp && <Chip roundness="md" label={chipProp?.label} className={classes.chip} />}
      </CardMedia>
      <CardContent classes={{ root: classes.cardContentRoot }}>
        <Box py={2} className={classes.information}>
          <Box my={5}>
            {!!courseCode && <Typography display="inline">{courseCode}: </Typography>}
            <TruncateText text={title} className={classes.titleText} />
          </Box>
          <TruncateText text={description} mb={8} fontSize={fontSizes.medium} />
        </Box>
        {progress !== undefined && (
          <Box mb={4}>
            <LinearProgress value={progress} variant="determinate" />
            <Box mt={2}>
              <Typography
                variant="body2"
                color="textSecondary"
                className={progress === 100 && classes.completed}>
                {getStatusText()}
              </Typography>
            </Box>
          </Box>
        )}
        {footerText && (
          <Typography variant="body2" color="textSecondary" className={classes.footerText}>
            {footerText}
            <Typography component="span" variant="body2" className="span">
              {iconText && iconText}
            </Typography>
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

const useStyles = makeStyles({
  titleText: {
    display: 'inline',
  },
  card: {
    height: '100%',
    cursor: 'pointer',
    borderRadius: borderRadius.small,
  },
  img: {
    width: '100%',
    position: 'relative',
    height: 120,
    objectFit: 'contain',
  },
  cardContentRoot: {
    paddingBottom: 0,
    paddingTop: 0,
    '&:last-child': {
      paddingBottom: 0,
    },
  },
  information: {
    '& :nth-child(1)': {
      color: colors.black,
      fontWeight: fontWeight.bold,
    },
  },
  chip: ({ chipColor, setBackGroundColor }) => ({
    position: 'relative',
    left: 5,
    top: 5,
    color: chipColor !== ChipColor.DEFAULT ? colors.white : colors.black,
    height: 25,
    backgroundColor: setBackGroundColor(),
  }),
  completed: {
    color: '#5AcA75',
  },
  footerText: {
    display: 'flex',
    alignItems: 'center',
    paddingBottom: spaces.medium,
    '& .span': {
      paddingLeft: spaces.small,
    },
  },
});

CourseProgressCard.propTypes = {
  description: PropTypes.string,
  courseCode: PropTypes.string,
  title: PropTypes.string,
  imageSrc: PropTypes.string,
  progress: PropTypes.number,
  footerText: PropTypes.string,
  chipProp: PropTypes.shape({
    label: PropTypes.string,
    color: PropTypes.oneOf(['success', 'warning', 'default']),
  }),
}.isRequired;

export default CourseProgressCard;
