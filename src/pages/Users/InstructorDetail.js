import React from 'react';
import { Typography, Box, Paper, Grid } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import UserDetailLayout from 'Layout/UserDetailLayout';
import { convertToSentenceCase } from 'utils/TransformationUtils';
import CourseProgressCard from 'reusables/CourseProgressCard';
import MaxWidthContainer from 'reusables/MaxWidthContainer';
import { GET_USER_DETAIL, GET_USER_COURSE_STAT } from 'graphql/queries/users';
import { GET_COURSES } from 'graphql/queries/courses';
import useNotification from 'reusables/NotificationBanner/useNotification';
import LoadingView from 'reusables/LoadingView';
import Empty from 'reusables/Empty';

const InstructorsTab = { OVERVIEW: 'Overview', ABOUT: 'About' };
const AboutInstructor = () => {
  const [currentTab, setCurrentTab] = React.useState(0);
  const tabValue = Object.values(InstructorsTab);
  const { id } = useParams();
  const notification = useNotification();

  const { data, loading } = useQuery(GET_USER_DETAIL, {
    variables: {
      userId: id,
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });
  const fullname = `${data?.user?.firstname} ${data?.user?.lastname}`;

  const { data: coursesData, loading: isLoadingCoursesInfo } = useQuery(GET_COURSES, {
    variables: {
      instructorId: id,
      truncateResults: true,
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const { data: courseStat, loading: isLoadingCourseStat } = useQuery(GET_USER_COURSE_STAT, {
    variables: {
      userId: id,
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });
  const { instructorTotalCourse, instructorLearnerCount, instructorCompletedCourse } =
    courseStat?.courseOverview || {};

  const renderContent = () => {
    switch (tabValue[currentTab]) {
      case InstructorsTab.ABOUT:
        return renderAboutInstructor();
      case InstructorsTab.OVERVIEW:
        return renderIntructorOverView();
      default:
        return null;
    }
  };

  const renderAboutInstructor = () => {
    const info = data?.user?.userinformation?.about;
    return (
      <Box py={50}>
        {Boolean(info) ? (
          <Box component={Paper} square py={20} px={20}>
            <Typography variant="body2" color="textSecondary">
              {info}
            </Typography>
          </Box>
        ) : (
          <Empty
            title="No Information Avalaible"
            description="We currently don't have any information about this instructor"
          />
        )}
      </Box>
    );
  };

  const renderIntructorOverView = () => {
    return (
      <Box py={20}>
        <Typography variant="h6" color="textPrimary" fontWeight="700">
          Courses
        </Typography>
        <Box mt={15} mb={10}>
          {coursesData?.courses?.results?.length === 0 && (
            <Empty title="No courses" description="No courses are being taken by this instructor" />
          )}
          <Grid container spacing={10}>
            {coursesData?.courses?.results?.map((course) => {
              return (
                <Grid item md={4} lg={3} sm={6} xs={12}>
                  <CourseProgressCard
                    key={course.id}
                    courseCode={course.code}
                    title={course.title}
                    description={course.description}
                    imageSrc={course.banner}
                    footerText={`${course.totalEnrolled} enrollments`}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Box>
    );
  };

  return (
    <LoadingView isLoading={loading || isLoadingCoursesInfo || isLoadingCourseStat}>
      <UserDetailLayout
        isPageLoaded={Boolean(data?.user)}
        onTabChange={(tab) => setCurrentTab(tab)}
        tabs={tabValue}
        instructor
        user={{
          imageSrc: data?.user?.image,
          name: fullname,
          id: data?.user?.staffId || 'Nil',
          department: data?.user?.department?.name,
          gender: convertToSentenceCase(data?.user?.gender),
        }}
        courseInfo={{
          total: instructorTotalCourse,
          learner: instructorLearnerCount,
          completion: instructorCompletedCourse,
        }}>
        <MaxWidthContainer>{renderContent()}</MaxWidthContainer>
      </UserDetailLayout>
    </LoadingView>
  );
};

export default AboutInstructor;
