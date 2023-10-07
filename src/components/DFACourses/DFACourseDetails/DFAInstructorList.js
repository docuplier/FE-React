import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Paper, Typography, Box, Grid, Avatar, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { getNameInitials } from 'utils/UserUtils';
import { fontWeight, colors, fontSizes } from '../../../Css';

const CourseRepOrInstructsList = ({
  data,
  vertical,
  onViewMoreClick,
  onReviewClick,
  cardClassname,
  student,
  colSpan: colSpanFromProps,
}) => {
  const classes = useStyles();
  const colSpan = vertical ? { xs: 12 } : colSpanFromProps;

  return (
    <Paper classes={{ root: classnames(classes.container, cardClassname) }}>
      <Box>
        <Typography variant="body1" className="title">
          {student ? 'Course Representative' : 'Lecturers'}
        </Typography>
      </Box>
      <Grid container spacing={10}>
        {data?.map((item, index) => (
          <Grid item {...colSpan}>
            <Box key={index} display="flex" justifyContent="flex-start">
              <Box mr={10}>
                <Avatar src={item.imgSrc} className="avatar">
                  {' '}
                  {getNameInitials(item.firstName, item.lastName)}{' '}
                </Avatar>
              </Box>
              <Box>
                <Typography color="textPrimary" className="nameText">
                  {item.firstName} {item.lastName}
                </Typography>
                <Typography color="textSecondary" variant="body1">
                  {item.department}
                </Typography>
                {!student && (
                  <Box mt={4} display="flex" alignItems="center">
                    {onReviewClick && (
                      <>
                        <Typography
                          onClick={() => onReviewClick(item)}
                          variant="body2"
                          className={classes.actionButton}
                        >
                          Review
                        </Typography>
                        <Box mx={8}>
                          <Divider orientation="vertical" className="divider" />
                        </Box>
                      </>
                    )}
                    <Typography
                      onClick={() => onViewMoreClick(item)}
                      variant="body2"
                      className={classes.actionButton}
                    >
                      View more
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    padding: 16,
    '& .title': {
      fontWeight: fontWeight.bold,
      marginBottom: 30,
      color: '#393A4A',
    },
    '& .nameText': {
      fontWeight: fontWeight.bold,
      fontSize: 18,
    },
    '& .avatar': {
      width: 68,
      height: 68,
    },
    '& .divider': {
      height: fontSizes.large,
      backgroundColor: '#3CAE5C',
    },
  },
  actionButton: {
    color: '#3CAE5C',
    cursor: 'pointer',
    marginTop: 8,
  },
}));

CourseRepOrInstructsList.propTypes = {
  cardClassname: PropTypes.object,
  vertical: PropTypes.bool,
  onViewMoreClick: PropTypes.func,
  onReviewClick: PropTypes.func,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      lastName: PropTypes.string,
      firstName: PropTypes.string,
      department: PropTypes.string,
      imgSrc: PropTypes.string,
    }),
  ),
  colSpan: PropTypes.shape({
    xs: PropTypes.number,
    sm: PropTypes.number,
    md: PropTypes.number,
    lg: PropTypes.number,
  }),
};

CourseRepOrInstructsList.defaultProps = {
  colSpan: {
    xs: 12,
    sm: 6,
    md: 6,
    lg: 6,
  },
};

export default CourseRepOrInstructsList;
