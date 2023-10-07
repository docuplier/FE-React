import React from 'react';
import { useQuery } from '@apollo/client';
import DFAProfileLayout from 'Layout/DFALayout/DFAProfileLayout';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import useNotification from 'reusables/NotificationBanner/useNotification';
import { GET_USER_DETAIL } from 'graphql/queries/users';
import { Box, Typography, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { fontSizes, fontWeight } from '../../Css';
import LoadingButton from 'reusables/LoadingButton';
import { green } from '@material-ui/core/colors';
import { navigateToActualURL } from 'utils/RouteUtils';
import { PublicPaths } from 'routes';
import DFAExitAssessment from 'components/DFAAssessment/DFAStudentAssessmentTake/DFAExitAssessment';
import AssessmentImage from 'assets/svgs/assessmentImg.svg';

const DFAK12Dashboard = () => {
  const classes = useStyles();
  const { userDetails } = useAuthenticatedUser();
  const notification = useNotification();
  const id = userDetails?.id;

  const { data, loading, error } = useQuery(GET_USER_DETAIL, {
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

  const renderProfile = () => {
    return (
      <Container className={classes.container}>
        <Box className={classes.header}>
          <img src={AssessmentImage} alt="assessment" className={classes.assessmentImage} />
        </Box>
        <Box className={classes.wrapper}>
          <Typography className={classes.headerText}>Welcome {userName},</Typography>
          <Typography className={classes.text}>
            Thank you for showing interest in becoming a K12 teacher. You need to take a Basic Level
            Assessment. <br />A minimum pass mark of 70% is required to move on to the next stage.
          </Typography>
          <Typography className={classes.text}>Good luck! You've got this💪</Typography>
          <LoadingButton
            //   isLoading={loading || isDomainLoading}
            type="submit"
            className={classes.button}
            onClick={() => {
              navigateToActualURL(PublicPaths.DFA_ASSESSMENT);
              console.log('click');
            }}
          >
            Start Assessment
          </LoadingButton>
        </Box>
      </Container>
    );
  };

  return (
    <DFAProfileLayout>
      {renderProfile()}
      <DFAExitAssessment />
    </DFAProfileLayout>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },
  header: {
    padding: theme.spacing(12),
    borderRadius: theme.spacing(1),
    color: '#fff',
    // background: 'var(--PrimaryGreenDFA, #3CAE5C)',
    fontSize: fontSizes.large,
    fontWeight: fontWeight.medium,
    boxShadow: theme.shadows[2],
    textAlign: 'start',
    [theme.breakpoints.down('xs')]: {
      textAlign: 'start',
      padding: theme.spacing(12),
    },
  },
  wrapper: {
    padding: theme.spacing(24),
    borderRadius: theme.spacing(1),
    background: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    textAlign: 'start',
    [theme.breakpoints.down('xs')]: {
      textAlign: 'start',
      padding: theme.spacing(12),
    },
  },
  assessmentImage: {
    position: 'absolute',
    top: '20%',
    left: '15%',
    width: '20%',
    height: 'auto',
    [theme.breakpoints.down('xs')]: {
      position: 'relative',
      top: 0,
      left: 0,
      width: '100%',
      height: 'auto',
    },
  },
  headerText: {
    padding: theme.spacing(6),
    fontSize: '32px',
    fontWeight: fontWeight.bold,
    color: 'var(--TextDFA, #083A55)',
    [theme.breakpoints.down('xs')]: {
      fontSize: fontSizes.title,
    },
  },
  text: {
    padding: theme.spacing(6),
    fontSize: fontSizes.xxlarge,
    fontWeight: fontWeight.regular,
    [theme.breakpoints.down('xs')]: {
      fontSize: fontSizes.large,
    },
  },
  button: {
    marginTop: 24,
    fontSize: fontSizes.large,
    fontWeight: fontWeight.medium,
    color: '#fff',
    backgroundColor: '#3CAE5C',
    '&:hover': {
      backgroundColor: green[700],
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: fontSizes.medium,
    },
  },
}));

export default DFAK12Dashboard;
