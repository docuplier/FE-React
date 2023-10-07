import {
  Box,
  Button,
  Grid,
  makeStyles,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { GET_ALL_ASSESSMENTS } from 'graphql/queries/courses';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import { useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import AccessControl from 'reusables/AccessControl';
import ContentListView from 'reusables/ContentListView';
import Empty from 'reusables/Empty';
import FilterControl from 'reusables/FilterControl';
import LoadingView from 'reusables/LoadingView';
import { useNotification } from 'reusables/NotificationBanner';
import { OffsetLimitBasedPagination } from 'reusables/Pagination';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { ReactComponent as CalendarIcon } from 'assets/svgs/green-calendar-16.svg';
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import { Calendar } from 'react-modern-calendar-datepicker';
import {
  AssessmentCompletionStatus,
  AssessmentStatus,
  DEFAULT_PAGE_LIMIT,
  DEFAULT_PAGE_OFFSET,
  UserRoles,
  EnrolmentStatus,
  CourseStatus,
} from 'utils/constants';
import { isCurrentTimeWithinAssessmentDateRange } from 'utils/StudentTakeAssessmentUtils';
import { convertToSentenceCase } from 'utils/TransformationUtils';
import { colors, fontSizes, fontWeight } from '../../../Css';
import { useQueryPagination } from 'hooks/useQueryPagination';

const Assessment = ({ course }) => {
  const classes = useStyles();
  const history = useHistory();
  const notification = useNotification();
  const { pathname } = useLocation();
  const { courseId } = useParams();
  const { userDetails } = useAuthenticatedUser();
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [queryParams, setQueryParams] = useState({
    search: '',
    offset: DEFAULT_PAGE_OFFSET,
    limit: DEFAULT_PAGE_LIMIT,
    courseId,
    startDate: null,
    dueDate: null,
  });
  const [openCalendar, setOpenCalendar] = useState();
  const [selectedDay, setSelectedDay] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { data, loading } = useQueryPagination(GET_ALL_ASSESSMENTS, {
    // fetchPolicy: 'cache-and-network',
    variables: {
      ...queryParams,
      courseId,
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
    skip: !course,
  });

  const handleChangeQueryParams = (changeset) => {
    setQueryParams((prevState) => ({
      ...prevState,
      ...changeset,
    }));
  };

  const handleNavigationForLecturerAndSchoolAdmin = (assessmentId, status) => {
    const { selectedRole } = userDetails;

    if (status === AssessmentStatus.DRAFT) {
      return selectedRole === UserRoles.LECTURER
        ? `${pathname}/assessments/create-assessment?id=${assessmentId}`
        : '';
    }

    return `${pathname}/assessments/${assessmentId}`;
  };

  const renderFilterControls = () => {
    return (
      <>
        <Grid item xs={12} sm={5}>
          <Box display="flex" alignItems="center" justifyContent="flex-start">
            <Box width={'100%'} display="flex" justifyContent="flex-end" sx={{ mr: 5 }}>
              <Button
                variant="contained"
                disableElevation
                classes={{ root: classes.button }}
                onClick={handleClick}
                disabled={open}
              >
                Status
                <KeyboardArrowDownIcon style={{ paddingLeft: 10 }} />
                <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
                  {Object.keys(CourseStatus).map((status) => (
                    <MenuItem key={status} value={status} onClick={handleClose}>
                      {convertToSentenceCase(status)}
                    </MenuItem>
                  ))}
                </Menu>
              </Button>
            </Box>

            <Box style={{ position: 'relative', width: '100%' }}>
              <Box className={classes.dueDate} onClick={() => setOpenCalendar(!openCalendar)}>
                <Typography>Range</Typography>
                <CalendarIcon />
              </Box>
              {openCalendar && (
                <Box style={{ position: 'absolute' }}>
                  <Calendar value={selectedDay} onChange={setSelectedDay} />
                </Box>
              )}
            </Box>
          </Box>
        </Grid>
      </>
    );
  };

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
        return `${pathname}/assessments/${assessmentId}/assessment-submissions`;
      case AssessmentCompletionStatus.PENDING:
        return `${pathname}/assessments/${assessmentId}/start-assessment`;
      default:
        if (
          isCurrentTimeWithinAssessmentDateRange({ startDate, startTime, dueDate, dueTime }).value
        ) {
          return `${pathname}/assessments/${assessmentId}/take-assessment`;
        }
        return `${pathname}/assessments/${assessmentId}/assessment-submissions`;
    }
  };

  const handleRoutes = ({
    assessmentId,
    status,
    completionStatus,
    startDate,
    startTime,
    dueDate,
    dueTime,
  }) => {
    const { selectedRole } = userDetails;

    if (selectedRole === UserRoles.LECTURER || selectedRole === UserRoles.SCHOOL_ADMIN) {
      return handleNavigationForLecturerAndSchoolAdmin(assessmentId, status);
    } else if (selectedRole === UserRoles.STUDENT && course?.enrolled === EnrolmentStatus.ENROL) {
      return handleNavigationForStudent({
        assessmentId,
        completionStatus,
        startDate,
        startTime,
        dueDate,
        dueTime,
      });
    }

    return '#';
  };

  const totalCount = data?.assessments?.totalCount ?? 0;
  const pending = data?.assessments?.pending ?? 0;
  const completed = data?.assessments?.completed ?? 0;
  const assessmentData = data?.assessments?.results;

  return (
    <LoadingView size={60} isLoading={loading}>
      <Box className={classes.container}>
        <Box className="header-container">
          <Box>
            <Typography component="h4" className="heading">
              Assessments
            </Typography>
            <Typography className="caption">
              {totalCount} Total • {pending} Draft • {completed} Published
            </Typography>
          </Box>

          <AccessControl allowedRoles={[UserRoles.LECTURER]}>
            <Box className="right-header-content">
              <Button
                variant="outlined"
                onClick={() => history.push(`${pathname}/assessments/create-assessment`)}
                startIcon={<AddIcon />}
                style={{ background: '#fff' }}
              >
                Add Assessment
              </Button>
            </Box>
          </AccessControl>
        </Box>

        <FilterControl
          paper={true}
          searchInputProps={{
            colSpan: {
              xs: 12,
              sm: 7,
            },
            onChange: (evt) => handleChangeQueryParams({ search: evt.target.value }),
          }}
          renderCustomFilters={renderFilterControls()}
        />
        {assessmentData?.length ? (
          <>
            <Box className="list-container">
              {assessmentData?.map(
                ({
                  title,
                  status,
                  totalSubmissions,
                  dueDate,
                  dueTime,
                  completed,
                  startDate,
                  startTime,
                  id: assessmentId,
                }) => (
                  <ContentListView
                    key={assessmentId}
                    title={title}
                    status={convertToSentenceCase(status)}
                    submissionsCount={totalSubmissions}
                    startDate={new Date(`${startDate} ${startTime}`)}
                    dueDate={new Date(`${dueDate} ${dueTime}`)}
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
                ),
              )}
            </Box>
            <OffsetLimitBasedPagination
              total={totalCount}
              onChangeLimit={(_offset, limit) => handleChangeQueryParams({ limit, offset: 0 })}
              onChangeOffset={(offset, _limit) =>
                handleChangeQueryParams({ limit: _limit, offset })
              }
              offset={queryParams.offset}
              limit={queryParams.limit}
            />
          </>
        ) : (
          <Empty
            title={'No Assessment'}
            description={'No Assessment has been published for this course.'}
          />
        )}
      </Box>
    </LoadingView>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    color: '#393A4A',
    '& .heading': {
      color: colors.dark,
      fontWeight: fontWeight.bold,
      fontSize: fontSizes.xxlarge,
    },
    '& .caption': {
      color: colors.grey,
      fontWeight: fontWeight.medium,
      fontSize: fontSizes.large,
      [theme.breakpoints.down('xs')]: {
        marginBottom: 5,
      },
    },
    '& .header-container': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 34,
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
        alignItems: 'flex-start',
      },
    },
    '& .right-header-content': {
      textAlign: 'right',
    },
    '& .list-container': {
      marginTop: 24,
    },
    '& .list-container > *': {
      marginBottom: 8,
    },
  },
  button: {
    backgroundColor: '#EBFFF0',
    color: '#267939',
    '&:hover': {
      backgroundColor: '#EBFFF0',
      color: '#267939',
    },
  },
  dueDate: {
    color: '#267939',
    height: '100%',
    borderRadius: '8px',
    background: '#EBFFF0',
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    padding: '10px',
    justifyContent: 'space-around',
    cursor: 'pointer',
  },
}));

export default Assessment;
