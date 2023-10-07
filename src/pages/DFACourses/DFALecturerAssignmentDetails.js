import React, { useState, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { useQueryPagination } from 'hooks/useQueryPagination';
import { Box, Typography, Button, Grid, Avatar, Card, CardContent } from '@material-ui/core';
import { ArrowForwardIos, Edit, MoreVert } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import AssignmentEllipse from 'components/Courses/Assignments/AssignmentEllipse';
import AssignmentListAndResources from 'components/Courses/Assignments/AssignmentListAndResources';
import UpsertAssignmentsDrawer from 'components/Courses/CourseDetails/UpsertAssignmentsDrawer';
import {
  ASSIGNMENT_OVERVIEW,
  GET_ASSIGNMENT_DOCUMENTS,
  GET_ASSIGNMENT_SUBMISSIONS,
} from 'graphql/queries/courses';
import { GET_ASSIGNMENT_BY_ID } from 'graphql/queries/users';
import BlueHeaderPageLayout from 'Layout/BlueHeaderPageLayout';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import AccessControl from 'reusables/AccessControl';
import BarChart from 'reusables/BarChart';
import Chip from 'reusables/Chip';
import DonutChart from 'reusables/DonutChart';
import LoadingView from 'reusables/LoadingView';
import MaxWidthContainer from 'reusables/MaxWidthContainer';
import useNotification from 'reusables/NotificationBanner/useNotification';
import { PrivatePaths } from 'routes';
import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET, UserRoles } from 'utils/constants';
import { convertIsoDateTimeToDateTime } from 'utils/TransformationUtils';
import { getNameInitials } from 'utils/UserUtils';
import { colors, fontWeight, spaces } from '../../Css';
import GreenHeaderPageLayout from 'Layout/DFALayout/GreenHeaderPageLayout';
import DFANavigationBar from 'reusables/DFANavigationBar';

const DFALectcurerAssignmentDetails = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const history = useHistory();
  const { pathname } = useLocation();
  const notification = useNotification();
  const { assignmentId, courseId } = useParams();
  const isDfa = pathname?.startsWith('/dfa');

  const defaultQueryParams = {
    offset: DEFAULT_PAGE_OFFSET,
    limit: DEFAULT_PAGE_LIMIT,
    ordering: null,
  };
  const [queryParams, setQueryParams] = useState(defaultQueryParams);

  const { data: assignmentDocuments, refetch: refetchAssignmentDocument } = useQuery(
    GET_ASSIGNMENT_DOCUMENTS,
    {
      variables: {
        assignmentId,
      },
      onError: (error) => {
        notification.error({
          message: error?.message,
        });
      },
    },
  );

  const { data: assignmenOverview, loading: isLoadingOverview } = useQuery(ASSIGNMENT_OVERVIEW, {
    variables: {
      assignmentId,
    },
    // fetchPolicy: 'cache-and-network',
  });
  const overview = assignmenOverview?.assignmentOverview;
  const xData = overview?.scoreChart?.map((data) => data?.title) || [];
  const yData = useMemo(() => overview?.scoreChart?.map((data) => data?.value) || [], [overview]);

  const showBar = useMemo(() => {
    return yData?.reduce((a, b) => Boolean(a + b), 0);
  }, [yData]);

  const {
    data: assignment,
    loading: isLoadingAssignment,
    refetch,
  } = useQuery(GET_ASSIGNMENT_BY_ID, {
    variables: {
      assignmentId,
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });
  const assignmentData = assignment?.assignment;
  const totalEnrolledLearners = assignmentData?.course?.totalEnrolled;

  const { data, loading } = useQueryPagination(GET_ASSIGNMENT_SUBMISSIONS, {
    variables: {
      assignmentId,
      courseId: courseId,
      offset: queryParams.offset,
      limit: queryParams.limit,
      ordering: queryParams.ordering,
    },
    // fetchPolicy: 'cache-and-network',
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const link = [
    {
      title: 'Home',
      to: '/',
    },
    {
      title: `${assignmentData?.course?.title}`,
      to: `${PrivatePaths.DFA_COURSE_DETAILS}/${courseId}`,
    },
    { title: 'Assignment', to: `${PrivatePaths.DFA_COURSE_DETAILS}/${courseId}?tab=assignments` },
  ];

  const ScoreArray = [
    { score: `${overview?.totalEnrolledSubmitted || 0}`, remark: 'Leraners enrolled' },
    { score: `${overview?.highestScore || 0}`, remark: 'Highest score' },
    { score: `${overview?.lowestScore || 0}`, remark: 'Lowest score' },
    { score: `${overview?.averageScore || 0}`, remark: 'Average score' },
  ];

  const handleShowEllipseContent = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseDrawer = () => {
    setIsVisible(false);
  };

  const refetchQueries = () => {
    refetch();
    refetchAssignmentDocument();
  };

  const renderOtherInformation = () => {
    const creator = assignmentData?.createdBy;

    return (
      <Box>
        <AccessControl allowedRoles={[UserRoles.SCHOOL_ADMIN]}>
          <Box display="flex" className={classes.otherInfo} alignItems="center" mb={5}>
            <Typography component="p">
              <span style={{ fontWeight: 600 }}>{totalEnrolledLearners}</span> enrolled
            </Typography>
            <hr className={classes.hr} />
            <Box ml={8} display="flex" alignItems="center">
              <Avatar src={creator?.image}>
                {getNameInitials(creator?.firstname, creator?.lastname)}
              </Avatar>
              <Typography component="p" className={classes.Infoname}>
                {creator?.firstname} {creator?.middlename} {creator?.lastname}
              </Typography>
              <Chip label="Creator" size="sm" />
            </Box>
          </Box>
        </AccessControl>
        <Box display="flex" className={classes.otherInfo}>
          <Typography component="p">
            <span className="timeline">Deadline:</span> {assignmentData?.dueDate || '--'}
          </Typography>
          <hr className={classes.hr} />
          <Typography component="p" style={{ paddingLeft: 16 }}>
            <span className="timeline">Last updated: </span>
            {convertIsoDateTimeToDateTime(assignmentData?.updatedAt)}
          </Typography>
        </Box>
      </Box>
    );
  };

  const renderBannerRightContent = () => {
    return (
      // <AccessControl allowedRoles={[UserRoles.STUDENT && UserRoles.LECTURER]}>
      <>
        <Button
          color="secondary"
          style={{ marginRight: spaces.medium }}
          onClick={() => setIsVisible(true)}
          variant="outlined"
          startIcon={<Edit />}
        >
          Edit assignment
        </Button>
        <Box>
          <Button
            onClick={handleShowEllipseContent}
            style={{ background: '#fff' }}
            variant="contained"
          >
            <MoreVert />
          </Button>
        </Box>
        <AssignmentEllipse
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          onStatusChange={() => refetch()}
          status={assignmentData?.status}
        />
        <UpsertAssignmentsDrawer
          open={isVisible}
          onCompletedCallback={refetchQueries}
          onClose={handleCloseDrawer}
          course={assignment?.assignment?.course}
          assignmentId={assignmentId}
        />
      </>
      // </AccessControl>
    );
  };

  const renderAssignmentDetailCard = () => {
    return (
      <Box
        className={classes.assDetail}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        onClick={() => history.push(`${pathname}/details`)}
        my={10}
        px={8}
        py={8}
      >
        <Typography variant="h6" color="textPrimary">
          Assignment details
        </Typography>
        <ArrowForwardIos />
      </Box>
    );
  };

  const renderInfoCards = () => {
    return (
      <Box my={12}>
        <Grid container spacing={10}>
          {!isLoadingOverview &&
            ScoreArray?.map((info) => {
              return (
                <Grid key={info.remark} sm={6} xs={12} md={3} lg={3} item>
                  <Card square>
                    <CardContent>
                      <Typography variant="body1" color="textPrimary" className={classes.score}>
                        {info.score}
                      </Typography>
                      <Typography>{info.remark}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
        </Grid>
      </Box>
    );
  };

  const renderGraphSection = () => {
    const submissionPercentage = (overview?.submissionCount / totalEnrolledLearners) * 100;
    const nonSubmissionPercentage = 100 - submissionPercentage;
    const donutData = [nonSubmissionPercentage, submissionPercentage];
    const showDonut = donutData.includes(NaN) ? null : donutData;

    return (
      <Box mt={10} className={classes.graph}>
        <Grid container spacing={10}>
          <Grid item xs={12} md={8}>
            <Card square classes={{ root: classes.cardRoot }}>
              <CardContent>
                <Box pl={10}>
                  <Typography
                    color="textPrimary"
                    variant="body1"
                    style={{ fontWeight: fontWeight.bold }}
                  >
                    Assignment score distribution
                  </Typography>
                  <Typography color="textSecondary" variant="body1">
                    y-axis = Learner count, x-axis = scores
                  </Typography>
                </Box>
                <BarChart
                  XaxisData={Boolean(showBar) && [...xData]}
                  Yaxis={{ name: 'Submited', data: Boolean(showBar) && [...yData] }}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card square classes={{ root: classes.cardRoot }}>
              <CardContent>
                <Box className={classes.dChart}>
                  <Typography color="textPrimary" variant="body1" className="learners-status">
                    Learner who haven't submitted
                  </Typography>
                  <Typography color="textSecondary" variant="body2" className="learners-count">
                    <p className="submitted" style={{ background: '#5ACA75' }}></p>
                    <span className="submit-text">Submited</span>
                    <p className="submitted" style={{ background: '#F48989' }}></p>Not submitted
                  </Typography>
                </Box>
                <Box>
                  <LoadingView isLoading={isLoadingOverview && isLoadingAssignment}>
                    <DonutChart
                      data={showDonut}
                      chartLabel={['submitted', 'not submitted']}
                      donutColors={['#00B0F1', '#F48989']}
                    />
                  </LoadingView>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <>
      <DFANavigationBar />
      <GreenHeaderPageLayout
        isTabBarHidden={true}
        title={assignmentData?.title}
        description=""
        chipLabel={`Score ${assignmentData?.maxScore}`}
        rightContent={renderBannerRightContent()}
        otherInformation={renderOtherInformation()}
        isPageLoaded={!isLoadingAssignment}
        links={link}
      >
        <MaxWidthContainer spacing="lg">
          {renderAssignmentDetailCard()}
          {renderInfoCards()}
          {renderGraphSection()}
          <AssignmentListAndResources
            data={data}
            loading={loading}
            queryParam={queryParams}
            setQueryParams={setQueryParams}
            assignmentDocuments={assignmentDocuments}
          />
        </MaxWidthContainer>
      </GreenHeaderPageLayout>
    </>
  );
};

const useStyles = makeStyles(() => ({
  assDetail: {
    background: colors.white,
    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    '& :nth-child(1)': {
      fontWeight: fontWeight.medium,
    },
  },
  hr: {
    height: spaces.medium,
    margin: 0,
    marginLeft: 16,
  },
  otherInfo: {
    '& .timeline': {
      fontWeight: fontWeight.regular,
      color: '#F0F5FF',
    },
  },
  score: {
    fontWeight: fontWeight.medium,
  },
  graph: {
    height: 380,
  },
  Infoname: {
    padding: '0 10px',
  },
  dChart: {
    '& .learners-status': {
      fontWeight: fontWeight.bold,
    },
    '& .learners-count': {
      display: 'flex',
      alignItems: 'center',
      paddingBottom: spaces.medium,
    },
    '& .submitted': {
      width: 20,
      height: 10,
      borderRadius: 10,
      marginRight: 5,
    },
    '& .submit-text': {
      paddingRight: spaces.small,
    },
  },
  cardRoot: {
    height: 360,
  },
}));
export default DFALectcurerAssignmentDetails;
