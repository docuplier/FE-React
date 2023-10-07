import React from 'react';
import PropTypes from 'prop-types';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import RoomOutlinedIcon from '@material-ui/icons/RoomOutlined';
import { makeStyles } from '@material-ui/styles';
import {
  Box,
  Card,
  CardMedia,
  Divider,
  Typography,
  CardContent,
  useTheme,
  useMediaQuery,
} from '@material-ui/core';

import { colors, spaces } from '../Css';
import { ReactComponent as Log } from 'assets/svgs/instructor-log.svg';
import { ReactComponent as Completed } from 'assets/svgs/completed-icon.svg';
import { ReactComponent as Completion } from 'assets/svgs/completion-icon.svg';
import { ReactComponent as Learner } from 'assets/svgs/learners-icon.svg';
import { ReactComponent as Ongoing } from 'assets/svgs/ongoing-icon.svg';
import Avatar from 'assets/svgs/avatar.png';
import { fontWeight } from '../Css';

function DetailProfileCard({ editable = false, onClick, user, courseInfo, isStaff = false }) {
  const theme = useTheme();

  const classes = useStyles({ isSmScreen: useMediaQuery(theme.breakpoints.down('sm')) });
  const getFooterContent = (content) => {
    switch (content) {
      case 'learner':
        return (
          <Box display="flex" alignItems="center">
            <Box display="flex" justifyContent="flex-start" alignItems="center" mr={5}>
              <Log className={classes.icons} />
              <Typography variant="subtitle2" color="textSecondary">
                <Typography color="textPrimary">
                  {courseInfo.enrolled} <br />
                </Typography>
                Enrolled Courses
              </Typography>
            </Box>
            <Box display="flex" justifyContent="flex-start" alignItems="center" mr={5}>
              <Ongoing className={classes.icons} />
              <Typography variant="subtitle2" color="textSecondary">
                <Typography color="textPrimary">
                  {courseInfo.ongoing} <br />
                </Typography>
                Ongoing Courses
              </Typography>
            </Box>
            <Box display="flex" justifyContent="flex-start" alignItems="center" mr={5}>
              <Completed className={classes.icons} />
              <Typography variant="subtitle2" color="textSecondary">
                <Typography color="textPrimary">
                  {courseInfo.completed} <br />
                </Typography>
                Completed
              </Typography>
            </Box>
          </Box>
        );

      case 'instructor':
        return (
          <Box display="flex" alignItems="center">
            <Box display="flex" justifyContent="flex-start" alignItems="center" mr={5}>
              <Log className={classes.icons} />
              <Typography variant="subtitle2" color="textSecondary">
                <Typography color="textPrimary">
                  {courseInfo.total} <br />
                </Typography>
                Total Courses
              </Typography>
            </Box>
            <Box display="flex" justifyContent="flex-start" alignItems="center" mr={5}>
              <Learner className={classes.icons} />
              <Typography variant="subtitle2" color="textSecondary">
                <Typography color="textPrimary">
                  {courseInfo.learner} <br />
                </Typography>
                Learners
              </Typography>
            </Box>
            <Box display="flex" justifyContent="flex-start" alignItems="center" mr={5}>
              <Completion className={classes.icons} />
              <Typography variant="subtitle2" color="textSecondary">
                <Typography color="textPrimary">
                  {courseInfo.completion} <br />
                </Typography>
                Completion
              </Typography>
            </Box>
          </Box>
        );

      default:
        break;
    }
  };

  const renderFooter = () => {
    return (
      <>
        <Divider className={classes.divider} />
        {(courseInfo.enrolled !== undefined && getFooterContent('learner')) ||
          (courseInfo.total !== undefined && getFooterContent('instructor'))}
      </>
    );
  };

  return (
    <Card className={classes.card} elevation={0}>
      <CardMedia image={user?.imageSrc || Avatar} className={classes.avatar} />
      <CardContent classes={{ root: classes.cardContent }}>
        <Box className={user?.age && classes.noCourseInfoSpacing}>
          <Typography
            variant="h5"
            style={{
              color: !!courseInfo ? colors.primary : colors.white,
              fontWeight: fontWeight.bold,
            }}
            className={!user?.id && classes.noIdPadding}>
            {user?.name} {editable && <CreateOutlinedIcon cursor="pointer" onClick={onClick} />}
          </Typography>
          <Box style={{ color: !!courseInfo ? colors.grey : colors.secondaryLightGrey }}>
            <Typography variant="subtitle2">
              ID: {isStaff ? user?.staffId || 'Nill' : user?.id || 'Nil'}{' '}
              {!!user?.department && ` • Department: ${user?.department || 'Nil'}`}
              {!!user?.level && ` • Level: ${user?.level}`}
            </Typography>
            <Typography variant="subtitle2">
              {user?.gender} {!!user?.age && `| ${user?.age} years`}
            </Typography>
            {user?.session && (
              <Box>
                <Typography variant="subtitle2">
                  Session: {user?.session} • Semester: {user?.semester}
                </Typography>
                <Typography variant="subtitle2">
                  <RoomOutlinedIcon classes={{ root: classes.icon }} />{' '}
                  {user?.location || 'Not Avalaible'}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
        {courseInfo && renderFooter()}
      </CardContent>
    </Card>
  );
}

const useStyles = makeStyles(() => ({
  card: (props) => ({
    display: props.isSmScreen ? 'block' : 'flex',
    justifyContent: 'flex-start',
    width: '100%',
    boxSizing: 'border-box',
    padding: spaces.medium,
    background: 'transparent',
    marginLeft: '-15px',
    alignItems: 'center',
  }),
  cardContent: {
    padding: 0,
  },
  avatar: {
    width: 132,
    height: 132,
    border: 'solid 5px #fff ',
    borderRadius: '8px',
    backgroundColor: colors.grey,
    marginRight: spaces.large,
  },
  icon: {
    marginLeft: '-5px',
    fontSize: '1rem',
  },
  divider: {
    margin: '10px 0',
    width: '130%',
    marginRight: 50,
  },
  icons: {
    marginRight: spaces.medium,
  },
  noCourseInfoSpacing: {
    '& > *': {
      paddingTop: 10,
    },
  },
  noIdPadding: {
    paddingTop: spaces.medium,
  },
}));

DetailProfileCard.propTypes = {
  profileImgSrc: PropTypes.string,
  user: PropTypes.shape({
    name: PropTypes.string,
    age: PropTypes.string,
    department: PropTypes.string,
    level: PropTypes.string,
    gender: PropTypes.string,
    semester: PropTypes.string,
    location: PropTypes.string,
    session: PropTypes.string,
    id: PropTypes.string,
  }),
  courseInfo: PropTypes.shape({
    enrolled: PropTypes.string,
    completed: PropTypes.string,
    ongoing: PropTypes.string,
    total: PropTypes.string,
    completion: PropTypes.string,
    learner: PropTypes.string,
  }),
  transparent: PropTypes.bool,
  editable: PropTypes.bool,
  onClick: PropTypes.func,
};

export default DetailProfileCard;
