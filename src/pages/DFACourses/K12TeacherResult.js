import { Box, Typography } from '@material-ui/core';
import { fontWeight } from '../../Css';
import React, { useMemo } from 'react';
import LoadingButton from 'reusables/LoadingButton';
import { GET_COURSE_ASSESSMENT_BY_ID } from 'graphql/queries/courses';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import useNotification from 'reusables/NotificationBanner/useNotification';
import { useStyles } from './styled.results';
import Congrats from 'assets/svgs/congrats.svg';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import { GET_USER_DETAIL } from 'graphql/queries/users';

const K12TeacherResult = ({ activeIndex }) => {
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
      <Box className={classes.wrapper}>
        <img src={Congrats} alt="congrats" style={{ width: '20%' }} />
        <Typography className={classes.title}>Congratulations {userName}!</Typography>
        <Typography className={classes.text}>You made it successfully to the end...</Typography>
        <LoadingButton
          type="submit"
          className={classes.button}
          onClick={() => {
            // Handle the onClick action specific to other roles
          }}
        >
          Proceed to Dashboard
        </LoadingButton>
        <Typography style={{ color: 'grey', marginTop: 7 }}>Redirecting in 1:03s</Typography>
      </Box>
    </Box>
  );
};

export default K12TeacherResult;
