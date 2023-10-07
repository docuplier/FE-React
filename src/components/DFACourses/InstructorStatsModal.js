import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, Box, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';

import DetailProfileCard from 'reusables/DetailProfileCard';
import Empty from 'reusables/Empty';
import CourseDescriptionCard from 'reusables/CourseDescriptionCard';
import { colors, spaces } from '../../Css';
import LoadingView from 'reusables/LoadingView';
import defaultCourseImg from 'assets/svgs/default-course-bg.jpeg';

const InstructorStatsModal = ({ open, onClose, profileInfo, courseData, loading }) => {
  const classes = useStyles();

  const renderEmptyState = () => {
    return (
      <Empty
        title={'No Courses'}
        description={'No Courses currently being taken by this instructor.'}
      ></Empty>
    );
  };

  return (
    <Dialog
      onClose={onClose}
      aria-labelledby="simple-dialog-title"
      open={open}
      maxWidth={600}
      classes={{ root: classes.root }}
    >
      <LoadingView isLoading={loading}>
        <Box className={classes.wrapper}>
          <Box className={classes.banner} px={18}>
            <Box display="flex" justifyContent="space-between">
              <DetailProfileCard isStaff {...profileInfo} />
              <CloseIcon className="icon" onClick={onClose} />
            </Box>
          </Box>
          <Box px={18} pt={5}>
            <Typography variant="h6" color="textPrimary">
              Courses by instructor
            </Typography>
          </Box>
        </Box>
        <Box px={20} position="relative">
          <Box style={{ maxWidth: '600px' }} pb={30}>
            {Boolean(courseData?.length)
              ? courseData?.map((course, index) => (
                  <CourseDescriptionCard
                    key={index}
                    imgSrc={course?.banner || defaultCourseImg}
                    courseCode={course?.code}
                    title={course?.title}
                    description={course?.description}
                    duration={course?.totalDuration}
                    unitCount={course?.unit}
                  />
                ))
              : renderEmptyState()}
          </Box>
        </Box>
      </LoadingView>
    </Dialog>
  );
};

const useStyles = makeStyles(() => ({
  root: {
    position: 'relative',
    '& .MuiDialog-paper': {
      padding: 0,
    },
  },
  wrapper: {
    position: 'sticky',
    zIndex: '100',
    top: 0,
    background: '#fff',
  },
  banner: {
    background: 'linear-gradient(100.09deg, #267939 28.96%, #3EBB5A 147.29%)',
    '& .icon': {
      color: colors.white,
      marginTop: spaces.medium,
      cursor: 'pointer',
    },
  },
}));

InstructorStatsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  profileInfo: PropTypes.shape({
    ...DetailProfileCard.propTypes,
  }),
  courseData: PropTypes.shape({
    ...CourseDescriptionCard.propTypes,
  }),
};

export default InstructorStatsModal;
