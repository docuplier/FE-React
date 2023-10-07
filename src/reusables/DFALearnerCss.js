import { colors, fontSizes, fontWeight } from '../Css';
import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  container: {
    color: '#393A4A',
    '& .title': {
      color: colors.dark,
      fontWeight: fontWeight.bold,
      fontSize: fontSizes.xxlarge,
    },
    '& .caption': {
      color: colors.grey,
      fontWeight: fontWeight.medium,
      fontSize: fontSizes.large,
      marginBottom: 16,
    },
    '& .name-container': {
      display: 'flex',
    },
    '& .avatar': {
      marginRight: 16,
    },
  },
  container2: {
    background: 'linear-gradient(0deg, #EBFFF0, #EBFFF0)',
    border: '1px solid #3CAE5C',
    padding: 24,
    borderRadius: 8,
    marginBottom: 16,
    '& .text': {
      color: colors.dark,
      fontWeight: fontWeight.medium,
      fontSize: fontSizes.large,
      marginBottom: 16,
    },
  },
  badge: {
    '& .MuiBadge-anchorOriginBottomRightRectangle': {
      right: 20,
      bottom: 10,
      postition: 'relative',
    },
  },
  starIcon: {
    width: 20,
    position: 'absolute',
  },
  button: {
    fontWeight: fontWeight.medium,
    color: '#267939',
    backgroundColor: '#EBFFF0',
    '&:hover': {
      backgroundColor: '#EBFFF0',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: fontSizes.medium,
    },
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  downloadButton: {
    background: '#3CAE5C',
  },
}));
