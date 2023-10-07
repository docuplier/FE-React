import { useMutation, useQuery } from '@apollo/client';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  makeStyles,
  Typography,
  useTheme,
  useMediaQuery,
  Paper,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import UndoIcon from '@material-ui/icons/Undo';
import classnames from 'classnames';
import About from 'components/Courses/CourseDetails/About';
import Announcement from 'components/Courses/CourseDetails/Announcement';
import Assessment from 'components/Courses/CourseDetails/Assessment';
import Assignment from 'components/Courses/CourseDetails/Assignment';
import CourseMoreActions from 'components/Courses/CourseDetails/CourseMoreActions';
import Learners from 'components/Courses/CourseDetails/Learners';
import LiveSession from 'components/Courses/CourseDetails/LiveSession';
import ParticipationModal from 'components/Courses/CourseDetails/ParticipationModal';
import Resources from 'components/Courses/CourseDetails/Resources';
import Syllabus from 'components/Courses/CourseDetails/Syllabus';
import InstructorStatsModal from 'components/Courses/InstructorStatsModal';
import { format } from 'date-fns';
import { CREATE_ENROLLMENT, DELETE_ENROLLMENT } from 'graphql/mutations/courses';
import { DELETE_TASK } from 'graphql/mutations/task';
import { GET_COURSES, GET_COURSE_BY_ID } from 'graphql/queries/courses';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import BlueHeaderPageLayout from 'Layout/BlueHeaderPageLayout';
import React, { useMemo, useState } from 'react';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import AccessControl from 'reusables/AccessControl';
import Chip from 'reusables/Chip';
import CourseInfoCard from 'reusables/CourseInfoCard';
import Empty from 'reusables/Empty';
import CourseRepOrInstructsList from 'reusables/InstructorsList';
import LoadingView from 'reusables/LoadingView';
import MaxWidthContainer from 'reusables/MaxWidthContainer';
import { useNotification } from 'reusables/NotificationBanner';
import { PrivatePaths } from 'routes';
import { UserRoles, EnrolmentStatus } from 'utils/constants';
import { convertTimeSpentToDuration } from 'utils/TransformationUtils';
import { getNameInitials } from 'utils/UserUtils';
import { colors, fontSizes, fontWeight } from '../../Css';
import InstructorRatingModal from 'components/Courses/CourseDetails/InstructorRatingModal';
import CourseRatingModal from 'components/Courses/CourseDetails/CourseRatingModal';
import Rating from 'reusables/Rating';
import LearningGroup from 'components/Courses/CourseDetails/LearningGroup';
import GroupDescussion from 'components/Courses/CourseDetails/GroupDescussion';
import { ReactComponent as Pencil } from 'assets/svgs/people_icon.svg';
import { ReactComponent as ChatBubbleOutline } from 'assets/svgs/chat.svg';
import { ReactComponent as View } from 'assets/svgs/view.svg';
import { ReactComponent as Upload } from 'assets/svgs/upload-ic.svg';
import { ReactComponent as Grag } from 'assets/svgs/finals.svg';
import { Edit } from '@material-ui/icons';
import SubmittedAssignment from 'components/SubmittedAssignment';
import LoadingButton from 'reusables/LoadingButton';
import AddGroupDrawer from 'components/TaskGroup/AddGroupDrawer';
import { GET_TASK, GET_TASK_GROUP, GET_TASK_GROUP_SUBMISSIONS } from 'graphql/queries/task';
import { TASK_SUBMISSION } from 'graphql/mutations/task';
import LearningGroupUpAssignment from 'components/Courses/CourseDetails/LearningGroupAssignment';

const breadCrumbs = [
  { title: 'Home', to: '/' },
  { title: 'Course', to: PrivatePaths.COURSES },
];

export const Tabs = {
  about: { name: 'About', value: 'about' },
  syllabus: { name: 'Syllabus', value: 'syllabus' },
  learners: { name: 'Learners', value: 'learners' },
  assignments: { name: 'Assignments', value: 'assignments' },
  assessments: { name: 'Assessments', value: 'assessments' },
  resources: { name: 'Resources', value: 'resources' },
  announcements: { name: 'Announcements', value: 'announcements' },
  liveSession: { name: 'Live Session', value: 'live-session' },
  learningGroup: { name: 'Learning Group', value: 'learning-group' },
};

const CourseDetails = () => {
  const [open, setOpen] = useState();
  const [actionMenuAnchorEl, setActionMenuAnchorEl] = useState(null);
  const classes = useStyles();
  const [isVisible, setIsVisible] = useState(false);
  const { userDetails } = useAuthenticatedUser();
  const notification = useNotification();
  const { courseId } = useParams();
  const history = useHistory();
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [isCourseRatingModalVisible, setIsCourseRatingModalVisible] = useState(false);
  const [isInstructorRatingModalVisible, setIsInstructorRatingModalVisible] = useState(false);
  const [instructorToReview, setInstructorToReview] = useState(null);
  const theme = useTheme();
  const params = new URLSearchParams(useLocation().search);
  const taskgroupId = params.get('taskgroupId');
  const descussionId = params.get('descussionId');
  const taskId = params.get('taskId');
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const urlParams = new URLSearchParams(useLocation().search);
  const currentTabValue = urlParams.get('tab') || 'about';
  const [openSubmittedAssDrawer, setOpenSubmittedAssDrawer] = useState(false);
  const [dataToOpenGroupDrawer, setDataToOpenGroupDrawer] = useState(null);
  const [openTaskSubmissionDrawer, setOpenTaskSubmissionDrawer] = useState(null);

  const {
    data,
    loading,
    refetch: refetchCourse,
  } = useQuery(GET_COURSE_BY_ID, {
    variables: { courseId },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const {
    data: taskdata,
    loading: isLoadingTask,
    refetch: refetchTask,
  } = useQuery(GET_TASK, {
    variables: { taskId },
    skip: !taskId,
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const task = taskdata?.task;

  const {
    data: taskgroupdata,
    loading: isLoadingTaskgroup,
    refetch,
  } = useQuery(GET_TASK_GROUP, {
    variables: { taskGroupId: taskgroupId },
    skip: !taskgroupId,
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });
  const taskgroup = taskgroupdata?.taskGroup;

  const { data: submissions, refetch: refetchSubmissions } = useQuery(GET_TASK_GROUP_SUBMISSIONS, {
    variables: { groupId: taskgroupId },
    skip: !taskgroupId,
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const submittedAssignment = submissions?.groupSubmissions || [];

  const [submitTask, { loading: submittingTask }] = useMutation(TASK_SUBMISSION, {
    onCompleted: () => {
      notification.success({
        message: 'Task submitted Successfully',
      });
      setOpenTaskSubmissionDrawer(null);
      refetchSubmissions();
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const [deleteTask, { loading: isDeleting }] = useMutation(DELETE_TASK, {
    onCompleted: () => {
      notification.success({
        message: 'Task archived',
      });
      refetchTask();
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const achiveTask = () => {
    deleteTask({
      variables: {
        id: taskId,
      },
    });
  };

  const { data: courseData, loading: isLoadingCourseData } = useQuery(GET_COURSES, {
    variables: { instructorId: selectedInstructor?.id, truncateResults: true },
    skip: Boolean(selectedInstructor?.id) === false,
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const PROFILE_INFO = {
    user: {
      imageSrc: selectedInstructor?.imgSrc,
      name: selectedInstructor?.firstName,
      department: selectedInstructor?.department,
      staffId: selectedInstructor?.staffId,
      id: selectedInstructor?.id,
    },
  };

  const course = data?.course;

  const getFileCount = (type) => {
    let fileCount = 0;
    course?.aggregateFileCount.forEach((item, i) => {
      if (item?.type === type) {
        fileCount = item.total;
      }
    });
    return fileCount;
  };

  const [createEnrollment, { loading: createEnrollmentIsLoading }] = useMutation(
    CREATE_ENROLLMENT,
    {
      refetchQueries: [{ query: GET_COURSE_BY_ID, variables: { courseId } }],
      onCompleted: () => {
        notification.success({
          message: 'You can successfully participate in this course',
        });
        refetchCourse();
        setIsVisible(false);
      },
      onError: (error) => {
        notification.error({
          message: 'An error occured while trying to processing your request. Please try again.',
        });
      },
    },
  );

  const [deleteEnrollment, { loading: deleteEnrollmentIsLoading }] = useMutation(
    DELETE_ENROLLMENT,
    {
      refetchQueries: [{ query: GET_COURSE_BY_ID, variables: { courseId } }],
      onCompleted: () => {
        notification.success({
          message: 'You have successfully unenrolled from this course',
        });
        refetchCourse();
        setIsVisible(false);
      },
      onError: (error) => {
        notification.error({
          message: 'An error occured while trying to processing your request. Please try again.',
        });
      },
    },
  );

  const tabsBasedOnSelectedRole = useMemo(() => {
    return userDetails?.selectedRole === UserRoles.STUDENT
      ? Object.values(Tabs).filter((tab) => tab.value !== Tabs.learners.value)
      : Object.values(Tabs);
  }, [userDetails]);

  const handleAction = (type) => {
    createEnrollment({
      variables: {
        newEnrolment: {
          course: courseId,
          status: type,
        },
      },
    });
  };

  const handleUnEnrollment = () => {
    deleteEnrollment({
      variables: {
        id: courseId,
      },
    });
  };

  const COURSE_INFORMATION = {
    courseDuration: course?.totalVideoDuration,
    pdfCount: getFileCount('PDF'),
    audioCount: getFileCount('AUDIO'),
    resourceCount: course?.resourceDocumentCount,
    lifeTimeAccess: true,
    screens: false,
    certificate: true,
  };

  const getInstructorListOrClassRepData = (cousrseLeadArray) => {
    return cousrseLeadArray?.map((instructor, i) => {
      return {
        id: instructor?.id,
        staffId: instructor?.staffId,
        firstName: instructor?.firstname,
        lastName: instructor?.lastname,
        department: instructor?.department?.name,
        imgSrc: instructor?.image,
      };
    });
  };

  const handleChangeTab = (tabIndex) => {
    const tabValue = tabsBasedOnSelectedRole?.find((_tab, index) => index === tabIndex)?.value;
    history.push(`${PrivatePaths.COURSES}/${courseId}?tab=${tabValue}`);
  };

  const handleClick = (data) => {
    setSelectedInstructor(data);
    setOpen(true);
  };

  const handleActionMenu = (event) => {
    setActionMenuAnchorEl(event.currentTarget);
  };

  const formattedTabs = useMemo(() => {
    const tabs = Object.values(Tabs);

    return userDetails?.selectedRole === UserRoles.STUDENT
      ? tabs.filter((tab) => tab !== 'Students')
      : tabs;
  }, [userDetails]);

  const renderMoreActions = () => {
    return (
      <>
        <Button
          variant="contained"
          color="inherit"
          onClick={handleActionMenu}
          style={{ color: colors.grey, marginLeft: 5 }}>
          <MoreVertIcon style={{ padding: 0 }} />
        </Button>
        <CourseMoreActions
          anchorEl={actionMenuAnchorEl}
          onClose={() => setActionMenuAnchorEl(null)}
          course={course}
          refetch={refetchCourse}
        />
      </>
    );
  };

  const renderRightContent = () => {
    return (
      <>
        <AccessControl allowedRoles={[UserRoles.SCHOOL_ADMIN, UserRoles.LECTURER]}>
          <Box height="100%" display="flex" alignItems="center" justifyContent="flex-end">
            <Box>
              <Button
                variant="outlined"
                startIcon={<CreateOutlinedIcon />}
                onClick={() =>
                  history.push(`${PrivatePaths.COURSES}/create-course?courseId=${course?.id}`)
                }
                style={{ color: colors.white }}>
                Edit Course
              </Button>
              {course?.leadInstructor?.id === userDetails?.id && renderMoreActions()}
            </Box>
          </Box>
        </AccessControl>
        <AccessControl allowedRoles={[UserRoles.STUDENT]}>
          <Box height="100%" display="flex" alignItems="center" justifyContent="flex-end">
            {Boolean(course) && (
              <Box>
                {course?.enrolled === EnrolmentStatus.AUDIT ||
                course?.enrolled === EnrolmentStatus.ENROL ? (
                  <Button
                    variant="outlined"
                    startIcon={<UndoIcon />}
                    style={{ background: '#CDCED9' }}
                    onClick={handleUnEnrollment}>
                    Unenroll
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    style={{ background: '#FFCC2E' }}
                    onClick={() => setIsVisible(true)}>
                    Participate
                  </Button>
                )}
              </Box>
            )}
          </Box>
          <ParticipationModal
            open={isVisible}
            onClose={() => setIsVisible(false)}
            onSelect={(type) => handleAction(type)}
            loading={createEnrollmentIsLoading || deleteEnrollmentIsLoading}
          />
        </AccessControl>
      </>
    );
  };

  const renderGroupDetails = () => {
    return (
      <Box component={Paper} p={8} mb={8}>
        <Box py={4}>
          <Typography variant="body1" color="textPrimary" style={{ fontWeight: fontWeight.bold }}>
            {task?.title || ''}
          </Typography>
          <Typography>Due date {task?.dueDate || '-'}</Typography>
        </Box>
        <Divider />
        <Box py={4}>
          <Typography dangerouslySetInnerHTML={{ __html: task?.description || '-' }} />
          <Box display="flex" justifyContent="flex-end" alignItems="center">
            <Button
              disabled={task?.isArchived}
              variant="outlined"
              color="primary"
              style={{ border: 'none' }}
              p={4}
              onClick={() =>
                history.push(
                  `${PrivatePaths.CREATE_TASK}?courseId=${courseId}&edit=${true}&taskId=${taskId}`,
                )
              }>
              Edit
            </Button>
            <LoadingButton
              isLoading={isDeleting}
              disabled={task?.isArchived}
              variant="outlined"
              color="primary"
              style={{ border: 'none' }}
              p={4}
              onClick={achiveTask}>
              Archive
            </LoadingButton>
          </Box>
        </Box>
        <Divider />
        <Box display="flex" justifyContent="space-between" alignItems="center" py={4}>
          <Typography variant="subtitle2" color="textPrimary">
            <Pencil style={{ marginRight: 4 }} /> {task?.totalGroups || 0} Groups
          </Typography>
          <Typography variant="subtitle2" color="textPrimary">
            <Grag style={{ marginRight: 4 }} />
            {task?.totalStudents || 0} Students
          </Typography>
          <Typography variant="subtitle2" color="textPrimary">
            <ChatBubbleOutline style={{ marginRight: 4 }} /> {task?.totalPosts || 0} Posts
          </Typography>
        </Box>
      </Box>
    );
  };

  const renderCourseRatings = () => {
    return (
      <Box mb={8} className={classes.metaDataContainer}>
        <Box display="flex">
          <Rating value={course?.averageCourseRating} readOnly mr={8} />
          <Typography component="span" variant="body1" style={{ color: colors.white }}>
            Rating {course?.averageCourseRating?.toFixed(1)}
          </Typography>
        </Box>
        <AccessControl allowedRoles={[UserRoles.STUDENT]}>
          {userDetails?.selectedRole === UserRoles.STUDENT &&
            course?.enrolled === EnrolmentStatus.ENROL && (
              <>
                <Box mx={8}>
                  <Divider orientation="vertical" className="divider" />
                </Box>
                <Button
                  size="small"
                  className="review-button"
                  onClick={() => setIsCourseRatingModalVisible(true)}>
                  Post Review
                </Button>
              </>
            )}
        </AccessControl>
      </Box>
    );
  };

  const renderCourseMetaData = () => {
    const fullName = `${course?.leadInstructor?.firstname} ${course?.leadInstructor?.lastname}`;
    return (
      <Box>
        {renderCourseRatings()}
        <Box className={classes.metaDataContainer}>
          <Box>
            <Typography component="span" variant="body1">
              <Typography component="span" className={classnames('bold-text', 'right-margin')}>
                {course?.learnerCount || 0}
              </Typography>
              enrollments
            </Typography>
          </Box>
          <Box ml={8} mr={8}>
            <Divider orientation="vertical" className="divider" />
          </Box>
          <Box display="flex" alignItems="center" mt={isSmallScreen ? 5 : 0}>
            <Avatar src={course?.leadInstructor?.image} className="avatar">
              {getNameInitials(fullName)}
            </Avatar>
            <Box ml={4} mr={4}>
              <Typography component="span">
                {Boolean(course?.leadInstructor?.firstname) ? fullName : ''}
              </Typography>
            </Box>
            <Chip label="Lead instructor" roundness="lg" />
          </Box>
        </Box>
        <Box mt={8} className={classes.metaDataContainer}>
          <Box>
            Last updated:
            <Typography component="span" className={classnames('bold-text', 'left-margin')}>
              {!!course?.updatedAt ? format(new Date(course?.updatedAt), 'LLL dd, yyyy') : 'nil'}
            </Typography>
          </Box>
          <Box ml={8} mr={8}>
            <Divider orientation="vertical" className="divider" />
          </Box>
          <Box mt={5}>
            Time:
            <Typography component="span" className={classnames('bold-text', 'left-margin')}>
              {convertTimeSpentToDuration(course?.totalDuration)}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  const renderDiscussionGroupInfo = () => {
    return (
      <Box mb={8}>
        <Box component={Paper} p={8} mb={8}>
          <Typography variant="body1" color="textSecondary" style={{ fontWeight: fontWeight.bold }}>
            {taskgroup?.name || '-'}
          </Typography>
          <Divider style={{ margin: '12px 0' }} />
          <Box py={4}>
            <Typography variant="body1" color="textPrimary" style={{ fontWeight: fontWeight.bold }}>
              {task?.title || ''}
            </Typography>
            <Typography>Due date {task?.dueDate || '-'}</Typography>
          </Box>
          <Divider style={{ margin: '12px 0' }} />
          <Box display="flex" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <Typography
                variant="subtitle2"
                color="textSecondary"
                style={{ fontWeight: fontWeight.bold, marginRight: 12 }}>
                <Pencil /> {taskgroup?.totalStudents || 0} Students
              </Typography>

              <Typography
                variant="subtitle2"
                color="textSecondary"
                style={{ fontWeight: fontWeight.bold }}>
                <ChatBubbleOutline /> Posts ({taskgroup?.totalPosts || 0})
              </Typography>
            </Box>
            <AccessControl allowedRoles={[UserRoles.LECTURER]}>
              <Button
                disabled={taskgroup?.task?.isArchived}
                onClick={() => setDataToOpenGroupDrawer(taskgroupId)}>
                <Edit />
              </Button>
            </AccessControl>
          </Box>
        </Box>
        <Box>
          {!submittedAssignment?.length ? (
            <AccessControl allowedRoles={[UserRoles.STUDENT]}>
              <Button
                fullWidth
                disabled={taskgroup?.groupAdmin?.id !== userDetails?.id}
                variant="contained"
                color="primary"
                onClick={() => setOpenTaskSubmissionDrawer(taskgroupId)}>
                <Upload style={{ marginRight: 8 }} /> Upload Assignment
              </Button>
            </AccessControl>
          ) : (
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => setOpenSubmittedAssDrawer(true)}>
              <View style={{ marginRight: 8 }} /> View Assignment
            </Button>
          )}
        </Box>
        <SubmittedAssignment
          open={openSubmittedAssDrawer}
          onClose={() => setOpenSubmittedAssDrawer(false)}
          data={submittedAssignment}
        />
        <LearningGroupUpAssignment
          open={openTaskSubmissionDrawer}
          submittingTask={submittingTask}
          submitTask={submitTask}
          onClose={() => setOpenTaskSubmissionDrawer(null)}
        />
      </Box>
    );
  };

  const renderContent = () => {
    switch (currentTabValue) {
      case Tabs.about.value:
        return <About course={course} />;
      case Tabs.syllabus.value:
        return <Syllabus course={course} />;
      case Tabs.learners.value:
        return <Learners course={course} />;
      case Tabs.assignments.value:
        return <Assignment course={course} />;
      case Tabs.assessments.value:
        return <Assessment course={course} />;
      case Tabs.resources.value:
        return <Resources course={course} />;
      case Tabs.announcements.value:
        return <Announcement course={course} />;
      case Tabs.liveSession.value:
        return <LiveSession />;
      case Tabs.learningGroup.value:
        return (
          <LearningGroup
            classRep={data?.course?.classRep?.id === userDetails?.id}
            task={task}
            isLoadingTask={isLoadingTask}
            taskgroup={taskgroup}
            isLoadingTaskgroup={isLoadingTaskgroup}
          />
        );
      default:
        return <LiveSession course={course} />;
    }
  };

  const { instructors = [], leadInstructor = {}, code = '' } = course || {};

  const courseCode = () => {
    if (code) {
      return <Typography className="title">{code}:</Typography>;
    }
    return '';
  };

  return (
    <LoadingView isLoading={loading}>
      <BlueHeaderPageLayout
        onTabChange={handleChangeTab}
        tabs={tabsBasedOnSelectedRole?.map((tab) => tab.name)}
        links={breadCrumbs}
        rightContent={renderRightContent()}
        extendTitle={courseCode()}
        title={course?.title || ''}
        chipLabel={`${course?.unit || 0} units`}
        description={course?.description}
        isPageLoaded={Boolean(course)}
        tabIndex={tabsBasedOnSelectedRole?.map((tab) => tab.value)?.indexOf(currentTabValue)}
        otherInformation={renderCourseMetaData()}>
        <MaxWidthContainer spacing="lg">
          <Grid container spacing={10}>
            <Grid item xs={12} md={8}>
              <Box pb={10}>{renderContent()}</Box>
            </Grid>
            <Grid item xs={12} md={4}>
              {Boolean(taskgroupId && !descussionId) && renderDiscussionGroupInfo()}
              {Boolean(taskId && !taskgroupId && !descussionId) && renderGroupDetails()}
              <AddGroupDrawer
                isUpdating={true}
                open={dataToOpenGroupDrawer}
                upDateId={dataToOpenGroupDrawer}
                refetch={refetch}
                onClose={() => setDataToOpenGroupDrawer(null)}
              />
              <CourseInfoCard paper fullWidth {...COURSE_INFORMATION} />
              <Box mt={8}>
                {!getInstructorListOrClassRepData([leadInstructor, ...instructors])?.length ? (
                  <Box
                    style={{ background: 'white', borderRadius: 8 }}
                    mt={20}
                    p={8}
                    pt={5}
                    pb={20}
                    pl={4}>
                    <Empty
                      title="Supporting Lecturers"
                      description={'There are no supporting lecturers for this course'}
                    />
                  </Box>
                ) : (
                  <CourseRepOrInstructsList
                    data={getInstructorListOrClassRepData([leadInstructor, ...instructors])}
                    vertical={4}
                    onViewMoreClick={(instructor) => handleClick(instructor)}
                    onReviewClick={
                      userDetails?.selectedRole === UserRoles.STUDENT &&
                      course?.enrolled === EnrolmentStatus.ENROL
                        ? (instructor) => {
                            setInstructorToReview(instructor);
                          }
                        : null
                    }
                  />
                )}
              </Box>
              <Box mt={8}>
                {course?.classRep === null ? (
                  <Box
                    style={{ background: 'white', borderRadius: 8 }}
                    mt={20}
                    p={8}
                    pt={5}
                    pb={20}
                    pl={4}>
                    <Empty
                      title="Course Representative"
                      description={'There are no course representatives'}
                    />
                  </Box>
                ) : (
                  <CourseRepOrInstructsList
                    student
                    data={getInstructorListOrClassRepData([course?.classRep])}
                    vertical={4}
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        </MaxWidthContainer>
      </BlueHeaderPageLayout>
      <InstructorStatsModal
        open={open}
        onClose={() => setOpen(false)}
        courseData={courseData?.courses?.results}
        profileInfo={PROFILE_INFO}
        loading={isLoadingCourseData}
      />
      <CourseRatingModal
        open={isCourseRatingModalVisible}
        onClose={() => setIsCourseRatingModalVisible(false)}
        course={{
          id: course?.id,
          name: course?.title,
          department: course?.department?.name,
        }}
        onOkSuccess={refetchCourse}
      />
      <InstructorRatingModal
        open={Boolean(instructorToReview)}
        onClose={() => setInstructorToReview(null)}
        courseId={course?.id}
        instructor={{
          id: instructorToReview?.id,
          lastname: instructorToReview?.lastName,
          firstname: instructorToReview?.firstName,
          image: instructorToReview?.imgSrc,
          department: instructorToReview?.department,
        }}
      />
    </LoadingView>
  );
};

const useStyles = makeStyles((theme) => ({
  metaDataContainer: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      alignItems: 'flex-start',
      flexDirection: 'column',
    },
    '& .title': {
      fontSize: fontSizes.title,
      fontWeight: fontWeight.bold,
    },

    '& .bold-text': {
      fontWeight: fontWeight.bold,
    },
    '& .left-margin': {
      marginLeft: 4,
    },
    '& .right-margin': {
      marginRight: 4,
    },
    '& .divider': {
      height: fontSizes.large,
      backgroundColor: colors.white,
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
    '& .avatar': {
      backgroundColor: colors.avatarDefaultBackground,
      width: 24,
      height: 24,
      color: colors.white,
      fontWeight: fontWeight.bold,
      fontSize: fontSizes.xsmall,
    },
    '& .review-button': {
      color: colors.white,
      fontSize: fontSizes.medium,
      borderRadius: 0,
      borderBottom: `1px solid ${colors.white}`,
      paddingBottom: 0,
      height: 18,
    },
  },
}));

export default CourseDetails;
