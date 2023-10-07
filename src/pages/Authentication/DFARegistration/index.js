import React, { useState } from 'react';
// import './index.css';
import { useForm } from 'react-hook-form';
import Paper from '@material-ui/core/Paper';
import Header from './header';
import { Box, Button, Container, Grid, Step, StepLabel, Stepper } from '@material-ui/core';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import StepFour from './StepFour';
import StepFive from './StepFive';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import clsx from 'clsx';
// import { navigateToActualURL } from 'utils/RouteUtils';
// import { PublicPaths } from 'routes';
import { QontoConnector, useStyles } from './styled.index';
import FinalStep from './FinalStep';

const defaultValues = {
  canRetakeTrackAssessmentAt: '',
  category: '',
  certification: '',
  computerAbility: '',
  course: '',
  createdBy: '',
  currentState: '',
  currentTrack: '',
  currentlyDoing: '',
  digitalParticipation: '',
  digitalSkills: '',
  digitalSkillsTrainingJourney: '',
  education: '',
  email: '',
  employment: '',
  extentOfDigitalSkills: '',
  firstname: '',
  middlename: '',
  gender: '',
  age: '',
  genderIntentional: '',
  generalAssessmentId: '',
  generalAssessmentNumberOfRetries: null,
  hasAlbinism: false,
  hasInternet: false,
  hasLaptop: false,
  hasOthers: false,
  hasPassedTrackGeneralAssessment: false,
  hasPhone: false,
  hasStartedGeneralAssessment: false,
  hasStartedTrackGeneralAssessment: false,
  hasTime: false,
  isDisabled: false,
  isHearingImpaired: false,
  isMovementImpaired: false,
  isPassedGeneralAssessment: false,
  isPassedTrackAssessment: false,
  isVisionImpaired: false,
  lastname: '',
  learnerClass: '',
  learningTrack: '',
  maritalStatus: '',
  monthlyIncome: '',
  numberOfSubjects: '',
  phone: '',
  platform: '',
  reasonForDigitalSkills: '',
  residentialArea: '',
  retakeGeneralAssessmentAt: '',
  schoolCategory: '',
  schoolType: '',
  schoolName: '',
  score: '',
  stateOfOrigin: '',
  subjectCategory: '',
  subjectName: '',
  trackAssessmentNumberOfRetries: '',
  trackGeneralAssessmentId: '',
  trackList: '',
  username: '',
};
const Register = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  // const steps = ['StepOne', 'StepTwo', 'StepThree', 'StepFour', 'StepFive'];
  const { handleSubmit, errors, control, reset, register, getValues, setValue, watch } = useForm({
    defaultValues,
  });
  const [isRegistrationComplete, setIsRegistrationComplete] = useState(false);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleInputChange = (changeset) => {
    setValue((prevState) => ({
      ...prevState,
      ...changeset,
    }));
  };
  const handleFinish = () => {
    // Set the registration completion state to true
    setIsRegistrationComplete(true);
  };
  const stages = [
    { component: StepOne, name: 'StepOne' },
    { component: StepTwo, name: 'StepTwo' },
    { component: StepThree, name: 'StepThree' },
    { component: StepFour, name: 'StepFour' },
    { component: StepFive, name: 'StepFive' },
  ];
  const convertStagesToSteps = (stages) => {
    return stages.map((stage) => stage.name);
  };

  const steps = convertStagesToSteps(stages);
  const StageComponent = stages[activeStep].component;

  const isLastStep = activeStep === steps.length - 1;

  const dynamicText = `
    Welcome to the Digital for All Challenge 2.0 application stage. Kindly register by
    completing the various fields of this form before submitting your application. Ensure to
    provide correct information as applicants will be disqualified if found to have
    submitted false information. All asterisked (*) fields are compulsory and must be
    provided. Click on Submit Form when you are done. By filling this form, you consent
    Tech4Dev to use your data for Monitoring, Evaluation, Research and Learning purposes.
  `;

  function QontoStepIcon(props) {
    const { active, completed } = props;

    return (
      <div
        className={clsx(classes.root, {
          [classes.active]: active || completed,
        })}
      >
        {completed ? (
          <RadioButtonCheckedIcon className={classes.activeIcon} />
        ) : (
          <RadioButtonUncheckedIcon className={classes.inactiveIcon} />
        )}
      </div>
    );
  }

  return (
    <Container className={classes.container}>
      <Paper className={classes.paper}>
        {isRegistrationComplete ? (
          <FinalStep />
        ) : (
          <>
            <Box>
              <Header props={dynamicText} />
            </Box>
            <Box style={{ display: 'flex', flexDirection: 'column' }}>
              <Grid className={classes.stepper}>
                <Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Grid>
              <Box width="100%">
                <div style={{ paddingLeft: 20, paddingRight: 20 }}>
                  <StageComponent
                    control={control}
                    errors={errors}
                    register={register}
                    getValues={getValues}
                    setValue={setValue}
                    handleNext={handleNext}
                    handleBack={handleBack}
                    handleInputChange={handleInputChange}
                    watch={watch}
                  />

                  <Box
                    marginTop="20px"
                    paddingBottom="30px"
                    display="flex"
                    justifyContent={activeStep === 0 ? 'flex-end' : 'space-between'}
                    padding={3}
                  >
                    {activeStep > 0 && (
                      <Button
                        onClick={handleBack}
                        variant="outlined"
                        className={classes.textButton}
                      >
                        Previous
                      </Button>
                    )}
                    {!isLastStep && (
                      <Button onClick={handleNext} variant="contained" className={classes.button}>
                        Next
                      </Button>
                    )}
                    {isLastStep && (
                      <Button
                        variant="contained"
                        className={classes.button}
                        onClick={handleFinish}
                        // onClick={() => navigateToActualURL(PublicPaths.DFA_RESET_PASSWORD)}
                      >
                        Finish
                      </Button>
                    )}
                  </Box>
                </div>
              </Box>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default Register;
