import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Typography, Box, Paper } from '@material-ui/core';

import { spaces, fontSizes, fontWeight } from '../Css';

import audioIcon from 'assets/svgs/audio.svg';
import videoIcon from 'assets/svgs/video.svg';
import fileIcon from 'assets/svgs/file.svg';
import packageIcon from 'assets/svgs/package.svg';
import recycleIcon from 'assets/svgs/recycle.svg';
import screensIcon from 'assets/svgs/screens.svg';

const CourseInfoCard = ({
  courseDuration,
  pdfCount,
  audioCount,
  resourceCount,
  lifeTimeAccess,
  screens,
  fullWidth = false,
  paper,
}) => {
  const classes = useStyles();
  const width = fullWidth ? '100%' : '40%';

  const showInformation = (value) => {
    return typeof value === 'number' ? true : Boolean(value);
  };

  const getOnDemandVideoText = (durationInSeconds) => {
    const durationInHours = Math.floor(durationInSeconds / 3600);

    if (durationInHours <= 0) {
      return 'Less than an hour on-demand video';
    }
    return `More than ${durationInHours} hour${durationInHours === 1 ? '' : 's'} on-demand video`;
  };

  const courseInformations = [
    {
      show: showInformation(courseDuration),
      text: getOnDemandVideoText(courseDuration),
      icon: videoIcon,
    },
    { show: showInformation(pdfCount), text: `${pdfCount} pdf files`, icon: fileIcon },
    { show: showInformation(audioCount), text: `${audioCount} audio files`, icon: audioIcon },
    {
      show: showInformation(resourceCount),
      text: `${resourceCount} resource documents`,
      icon: packageIcon,
    },
    { show: showInformation(lifeTimeAccess), text: `Full lifetime access`, icon: recycleIcon },
    { show: showInformation(screens), text: `Access on mobile and TV`, icon: screensIcon },
  ];

  const renderCourseInformation = () => {
    return (
      <>
        <Box mb={8}>
          <Typography variant="body1" color="textPrimary" className={classes.title}>
            This course includes
          </Typography>
        </Box>
        <Box>
          {courseInformations.map((info) => {
            if (!info.show) return null;
            return (
              <Box mb={4} style={{ width }} display="inline-flex" alignItems="center">
                <img alt="course info icon" className={classes.icon} src={info.icon} />
                <Typography variant="body1" color="textPrimary">
                  {info.text}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </>
    );
  };

  return paper ? (
    <Paper elevation={0} className={classes.paper}>
      <Box p={10} className="content">
        {renderCourseInformation()}
      </Box>
    </Paper>
  ) : (
    renderCourseInformation()
  );
};

const useStyles = makeStyles({
  paper: {
    width: '100%',
    height: 'auto',
    '& .content': {
      width: '100%',
      height: '100%',
    },
  },
  title: {
    fontWeight: fontWeight.bold,
  },
  icon: {
    fontSize: fontSizes.large,
    marginRight: spaces.small,
  },
});

CourseInfoCard.propTypes = {
  courseDuration: PropTypes.number,
  pdfCount: PropTypes.number,
  audioCount: PropTypes.number,
  resourceCount: PropTypes.number,
  lifeTimeAccess: PropTypes.bool,
  screens: PropTypes.bool,
  certificate: PropTypes.bool,
};

export default React.memo(CourseInfoCard);
