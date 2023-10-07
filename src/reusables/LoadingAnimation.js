import React from 'react';
import { Box, makeStyles } from '@material-ui/core';
import logo from 'assets/svgs/dlms-logo.svg';

const LoadingAnimation = () => {
  const classes = useStyles();
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100%"
      width="100%"
      minHeight="100vh">
      <img src={logo} alt="logo" className={classes.logo} />
    </Box>
  );
};

const useStyles = makeStyles({
  logo: {
    animationDuration: '1.5s',
    animationFillMode: 'both',
    animationIterationCount: 'infinite',
    animationName: '$logo',
    animationTimingFunction: 'ease-in-out',
  },
  '@keyframes logo': {
    '0%': {
      opacity: 0.5,
      transform: 'scale(0.9)',
    },
    '100%': {
      opacity: 1,
      transform: 'scale(1)',
    },
  },
});

export default React.memo(LoadingAnimation);
