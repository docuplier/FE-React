import { useMutation, useQuery, useSubscription } from '@apollo/client';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Menu,
  Paper,
  ListItemText,
  MenuItem,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ArrowForwardIos, Edit, MoreVert } from '@material-ui/icons';
import { format } from 'date-fns';
import {
  GET_ALL_ASSESSMENT_GRADES,
  GET_ASSESSMENT_OVERVIEW,
  GET_COURSE_ASSESSMENT_BY_ID,
} from 'graphql/queries/courses';
import { EXPORT_RESULT_GRADES_ASSESMENT } from 'graphql/mutations/courses';

import BlueHeaderPageLayout from 'Layout/BlueHeaderPageLayout';
import React, { useMemo } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import AccessControl from 'reusables/AccessControl';
import BarChart from 'reusables/BarChart';
import Chip from 'reusables/Chip';
import DonutChart from 'reusables/DonutChart';
import LoadingView from 'reusables/LoadingView';
import MaxWidthContainer from 'reusables/MaxWidthContainer';
import { useNotification } from 'reusables/NotificationBanner';
import ResourceTable from 'reusables/ResourceTable';
import { PrivatePaths } from 'routes';
import { UserRoles } from 'utils/constants';
import { convertToSentenceCase } from 'utils/TransformationUtils';
import { getNameInitials } from 'utils/UserUtils';
import { colors, fontSizes, fontWeight, spaces } from '../../Css';
import { SUBSCRIBE_NOTIFICATION } from 'graphql/queries/notification';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import { useState } from 'react';

const AssessmentDetails = () => {
  const { userDetails } = useAuthenticatedUser();
  const classes = useStyles();
  const { pathname } = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notificationData, setNotificationData] = useState(null);
  const [downloadData, setDownloadData] = useState(null);
  const notification = useNotification();
  const { courseId, assessmentId } = useParams();
  const history = useHistory();

  const { data, loading } = useQuery(GET_ALL_ASSESSMENT_GRADES, {
    variables: {
      assessmentId,
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const { data: assessment, loading: loadingAssessment } = useQuery(GET_COURSE_ASSESSMENT_BY_ID, {
    variables: {
      assessmentId,
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const { data: notify } = useSubscription(SUBSCRIBE_NOTIFICATION, {
    variables: {
      userId: userDetails?.id,
    },
    onSubscriptionData: (subscriptionData) => {
      setNotificationData(subscriptionData);
    },
    onError: () => {
      notification.error({
        message: 'Failed',
        description: 'Failed to process result. Try again',
      });
    },
  });

  const [exportResult, { loading: loadingResults }] = useMutation(EXPORT_RESULT_GRADES_ASSESMENT, {
    onCompleted: (data) => {
      setAnchorEl(null);
      setDownloadData(data);
    },
    onError: () => {
      notification.error({
        message: 'Failed',
        description: 'Failed to process result. Try again',
      });
    },
  });

  const handleExportResult = () => {
    exportResult({
      variables: {
        assessmentId,
      },
    });
  };
  React.useEffect(() => {
    if (loadingResults) {
      notification.info({
        message: 'Processing',
        description: `Processing result. Once complete, 
        you will get a notification to download.`,
      });
    } else if ((!loadingResults && notify) || (!loadingResults && downloadData)) {
      notification.success({
        message: 'Download',
        description: 'Your result has been downloaded',
      });
    }
  }, [loadingResults, notify, downloadData]);

  const { data: assessmentOverview, loading: loadingOverview } = useQuery(GET_ASSESSMENT_OVERVIEW, {
    variables: {
      assessmentId,
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const assessmentOverviewData = assessmentOverview?.assessmentOverview;
  const assessmentItems = assessment?.assessment;
  const dataSource = data?.assessmentGrades?.results;
  const totalQuestions = assessmentItems?.totalQuestions;
  const multichoiceQuestionCount = assessmentItems?.multichoiceQuestionCount;
  const textQuestionCount = assessmentItems?.textQuestionCount;
  const title = assessmentItems?.title;
  const duration = assessmentItems?.duration;

  const scoreInformationData = [
    { score: `${assessmentOverviewData?.learnersEnrolledCount || 0}`, remark: 'Students Enrolled' },
    { score: `${assessmentOverviewData?.lowestScore || 0}`, remark: 'Lowest Score' },
    { score: `${assessmentOverviewData?.highestScore || 0}`, remark: 'Highest Score' },
    { score: `${assessmentOverviewData?.averageScore || 0}`, remark: 'Average Score' },
  ];

  // do a check here to check if it is global accessment
  // if true, set the routes and privatepaths to pick the unique value to global accessment
  const isGlobalAssessment = assessmentItems?.isGlobalAssessment;
  const breadCrumbs = useMemo(
    () =>
      [
        { title: 'Home', to: isGlobalAssessment ? '/assessments' : '/' },
        !isGlobalAssessment && { title: `${assessment?.course?.title}`, to: PrivatePaths.COURSES },
        !isGlobalAssessment && {
          title: `${assessment?.title}`,
          to: `${PrivatePaths.COURSES}/${courseId}`,
        },
      ].filter((link) => link),
    [isGlobalAssessment, assessment, courseId],
  ); // Remove falsy link values

  const xAxisData = useMemo(
    () => assessmentOverviewData?.scoreChart?.map((data) => data?.title),
    [assessmentOverviewData],
  );

  const yAxisData = useMemo(
    () => assessmentOverviewData?.scoreChart?.map((data) => data?.value),
    [assessmentOverviewData],
  );

  const showBar = useMemo(() => {
    return yAxisData?.reduce((a, b) => Boolean(a + b), 0);
  }, [yAxisData]);

  const columns = [
    {
      title: 'Name / Student’s ID',
      dataIndex: 'user',
      width: '45%',
      render: (text, data) => {
        return (
          <Box display="flex" justifyContent="flex-start" flexDirection="flex-start">
            <Box mr={6}>
              <Avatar src={data?.user?.image} className={classes.avatar}>
                {getNameInitials(data?.user?.firstname, data?.user?.lastname)}
              </Avatar>
            </Box>
            <Box>
              <Typography variant="body2">
                {convertToSentenceCase(data?.user?.firstname)}{' '}
                {`${convertToSentenceCase(data?.user?.middlename)} `}
                {convertToSentenceCase(data?.user?.lastname)}
              </Typography>
              <Typography variant="body2">{data?.user?.matricNumber}</Typography>{' '}
            </Box>
          </Box>
        );
      },
    },
    {
      title: 'Score',
      dataIndex: 'score',
      sorter: true,
    },
    {
      title: 'Status',
      dataIndex: 'gradeStatus',
      sorter: true,
      render: (text, status) => (
        <Chip
          className={status?.gradeStatus === 'PENDING' && classes.pending}
          label={status?.gradeStatus === 'DONE' ? 'DONE' : 'PENDING'}
          size="md"
          roundness="sm"
          variant="outlined"
          color={status?.gradeStatus === 'DONE' ? 'active' : 'pending'}
        />
      ),
    },
    {
      title: 'Percentage',
      dataIndex: 'scorePercentage',
      sorter: true,
      render: (scorePercentage) => <Typography>{scorePercentage?.toFixed(2)}</Typography>,
    },
  ];

  const handleShowEllipseContent = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const renderOtherHeaderInformation = () => {
    const startDate = assessmentItems?.startDate ?? '01-01-2020';
    const startTime = assessmentItems?.startTime ?? '';
    const dueDate = assessmentItems?.dueDate ?? '01-01-2020';
    const dueTime = assessmentItems?.dueTime ?? '';

    return (
      <Box display="flex">
        <Typography variant="body3" className={classes.headerInformation}>
          Published:{' '}
          <strong>
            {startDate} - {format(new Date(`${startDate} ${startTime}`), 'hh:mm aaa')}
          </strong>
        </Typography>
        <Typography variant="body3" style={{ paddingLeft: 8 }}>
          Deadline:{' '}
          <strong>
            {dueDate} - {format(new Date(`${dueDate} ${dueTime}`), 'hh:mm aaa')}
          </strong>
        </Typography>
      </Box>
    );
  };

  const renderBannerRightContent = () => {
    return (
      <AccessControl
        allowedRoles={
          isGlobalAssessment ? [UserRoles.LECTURER, UserRoles.SCHOOL_ADMIN] : [UserRoles.LECTURER]
        }
      >
        <Box mr={8} display="flex" justifyContent="flex-end">
          <Button
            onClick={() => {
              isGlobalAssessment
                ? history.push(`${PrivatePaths.ASSESSMENTS}/create-assessment?id=${assessmentId}`)
                : history.push(
                    `${PrivatePaths.COURSES}/${courseId}/assessments/create-assessment?id=${assessmentId}`,
                  );
            }}
            variant="outlined"
            startIcon={<Edit />}
            style={{ color: colors.white, marginRight: spaces.small }}
          >
            Edit assessment
          </Button>

          <Button
            onClick={handleShowEllipseContent}
            style={{ background: '#fff' }}
            variant="contained"
          >
            <MoreVert />
          </Button>

          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            style={{ marginTop: 60 }}
          >
            <Box component={Paper} px={5} elevation={0}>
              <MenuItem>
                <ListItemText
                  color="primary"
                  primary=" Export Result"
                  but
                  onClick={() => {
                    handleExportResult();
                    setAnchorEl(null);
                  }}
                />
              </MenuItem>
            </Box>
          </Menu>
        </Box>
      </AccessControl>
    );
  };

  const renderAssessmentScoreInformation = () => {
    return (
      <Grid container spacing={10}>
        {scoreInformationData?.map(({ score, remark }) => {
          return (
            <Grid item xs={12} sm={6} md={3}>
              <Box p={6} className={classes.scoreInformation}>
                <Typography style={{ fontSize: fontSizes.large }}>
                  <strong>{score}</strong>
                </Typography>
                <Typography style={{ fontSize: fontSizes.medium }}>{remark}</Typography>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  const renderGraphSection = () => {
    const totalEnrolledSubmitted = assessmentOverviewData?.totalEnrolledSubmitted;
    const learnersEnrolledCount = assessmentOverviewData?.learnersEnrolledCount;
    const submissionPercentage = (totalEnrolledSubmitted / learnersEnrolledCount) * 100;
    const nonSubmissionPercentage = 100 - submissionPercentage;
    const donutData = [nonSubmissionPercentage, submissionPercentage];
    const showDonut = donutData.includes(NaN) ? null : donutData;

    return (
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
                  Assessment score distribution
                </Typography>
                <Typography color="textSecondary" variant="body1">
                  y-axis = Learner count, x-axis = scores
                </Typography>
              </Box>
              <BarChart
                XaxisData={Boolean(showBar) && [...xAxisData]}
                Yaxis={{ name: 'Submitted', data: Boolean(showBar) && [...yAxisData] }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card square classes={{ root: classes.cardRoot }}>
            <CardContent>
              <Box className={classes.dChart}>
                <Typography color="textPrimary" variant="body1" className="learners-status">
                  Students who haven't submitted
                </Typography>
                <Typography color="textSecondary" variant="body2" className="learners-count">
                  <p className="submitted" style={{ background: colors.successBg }}></p>
                  <span className="submit-text">Submitted</span>
                  <p
                    className="submitted"
                    style={{ background: colors.avatarDefaultBackground }}
                  ></p>
                  Not submitted
                </Typography>
              </Box>
              <Box>
                <LoadingView isLoading={loadingOverview}>
                  <DonutChart data={showDonut} chartLabel={['Not submitted', 'Submitted']} />
                </LoadingView>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderResourceTable = () => {
    return (
      <LoadingView isLoading={loading}>
        <Grid container spacing={10}>
          <Grid item xs={12} md={8}>
            <ResourceTable
              columns={columns}
              dataSource={dataSource ?? []}
              onRow={(record) => {
                return {
                  onClick: (_evt) =>
                    history.push(
                      `${pathname}/assessment-submissions?assessmentGradeId=${record.id}&enrolleeId=${record.user.id}`,
                    ),
                };
              }}
              pagination={{
                total: data?.assessmentGrades?.totalCount,
              }}
            />
          </Grid>
        </Grid>
      </LoadingView>
    );
  };

  return (
    <>
      <LoadingView isLoading={loadingAssessment}>
        <BlueHeaderPageLayout
          links={breadCrumbs}
          rightContent={renderBannerRightContent()}
          title={title}
          chipLabel={`Duration: ${duration}`}
          isPageLoaded={true}
          isTabBarHidden={true}
          otherInformation={renderOtherHeaderInformation()}
        >
          <MaxWidthContainer spacing="lg">
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={6}
              mb={12}
              onClick={() => history.push(`${pathname}/questions-overview`)}
              style={{ background: colors.white, cursor: 'pointer' }}
            >
              <Box>
                <Typography style={{ fontSize: fontSizes.large }}>
                  <strong>Question Overview</strong>
                </Typography>
                <Typography style={{ fontSize: fontSizes.medium }}>
                  {totalQuestions} questions in total • {multichoiceQuestionCount} multichoice •{' '}
                  {textQuestionCount} text & essay{' '}
                </Typography>
              </Box>
              <Box>
                <ArrowForwardIos />
              </Box>
            </Box>
            {renderAssessmentScoreInformation()}
            {renderGraphSection()}
            {renderResourceTable()}
          </MaxWidthContainer>
        </BlueHeaderPageLayout>
      </LoadingView>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  line: {
    color: colors.white,
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
  graph: {
    height: 380,
  },
  cardRoot: {
    height: 360,
  },
  pending: {
    background: '#FFFFFF',
    color: '#FFB321',
    borderColor: '#FFB321',
  },
  headerInformation: {
    borderRight: `1px solid ${colors.seperator}`,
    paddingRight: 8,
  },
  scoreInformation: {
    background: colors.white,
    minWidth: '250px',
  },
}));
export default AssessmentDetails;
