import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button } from '@material-ui/core';

import { fontWeight, fontSizes } from '../../../Css.js';

const EmptyList = ({ caption, onClick }) => {
  const classes = useStyles();
  return (
    <div className={classes.empty}>
      <Typography align="center" className="empty-title" color="textPrimary">
        Empty
      </Typography>
      <Typography align="center" variant="body2" color="textSecondary">
        {caption}
      </Typography>
      <Button onClick={onClick} className="add-btn" size="medium" color="primary">
        Click here to add
      </Button>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  empty: {
    padding: theme.spacing(20),
    backgroundColor: '#F7F8F9',
    '& .empty-title': {
      fontWeight: fontWeight.medium,
      fontSize: fontSizes.large,
    },
    '& > :nth-child(2)': {
      marginBottom: theme.spacing(5),
    },
    '& .add-btn': {
      display: 'flex',
      margin: '0 auto 0',
    },
  },
}));

export default EmptyList;
