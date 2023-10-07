import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import NavigationBar from 'reusables/NavigationBar';
import { ReactComponent as ComingSoon } from '../assets/svgs/ComingSoon.svg';
import { fontSizes, fontWeight } from '../Css';

const Dashboard = () => {
  const classes = useStyles();
  return (
    <>
      <NavigationBar />
      <div className={classes.main}>
        <ComingSoon />
        <Typography variant="p">Coming Soon</Typography>
      </div>
    </>
  );
};
export default Dashboard;

const useStyles = makeStyles(() => ({
  main: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    color: '#BDBDBD',
    fontSize: fontSizes.largeTitle,
    fontWeight: fontWeight.medium,
    alignItems: 'center',
    marginTop: '25vh',
  },
}));
