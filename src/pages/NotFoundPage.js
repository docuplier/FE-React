import React from 'react';
import { makeStyles, Typography, Box } from '@material-ui/core';
import { ReactComponent as Image } from 'assets/svgs/not-found.svg';
import { colors } from '../Css';

const NotFoundPage = () => {
  const classes = useStyles();
  return (
    <Box display="grid" justifyContent="center" alignItems="center" height="100vh" width="100vw">
      <Box>
        <Image className={classes.img} />
        <Typography variant="body1" className={classes.text}>
          We can’t find the page that you’re looking for
        </Typography>
      </Box>
    </Box>
  );
};

const useStyles = makeStyles((theme) => ({
  text: {
    textAlign: 'center',
    color: colors.grey,
    marginTop: 32,
  },
  img: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      height: '100%',
    },
  },
}));

export default NotFoundPage;
