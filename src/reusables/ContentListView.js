import { Box, makeStyles, Paper } from '@material-ui/core';
import { ReactComponent as CopyIcon } from 'assets/svgs/copy_icon.svg';
import { ReactComponent as PersonIcon } from 'assets/svgs/people_icon.svg';
import { ReactComponent as TimerIcon } from 'assets/svgs/timer_icon.svg';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import AccessControl from 'reusables/AccessControl';
import Chip from 'reusables/Chip';
import { CourseStatus, UserRoles } from 'utils/constants';
import { convertToSentenceCase } from 'utils/TransformationUtils';
import { colors, fontSizes, fontWeight } from '../Css';

import useMouseHover from 'hooks/useMouseHover';

function ContentListView(props) {
  const classes = useStyles();
  const { isHovered, cardRef } = useMouseHover();
  const {
    title,
    description,
    submissionsCount,
    fileCount,
    url,
    status,
    startDate = new Date(),
    dueDate = new Date(),
    submission,
    onClick,
  } = props;

  const chipColor =
    status === convertToSentenceCase(CourseStatus.PUBLISHED) ? 'active' : 'secondary';

  const overdue = !submission && dueDate.toISOString() <= new Date().toISOString();
  const notStarted = !submission && dueDate.toISOString() > new Date().toISOString();
  const submittedAssignment = submission;

  const checkSubmissionStatus = {
    [classes.overdueChip]: overdue,
    [classes.notStartedChip]: notStarted,
    [classes.submittedChip]: submittedAssignment,
  };
  const changeDueDateBackground = {
    [classes.overdueDate]: overdue,
    [classes.notStartedDate]: notStarted,
  };

  const chipLabelText = () => {
    if (submittedAssignment) return 'Submitted';
    if (overdue) return 'Overdue';
    return 'Not Started';
  };

  return (
    <Paper
      ref={cardRef}
      className={classes.Item}
      variant="outlined"
      elevation={2}
      onClick={onClick}
      style={{
        backgroundColor: isHovered ? '#e6e6eb' : '',
      }}
    >
      <Link to={url} style={{ textDecoration: 'none', color: 'inherit' }}>
        <Box className="title" display="flex" alignItems="center">
          {title}{' '}
          <AccessControl allowedRoles={[UserRoles.LECTURER]}>
            <Chip color={chipColor} label={status} className={classes.chip} />
          </AccessControl>
          <AccessControl allowedRoles={[UserRoles.STUDENT]}>
            <Chip
              label={chipLabelText()}
              size="sm"
              className={classNames(classes.chip, {
                ...checkSubmissionStatus,
              })}
            />
          </AccessControl>
        </Box>
        {description && <div className="description">{description}</div>}
        <Box container className="flex-layout-container">
          {isHovered && (
            <Box className="flex-layout-item" mr={8}>
              <PersonIcon className="icon" />
              {submissionsCount} Submissions
            </Box>
          )}
          {fileCount !== undefined && (
            <Box className="flex-layout-item" mr={8}>
              <CopyIcon className="icon" />
              {fileCount} files
            </Box>
          )}

          <Box className="flex-layout-item" mr={8}>
            <TimerIcon className="icon" />
            Start Date: {!!startDate ? format(startDate, 'LLL dd, yyyy') : '----'}
          </Box>

          <Box className="flex-layout-item">
            <TimerIcon className="icon" />
            <AccessControl allowedRoles={[UserRoles.LECTURER]}>
              <span
                style={{
                  ...(overdue && { color: '#DA1414' }),
                  ...(notStarted && { color: '#F2994A' }),
                  color: 'red',
                }}
              >
                Due Date: {!!dueDate ? format(dueDate, 'LLL dd, yyyy') : '----'}
              </span>
            </AccessControl>
            <AccessControl allowedRoles={[UserRoles.STUDENT]}>
              <span
                className={classNames(classes.dueDate, {
                  ...changeDueDateBackground,
                })}
              >
                Due Date: {!!dueDate ? format(dueDate, 'LLL dd, yyyy') : '----'}
              </span>
            </AccessControl>
          </Box>
        </Box>
      </Link>
    </Paper>
  );
}

ContentListView.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  submissionsCount: PropTypes.number,
  fileCount: PropTypes.number,
  dueDate: PropTypes.string,
  url: PropTypes.string,
  submission: PropTypes.bool,
};

const useStyles = makeStyles((theme) => ({
  Item: {
    cursor: 'pointer',
    '&.MuiPaper-root': {
      padding: 16,
      border: '1px solid #CDCED9',
      borderRadius: 8,
    },
    '& .title': {
      cursor: 'pointer',
      color: colors.dark,
      fontSize: fontSizes.large,
      fontWeight: fontWeight.bold,
      marginBottom: 5,
    },
    '& .description': {
      color: colors.grey,
      fontSize: fontSizes.medium,
      marginBottom: 16,
    },
    '& .flex-layout-container': {
      display: 'flex',
      fontSize: fontSizes.medium,
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
      },
    },
    '& .flex-layout-item': {
      display: 'flex',
      alignItems: 'center',
      color: '#393A4A',
      [theme.breakpoints.down('xs')]: {
        marginBottom: 20,
      },
    },
    '& .icon': {
      marginRight: 5,
      height: fontSizes.medium,
      color: '#6B6C7E',
    },
  },
  dueDate: {
    color: 'inherit',
  },
  overdueDate: {
    color: colors.error,
  },
  notStartedDate: {
    color: colors.notStartedText,
  },

  chip: {
    marginLeft: 8,
    fontWeight: fontWeight.regular,
    height: fontSizes.large,
    fontSize: fontSizes.xsmall,
  },
  notStartedChip: {
    backgroundColor: colors.secondaryLightGrey,
  },
  submittedChip: {
    backgroundColor: colors.successBg,
    color: colors.white,
  },
  overdueChip: {
    backgroundColor: colors.error,
    color: colors.white,
  },
}));

export default ContentListView;
