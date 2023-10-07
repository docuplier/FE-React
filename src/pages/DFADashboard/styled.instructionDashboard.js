import { makeStyles } from '@material-ui/core/styles';
import { fontSizes, fontWeight } from '../../Css';
import { green } from '@material-ui/core/colors';
import HeaderItems from 'assets/svgs/headerItems.svg';

export const useStyles = makeStyles((theme) => ({
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
  text: {
    marginTop: '5px',
    marginBottom: '10px',
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
