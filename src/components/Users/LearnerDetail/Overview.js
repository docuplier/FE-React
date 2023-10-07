import React from 'react';
import { Box, Typography, Paper, TextField, MenuItem, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { ReactComponent as AvgQuiz } from 'assets/svgs/pdf_icon.svg';
import { ReactComponent as ModuleCompleted } from 'assets/svgs/note_icon.svg';
import { colors, spaces } from '../../../Css';
import CourseProgressCard from 'reusables/CourseProgressCard';
import MaxWidthContainer from 'reusables/MaxWidthContainer';
import { convertToSentenceCase } from 'utils/TransformationUtils';
import Empty from 'reusables/Empty';
import Carousel from 'reusables/Carousel';
import { EnrolmentStatus } from 'utils/constants';

const Overview = ({
  learnerCourses,
  completedCourses = [],
  onChange,
  filterValue,
  learnerCourseStat,
}) => {
  const classes = useStyles();

  const renderTopCard = () => {
    return (
      <MaxWidthContainer>
        <Box
          display="flex"
          component={Paper}
          square
          justifyContent="flex-start"
          alignItems="center"
          py={24}
          px={24}
          className={classes.cardSection}>
          <Box
            display="flex"
            justifyContent="flex-start"
            alignItems="center"
            className="card-section">
            <Box mr={10}>
              <AvgQuiz />
            </Box>
            <Box>
              <Typography variant="h6" color="textPrimary">
                {learnerCourseStat?.courseOverview?.learnerAverageQuizScore}%
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Avg. Quiz Score
              </Typography>
            </Box>
          </Box>
          <Box className="card-section">
            <Box display="flex" justifyContent="flex-start" alignItems="center">
              <Box mr={10}>
                <ModuleCompleted />
              </Box>
              <Box>
                <Typography variant="h6" color="textPrimary">
                  {learnerCourseStat?.courseOverview?.learnerCompletedCourse}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Courses Completed
                </Typography>
              </Box>
              <hr className="hr-tag" />
              <Box>
                <Typography variant="h6" color="textPrimary">
                  {learnerCourseStat?.courseOverview?.learnerOngoingCourse}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Courses Pending
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </MaxWidthContainer>
    );
  };

  const renderFilters = () => {
    return (
      <MaxWidthContainer>
        <Box mb={20} className={classes.inputField}>
          <Grid container spacing={10}>
            <Grid item xs={9}>
              <TextField
                label="Search"
                fullWidth
                variant="outlined"
                name="searchTerm"
                value={filterValue.searchTerm}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                variant="outlined"
                select
                fullWidth
                label="All"
                name="enrolmentStatus"
                onChange={onChange}>
                <MenuItem value="all">All</MenuItem>
                {Object.values(EnrolmentStatus).map((status) => (
                  <MenuItem value={status}>{convertToSentenceCase(status)}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Box>
      </MaxWidthContainer>
    );
  };

  const renderAllCourses = () => {
    const results = learnerCourses?.enrolments?.results || [];

    return (
      <MaxWidthContainer>
        <Box mb={40}>
          <Grid container spacing={10}>
            {results?.length === 0 && (
              <Box display="grid" placeItems="center" width="100%">
                <Empty title="No Courses Found" description="No courses found for this learner" />
              </Box>
            )}
            {results?.map((course) => {
              return (
                <Grid item lg={3} md={3} sm={6} xs={12}>
                  <CourseProgressCard
                    key={course.id}
                    courseCode={course?.course?.code}
                    title={course?.course?.title}
                    description={course?.course?.description}
                    imageSrc={course?.course?.banner}
                    progress={course.progress}
                    chipProp={{
                      label: convertToSentenceCase(course.status),
                      color: course.status === EnrolmentStatus.ENROL ? 'success' : 'warning',
                    }}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </MaxWidthContainer>
    );
  };

  const renderCompletedCourse = () => {
    return (
      <Box py={20} component={Paper} square>
        <MaxWidthContainer>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={12}>
            <Typography variant="h6" color="textPrimary" fontWeight="700">
              Completed Courses
              {Boolean(completedCourses?.length) && (
                <Typography component="span" className={classes.viewAll}>
                  View all
                </Typography>
              )}
            </Typography>
          </Box>
          <Box style={{ marginLeft: -7.5 }}>
            {completedCourses?.length === 0 && (
              <Box display="grid" placeItems="center" width="100%">
                <Empty
                  title="No Completed Courses"
                  description="This student hasn't completed any courses."
                />
              </Box>
            )}
            {Boolean(completedCourses?.length) && (
              <Carousel>
                {completedCourses?.map((course) => {
                  return (
                    <Box mx={5}>
                      <CourseProgressCard
                        key={course.id}
                        courseCode={course?.course?.code}
                        title={course?.course?.title}
                        description={course?.course?.description}
                        imageSrc={course?.course?.banner}
                        progress={course.progress}
                        chipProp={{
                          label: convertToSentenceCase(course.status),
                          color: course.status === EnrolmentStatus.ENROL ? 'success' : 'warning',
                        }}
                      />
                    </Box>
                  );
                })}
              </Carousel>
            )}
          </Box>
        </MaxWidthContainer>
      </Box>
    );
  };

  return (
    <Box>
      <Box my={40}>{renderTopCard()}</Box>
      <Box>{renderFilters()}</Box>
      {renderAllCourses()}
      {renderCompletedCourse()}
    </Box>
  );
};

const useStyles = makeStyles(() => ({
  cardSection: {
    '& .card-section': {
      border: '1px solid #E7E7ED',
      borderRadius: '8px',
      background: '#FAFAFA',
      padding: 16,
      marginRight: spaces.medium,
      '& .hr-tag': {
        transform: 'rotate(90deg)',
        width: 50,
        backgroundColor: '#CDCED9',
      },
    },
  },
  viewAll: {
    color: colors.primary,
    cursor: 'pointer',
    paddingLeft: spaces.medium,
  },
  maxWidth: {
    maxWidth: '100% !important',
  },
}));

export default Overview;
