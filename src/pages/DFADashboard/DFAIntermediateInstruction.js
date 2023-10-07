import React from 'react';
import { useState } from 'react';
import DFAProfileLayout from 'Layout/DFALayout/DFAProfileLayout';
import { Box, Typography, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { fontSizes, fontWeight } from '../../Css';
import LoadingButton from 'reusables/LoadingButton';
import { green } from '@material-ui/core/colors';
import HeaderItems from 'assets/svgs/headerItems.svg';
import { navigateToActualURL } from 'utils/RouteUtils';
import { PublicPaths } from 'routes';
import DFAConfirmationDialog from 'reusables/DFAConfirmationDialog';

const DFAIntermediateInstruction = () => {
  const classes = useStyles();

  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);

  const handleConfirmDialogOkClick = () => {
    setIsConfirmationDialogOpen(true);
  };

  const renderProfile = () => {
    return (
      <Container>
        <Box className={classes.header}>Instruction</Box>
        <Box className={classes.wrapper}>
          <Typography className={classes.headerText}>
            Welcome to Intermediate-level Entry Assessment.
          </Typography>
          <Typography style={{ marginTop: '1rem', marginBottom: '1rem' }}>
            Get ready to explore your digital skills! This quick assessment will determine your
            digital proficiency level and guide your next steps.
          </Typography>

          <Typography className={classes.headerText}>Assessment Overview:</Typography>
          <ul style={{ marginTop: '0' }}>
            <li style={{ marginBottom: '5px' }}>
              <span className={classes.headerText}>Duration: </span>30 minutes.
            </li>
            <li style={{ marginBottom: '5px' }}>
              <span className={classes.headerText}>Format: </span> Multiple Choice.
            </li>
            <li>
              <span className={classes.headerText}>Goal: </span> Assess your readiness for the
              intermediate level courses.
            </li>
          </ul>
          <Typography className={classes.headerText}>Guidelines:</Typography>
          <ol style={{ marginTop: '0' }}>
            <li style={{ marginBottom: '5px' }}>
              {' '}
              <span className={classes.headerText}> Quiet Place: </span>Find a quiet,
              distraction-free environment.
            </li>
            <li style={{ marginBottom: '5px' }}>
              {' '}
              <span className={classes.headerText}>Stable Internet: </span>Ensure a stable internet
              connection.
            </li>
            <li style={{ marginBottom: '5px' }}>
              {' '}
              <span className={classes.headerText}>Answer Honestly: </span>Do your best, and please
              don't cheat.
            </li>
            <li style={{ marginBottom: '5px' }}>
              {' '}
              <span className={classes.headerText}>No Tab Switching: </span>Stay on this page.
            </li>
            <li>
              {' '}
              <span className={classes.headerText}>Review Answers: </span>Double-check before
              submitting
            </li>
          </ol>
          <Typography className={classes.headerText}>Important Note:</Typography>
          <Typography>
            Upon completion, your assessment will be submitted, and your personalized learning
            journey will be crafted based on your performance. You won't have access to retake this
            assessment, so give it your best shot!
          </Typography>
          <LoadingButton
            //   isLoading={loading || isDomainLoading}
            type="submit"
            className={classes.button}
            onClick={handleConfirmDialogOkClick}
          >
            Start Assessment
          </LoadingButton>
        </Box>
        {isConfirmationDialogOpen && (
          <DFAConfirmationDialog
            title={'Start Assessment'}
            description={`Are you sure you want to begin this assessment`}
            okText={'Yes, proceed'}
            cancelText={'Cancel'}
            open={isConfirmationDialogOpen}
            onOk={() => {
              navigateToActualURL(PublicPaths.DFA_START_ASSESSMENT);
            }}
            onClose={() => setIsConfirmationDialogOpen(false)}
          />
        )}
      </Container>
    );
  };

  return <>{renderProfile()}</>;
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '90vh',
    padding: theme.spacing(24),
    [theme.breakpoints.down('xs')]: {
      textAlign: 'start',
      padding: theme.spacing(6),
    },
  },
  header: {
    padding: theme.spacing(12),
    borderRadius: theme.spacing(1),
    color: '#fff',
    background: 'var(--PrimaryGreenDFA, #3CAE5C)',
    backgroundImage: `url(${HeaderItems})`,
    backgroundSize: 'cover',
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
    padding: theme.spacing(12),
    borderRadius: theme.spacing(1),
    background: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    textAlign: 'start',
    [theme.breakpoints.down('xs')]: {
      textAlign: 'start',
      padding: theme.spacing(12),
    },
  },
  headerText: {
    marginTop: '4px',
    fontWeight: fontWeight.bold,
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

export default DFAIntermediateInstruction;
