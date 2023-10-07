import React from 'react';
import { Box, Typography, Grid, Paper, makeStyles } from '@material-ui/core';
import { colors, fontSizes, fontWeight } from '../../../Css';
import { ReactComponent as GroupIcon } from 'assets/svgs/Group.svg';

const useStyles = makeStyles(() => ({
  box: {
    borderRadius: '8px',
    border: '1px solid #E5E5EA',

    '& .heading': {
      color: colors.dark,
      fontWeight: fontWeight.bold,
      fontSize: fontSizes.large,
      marginBottom: '10px',
    },

    '& .student_no': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },

    '& .text': {
      marginLeft: 6,
      color: colors.dark,
      fontSize: fontSizes.medium,
    },

    '& .assignment': {
      padding: '4px 8px',
      borderRadius: '4px',
      color: colors.dark,
      fontSize: fontSizes.medium,
    },
    '& .assignment': {
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: fontSizes.medium,
    },
  },
}));

const LearningGroupDetailsCard = ({ name, student_no, assignment, Group, submitted }) => {
  const classes = useStyles({ bg: 'yellow' });
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sm={12}>
        <Box className={classes.box} component={Paper} elevation={0} p={8} fullWidth>
          <Typography variant="body2" gutterBottom>
            {Group}
          </Typography>
          <Typography className="heading">{name}</Typography>
          <Box className="student_no">
            <Box display="flex" alignItems="center">
              <GroupIcon />
              <Typography className="text">{student_no}</Typography>
            </Box>
            <Box
              className="assignment"
              style={{
                background: submitted ? '#0A8043' : '#E5E5EA',
                color: submitted ? '#ffffff' : '#000000',
              }}>
              {assignment}
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default LearningGroupDetailsCard;
