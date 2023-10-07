import {
  Box,
  Button,
  Grid,
  makeStyles,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
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
import {
  AssessmentCompletionStatus,
  AssessmentStatus,
  DEFAULT_PAGE_LIMIT,
  DEFAULT_PAGE_OFFSET,
  UserRoles,
  EnrolmentStatus,
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
              sm: 6,
            },
            onChange: (evt) => handleChangeQueryParams({ search: evt.target.value }),
          }}
          renderCustomFilters={
            <>
              <Grid item xs={12} sm={3}>
                <TextField
                  type="date"
                  variant="outlined"
                  label="Start date"
                  defaultValue="Due date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  value={queryParams.startDate}
                  onChange={(evt) => handleChangeQueryParams({ startDate: evt.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  type="date"
                  variant="outlined"
                  label="Due date"
                  defaultValue="Due date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  value={queryParams.dueDate}
                  onChange={(evt) => handleChangeQueryParams({ dueDate: evt.target.value })}
                />
              </Grid>
            </>
          }
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
}));

export default Assessment;
