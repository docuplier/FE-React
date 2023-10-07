import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Box, makeStyles, Typography } from '@material-ui/core';
import { PrivatePaths } from 'routes';
import { colors, fontSizes, fontWeight } from '../../../Css';
import CourseAccordion from '../CourseAccordion';
import { convertTimeSpentToDuration, transformValueToPluralForm } from 'utils/TransformationUtils';
import Empty from 'reusables/Empty';

function Syllabus({ course }) {
  const classes = useStyles();
  const history = useHistory();
  const { courseId } = useParams();

  const handleNavigationToLecture = (lectureId) => {
    history.push(`${PrivatePaths.COURSES}/${courseId}/course-content?lectureId=${lectureId}`);
  };

  const renderEmptyState = () => {
    return (
      <Empty
        title={'No Syllabus'}
        description={'The Syllabus is currently not avalaible for this course.'}></Empty>
    );
  };

  return (
    <Box className={classes.container}>
      <Typography component="h4" className="title">
        Course Content
      </Typography>
      <Typography className="caption">
        {transformValueToPluralForm(course?.sectionCount, 'section')}
        <span className="dot">•</span>
        {transformValueToPluralForm(course?.lectureCount, 'lecture')}
        <span className="dot">•</span>
        {convertTimeSpentToDuration(course?.totalDuration) || 0} total length
      </Typography>
      {Boolean(course?.crsSections.length) ? (
        <CourseAccordion
          data={course?.crsSections}
          onClickLecture={(lectureId) => handleNavigationToLecture(lectureId)}
        />
      ) : (
        renderEmptyState()
      )}
    </Box>
  );
}

const useStyles = makeStyles({
  container: {
    color: '#393A4A',
    '& .title': {
      color: colors.dark,
      fontWeight: fontWeight.bold,
      fontSize: fontSizes.xxlarge,
    },
    '& .caption': {
      color: colors.grey,
      fontWeight: fontWeight.medium,
      fontSize: fontSizes.large,
      marginBottom: 34,
    },
    '& .dot': {
      padding: '0px 3px',
    },
  },
});

export default Syllabus;
