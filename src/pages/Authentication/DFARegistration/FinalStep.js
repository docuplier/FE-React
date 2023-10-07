import React from 'react';
import { Container, Grid, Typography, makeStyles } from '@material-ui/core';
import CheckMark from 'assets/gif/checkMark.gif';
import { fontSizes } from '../../../Css';

const FinalStep = () => {
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      {/* <Paper> */}
      <Grid container>
        <Grid item xs={12}>
          <img src={CheckMark} alt="check-mark" style={{ width: '40%' }} />
        </Grid>
        <Grid item xs={12} className={classes.field}>
          <Typography variant="h6" component="div">
            Registration Completed Successfully
          </Typography>
          <Typography variant="body1" className={classes.highlight}>
            Check your email to complete your onboarding
          </Typography>
        </Grid>
      </Grid>
      {/* </Paper> */}
    </Container>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '70vh',
    textAlign: 'center',
    // width: '622px',
    boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.10)',
  },
  field: {
    marginTop: theme.spacing(2),
    textAlign: 'center',
    padding: theme.spacing(6),
    color: 'var(--Header, #1D2733)',
    fontSize: fontSizes.title,
  },
  highlight: {
    color: 'var(--TextDFA, #083A55)',
    fontSize: fontSizes.large,
  },
}));

export default FinalStep;
