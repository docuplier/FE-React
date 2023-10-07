import React, { useState } from 'react';
import RadialChart from 'components/Dashboard/RadialChart';
import {
  Box,
  Button,
  Grid,
  Typography,
  Paper,
  Select,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
} from '@material-ui/core';

import MaxWidthContainer from 'reusables/MaxWidthContainer';
import NavigationBar from 'reusables/NavigationBar';
import VerticalBarChart from 'components/Dashboard/VerticalBarChart';
import { borderRadius, colors, fontSizes, fontWeight, spaces } from '../../Css';
import { makeStyles } from '@material-ui/styles';
import report from 'assets/svgs/report.png';
import RatingAndPerformanceCard from 'components/Dashboard/Instructor/RatingAndPerformanceCard';
import InstructorCourseDrawer from 'components/Dashboard/Instructor/InstructorCourseDrawer';
import InstructorSummaryDrawer from 'components/Dashboard/Instructor/InstructorSummaryDrawer';
import { OffsetLimitBasedPagination } from 'reusables/Pagination';
import { useQuery } from '@apollo/client';
import { useNotification } from 'reusables/NotificationBanner';
import { GET_INSTRUCTOR_SUMMARY, GET_INTRUCTOR_OVERVIEW } from 'graphql/queries/dashboard';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import { GET_COURSES } from 'graphql/queries/courses';
import { useQueryPagination } from 'hooks/useQueryPagination';
import LoadingView from 'reusables/LoadingView';
import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET } from 'utils/constants';
import WorkbenchList from 'components/Dashboard/Instructor/WorkbenchList';
import CsvDownloadDrawer from 'components/Dashboard/Instructor/InstructorCsvDrawer';
import {
  getCourseDataArray,
  getCourseStat,
  getWorkBenchDataArray,
  getSummary,
} from 'utils/instructorCsvDowloaderUtils';
import LoadingButton from 'reusables/LoadingButton';
import { ReactComponent as Export } from 'assets/svgs/export.svg';
import { GET_NOTIFICATIONS } from 'graphql/queries/dashboard';

const InstructorDashboard = () => {
  const classes = useStyles();
  const theme = useTheme();
  const [openCourseToView, setOpenCourseToView] = useState(null);
  const [openSummaryReportDrawer, setOpenSummaryReportDrawer] = useState(false);
  const notification = useNotification();
  const { userDetails } = useAuthenticatedUser();
  const isSmScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openCsvDrawer, setOpenCsvDrawer] = useState(false);

  //eslint-disable-next-line
  const [notificationQueryParams, _setNotificationQueryParams] = useState({
    offset: DEFAULT_PAGE_OFFSET,
    limit: DEFAULT_PAGE_LIMIT,
  });

  const { data: notificationsData } = useQuery(GET_NOTIFICATIONS, {
    skip: !userDetails,
    variables: notificationQueryParams,
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const onCloseDrawer = () => {
    handleCloseMenu();
    return setOpenCsvDrawer(false);
  };
  const defaultQueryParams = {
    filterBy: null,
    offset: DEFAULT_PAGE_OFFSET,
    limit: DEFAULT_PAGE_LIMIT / 2.5,
  };
  const [queryParams, setQueryParams] = useState(defaultQueryParams);

  const handleChangeQueryParams = (changeset) => {
    setQueryParams((prevState) => ({
      ...prevState,
      ...changeset,
    }));
  };

  const handleClose = () => {
    handleCloseMenu();
    setOpenSummaryReportDrawer(false);
  };

  const handleCloseModal = () => {
    setOpenCourseToView(null);
  };

  const handleOpenCourseModal = (data) => {
    setOpenCourseToView(data);
  };

  const { data, loading: isLoadingChart } = useQuery(GET_INTRUCTOR_OVERVIEW, {
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const verticalCharData = data?.instructorOverview;

  const { data: courseData, loading: isLoadingCourses } = useQueryPagination(GET_COURSES, {
    variables: {
      instructorId: userDetails?.id,
      status: queryParams?.filterBy,
      offset: queryParams?.offset,
      limit: queryParams?.limit,
      truncateResults: true,
      showCourseAverageStats: true,
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });
  const instructorCourses = courseData?.courses?.results;

  const { data: summaryReport, loading } = useQuery(GET_INSTRUCTOR_SUMMARY);

  const enrollmentArray = getCourseStat(verticalCharData)?.enrollment ?? [];
  const courseStatArray = getCourseStat(verticalCharData)?.courseStat ?? [];
  const coursesArray = getCourseDataArray(instructorCourses) ?? [];
  const workbenchDataArray = getWorkBenchDataArray(notificationsData) ?? [];
  const summaryDataArray = getSummary(summaryReport) ?? [];

  const setCsv = {
    'Course Enrollment': enrollmentArray,
    'Course Statistics': courseStatArray,
    'Summary Report': summaryDataArray,
    Courses: coursesArray,
    Workbench: workbenchDataArray,
  };

  const renderDownloadMenu = () => {
    return (
      <>
        <LoadingButton
          onClick={handleClick}
          disabled={loading || isLoadingChart || isLoadingCourses}
          aria-haspopup="true"
          variant="contained"
          color="primary"
          aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
        >
          <Export style={{ marginRight: spaces.medium }} />
          Export
        </LoadingButton>
        <Menu
          open={Boolean(anchorEl)}
          aria-labelledby="demo-positioned-button"
          anchorEl={anchorEl}
          onClose={handleClose}
          classes={{
            paper: classes.menu,
          }}
        >
          <MenuItem onClick={() => setOpenCsvDrawer(true)}>Export as .csv</MenuItem>
        </Menu>
      </>
    );
  };

  const renderTopInfo = () => {
    return (
      <Box pb={12}>
        <Box display="flex" justifyContent="flex-end" mb={12}>
          {renderDownloadMenu()}
        </Box>
        <Grid container spacing={10} direction={isSmScreen ? 'column-reverse' : 'row'}>
          <Grid item xs={12} md={8}>
            <Grid container spacing={10}>
              <Grid item xs={12} sm={6}>
                <Box component={Paper} p={10} elevation={0}>
                  <LoadingView isLoading={isLoadingChart}>
                    <VerticalBarChart
                      const
                      data={[
                        { Yaxis: verticalCharData?.registered, Xaxis: 'Registered' },
                        { Yaxis: verticalCharData?.auditees, Xaxis: 'Auditee' },
                        { Yaxis: verticalCharData?.enrolees, Xaxis: 'Enrollee' },
                        { Yaxis: verticalCharData?.expected, Xaxis: 'Expected' },
                      ]}
                      height={258}
                      title="Course Enrollment"
                    />
                  </LoadingView>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box component={Paper} elevation={0} pb={12}>
                  <Typography className={classes.title}>Course Statistics</Typography>
                  <Box display="flex" justifyContent="space-between" px={12}>
                    <Box width={'auto'} className={classes.radialBox} mr={12}>
                      <RadialChart
                        series={verticalCharData?.averageCompletionRate?.toFixed(1) || 0}
                        height={160}
                        size={'60%'}
                        subtitle="Average&nbsp;Course Completion Rate"
                      />
                    </Box>
                    <Box width={'auto'} className={classes.radialBox}>
                      <RadialChart
                        series={verticalCharData?.averagePassRate?.toFixed(1) || 0}
                        height={160}
                        size={'60%'}
                        subtitle="Average&nbsp;Course Success Rate "
                      />
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={4} xs={12}>
            <Box className={classes.report}>
              <Box className={classes.summary} px={22}>
                <img src={report} alt="report logo" />
                <Box>
                  <Typography className="title">Summary Report</Typography>
                  <Typography className="desc">Your attention is needed</Typography>
                </Box>
                <Button
                  variant="contained"
                  color="default"
                  size="small"
                  onClick={() => setOpenSummaryReportDrawer(true)}
                >
                  Report
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderBody = () => {
    return (
      <Box>
        <Grid container direction={isSmScreen ? 'column-reverse' : 'row'}>
          <Grid item sm={12} md={8}>
            <Box display="flex" justifyContent="space-between" alignItems="baseline" mb={4}>
              <Typography
                color="textPrimary"
                variant="body1"
                style={{ fontWeight: fontWeight.bold }}
              >
                Courses
              </Typography>
              <Select
                native
                value={queryParams.filterBy}
                onChange={(e) => handleChangeQueryParams({ filterBy: e.target.value })}
                style={{ width: 85 }}
              >
                <option value="PUBLISHED">Active</option>
                <option value="DRAFT">Inactive</option>
              </Select>
            </Box>
            <LoadingView isLoading={isLoadingCourses}>
              <Box>
                {instructorCourses?.map((data) => (
                  <Box key={data.id} mb={8}>
                    <RatingAndPerformanceCard
                      averagePerformance={data?.averagePassRate?.toFixed(1) || 0}
                      chipLabel={data?.status === 'PUBLISHED' ? 'Active' : 'Inactive'}
                      course={{
                        name: data?.title,
                        ratingLabel: 'Course rating',
                        useNumberedLabel: true,
                        rating: data?.averageCourseRating,
                      }}
                      countCardProps={{
                        label: 'Student',
                        count: data?.learnerCount,
                      }}
                      instructor={{
                        ratingLabel: 'Instructor rating',
                        useNumberedLabel: true,
                        rating: data?.averageInstructorRating,
                      }}
                      onClick={() => handleOpenCourseModal(data)}
                    />
                  </Box>
                ))}
                <Box mt={8} mb={12}>
                  <OffsetLimitBasedPagination
                    total={courseData?.courses?.totalCount}
                    onChangeLimit={(_offset, limit) =>
                      handleChangeQueryParams({
                        offset: DEFAULT_PAGE_OFFSET,
                        limit,
                      })
                    }
                    onChangeOffset={(offset) => handleChangeQueryParams({ offset })}
                    offset={queryParams.offset}
                    limit={queryParams.limit}
                  />
                </Box>
              </Box>
            </LoadingView>
          </Grid>
          <Grid item xs={12} md={4}>
            <WorkbenchList />
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <>
      <NavigationBar />
      <Box py={12} style={{ background: '#FAFAFA' }}>
        <MaxWidthContainer>
          {renderTopInfo()} {renderBody()}
          <InstructorCourseDrawer onClose={handleCloseModal} data={openCourseToView} />
          <InstructorSummaryDrawer
            data={summaryReport}
            loading={loading}
            open={openSummaryReportDrawer}
            close={handleClose}
          />
        </MaxWidthContainer>
        <CsvDownloadDrawer setCsv={setCsv} open={openCsvDrawer} onCloseDrawer={onCloseDrawer} />
      </Box>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  radialBox: {
    background: '#FAFAFA',
    borderRadius: borderRadius.default,
    padding: '0 16px 24px 16px',
    height: 213,
    marginTop: 24,
    boxSizing: 'border-box',
  },
  topWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      display: 'block',
    },
  },
  title: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#111C55',
    padding: '24px 0 0 24px',
  },
  report: {
    background: colors.primary,
    borderRadius: borderRadius.default,
    textAlign: 'center',
    padding: 24,
    boxSizing: 'border-box',
  },
  summary: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    [theme.breakpoints.down('xs')]: {
      display: 'block',
    },
    '& .title': {
      fontWeight: fontWeight.bold,
      color: colors.white,
      fontSize: fontSizes.xlarge,
    },
    '& .desc': {
      fontSize: fontSizes.medium,
      color: colors.primaryLight,
      paddingBottom: 24,
    },
  },
  menu: {
    marginTop: 55,
  },
}));
export default InstructorDashboard;
