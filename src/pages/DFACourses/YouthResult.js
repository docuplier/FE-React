import { Box, Typography } from '@material-ui/core';
import { fontWeight } from '../../Css';
import React, { useMemo } from 'react';
import LoadingButton from 'reusables/LoadingButton';
import { PublicPaths } from 'routes';
import { navigateToActualURL } from 'utils/RouteUtils';
import { GET_COURSE_ASSESSMENT_BY_ID } from 'graphql/queries/courses';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import useNotification from 'reusables/NotificationBanner/useNotification';
import { useStyles } from './styled.results';
import Congrats from 'assets/svgs/congrats.svg';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import { GET_USER_DETAIL } from 'graphql/queries/users';

const YouthResult = () => {
  const { assessmentId } = useParams();
  const notification = useNotification();
  const classes = useStyles();
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

  return (
    <Box className={classes.description} square>
      <Box className="box" display="flex" justifyContent="space-between" alignItems="center" px={9}>
        <Box>
          <Typography variant="body1" color="#fff" style={{ fontWeight: fontWeight.bold }}>
            {assessment?.title || 'General Assessment'}
          </Typography>
        </Box>
      </Box>
      <Box className={classes.wrapper}>
        <img src={Congrats} alt="congrats" style={{ width: '20%' }} />
        <Typography className={classes.title}>Congratulations {userName}!</Typography>
        <Typography className={classes.text}>
          Well done! Your Digital Skill Readiness Score is 90% Please proceed with your application
          by completing the fields below.
        </Typography>
        <Box display="flex" flexDirection="column">
          <LoadingButton
            type="submit"
            className={classes.button}
            onClick={() => {
              navigateToActualURL(PublicPaths.DFA_INTERMEDIATE_ASSESSMENT);
            }}
          >
            Proceed to Intermediate Level
          </LoadingButton>
          <LoadingButton
            type="submit"
            className={classes.button1}
            onClick={() => {
              // Handle the onClick action for 'Enroll for Basic Level'
            }}
          >
            Enroll for Basic Level
          </LoadingButton>
        </Box>
      </Box>
    </Box>
  );
};

export default YouthResult;
