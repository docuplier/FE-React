import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Box, Typography } from '@material-ui/core';

import { fontWeight, fontSizes, colors, spaces } from '../../../Css';
import AccordionCourseContent from './AccordionCourseContent';

function AddLectures() {
  const classes = useStyles();

  const renderPublishStatus = () => {
    return (
      <Box display="flex">
        <Box display="flex" alignItems="center">
          <Box mr={5} className={classes.statusBox} style={{ background: '#5ACA75' }}></Box>
          <Typography>Published</Typography>
        </Box>
        <Box display="flex" alignItems="center" ml={20}>
          <Box mr={5} className={classes.statusBox} style={{ background: '#A7A9BC' }}></Box>
          <Typography>Not Published</Typography>
        </Box>
      </Box>
    );
  };

  return (
    <React.Fragment>
      <Box className={classes.container} mb={20}>
        <Typography className="header">Add lectures</Typography>
        <Typography variant="body1" color="textPrimary">
          The Prunedge Smart Toolbar groups all actions by scope into 4 categories. It's an
          intuitive toolbar where every feature is easy to find and your most used ones are there
          for you.
        </Typography>
      </Box>
      {renderPublishStatus()}
      <Box mt={20}>
        <AccordionCourseContent />
      </Box>
    </React.Fragment>
  );
}

const useStyles = makeStyles({
  container: {
    maxWidth: 800,
    '& .header': {
      fontWeight: fontWeight.medium,
      fontSize: fontSizes.title,
      color: colors.black,
      padding: 0,
      marginBottom: spaces.small,
    },
  },
  form: {
    '& > * > *': {
      marginBottom: spaces.medium,
    },
  },
  statusBox: {
    height: 15,
    width: 15,
    borderRadius: 3,
  },
});

export default AddLectures;
