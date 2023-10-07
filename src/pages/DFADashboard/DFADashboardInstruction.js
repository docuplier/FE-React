import { Typography } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { fontWeight } from '../../Css';

export const renderAssessmentOverview = (duration, format, goal) => (
  <>
    <Typography>Assessment Overview:</Typography>
    <ul style={{ marginTop: '0' }}>
      <li>
        <strong>Duration:</strong> {duration}
      </li>
      <li>
        <strong>Format:</strong> {format}
      </li>
      <li>
        <strong>Goal:</strong> {goal}
      </li>
    </ul>
  </>
);

export const renderGeneralGuidelines = () => (
  <>
    <Typography>Guidelines:</Typography>
    <ol style={{ marginTop: '0' }}>
      <li>
        <strong>Quiet Place:</strong> Find a distraction-free environment.
      </li>
      <li>
        <strong>Stable Internet:</strong> Ensure a stable internet connection.
      </li>
      <li>
        <strong>Answer Honestly:</strong> Do your best, and please don't cheat.
      </li>
      <li>
        <strong>No Tab Switching:</strong> Stay on this page.
      </li>
      <li>
        <strong>Review Answers:</strong> Double-check before submitting.
      </li>
    </ol>
  </>
);

const DFADashboardInstruction = ({ greeting, title, duration, questionType, assessment, note }) => {
  const classes = useStyles();

  return (
    <>
      <Typography className={classes.headerText}>{greeting}</Typography>
      <Typography className={classes.text}>{title}</Typography>
      {renderAssessmentOverview(duration, questionType, assessment)}
      {renderGeneralGuidelines()}
      <Typography className={classes.headerText}>Note:</Typography>
      <Typography>{note}</Typography>
    </>
  );
};

DFADashboardInstruction.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  icon: PropTypes.node,
  iconClassName: PropTypes.string,
};

export default DFADashboardInstruction;

const useStyles = makeStyles(() => ({
  text: {
    marginTop: '5px',
    marginBottom: '10px',
  },
  headerText: {
    marginTop: '4px',
    fontWeight: fontWeight.bold,
  },
}));
