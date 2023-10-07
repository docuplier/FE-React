import { makeStyles } from '@material-ui/styles';
import { colors, fontSizes, fontWeight } from '../../Css';
import HeaderItems from 'assets/svgs/headerItems.svg';
import { green } from '@material-ui/core/colors';

export const useStyles = makeStyles((theme) => ({
  description: {
    width: '100%',
    height: 'auto',
    display: 'grid',
    placeItems: 'center',
    '& .box': {
      width: '100%',
      height: 77,
      color: '#fff',
      background: 'var(--PrimaryGreenDFA, #3CAE5C)',
      backgroundImage: `url(${HeaderItems})`,
      backgroundSize: 'cover',
      [theme.breakpoints.down('xs')]: {
        width: '90%',
        fontSize: fontSizes.regular,
      },
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
  headerText: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    color: '#267939',
  },
  wrapper: {
    padding: theme.spacing(28),
    borderRadius: theme.spacing(1),
    width: '65%',
    textAlign: 'center',
    [theme.breakpoints.down('xs')]: {
      textAlign: 'center',
      padding: theme.spacing(3),
    },
  },
  title: {
    padding: theme.spacing(6),
    fontSize: fontSizes.xlarge,
    fontWeight: fontWeight.bold,
    color: 'var(--TextDFA, #083A55)',
    [theme.breakpoints.down('xs')]: {
      fontSize: fontSizes.large,
    },
  },
  text: {
    padding: theme.spacing(6),
    fontSize: fontSizes.large,
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',

    fontWeight: fontWeight.regular,
    [theme.breakpoints.down('xs')]: {
      fontSize: fontSizes.medium,
    },
  },
  button: {
    marginTop: 12,
    fontSize: fontSizes.large,
    fontWeight: fontWeight.medium,
    color: '#fff',
    backgroundColor: '#3CAE5C',
    '&:hover': {
      backgroundColor: green[700],
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: fontSizes.medium,
      marginTop: 12,
    },
  },
  button1: {
    marginTop: 24,
    fontSize: fontSizes.large,
    fontWeight: fontWeight.medium,
    color: green[700],
    paddingLeft: 50,
    paddingRight: 50,

    backgroundColor: '#EBFFF0',
    '&:hover': {
      backgroundColor: green[500],
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: fontSizes.medium,
      marginTop: 12,
      marginBottom: 12,
    },
  },
  failWrapper: {
    width: '80%',
    padding: theme.spacing(12),
    borderRadius: theme.spacing(1),
    textAlign: 'center',
    [theme.breakpoints.down('xs')]: {
      width: '80%',
      textAlign: 'center',
      padding: theme.spacing(3),
    },
  },
  mark: {
    fontSize: '40px',
    fontWeight: fontWeight.bold,
    color: colors.textError,
  },
  failBox: {
    width: '100%',
    padding: theme.spacing(24),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'var(--general-light-1-hover-sec-btn, #F7F8F9)',
    [theme.breakpoints.down('xs')]: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      textAlign: 'center',
      padding: theme.spacing(3),
    },
  },
  failHeaderText: {
    padding: theme.spacing(6),
    fontSize: fontSizes.xlarge,
    fontWeight: fontWeight.bold,
    color: 'var(--TextDFA, #083A55)',
    [theme.breakpoints.down('xs')]: {
      fontSize: fontSizes.large,
    },
  },
  failText: {
    marginBottom: '30px',
    // padding: theme.spacing(2),
    fontSize: fontSizes.large,
    fontWeight: fontWeight.regular,
    [theme.breakpoints.down('xs')]: {
      fontSize: fontSizes.medium,
    },
  },
  failSecondText: {
    padding: theme.spacing(2),
    fontSize: fontSizes.large,
    fontWeight: fontWeight.regular,
    [theme.breakpoints.down('xs')]: {
      fontSize: fontSizes.medium,
    },
  },
  failButton: {
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
