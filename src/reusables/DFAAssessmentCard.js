import React from 'react';
import PropTypes from 'prop-types';
import { fontWeight, fontSizes, colors } from '../Css';
import LoadingButton from './LoadingButton';
import { Dialog, Box, Typography, makeStyles, Grid, Paper } from '@material-ui/core';
import HeaderItems from 'assets/svgs/headerItems.svg';

const DFAAssessmentCard = ({ title, children, logo, md }) => {
  const classes = useStyles();

  return (
    <Grid container className={classes.container}>
      <Grid item md={md ? md : 12}>
        <Paper>
          <Box className={classes.backgroundHeader}>
            <Typography className="title" variant="body1">
              {title}
            </Typography>
          </Box>

          <Box>{children}</Box>
        </Paper>
      </Grid>
    </Grid>
  );
};
const useStyles = makeStyles((theme) => ({
  bodyContainer: {
    padding: '5rem',
    paddingTop: '4rem',
  },
  container: {
    paddingBottom: '3rem',
    display: 'flex',
    justifyContent: 'center',
    '& .MuiDialog-paper ': {
      display: 'flex',
      justifyContent: 'center',
      // padding: 0,
      paddingBottom: '3rem',
      width: '100%',
    },
    '& .btnText1': {
      backgroundColor: '#3CAE5C',
      marginBottom: '1rem',
      color: colors.white,
    },
    '& .btnText2': {
      backgroundColor: '#EBFFF0',
      color: '#15692A',
      paddingLeft: '3.2rem',
      paddingRight: '3.2rem',
    },
  },

  backgroundHeader: {
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
    '& .title': {
      fontWeight: fontWeight.bold,
      color: colors.white,
      fontSizes: fontSizes.xlarge,
    },
  },
}));

DFAAssessmentCard.propTypes = {
  ...Dialog.propTypes,
  btnText1Props: PropTypes.shape({
    ...LoadingButton.propTypes,
  }),
  btnText2Props: PropTypes.shape({
    ...LoadingButton.propTypes,
  }),
  okText: PropTypes.node,
  title: PropTypes.string,
  children: PropTypes.node,
};
export default DFAAssessmentCard;
