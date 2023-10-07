import React from 'react';
import {
  Paper,
  makeStyles,
  Box,
  Typography,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from '@material-ui/core';
import { ReactComponent as FatUpArrowIcon } from 'assets/svgs/fatArrowUp.svg';
import { Controller, useForm } from 'react-hook-form';
import { borderRadius, colors } from '../../Css';
import welcomeIcon from 'assets/svgs/welcome.svg';
import DFAConfirmationDialog from 'reusables/DFAConfirmationDialog';
import PropTypes from 'prop-types';

const DFAIntermediateLevel = ({ onOk }) => {
  const courses = [
    {
      name: 'Cyber Security',
      value: 'Cyber Security',
      description:
        'Cybersecurity Learning Path is designed to empower learners with the expertise needed to defend against cyberattacks, secure networks, and contribute to the safety of the digital ecosystem. This learning path offers you a structured journey through all Cybersecurity Fundamentals, Network Security and many more  ',
    },
    {
      name: 'Product Design',
      value: 'Product Design',
      description:
        'Data Analysis Learning Path combines comprehensive theoretical knowledge with hands-on practice, allowing you to develop the expertise needed to excel in the world of data analysis. This learning path will empower you with Foundations of Data Analysis, Data Cleaning and Preparation, and many more  ',
    },
    {
      name: 'Product Management',
      value: 'Product Management',
      description:
        'Product Design Learning Path equips you with the tools and methodologies necessary to tackle design challenges and create user-centric solutions. This offers a comprehensive roadmap to design Thinking Fundamentals, user-centered design, prototyping and mockups, design tools and many more  ',
    },
    {
      name: 'Data Science',
      value: 'Data Science',
      description:
        'Product Management Learning Path combines in-depth knowledge with practical experience to navigate the complexities of product management. This learning path equips you with the skills in leading product teams, launch successful products with solid foundation in Market Research Product Strategy Product Development and Lifecycle Management and many more  ',
    },
    {
      name: 'Software Development',
      value: 'Software Development',
      description:
        'Software Development Learning Path equips you with programming skills in creating powerful software solution, acquiring a strong foundation in programming fundamentals, web Development, backend Development mobile app development and many more  ',
    },
  ];
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = React.useState(false);
  const { control, watch, handleSubmit } = useForm();
  const { course_value } = watch();

  const classes = useStyles();
  const onSubmit = (val) => {
    console.log(val);
  };
  return (
    <Paper className={classes.container}>
      <Grid container className={classes.banner} spacing={2}>
        <Grid item md={4}>
          <img src={welcomeIcon} alt="welcome icon" />
        </Grid>
        <Grid item md={8}>
          {/* <Box className="banner-desptn"> */}
          <Typography className="header">Welcome, to Youth - Intermediate Category</Typography>
          <Typography className="caption">
            {/* Congratulations on getting to this stage. We are happy to have you here. */}
          </Typography>
          {/* </Box> */}
        </Grid>
      </Grid>
      {/* </Box> */}
      <Box className={classes.bodyContainer}>
        <Typography className="body-text">
          Congratulations on getting to this stage. We are happy to have you here.
        </Typography>
        <Typography className="body-text">
          Great job on acing the assessment! Your dedication has paid off. To continue your learning
          journey, we invite you to take a brief follow-up assessment. This helps us tailor your
          experience and ensure your success. Don't worry, it won't affect your current progress.
        </Typography>
        <Typography className="body-text">
          Ready to showcase your growth? Select your path below to take the assessment:
        </Typography>
        {/* <RadioGroup className={classes.optionsWrapper}> */}
        <form>
          <Grid container spacing={10} style={{ marginTop: 4 }}>
            {courses?.map((props) => {
              return (
                <Grid item xs={12} key={courses.name}>
                  <Controller
                    name="course_value"
                    control={control}
                    render={({
                      ...fieldProps
                      // fieldState: { error }
                    }) => (
                      <>
                        <RadioGroup {...fieldProps} row aria-labelledby="course_value">
                          <Accordion
                            className="quest-option"
                            style={{
                              backgroundColor:
                                props.value === course_value ? '#EBFFF0' : 'transparent',
                            }}
                          >
                            <AccordionSummary expandIcon={<FatUpArrowIcon />}>
                              <FormControlLabel
                                control={
                                  <Radio
                                    checked={props.value === course_value}
                                    style={{
                                      color: props.value === course_value && '#3CAE5C',
                                      fontWeight: 700,
                                    }}
                                  />
                                }
                                label={
                                  <Typography className={classes.label}>{props?.name}</Typography>
                                }
                                value={props?.value}
                                style={{
                                  fontWeight: 700,
                                  color: props.value === course_value ? '#3CAE5C' : '#083A55',
                                  '& .MuiTypography-root': {
                                    fontWeight: 700,
                                  },
                                }}
                                className={classes.label}
                              />
                            </AccordionSummary>
                            <AccordionDetails style={{ width: '90%', paddingBottom: 20 }}>
                              <Typography>{props?.description}</Typography>
                            </AccordionDetails>
                          </Accordion>
                        </RadioGroup>
                      </>
                    )}
                  />
                </Grid>
              );
            })}
          </Grid>
        </form>
        <Button
          //   variant="contained"
          color={'success'}
          className={classes.btn}
          type="submit"
          onClick={() => {
            setIsConfirmationDialogOpen(true);
          }}
        >
          Proceed
        </Button>
        {/* </RadioGroup> */}
      </Box>
      {isConfirmationDialogOpen && (
        <DFAConfirmationDialog
          title={'Select Path'}
          description={
            "Are you sure you want to begin [Path]? Once you proceed to this learning path, you won't have access to other learning path."
          }
          okText={'Yes, Proceed'}
          cancelText={'Cancel'}
          onOk={onOk}
          open={isConfirmationDialogOpen}
          onClose={() => {
            setIsConfirmationDialogOpen(false);
          }}
        />
      )}
    </Paper>
  );
};

const useStyles = makeStyles({
  label: {
    fontWeight: 700,
  },
  btn: {
    borderRadius: borderRadius.small,
    marginTop: 20,
    paddingLeft: '2rem',
    paddingRight: '2rem',
    backgroundColor: '#3CAE5C',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: 700,
    '&:hover': {
      backgroundColor: '#5ACA75',
      borderColor: '#5ACA75',
      boxShadow: 'none',
    },
  },

  container: {
    padding: 14,
  },
  banner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem',
    paddingLeft: '3rem',
    paddingRight: '3rem',
    backgroundColor: '#EBFFF0',
    '& .banner-desptn': {
      marginLeft: '4rem',
    },
    '& .header': {
      fontWeight: 700,
      fontSize: '28px',
      color: '#272833',
    },
    '& .caption': {
      marginTop: '1rem',
      color: '#6B6C7E',
    },
  },
  bodyContainer: {
    '& .quest-option': {
      border: '1px solid #CDCED9',
      padding: 20,
      paddingTop: 0,
      paddingBottom: 0,
    },

    '& .body-text': {
      fontSize: '16px',
      marginTop: 20,
    },
  },
});
DFAIntermediateLevel.propTypes = {
  onOk: PropTypes.func,
};
export default DFAIntermediateLevel;
