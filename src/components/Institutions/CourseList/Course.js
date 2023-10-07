import React from 'react';
import PropTypes from 'prop-types';
import { Box, makeStyles, Typography } from '@material-ui/core';
import DotIcon from '@material-ui/icons/FiberManualRecord';
import { Link } from 'react-router-dom';

import { borderRadius, colors, fontSizes, fontWeight } from '../../../Css';
import TruncateText from 'reusables/TruncateText';
import Chip from 'reusables/Chip';
import { convertPositionToNthValue } from 'utils/TransformationUtils';

const Course = ({ title, description, semester, unit, banner, numberOfStudents }) => {
  const classes = useStyles();

  return (
    <Link to="#" className={classes.container}>
      <Box mt={12} display="flex">
        <div className={classes.avatarContainer}>{banner && <img src={banner} alt="course" />}</div>
        <Box
          ml={12}
          style={{
            width: '100%',
          }}>
          <Typography color="textPrimary" variant="body2" className={classes.title}>
            {title}
          </Typography>
          <TruncateText text={description} />
          <Box mt={4} mb={4}>
            <Chip
              label={`${semester}${convertPositionToNthValue(semester)} semester`}
              color="primary"
            />
          </Box>
          <Box display="flex" alignItems="center">
            <Typography color="textSecondary" variant="body2">
              {unit} units
            </Typography>
            <DotIcon className={classes.dot} />
            <Typography color="textSecondary" variant="body2">
              {numberOfStudents} students
            </Typography>
          </Box>
        </Box>
      </Box>
    </Link>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    textDecoration: 'none',
    display: 'block',
  },
  avatarContainer: {
    background: '#041E44',
    height: 147,
    minWidth: 260,
    maxWidth: 260,
    borderRadius: borderRadius.default,
    '& > img': {
      width: '100%',
      height: '100%',
      borderRadius: borderRadius.default,
    },
  },
  dot: {
    color: colors.grey,
    margin: theme.spacing(0, 2),
    fontSize: fontSizes.xsmall,
  },
  title: {
    fontWeight: fontWeight.bold,
  },
}));

Course.propTypes = {
  src: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  semester: PropTypes.number.isRequired,
  unit: PropTypes.number,
  numberOfStudents: PropTypes.number,
  id: PropTypes.string.isRequired,
};

export default React.memo(Course);
