import React from 'react';
import { useState } from 'react';
import DFAProfileLayout from 'Layout/DFALayout/DFAProfileLayout';
import Dashboard from './DFADashboardInstruction';
import { Box, Container } from '@material-ui/core';
import LoadingButton from 'reusables/LoadingButton';
import { navigateToActualURL } from 'utils/RouteUtils';
import { PrivatePaths } from 'routes';
import DFAConfirmationDialog from 'reusables/DFAConfirmationDialog';
import { useStyles } from './styled.instructionDashboard';

const K12StudentDashboard = () => {
  const classes = useStyles();
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);

  const handleConfirmDialogOkClick = () => {
    setIsConfirmationDialogOpen(true);
  };

  const greeting = ' Welcome to the K-12 Students Basic Digital Skills Final Assessment';
  const title =
    ' Get ready to explore your digital skills! This quick assessment is designed to assess your digital literacy level and determine whether you qualify for the challenge phase of this program.';
  const duration = '30 minutes';
  const questionData = 'Multiple Choice';
  const assessmentInfo = 'This is your final assessment.';
  const note =
    'Your score will be revealed upon submission. Below 60% suggests you go take basic program online, while above 60% qualifies you for the challenge stage of this program.';
  return (
    <DFAProfileLayout>
      <Container className={classes.container}>
        <Box className={classes.header}>Instruction</Box>
        <Box className={classes.wrapper}>
          <Dashboard
            greeting={greeting}
            title={title}
            duration={duration}
            questionType={questionData}
            assessment={assessmentInfo}
            note={note}
          />
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
              navigateToActualURL(PrivatePaths.DFA_ASSESSMENT);
              setIsConfirmationDialogOpen(false);
            }}
            onClose={() => setIsConfirmationDialogOpen(false)}
          />
        )}
      </Container>
    </DFAProfileLayout>
  );
};

export default K12StudentDashboard;
