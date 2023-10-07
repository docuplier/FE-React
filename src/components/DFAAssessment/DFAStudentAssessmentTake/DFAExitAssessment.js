import React from 'react';
// import { useQuery } from '@apollo/client';
// import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
// import useNotification from 'reusables/NotificationBanner/useNotification';
// import { GET_USER_DETAIL } from 'graphql/queries/users';
import { Box, Typography, Container, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { colors, fontSizes, fontWeight } from '../../../Css';
import AssessmentScore from 'assets/svgs/assessmentScore.svg';
import LoadingButton from 'reusables/LoadingButton';
import { green } from '@material-ui/core/colors';

const DFAExitAssessment = () => {
  const classes = useStyles();
  // const { userDetails } = useAuthenticatedUser();
  // const notification = useNotification();
  // const id = userDetails?.id;

  // const { data } = useQuery(GET_USER_DETAIL, {
  //   variables: {
  //     userId: id,
  //   },
  //   onError: (error) => {
  //     notification.error({
  //       message: error?.message,
  //     });
  //   },
  // });

  //   const userName = data?.user?.firstname;

  const renderProfile = () => {
    return (
      <Container className={classes.container}>
        <Box className={classes.wrapper}>
          <Typography className={classes.mark}>56%</Typography>
          <Typography className={classes.headerText}>
            Sorry, You didn’t meet the pass mark.
          </Typography>
          <Typography className={classes.text}>Don’t worry, we’ve got goodnews.</Typography>
          <Grid container className={classes.box}>
            <Grid item xs={6}>
              <img src={AssessmentScore} alt="assessment-score" style={{ width: '50%' }} />
            </Grid>
            <Grid item xs={6}>
              <Typography className={classes.secondText}>
                You can only retake this assessment after 24 hours in 2 more attempts. After the
                third attempt and you didn’t pass, you would have to reenroll for the BDL Course.
              </Typography>
              <LoadingButton
                //   isLoading={loading || isDomainLoading}
                type="submit"
                className={classes.button}
                onClick={() => {
                  console.log('click');
                }}
              >
                Retake Assessment
              </LoadingButton>
            </Grid>
          </Grid>
        </Box>
      </Container>
    );
  };

  return <>{renderProfile()}</>;
};

const useStyles = makeStyles((theme) => ({
  wrapper: {
    padding: theme.spacing(32),
    borderRadius: theme.spacing(1),
    // background: theme.palette.background.paper,
    // boxShadow: theme.shadows[2],
    textAlign: 'center',
    [theme.breakpoints.down('xs')]: {
      textAlign: 'center',
      padding: theme.spacing(3),
    },
  },
  mark: {
    fontSize: '40px',
    fontWeight: fontWeight.bold,
    color: colors.textError,
  },
  box: {
    width: '100%',
    padding: theme.spacing(12),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'var(--general-light-1-hover-sec-btn, #F7F8F9)',
  },
  headerText: {
    padding: theme.spacing(6),
    fontSize: fontSizes.xlarge,
    fontWeight: fontWeight.bold,
    color: 'var(--TextDFA, #083A55)',
    [theme.breakpoints.down('xs')]: {
      fontSize: fontSizes.large,
    },
  },
  text: {
    marginBottom: '30px',
    // padding: theme.spacing(2),
    fontSize: fontSizes.large,
    fontWeight: fontWeight.regular,
    [theme.breakpoints.down('xs')]: {
      fontSize: fontSizes.medium,
    },
  },
  secondText: {
    padding: theme.spacing(2),
    fontSize: fontSizes.large,
    fontWeight: fontWeight.regular,
    [theme.breakpoints.down('xs')]: {
      fontSize: fontSizes.medium,
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

export default DFAExitAssessment;
