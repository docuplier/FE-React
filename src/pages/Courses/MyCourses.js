import '@brainhubeu/react-carousel/lib/style.css';
import { Box, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery } from '@apollo/client';
import { useHistory, useLocation } from 'react-router-dom';
import BlueHeaderPageLayout from 'Layout/BlueHeaderPageLayout';
import { useState } from 'react';
import CourseProgressCard from 'reusables/CourseProgressCard';
import FilterControl from 'reusables/FilterControl';
import MaxWidthContainer from 'reusables/MaxWidthContainer';
import { OffsetLimitBasedPagination } from 'reusables/Pagination';
import { MULTIPLE_OF_TWELVE_DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET } from 'utils/constants';
import { colors, fontWeight, fontSizes } from '../../Css';
import { ReactComponent as StudentIcon } from 'assets/svgs/student-icon-svg.svg';
import { GET_COURSES } from 'graphql/queries/courses';
import { useNotification } from 'reusables/NotificationBanner';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import LoadingView from 'reusables/LoadingView';
import Empty from 'reusables/Empty';

const MyCourses = () => {
  const classes = useStyles();
  const history = useHistory();
  const notification = useNotification();
  const { userDetails } = useAuthenticatedUser();
  const instructorId = userDetails?.id;
  const { pathname } = useLocation();

  const [queryParams, setQueryParams] = useState({
    search: '',
    offset: DEFAULT_PAGE_OFFSET,
    limit: MULTIPLE_OF_TWELVE_DEFAULT_PAGE_LIMIT,
    ordering: [],
  });

  const handleChangeQueryParams = (changeset) => {
    setQueryParams((prevState) => ({
      ...prevState,
      ...changeset,
    }));
  };

  const { data: courseLists, loading } = useQuery(GET_COURSES, {
    variables: {
      instructorId,
      search: queryParams.search,
      limit: queryParams.limit,
      offset: queryParams.offset,
      truncateResults: true,
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });
  const courses = courseLists?.courses?.results;

  const renderEmptyState = () => {
    return <Empty title={'No Courses'} description={'No Courses Avalaible.'}></Empty>;
  };

  const renderOtherInformation = () => {
    return (
      <Box display="flex">
        <Typography component="p" className={classes.infoContent}>
          <strong>{courseLists?.courses?.totalCount}</strong> Courses
        </Typography>
      </Box>
    );
  };

  const renderContentBody = () => {
    return (
      <>
        <Grid item xs={12} lg={12}>
          <FilterControl
            searchInputProps={{
              colSpan: {
                xs: 12,
              },
              onChange: (e) => handleChangeQueryParams({ [e.target.name]: e.target.value }),
              name: 'search',
              value: queryParams.search,
            }}
          />
          <LoadingView isLoading={loading}>
            <Box my={12}>
              {Boolean(courses?.length) ? (
                <Grid container spacing={10}>
                  {courses?.map((course) => {
                    const chipProp =
                      instructorId === course?.leadInstructor?.id
                        ? {
                            label: 'Lead',
                            color: 'default',
                          }
                        : null;

                    return (
                      <Grid item xs={12} sm={6} md={3}>
                        <CourseProgressCard
                          onClick={() => history.push(`${pathname}/${course.id}`)}
                          key={course.id}
                          courseCode={course.code}
                          title={course.title}
                          description={course.description}
                          imageSrc={course.banner}
                          footerText={<StudentIcon />}
                          iconText={`${course.learnerCount} students`}
                          chipProp={chipProp}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              ) : (
                renderEmptyState()
              )}
            </Box>
          </LoadingView>
        </Grid>
      </>
    );
  };

  const renderSecondaryHeader = () => {
    return (
      <>
        <MaxWidthContainer>
          <Box className={classes.lecturerHeader} pt={10}>
            <Typography variant="h6" color="textPrimary">
              My Courses
            </Typography>
            {/* <button
            <Typography className={classes.title}>My Courses</Typography>
            <button
              type="button"
              className={classes.button}
              onClick={() => history.push('/courses/all')}>
              View All Courses
            </button> */}
          </Box>
        </MaxWidthContainer>
      </>
    );
  };

  return (
    <BlueHeaderPageLayout
      onTabChange={(value) => console.log(value)}
      isTabBarHidden={true}
      title={'Courses'}
      description={'List of all courses created on the platform for your institution'}
      isPageLoaded={true}
      otherInformation={renderOtherInformation()}
      links={[{ title: 'Home', to: '/' }]}>
      {renderSecondaryHeader()}
      <MaxWidthContainer>
        <Box py={20}>
          <Grid container spacing={10} style={{ justifyContent: 'flex-end' }}>
            {renderContentBody()}
            {Boolean(courses?.length) && (
              <Grid item xs={12} lg={12}>
                <OffsetLimitBasedPagination
                  total={courseLists?.courses?.totalCount}
                  onChangeLimit={(_offset, limit) =>
                    handleChangeQueryParams({
                      offset: DEFAULT_PAGE_OFFSET,
                      limit,
                    })
                  }
                  onChangeOffset={(offset) => handleChangeQueryParams({ offset })}
                  offset={queryParams.offset}
                  limit={queryParams.limit}
                  limitOptions={[12, 24, 36, 48]}
                />
              </Grid>
            )}
          </Grid>
        </Box>
      </MaxWidthContainer>
    </BlueHeaderPageLayout>
  );
};

const useStyles = makeStyles((theme) => ({
  topicContainer: {
    border: `1px solid ${colors.seperator}`,
  },
  infoContent: {
    display: 'inline',
    paddingRight: theme.spacing(8),
    borderRight: `1px solid ${colors.white}`,
    '&:nth-child(2)': {
      borderLeft: `1px solid ${colors.white}`,
    },
    '&:nth-child(1)': {
      border: 'none',
    },
  },
  lecturerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  button: {
    color: colors.primary,
    border: 'none',
    background: 'none',
    cursor: 'pointer',
  },
  title: {
    color: colors.black,
    fontWeight: fontWeight.bold,
    fontSize: fontSizes.title,
  },
}));

export default MyCourses;
