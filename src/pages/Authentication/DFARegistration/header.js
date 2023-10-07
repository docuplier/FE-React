import React from 'react';
import { Box, Typography, makeStyles } from '@material-ui/core';
import FloppyDisk from 'assets/svgs/confettiItems.svg';
import { fontSizes, fontWeight, colors } from '../../../Css.js';

function Header({ props }) {
  const classes = useStyles();

  return (
    <div>
      <Box className={classes.boxStyle}>
        <div>
          <Typography className={classes.header}>Registration</Typography>
          <Typography className={classes.instruction}>INSTRUCTION</Typography>
        </div>
        <div>
          <Typography className={classes.title}>{props}</Typography>
        </div>
      </Box>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  boxStyle: {
    height: '282px',
    backgroundColor: '#3CAE5C',
    color: '#FFFFFF',
    borderRadius: '8px 8px 0px 0px',
    backgroundImage: `url(${FloppyDisk})`, // Set the background image
    backgroundSize: 'cover', // You can adjust this property to fit your design
    [theme.breakpoints.down('sm')]: {
      height: 'auto', // Reset the height for smaller screens
      padding: '20px',
    },
  },
  header: {
    color: colors.white,
    fontSize: fontSizes.title,
    fontFamily: 'Raleway, sans-serif',
    fontWeight: fontWeight.bold,
    marginLeft: '18px',
    paddingTop: '50px',
    [theme.breakpoints.down('sm')]: {
      fontSize: fontSizes.large, // Reduce font size for smaller screens
      fontWeight: fontWeight.medium, // Reduce font weight for smaller screens
      marginLeft: 0, // Remove left margin
      paddingTop: '0', // Remove top padding
    },
  },
  instruction: {
    fontSize: fontSizes.large,
    fontWeight: fontWeight.bold,
    fontFamily: 'Ubuntu, sans-serif',
    marginLeft: '18px',
    marginTop: '8px',
    [theme.breakpoints.down('sm')]: {
      fontSize: fontSizes.medium, // Reduce font size for smaller screens
      marginLeft: 0, // Remove left margin
      marginTop: '4px', // Adjust top margin
    },
  },
  title: {
    color: colors.white,
    fontSize: fontSizes.large,
    fontFamily: 'Ubuntu, sans-serif',
    fontWeight: fontWeight.regular,
    marginLeft: '18px',
    marginTop: '8px',
    [theme.breakpoints.down('sm')]: {
      fontSize: fontSizes.medium, // Reduce font size for smaller screens
      fontWeight: fontWeight.light, // Reduce font weight for smaller screens
      marginLeft: 0, // Remove left margin
      marginTop: '4px', // Adjust top margin
    },
  },
}));

export default Header;
