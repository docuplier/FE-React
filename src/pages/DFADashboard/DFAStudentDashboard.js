import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import {
  Box,
  Typography,
  makeStyles,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  useMediaQuery,
  useTheme,
  Menu,
} from '@material-ui/core';
import {
  AssessmentCompletionStatus,
  DEFAULT_PAGE_LIMIT,
  DEFAULT_PAGE_OFFSET,
} from 'utils/constants';
import { GET_ALL_ASSESSMENTS } from 'graphql/queries/courses';
import MaxWidthContainer from 'reusables/MaxWidthContainer';
import { colors, fontSizes, fontWeight, spaces } from '../../Css';
import Empty from 'reusables/Empty';
import LoadingView from 'reusables/LoadingView';
import CourseInfoHeader from 'reusables/CourseInfoHeader';
import CourseProgressTracker from 'components/Dashboard/Student/CourseProgressTracker';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import { useNotification } from 'reusables/NotificationBanner';
import { GET_SESSIONS_QUERY } from 'graphql/queries/institution';
import { GET_USER_COURSE_STAT } from 'graphql/queries/users';
import { GET_LEARNER_ENROLMENTS } from 'graphql/queries/courses';
import CalendarView from 'components/Dashboard/LearnersDashboard/CalendarView';
import { convertToSentenceCase } from 'utils/TransformationUtils';
import { useHistory } from 'react-router';
import { isCurrentTimeWithinAssessmentDateRange } from 'utils/StudentTakeAssessmentUtils';
import { PrivatePaths } from 'routes';
import { useActivityData } from 'components/Dashboard/LearnersDashboard/StudenActivityContext';
import LoadingButton from 'reusables/LoadingButton';
import ContentListView from 'reusables/ContentListView';
import CsvDownloaderDrawer from 'components/Dashboard/LearnersDashboard/CsvDownloaderDrawer';
import { ReactComponent as Export } from 'assets/svgs/download-drop.svg';
import { OffsetLimitBasedPagination } from 'reusables/Pagination';
import { useQueryPagination } from 'hooks/useQueryPagination';
import { ReactComponent as Logo } from 'assets/svgs/newDFA-logo.svg';
import DFANavigationBar from 'reusables/DFANavigationBar';
const StudentDashboard = () => {
  const classes = useStyles();
  const theme = useTheme();
  const [selectedSession, setSelectedSession] = useState('All Sessions');
  const { userDetails } = useAuthenticatedUser();
  const notification = useNotification();
  const history = useHistory();
  const isSmScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const institutionId = userDetails?.institution?.id || null;
  const programId = userDetails?.program?.id || null;
  const userId = userDetails?.id || null;

  const { startDate, endDate, studentActivitiesData, loading, selectedDay } = useActivityData();

  const [anchorEl, setAnchorEl] = useState(null);
  const [openCsvDrawer, setOpenCsvDrawer] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onCloseCsvDrawer = () => {
    handleClose();
    return setOpenCsvDrawer(false);
  };

  const { data: sessionsData } = useQuery(GET_SESSIONS_QUERY, {
    variables: { institutionId, programId, limit: 10, offset: DEFAULT_PAGE_OFFSET, asFilter: true },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const onSessionChange = (value) => {
    if (!value || value === 'All Sessions') return undefined;
    else return value;
  };

  const { data: learnerCourseStat, loading: isLoadingCourseStat } = useQuery(GET_USER_COURSE_STAT, {
    skip: !userId || !selectedSession,
    variables: {
      userId,
      sessionId: onSessionChange(selectedSession),
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const { data: learnerCourses, loading: isLoadingCourses } = useQuery(GET_LEARNER_ENROLMENTS, {
    variables: {
      userId,
      sessionId: onSessionChange(selectedSession),
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const [queryParams, setQueryParams] = useState({
    search: '',
    offset: DEFAULT_PAGE_OFFSET,
    limit: DEFAULT_PAGE_LIMIT,
    isGlobalAssessment: true,
    startDate: null,
    dueDate: null,
  });

  const { data } = useQueryPagination(GET_ALL_ASSESSMENTS, {
    variables: {
      ...queryParams,
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });
  const handleNavigationForStudent = ({
    assessmentId,
    completionStatus,
    startDate,
    startTime,
    dueDate,
    dueTime,
  }) => {
    switch (completionStatus) {
      case AssessmentCompletionStatus.COMPLETED:
        return `${PrivatePaths.DFA_ASSESSMENTS}/${assessmentId}/assessment-submissions`;

      case AssessmentCompletionStatus.PENDING:
        return `${PrivatePaths.DFA_ASSESSMENTS}/${assessmentId}/start-assessment`;

      default:
        if (
          isCurrentTimeWithinAssessmentDateRange({ startDate, startTime, dueDate, dueTime }).value
        ) {
          return `${PrivatePaths.DFA_ASSESSMENTS}/${assessmentId}/take-assessment`;
        }
        return `${PrivatePaths.DFA_ASSESSMENTS}/${assessmentId}/assessment-submissions`;
    }
  };

  const handleChangeQueryParams = (changeset) => {
    setQueryParams((prevState) => ({
      ...prevState,
      ...changeset,
    }));
  };
  const totalCount = data?.assessments?.results?.length ?? 0;
  const assessmentData = data?.assessments?.results || [];
  const handleRoutes = ({
    assessmentId,
    status,
    completionStatus,
    startDate,
    startTime,
    dueDate,
    dueTime,
  }) => {
    return handleNavigationForStudent({
      assessmentId,
      completionStatus,
      startDate,
      startTime,
      dueDate,
      dueTime,
    });
  };
  const { learnerAverageQuizScore, learnerCompletedCourse, learnerOngoingCourse } =
    learnerCourseStat?.courseOverview || {};

  const sessionResults = sessionsData?.sessions?.results || [];
  const enrollmentResults = learnerCourses?.enrolments?.results || [];
  const formatCardsEvents = (data) => {
    // When you navigate to a month, it lists all the events within the startDate && endDate of a month;
    // When you select a day in the month, it lists all the events within the selectedDay && endDate of a month;
    if (startDate && endDate) {
      let cardListStartDate = startDate;
      // start listing events from the selectedDay, only if its within the current month being displayed
      if (selectedDay && selectedDay.month === endDate.month && selectedDay.year === endDate.year) {
        cardListStartDate = selectedDay;
      }
      return data?.filter(
        (event) =>
          new Date(event.date) >= parseDate(cardListStartDate) &&
          new Date(`${event.date} 00:00:00`) <= parseDate(endDate),
      );
    }
    return [];
  };
  function parseDate(date) {
    const { year, month, day } = date;
    return new Date(year, month - 1, day);
  }

  const getCsvData = () => {
    const AvgQuiz = [['Average Quiz score', learnerAverageQuizScore ?? 0]];
    const moduleCompleted = [['Modules Completed', learnerCompletedCourse ?? 0]];
    const modulesPending = [['Modules pending', learnerOngoingCourse ?? 0]];
    let courseProgress = [];
    let activities = [];
    enrollmentResults?.map(
      ({ course: { title, id }, progress, totalLectures, totalLecturesCompleted }) => {
        return courseProgress?.push([
          title ?? '--',
          progress ?? 0,
          totalLectures ?? 0,
          totalLecturesCompleted ?? 0,
        ]);
      },
    );
    courseProgress?.unshift(['Course', 'Progress', 'Total lectures', 'Total Lectures Completed']);
    formatCardsEvents(studentActivitiesData)?.map((event) => {
      return activities?.push([
        event?.date ?? '--',
        event?.assessments?.length > 0
          ? event?.assessments?.map((item) => [item?.dueTime ?? 'No specified time', item?.title])
          : 'No Asessment for today',
        event?.assignments?.length > 0
          ? event?.assignments?.map((item) => [item?.dueTime ?? 'No specified time', item?.title])
          : 'No Assignment for today',
        event?.liveSessions?.length > 0
          ? event?.liveSessions?.map((item) => [item?.dueTime ?? 'No specified time', item?.title])
          : 'No Event for today',
      ]);
    });
    activities?.unshift(['Event Date', 'Assessment', 'Assignment', 'Live session']);
    return {
      AvgQuiz,
      moduleCompleted,
      modulesPending,
      courseProgress,
      activities,
    };
  };
  const setCsv = {
    'Avg. Quiz Score': getCsvData()?.AvgQuiz,
    'Modules Completed': getCsvData()?.moduleCompleted,
    'Modules Pending': getCsvData()?.modulesPending,
    'Progress Tracker': getCsvData()?.courseProgress,
    Activities: getCsvData()?.activities,
  };

  const renderDownloadMenu = () => {
    return (
      <>
        <LoadingButton
          disabled={loading || isLoadingCourseStat || isLoadingCourses}
          onClick={handleClick}
          aria-haspopup="true"
          variant="contained"
          style={{ backgroundColor: '#3CAE5C', color: 'white' }}
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

  const renderSessionDropdown = () => {
    return (
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel id="select-label">Session</InputLabel>
          <Select
            disabled={!sessionResults?.length}
            labelId="select-label"
            variant="outlined"
            name="session"
            value={selectedSession}
            onChange={(evt) => setSelectedSession(evt.target.value)}
          >
            <MenuItem value={'All Sessions'}>All Sessions</MenuItem>
            {sessionResults?.map((session) => {
              return (
                <MenuItem key={session.id} value={session.id}>
                  {session?.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <Box>{renderDownloadMenu()}</Box>
      </Box>
    );
  };

  const renderCourseProgressTrackers = () => {
    return (
      <LoadingView isLoading={isLoadingCourses}>
        {enrollmentResults?.length ? (
          enrollmentResults?.map(
            ({ course: { title, id }, progress, totalLectures, totalLecturesCompleted }, index) => {
              return (
                <CourseProgressTracker
                  key={index}
                  onClick={() => history.push(`${PrivatePaths.COURSES}/${id}`)}
                  courseTitle={title}
                  percentageCompletion={progress}
                  numberOfLessonsCompleted={totalLecturesCompleted}
                  totalNumberOfLessons={totalLectures}
                />
              );
            },
          )
        ) : (
          <Empty
            title={'Progress Tracker'}
            description={
              selectedSession
                ? 'You are not enrolled for any course in the selected session.'
                : 'You are not enrolled for any course.'
            }
          />
        )}
      </LoadingView>
    );
  };

  const renderAssessmentDetails = () => {
    return assessmentData?.length ? (
      <>
        <Box>
          {assessmentData.map(
            ({
              title,
              status,
              totalSubmissions,
              dueDate,
              startTime,
              dueTime,
              completed,
              startDate,
              id: assessmentId,
              description,
              fileCount,
            }) => (
              <Box my={5} mb={10}>
                <ContentListView
                  key={assessmentId}
                  title={title}
                  status={convertToSentenceCase(status)}
                  submissionsCount={totalSubmissions}
                  description={description}
                  fileCount={fileCount}
                  // startDate={new Date(`${startDate}`)}
                  // dueDate={new Date(`${dueDate} `)}
                  dueDate={dueDate ? new Date(`${dueDate} 23:59:59`) : null}
                  startDate={startDate ? new Date(`${startDate} 23:59:59`) : null}
                  url={handleRoutes({
                    assessmentId,
                    status,
                    completionStatus: completed,
                    startDate,
                    startTime,
                    dueDate,
                    dueTime,
                  })}
                  submission={completed === AssessmentCompletionStatus.COMPLETED}
                />
              </Box>
            ),
          )}
        </Box>
        <OffsetLimitBasedPagination
          total={totalCount}
          onChangeLimit={(_offset, limit) => handleChangeQueryParams({ limit, offset: 0 })}
          onChangeOffset={(offset, _limit) => handleChangeQueryParams({ limit: _limit, offset })}
          offset={queryParams.offset}
          limit={queryParams.limit}
        />
      </>
    ) : (
      <Empty
        title={'No Assessment'}
        description={'No Assessment has been published for this course.'}
      />
    );
  };

  return (
    <div className={classes.wrapper}>
      <DFANavigationBar />
      <MaxWidthContainer>
        <Box>
          <Grid container spacing={10}>
            <Grid item xs={12} md={8}>
              <Box mt={14} mb={14}>
                {renderSessionDropdown()}
              </Box>
              <Box>
                <CourseInfoHeader
                  quizScore={learnerAverageQuizScore || 0}
                  modulesCompletedCount={learnerCompletedCourse || 0}
                  modulesPendingCount={learnerOngoingCourse || 0}
                />
              </Box>
              <Box my={12}>{isSmScreen && <CalendarView />}</Box>
              <Box
                p={12}
                mt={12}
                mb={12}
                style={{ backgroundColor: colors.white }}
                borderRadius={8}
              >
                <Typography
                  style={{
                    fontWeight: 900,
                  }}
                  className={classes.title}
                >
                  Assessment
                </Typography>
                <Box className="container">
                  <Box className={classes.assessments}>{renderAssessmentDetails()}</Box>
                </Box>
              </Box>
              <Box
                p={12}
                mt={12}
                mb={12}
                style={{ backgroundColor: colors.white }}
                borderRadius={8}
              >
                <Typography className={classes.title}>Progress Tracker</Typography>
                <Box height="auto" maxHeight={600} className="container">
                  {renderCourseProgressTrackers()}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              {!isSmScreen && <CalendarView />}
            </Grid>
          </Grid>
        </Box>
        <CsvDownloaderDrawer
          setCsv={setCsv}
          openCsvDrawer={openCsvDrawer}
          onCloseCsvDrawer={onCloseCsvDrawer}
        />
      </MaxWidthContainer>

      <Box
        bgcolor={'white'}
        style={{
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <MaxWidthContainer>
          <Box display="flex" alignItems="center" justifyContent={'space-between'} py={8}>
            <Box display="flex" alignItems="center">
              <Logo />
              {/* <img src={logoImage} alt="logo" /> */}
            </Box>
            <Typography>©2023 Tech4Dev, Inc.</Typography>
          </Box>
        </MaxWidthContainer>
      </Box>
    </div>
  );
};
const useStyles = makeStyles((theme) => ({
  wrapper: {
    background: colors.background,
    overflow: 'auto',
    height: '100vh',
    '& .container': {
      overflowY: 'auto',
      scrollbarWidth: 'thin',
      scrollbarColor: '#757575',
    },
    '& .container::-webkit-scrollbar-track': {
      background: 'white',
    },
    '& .container::-webkit-scrollbar-thumb ': {
      backgroundColor: '#757575',
      borderRadius: 8,
    },
    '& .container::-webkit-scrollbar': {
      width: 7,
    },
  },
  title: {
    fontSize: fontSizes.xlarge,
    color: '#111C55',
    fontWeight: fontWeight.bold,
    marginBottom: theme.spacing(12),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    background: colors.white,
  },
  menu: {
    marginTop: 55,
  },
  assessments: {
    height: '399px',
    overflowY: 'auto',
  },
}));

export default StudentDashboard;
