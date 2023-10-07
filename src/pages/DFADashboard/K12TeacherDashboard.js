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

const K12TeacherDashboard = () => {
  const classes = useStyles();
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);

  const handleConfirmDialogOkClick = () => {
    setIsConfirmationDialogOpen(true);
  };

  const greeting = ' Welcome to the K-12 Teachers Eligibility Assessment.';
  const title =
    ' Get ready to explore your digital skills! This quick assessment is designed to assess your digital proficiency level and eligibility to proceed as a K-12 teacher on this program.';
  const duration = '30 minutes';
  const questionData = 'Multiple Choice';
  const assessmentInfo =
    'Assess your digital proficiency and eligibility to proceed as a K-12 teacher on this program.';
  const note =
    'Your score will be revealed upon submission. Below 70% suggests that you retake the test and/or the basic course, while above 70% allow you proceed with your registration as a K-12 Teacher.';
  const renderProfile = () => {
    return (
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
    );
  };

  return <DFAProfileLayout>{renderProfile()}</DFAProfileLayout>;
};

export default K12TeacherDashboard;
