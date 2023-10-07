import React from 'react';
import { useHistory, useParams } from 'react-router-dom';

import AssignmentDetailLayout from 'Layout/AssignmentDetailLayout';
import { ArrowBackIos } from '@material-ui/icons';
import { Box, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { fontWeight } from '../../Css';
import { PrivatePaths } from 'routes';
import { useQuery } from '@apollo/client';
import { GET_ASSIGNMENT_BY_ID } from 'graphql/queries/users';
import useNotification from 'reusables/NotificationBanner/useNotification';
import LoadingView from 'reusables/LoadingView';

const AssignmentDetail = () => {
  const classes = useStyles();
  const history = useHistory();
  const { courseId } = useParams();
  const { assignmentId } = useParams();
  const notification = useNotification();

  const { data, loading } = useQuery(GET_ASSIGNMENT_BY_ID, {
    variables: {
      assignmentId,
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const links = [
    { title: 'Home', to: '/' },
    { title: 'Course', to: `${PrivatePaths.COURSES}` },
    {
      title: `${data?.assignment?.course?.title}`,
      to: `${PrivatePaths.COURSES}/${courseId}`,
    },
    { title: 'Assignment', to: `${PrivatePaths.COURSES}/${courseId}/assignmentss/${assignmentId}` },
    { title: `${data?.assignment?.course?.title}`, to: '#' },
  ];
  return (
    <AssignmentDetailLayout
      isLoading={loading}
      links={links}
      headerText={
        <Typography className={classes.nav} onClick={() => history.goBack()}>
          <ArrowBackIos /> Back to assignment details
        </Typography>
      }>
      <Box className={classes.detailText} py={12} px={15} mt={12}>
        <Typography variant="h6" color="textPrimary">
          Details
        </Typography>
      </Box>
      <Box py={15} px={15} component={Paper} square elevation={2} mb={50}>
        <LoadingView isLoading={loading}>
          <Typography variant="body1" color="textPrimary">
            {data?.assignment?.body}
          </Typography>
        </LoadingView>
      </Box>
    </AssignmentDetailLayout>
  );
};

const useStyles = makeStyles(() => ({
  nav: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  detailText: {
    background: '#F7F8F9',
    borderRadius: '8px 8px 0px 0px',
    boxSizing: 'border-box',
    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
    '&:nth-child(1)': {
      fontWeight: fontWeight.bold,
    },
  },
}));
export default AssignmentDetail;
