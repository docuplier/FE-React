import { Box, Grid, Typography } from '@material-ui/core';
import { fontWeight } from '../../Css';
import React, { useMemo } from 'react';
import LoadingButton from 'reusables/LoadingButton';
import { GET_COURSE_ASSESSMENT_BY_ID } from 'graphql/queries/courses';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import useNotification from 'reusables/NotificationBanner/useNotification';
import { useStyles } from './styled.results';
import Congrats from 'assets/svgs/congrats.svg';
import AssessmentScore from 'assets/svgs/assessmentScore.svg';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import { GET_USER_DETAIL } from 'graphql/queries/users';
import { navigateToActualURL } from 'utils/RouteUtils';
import { PrivatePaths } from 'routes';

const K12StudentResult = ({ activeIndex, passed }) => {
  const classes = useStyles();
  const { assessmentId } = useParams();
  const notification = useNotification();
  const { userDetails } = useAuthenticatedUser();
  const id = userDetails?.id;

  const { data } = useQuery(GET_USER_DETAIL, {
    variables: {
      userId: id,
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const userName = data?.user?.firstname;

  const { data: assessmentData, loading: isLoadingAssessment } = useQuery(
    GET_COURSE_ASSESSMENT_BY_ID,
    {
      // fetchPolicy: 'cache-and-network',
      variables: {
        assessmentId,
      },
      onError: (error) => {
        notification.error({
          message: error?.message,
        });
      },
      skip: !assessmentId, // Skip the query if assessmentId is not available
    },
  );
  const assessment = useMemo(() => assessmentData?.assessment || {}, [assessmentData]);

  const renderPassed = () => {
    return (
      <Box className={classes.wrapper}>
        <img src={Congrats} alt="congrats" style={{ width: '20%' }} />
        <Typography className={classes.title}>Congratulations {userName}!</Typography>
        <Typography className={classes.text}>
          You made it successfully to the end. Your Digital Skill Readiness Score is 90%
        </Typography>
        <Box display="flex" flexDirection="column" alignItems="center">
          <LoadingButton
            type="submit"
            className={classes.button}
            onClick={() => {
              // Handle the onClick action specific to other roles
            }}
          >
            View Result
          </LoadingButton>
        </Box>
        <Typography style={{ color: 'grey', marginTop: 7 }}>Redirecting in 1:03s</Typography>
      </Box>
    );
  };

  const renderFailed = () => {
    return (
      <Box className={classes.failWrapper}>
        <Typography className={classes.mark}>56%</Typography>
        <Typography className={classes.failHeaderText}>
          Sorry, You didn’t meet the pass mark.
        </Typography>
        <Typography className={classes.failText}>Don’t worry, we’ve got goodnews.</Typography>
        <Grid container className={classes.failBox}>
          <Grid item xs={6}>
            <img src={AssessmentScore} alt="assessment-score" style={{ width: '50%' }} />
          </Grid>
          <Grid item xs={12} sm={6} lg={6}>
            <Typography className={classes.failSecondText}>
              You can only retake this assessment after 24 hours in 2 more attempts. After the third
              attempt and you didn’t pass, you would have to reenroll for the BDL Course.
            </Typography>
            <LoadingButton
              //   isLoading={loading || isDomainLoading}
              type="submit"
              className={classes.button}
              onClick={() => {
                navigateToActualURL(PrivatePaths.DFA_ASSESSMENT);
              }}
            >
              Retake Assessment
            </LoadingButton>
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <Box className={classes.description} square>
      <Box className="box" display="flex" justifyContent="space-between" alignItems="center" px={9}>
        <Box>
          <Typography variant="body1" color="#fff" style={{ fontWeight: fontWeight.bold }}>
            {assessment?.title || 'General Assessment'}
          </Typography>
        </Box>
        <Typography variant="body1" color="#fff" style={{ fontWeight: fontWeight.medium }}>
          Attempts: {activeIndex + 1} out of {assessment?.attempts?.legnth || 3}
        </Typography>
      </Box>
      {!passed ? renderFailed() : renderPassed()}
    </Box>
  );
};

export default K12StudentResult;
