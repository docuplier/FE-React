import { useQuery } from '@apollo/client';
import {
  Box,
  Button,
  Grid,
  makeStyles,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { GET_ASSIGNMENTS } from 'graphql/queries/courses';
import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import AccessControl from 'reusables/AccessControl';
import ContentListView from 'reusables/ContentListView';
import Empty from 'reusables/Empty';
import FilterControl from 'reusables/FilterControl';
import LoadingView from 'reusables/LoadingView';
import { useNotification } from 'reusables/NotificationBanner';
import { OffsetLimitBasedPagination } from 'reusables/Pagination';
import {
  CourseStatus,
  DEFAULT_PAGE_LIMIT,
  DEFAULT_PAGE_OFFSET,
  UserRoles,
  EnrolmentStatus,
} from 'utils/constants';
import { convertToSentenceCase } from 'utils/TransformationUtils';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import { colors, fontSizes, fontWeight } from '../../../Css';
import UpsertAssignmentsDrawer from '../../Courses/CourseDetails/UpsertAssignmentsDrawer';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { ReactComponent as CalendarIcon } from 'assets/svgs/green-calendar-16.svg';
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import { Calendar } from 'react-modern-calendar-datepicker';

const DFAAssignment = ({ course }) => {
  const classes = useStyles();
  const { courseId } = useParams();
  const notification = useNotification();
  const { pathname } = useLocation();
  const { userDetails } = useAuthenticatedUser();
  const [openCalendar, setOpenCalendar] = useState();
  const [selectedDay, setSelectedDay] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeQueryParams = (changeset) => {
    setQueryParams((prevState) => ({
      ...prevState,
      ...changeset,
    }));
  };

  const handleCloseDrawer = () => {
    setIsVisible(false);
    refetch();
  };

  const handleNavigation = (assignmentId) => {
    if (
      userDetails?.selectedRole === UserRoles.STUDENT &&
      course?.enrolled !== EnrolmentStatus.ENROL
    ) {
      return `#`;
    } else {
      return `${pathname}/assignments/${assignmentId}`;
    }
  };

  const [isVisible, setIsVisible] = useState(false);

  const [queryParams, setQueryParams] = useState({
    search: '',
    offset: DEFAULT_PAGE_OFFSET,
    limit: DEFAULT_PAGE_LIMIT,
    courseId,
  });

  const { data, loading, refetch } = useQuery(GET_ASSIGNMENTS, {
    variables: {
      ...queryParams,
      courseId,
    },
    fetchPolicy: 'network-only',
    onError: (error) => {
      notification.error({
        message: 'Error!',
        description: error?.message,
      });
    },
    skip: !course,
  });

  const assignmentData = data?.assignments?.results;
  const totalCount = data?.assignments?.totalCount ?? 0;
  const draft = assignmentData?.filter(({ status }) => status === 'DRAFT')?.length ?? 0;
  const published = assignmentData?.filter(({ status }) => status === 'PUBLISHED')?.length ?? 0;

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
                <Typography>Due date</Typography>
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

  const renderAssignmentList = () => {
    return (
      <>
        <Box className="list-container">
          {assignmentData?.map(
            (
              {
                id: assignmentId,
                title,
                status,
                body,
                assignmentSubmissions,
                files,
                dueDate,
                startDate,
                submission,
              },
              i,
            ) => (
              <ContentListView
                submission={submission}
                title={title}
                status={convertToSentenceCase(status)}
                description={body}
                submissionsCount={assignmentSubmissions?.length}
                fileCount={files?.length ?? 0}
                dueDate={dueDate ? new Date(`${dueDate} 23:59:59`) : null}
                startDate={startDate ? new Date(`${startDate} 23:59:59`) : null}
                url={handleNavigation(assignmentId)}
              />
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
    );
  };

  return (
    <LoadingView size={60} isLoading={loading}>
      <Box className={classes.container}>
        <Box className="header-container">
          <Box>
            <Typography component="h4" className="heading">
              Assignments
            </Typography>
            <Typography className="caption">
              {totalCount} in total • {draft} draft • {published} published
            </Typography>
          </Box>
          <AccessControl allowedRoles={[UserRoles.LECTURER]}>
            <Box className="right-header-content">
              <Button
                variant="outlined"
                onClick={() => setIsVisible(true)}
                startIcon={<AddIcon />}
                style={{ background: '#fff' }}
              >
                Add Assignment
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
        {assignmentData?.length ? (
          renderAssignmentList()
        ) : (
          <Empty
            title={'No Assignment'}
            description={'No Assignment has been published for this course.'}
          />
        )}
        <UpsertAssignmentsDrawer open={isVisible} onClose={handleCloseDrawer} course={course} />
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

export default DFAAssignment;
