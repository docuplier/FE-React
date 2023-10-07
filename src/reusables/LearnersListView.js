import React from 'react';
import PropTypes from 'prop-types';
import { Paper, Box, Grid, Typography, makeStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';

import { fontSizes, fontWeight } from '../Css';

/**
 * This reusable renders a list item with each levels, total number courses and total number of student
 */
function LearnersListView({ level, courseCount, userCount, path }) {
  const classes = useStyles();

  return (
    <Link className={classes.container} to={path}>
      <Paper square>
        <Box p={12}>
          <Grid container>
            <Grid item xs={4}>
              <Typography component="span" variant="body1" color="textSecondary">
                <Typography
                  component="span"
                  color="textPrimary"
                  className="bold-text"
                  variant="body1">
                  {level}
                </Typography>{' '}
                Level
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography component="span" variant="body1" color="textSecondary">
                <Typography
                  component="span"
                  color="textSecondary"
                  className="bold-text"
                  variant="body1">
                  {courseCount}
                </Typography>{' '}
                Courses
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Box display="flex" alignItems="center">
                <Box ml={4}>
                  <Typography color="textSecondary" body="body2">
                    {userCount}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Link>
  );
}

const useStyles = makeStyles({
  container: {
    display: 'block',
    textDecoration: 'none',
    '& .bold-text': {
      fontWeight: fontWeight.bold,
    },
    '& .small-avatar': {
      width: 24,
      height: 24,
      fontSize: fontSizes.xsmall,
    },
  },
});

LearnersListView.propTypes = {
  level: PropTypes.number.isRequired,
  courseCount: PropTypes.number.isRequired,
  userCount: PropTypes.number.isRequired,
  path: PropTypes.string.isRequired,
};

export default LearnersListView;
