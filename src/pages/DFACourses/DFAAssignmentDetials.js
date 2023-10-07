import DFAAssignmentDetailLayout from 'Layout/DFALayout/DFAAssignmentDetailLayout';
import React from 'react';
import { Box, Typography, makeStyles, Paper } from '@material-ui/core';
import DFANavigationBar from 'reusables/DFANavigationBar';
import { useParams, useHistory } from 'react-router-dom';
import { PrivatePaths } from 'routes';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { fontSizes, colors, fontWeight, spaces } from '../../Css';
import DFAFooter from 'reusables/DFAFooter';

const DFAAssignmentDetials = () => {
  const history = useHistory();
  const classes = useStyles();
  const { courseId, assignmentId } = useParams();

  const links = [
    { title: 'Home', to: '/' },
    { title: 'Introduction to Graphics', to: `${PrivatePaths.COURSES}/${courseId}` },
    {
      title: `Assignment`,
      to: `${PrivatePaths.DFA_COURSE_DETAILS}/${courseId}/assignments/${assignmentId}`,
    },
  ];

  return (
    <>
      {/* <DFANavigationBar /> */}
      <DFAAssignmentDetailLayout links={links}>
        <Box color={colors.grey}>
          <Box
            className={classes.backBox}
            onClick={() =>
              history.push(
                `${PrivatePaths.DFA_COURSE_DETAILS}/${courseId}/assignments/${assignmentId}`,
              )
            }
          >
            <ArrowBackIosIcon fontSize="small" />
            <Typography className="backText">back to assignment details</Typography>
          </Box>
          <Paper elevation={4}>
            <Box className={classes.details}>
              <Typography className="heading">Details</Typography>
              <Typography className="subheading">23 minutes - reading time</Typography>
            </Box>
            <hr style={{ margin: 0 }} />
            <Box className={classes.description}>
              <Typography className="descText">
                Professor Emeka Chucks of Delta State Business School contrasts traditional
                approaches to branding - where brands are a visual identity and a promise to
                customers - to brands as a customer experience delivered by the entire organisation.
                The course offers a brand workout for your own brands, as well as guest videos from
                leading branding professionals.
              </Typography>
              <Typography className="descText">
                The aim of the course is to change the conception of brands as being an
                organisation's visual identity (e.g., logo) and image (customers' brand
                associations) to an experience along "moments-that-matter" along the customer
                journey and, therefore, delivered by people across the entire organisation. Brands
                are thus not only an external promise to customers, but a means of executing
                business strategy via internal brand-led behaviour and culture change.
              </Typography>
              <Typography className="descText">
                You will learn and practice the following skills:
              </Typography>
              <Typography className="descText">
                1. How to build brands from a broad organisational perspective 2. How to lead
                brand-led culture change with human resource practices at the core (i.e., brand as a
                lever and not just an outcome) 3. How to build brands in multi-brand companies,
                across cultures and geographies 4. How to measure brand health in new ways, that is,
                internally in addition to externally 5. How to value and capture returns to brands
                across the organisation - introducing the new concept of employee-based brand equity
                - and how this is different from the valuation of brands as intangible assets.
              </Typography>
            </Box>
          </Paper>
        </Box>
      </DFAAssignmentDetailLayout>
      <DFAFooter />
    </>
  );
};

const useStyles = makeStyles(() => ({
  backBox: {
    display: 'flex',
    color: '#287D3C',
    cursor: 'pointer',
    '& .backText': {
      fontSize: fontSizes.medium,
    },
  },
  details: {
    borderRadius: 0,
    padding: spaces.small,
    marginTop: spaces.medium,
    background: colors.xLightGrey,
    '& .heading': {
      fontWeight: fontWeight.bold,
      fontSize: fontSizes.large,
    },
    '& .subheading': {
      fontSize: fontSizes.small,
      color: colors.grey,
    },
  },
  description: {
    padding: spaces.medium,
    paddingBottom: spaces.large,
    '& .descText': {
      fontSize: fontSizes.small,
      marginTop: spaces.medium,
    },
  },
}));

export default DFAAssignmentDetials;
