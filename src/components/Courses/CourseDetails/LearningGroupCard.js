import React from 'react';
import { Box, Typography, Grid, Paper, Avatar, Divider, makeStyles } from '@material-ui/core';
import { colors, fontSizes, fontWeight } from '../../../Css';
import { ReactComponent as GroupIcon } from 'assets/svgs/Group.svg';
import { ReactComponent as GraduateIcon } from 'assets/svgs/people-man-graduate.svg';

const useStyles = makeStyles(() => ({
  box: {
    borderRadius: '8px',
    border: '1px solid #E5E5EA',
    cursor: 'pointer',

    '& .heading': {
      color: colors.dark,
      fontWeight: fontWeight.bold,
      fontSize: fontSizes.large,
    },

    '& .bottom_container': {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      marginTop: '15px',
    },

    '& .text': {
      marginLeft: 4,
      color: '#27833',
      fontSize: fontSizes.small,
      color: '#393A4A',
    },

    '& .avatar_text': {
      display: 'flex',
      alignItems: 'center',
      borderRadius: '4px',
      color: colors.dark,
      fontSize: fontSizes.medium,
    },

    '& .caption': {
      display: 'flex',
      flexDirection: 'column',
      marginLeft: '10px',
    },
  },
}));

const LearningGroupCard = ({
  description,
  date,
  createdBy,
  groupNo,
  studentNo,
  title,
  onClick,
}) => {
  const classes = useStyles({ bg: 'yellow' });
  return (
    <Grid container spacing={6} onClick={onClick}>
      <Grid item xs={12} sm={12}>
        <Box className={classes.box} component={Paper} elevation={0} p={8} fullWidth>
          <Typography className="heading"> {title}</Typography>
          <Typography
            variant="body2"
            color="#6B6C7E"
            dangerouslySetInnerHTML={{ __html: description }}></Typography>
          <Box className="bottom_container">
            <Box className="avatar_text">
              <Avatar src="">Az</Avatar>
              <Box className="caption">
                <Typography style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography style={{ color: '#6B6C7E', fontSize: '12px' }}>Created</Typography>
                  <Divider orientation="vertical" variant="middle" flexItem />
                  <Typography style={{ color: '#6B6C7E', fontSize: '12px' }}> {date}</Typography>
                </Typography>
                <Typography style={{ color: '#393A4A', fontSize: '14px' }}>{createdBy}</Typography>
              </Box>
            </Box>
            <Box display="flex" alignItems="center">
              <Box display="flex" alignItems="center" marginRight="10px">
                <GroupIcon />
                <Typography className="text">{groupNo}</Typography>
                <Typography className="text">Groups</Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <GraduateIcon />
                <Typography className="text">{studentNo}</Typography>
                <Typography className="text">Students</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default LearningGroupCard;
