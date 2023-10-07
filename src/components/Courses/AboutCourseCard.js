import React from 'react';
import PropTypes from 'prop-types';
import { Box, makeStyles, Typography, Paper } from '@material-ui/core';
import { colors, fontSizes, fontWeight } from '../../Css';

const AboutCourseCard = (props) => {
  const { viewCount, descriptionHtml, objectivesHtml, showTitle } = props;
  const classes = useStyles();
  return (
    <Box className={classes.container}>
      {showTitle && (
        <Typography component="h4" className="title">
          About this course
        </Typography>
      )}
      <Typography className="views">{viewCount?.toLocaleString()} recent views</Typography>
      <Typography
        variant="body2"
        color="textPrimary"
        dangerouslySetInnerHTML={{ __html: descriptionHtml }}
      />
      <Paper>
        <Typography className="section-title">What you will learn</Typography>
        <Typography
          variant="body2"
          color="textPrimary"
          dangerouslySetInnerHTML={{ __html: objectivesHtml }}
        />
      </Paper>
    </Box>
  );
};

const useStyles = makeStyles({
  container: {
    color: '#393A4A',
    '& .title': {
      color: colors.dark,
      fontWeight: fontWeight.bold,
      fontSize: fontSizes.xxlarge,
    },
    '& .views': {
      color: colors.grey,
      fontWeight: fontWeight.medium,
      fontSize: fontSizes.large,
      marginBottom: 16,
    },
    '& .MuiPaper-root': {
      padding: 24,
      background: '#F1F2F6',
      borderRadius: 8,
      border: '1px solid #CDCED9',
      margin: '16px 0px',
    },
    '& .section-title': {
      fontWeight: fontWeight.medium,
      fontSize: fontSizes.large,
      color: '#393A4A',
      marginBottom: 16,
    },
  },
});

AboutCourseCard.propTypes = {
  viewCount: PropTypes.number,
  descriptionHtml: PropTypes.string,
  objectivesHtml: PropTypes.string,
  showTitle: PropTypes.bool,
};

AboutCourseCard.defaultProps = {
  viewCount: 0,
  descriptionHtml: '<div></div>',
  objectivesHtml: '<div></div>',
  showTitle: false,
};

export default AboutCourseCard;
