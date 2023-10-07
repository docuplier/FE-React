import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import { ReactComponent as ModulesIcon } from '../assets/svgs/modules-icon.svg';
import { ReactComponent as QuizIcon } from '../assets/svgs/quiz-icon.svg';
import { fontSizes, fontWeight, colors, spaces } from '../Css';

const CourseInfoHeader = ({ quizScore, modulesCompletedCount, modulesPendingCount }) => {
  const classes = useStyles();

  return (
    <Box className={classes.iconContainer}>
      <Box className={classes.iconDescription} mr={12}>
        <Box className="icon-class">
          <QuizIcon />
        </Box>
        <Box className="item">
          <Typography className="item-count">{quizScore}%</Typography>
          <Typography> Avg. Quiz Score</Typography>
        </Box>
      </Box>
      <Box className={classes.iconDescription}>
        <Box className="icon-class" style={{ background: '#F2EBF4' }}>
          <ModulesIcon />
        </Box>
        <Box className={classes.moduleIconSection}>
          <Box className="item" style={{ borderRight: '1px solid #CDCED9' }}>
            <Typography className="item-count">{modulesCompletedCount}</Typography>
            <Typography>Courses Completed</Typography>
          </Box>
          <Box className="item">
            <Typography className="item-count">{modulesPendingCount}</Typography>
            <Typography>Courses Pending</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const useStyles = makeStyles((theme) => ({
  iconContainer: {
    display: 'flex',
    color: colors.grey,
    width: '100%',
    boxSizing: 'border-box',
    [theme.breakpoints.down('xs')]: {
      display: 'block',
    },
  },
  iconDescription: {
    display: 'flex',
    alignItems: 'center',
    background: '#FAFAFA',
    borderRadius: '8px',
    padding: theme.spacing(8),
    border: '1px solid #E7E7ED',
    [theme.breakpoints.down('xs')]: {
      marginBottom: spaces.medium,
      boxSizing: 'border-box',
    },
    '& .icon-class': {
      width: '48px',
      height: '48px',
      borderRadius: '100%',
      background: '#F0F5FF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    '& .item': {
      paddingLeft: '16px',
      paddingRight: '16px',
    },
    '& .item-count': {
      fontSize: fontSizes.title,
      fontWeight: fontWeight.bold,
      color: '#272833',
    },
  },
  moduleIconSection: {
    display: 'flex',
  },
}));

CourseInfoHeader.propTypes = {
  quizScore: PropTypes.number,
  modulesCompletedCount: PropTypes.number,
  modulesPendingCount: PropTypes.number,
};

export default CourseInfoHeader;
