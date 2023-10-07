import { makeStyles, withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import { StepConnector } from '@material-ui/core';
import BackgroundImage from 'assets/svgs/group-folders.svg';

export const useStyles = makeStyles((theme) => ({
  container: {
    padding: '40px 20px',
    display: 'flex',
    backgroundImage: `url(${BackgroundImage})`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paper: {
    justifyContent: 'center',
    width: '822px',
  },
  content: {
    margin: theme.spacing(40, 0, 40, 0),
    borderRadius: '8px 8px 0px 0px',
    // width: '822px',
    width: '100%', // Adjust to your desired maximum width
    maxWidth: '1000px', // Maximum width for responsiveness
  },
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  stepper: {
    width: '100%',
    // maxWidth: '1000px',
    '& .MuiStepper-root': {
      padding: '24px 0 24px 0',
    },
  },
  activeIcon: {
    color: '#3CAE5C', // Set the color to match the active line color
  },

  inactiveIcon: {
    color: theme.palette.grey['400'], // You can set a different color for the inactive state
  },
  button: {
    color: '#fff',
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  textButton: {
    color: '#267939',
    backgroundColor: '#EBFFF0',
    '&:hover': {
      backgroundColor: green[200],
    },
  },
}));

export const QontoConnector = withStyles({
  alternativeLabel: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  active: {
    color: '#3CAE5C',
    '& $line': {
      borderColor: '#3CAE5C',
    },
  },
  completed: {
    '& $line': {
      borderColor: '#3CAE5C',
    },
  },
  line: {
    borderColor: '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
  },
})(StepConnector);
