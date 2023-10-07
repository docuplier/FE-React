import { Box, Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { colors, fontSizes, fontWeight, spaces } from '../../../Css';
import React from 'react';

const Empty = ({ onClick }) => {
  const classes = useStyles();
  return (
    <Box className={classes.wrapper}>
      <Typography className="header-text">Empty</Typography>
      <Typography className="header-desc">You currently have no data registered.</Typography>
      <Button variant="outlined" color="primary" onClick={onClick}>
        Click here to add
      </Button>
    </Box>
  );
};

const useStyles = makeStyles(() => ({
  wrapper: {
    maxWidth: 800,
    margin: 'auto',
    height: 170,
    background: '#F7F8F9',
    textAlign: 'center',
    '& .header-text': {
      fontWeight: fontWeight.medium,
      fontSize: fontSizes.large,
      color: colors.black,
      paddingTop: spaces.large,
    },
    '& .header-desc': {
      fontWeight: fontWeight.regular,
      fontSize: fontSizes.medium,
      color: colors.grey,
      paddingBottom: spaces.medium,
    },
  },
}));
export default Empty;
