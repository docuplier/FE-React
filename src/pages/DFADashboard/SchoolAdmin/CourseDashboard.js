import { useState } from 'react';
import { Box, Button, Typography, Grid, makeStyles } from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import { useLocation, useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { colors, fontWeight } from '../../../Css';
import AssignmentDetailLayout from 'Layout/AssignmentDetailLayout';
import MaxWidthContainer from 'reusables/MaxWidthContainer';
import CountCard from 'components/Dashboard/CountCard';
import CourseEnrollmentTrend from 'components/Dashboard/SchoolAdmin/CourseEnrollmentTrend';
import InstructorsList from 'reusables/InstructorsList';
import ChangeCourseDrawer from 'components/Dashboard/SchoolAdmin/ChangeCourseDrawer';
import CourseEnrollmentFilterDrawer from 'components/Dashboard/CourseEnrollmentFilterDrawer';
import { PrivatePaths } from 'routes';
import { GET_COURSES, GET_COURSE_BY_ID } from 'graphql/queries/courses';
import { useNotification } from 'reusables/NotificationBanner';
import LoadingView from 'reusables/LoadingView';
import { convertToSentenceCase } from 'utils/TransformationUtils';
import { CourseStatus } from 'utils/constants';
import { GET_COURSE_ENROLLMENT_TREND } from 'graphql/queries/dashboard';
import InstructorStatsModal from 'components/Courses/InstructorStatsModal';

const CourseDashboard = () => {
  const classes = useStyles();
  const notification = useNotification();
  const { pathname, search } = useLocation();
  const history = useHistory();
  const params = new URLSearchParams(search);
  const courseId = params.get('courseId');
  const [courseEnrollmentTrendQueryParams, setCourseEnrollmentTrendQueryParams] = useState({
    programId: undefined,
    programName: undefined,
  });
  const [instructorToView, setInstructorToView] = useState(null);
  const [isChangeCourseDrawerVisible, setIsChangeCourseDrawerVisible] = useState(false);
  const [isCourseEnrollmentFilterDrawerVisible, setIsCourseEnrollmentFilterDrawerVisible] =
    useState(false);

  const { loading: isLoadingCourseEnrollmentTrend, data: courseEnrollmentTrendData } = useQuery(
    GET_COURSE_ENROLLMENT_TREND,
    {
      variables: {
        course: courseId,
        program: courseEnrollmentTrendQueryParams.programId,
      },
      onError: (error) => {
        notification.error({
          message: error?.message,
        });
      },
    },
  );

  const { data: instructorCourses, loading: isLoadingInstructorCourses } = useQuery(GET_COURSES, {
    variables: { instructorId: instructorToView?.id, truncateResults: true },
    skip: !instructorToView?.id,
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const { loading: isLoadingCourse, data: courseData } = useQuery(GET_COURSE_BY_ID, {
    variables: { courseId },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });
  const course = courseData?.course || {};

  const getCourseEnrollmentData = () => {
    return courseEnrollmentTrendData?.courseEnrolmentTrend?.map((session) => ({
      name: session.name,
      topLineValue: session.enrolmentRate,
      bottomLineValue: session.completionRate,
      tooltipData: [
        { key: 'Enrollment rate', value: session.enrolmentRate },
        { key: 'Completion rate', value: session.completionRate },
      ],
    }));
  };

  const renderDepartmentInfoCard = () => {
    const cards = [
      { label: 'Total Enrollment', countKey: 'totalEnrolled' },
      { label: 'Total Auditee', countKey: 'totalAudited' },
      { label: 'No. of Instructors', countKey: 'lecturerCount' },
      { label: 'No. of Assessments', countKey: 'assessmentCount' },
      { label: 'No. of Assignments', countKey: 'assignmentCount' },
    ];

    return (
      <Box my={18}>
        <Grid container spacing={8}>
          {cards?.map((card) => {
            return (
              <Grid key={card.countKey} item xs={12} md={4}>
                <CountCard count={course?.[card.countKey]} label={card.label} mode="light" />
              </Grid>
            );
          })}
        </Grid>
      </Box>
    );
  };

  const renderSecondBanner = () => {
    const statusColor = course?.status === CourseStatus.PUBLISHED ? '#80ACFF' : colors.lightGrey;
    const titleText = course?.title ? `${course?.title} (${course?.code || null})` : '';
    return (
      <Box bgcolor={colors.white}>
        <MaxWidthContainer>
          <Box display="flex" justifyContent="space-between" alignItems="baseline">
            <Box display="flex" justifyContent="flex-start" alignItems="baseline" py={8}>
              <Typography
                variant="h6"
                color="textPrimary"
                style={{ fontWeight: fontWeight.bold, marginRight: 24 }}>
                {titleText}
              </Typography>
              <Button
                variant="outlined"
                className={classes.dashedButton}
                onClick={() => setIsChangeCourseDrawerVisible(true)}>
                Change Course <FilterListIcon />
              </Button>
            </Box>
            <Box display="flex" justifyContent="flex-start" alignItems="baseline">
              <Typography
                variant="body1"
                color="textPrimary"
                style={{ fontWeight: fontWeight.bold }}>
                Status:
              </Typography>
              <Box mx={4} width={14} height={14} bgcolor={statusColor} />
              <Typography>{convertToSentenceCase(course?.status)}</Typography>
            </Box>
          </Box>
        </MaxWidthContainer>
      </Box>
    );
  };

  const renderCourseEnrollmentTrend = () => {
    return (
      <CourseEnrollmentTrend
        data={getCourseEnrollmentData()}
        programName={courseEnrollmentTrendQueryParams.programName}
        onClickFilter={() => setIsCourseEnrollmentFilterDrawerVisible(true)}
        isLoading={isLoadingCourseEnrollmentTrend}
      />
    );
  };

  return (
    <>
      <AssignmentDetailLayout
        withMaxWidth={false}
        isLoading={false}
        links={[{ title: 'Home', to: PrivatePaths.DASHBOARD }]}>
        <LoadingView isLoading={isLoadingCourse}>
          {renderSecondBanner()}
          <MaxWidthContainer>
            {renderDepartmentInfoCard()}
            {renderCourseEnrollmentTrend()}
            <Box mt={18} pb={25}>
              <InstructorsList
                colSpan={{ xs: 12, md: 3 }}
                onViewMoreClick={(instructor) => setInstructorToView(instructor)}
                data={[course?.leadInstructor, ...(course?.instructors || [])].map(
                  (instructor) => ({
                    firstName: instructor?.firstname,
                    lastName: instructor?.lastname,
                    department: instructor?.department?.name,
                    imgSrc: instructor?.image,
                    id: instructor?.id,
                    staffId: instructor?.staffId,
                  }),
                )}
              />
            </Box>
          </MaxWidthContainer>
        </LoadingView>
      </AssignmentDetailLayout>
      <CourseEnrollmentFilterDrawer
        open={isCourseEnrollmentFilterDrawerVisible}
        onClose={() => setIsCourseEnrollmentFilterDrawerVisible(false)}
        programId={courseEnrollmentTrendQueryParams.programId}
        onFilter={(params) => setCourseEnrollmentTrendQueryParams(params)}
      />
      <ChangeCourseDrawer
        open={isChangeCourseDrawerVisible}
        courseId={courseId}
        onClose={() => setIsChangeCourseDrawerVisible(false)}
        onFilter={({ courseId }) => history.push(`${pathname}?courseId=${courseId}`)}
      />
      <InstructorStatsModal
        open={Boolean(instructorToView)}
        onClose={() => setInstructorToView(null)}
        courseData={instructorCourses?.courses?.results}
        profileInfo={{
          user: {
            imageSrc: instructorToView?.imgSrc,
            name: `${instructorToView?.firstName} ${instructorToView?.lastName}`,
            department: instructorToView?.department,
            staffId: instructorToView?.staffId,
          },
        }}
        loading={isLoadingInstructorCourses}
      />
    </>
  );
};

const useStyles = makeStyles({
  dashedButton: {
    padding: 0,
    minHeight: 'max-content',
    border: 'none',
    borderRadius: 0,
    borderBottom: `1px dashed rgba(0, 0, 0, 0.23)`,
  },
});

export default CourseDashboard;
