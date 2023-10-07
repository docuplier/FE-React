import React, { useState } from 'react';
import { Box, Typography, Button, makeStyles } from '@material-ui/core';
import { fontSizes } from '../../../Css';
import AddIcon from '@material-ui/icons/Add';
import LearningGroupTabs from './LearningGroupTabs';
import LearningGroupActive from './LearningGroupActive';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { PrivatePaths } from 'routes';
import AccessControl from '../../../reusables/AccessControl';
import { UserRoles } from 'utils/constants';
import GroupDescussion from './GroupDescussion';
import LearningGroupArchive from './LearningGroupArchive';
import LearningGroupDetails from './LearningGroupDetails';
import DiscussionReply from './DiscussionReply';
import { useNotification } from 'reusables/NotificationBanner';
import { useQuery } from '@apollo/client';
import { GET_TASK } from 'graphql/queries/task';

const useStyles = makeStyles((theme) => ({
  container: {
    color: '#393A4A',

    '& .header-container': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 8,
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
        alignItems: 'flex-start',
      },
    },
    '& .add_btn': {
      background: '#F0F5FF',
      color: '#0050C8',
      borderRadius: '8px',
      fontWeight: 400,
      padding: '0 16px',
      fontSize: fontSizes.large,
      [theme.breakpoints.down('xs')]: {
        marginBottom: 1,
      },
    },

    '& .title': {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: 8,
    },
  },

  status: {
    marginBottom: 14,
    width: '30%',
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '16px',
  },
}));

const LearningGroup = ({ task, classRep }) => {
  const [activeTab, setActiveTab] = useState(0);
  const classes = useStyles();
  const history = useHistory();
  const notification = useNotification();
  const params = new URLSearchParams(useLocation().search);
  const taskgroupId = params.get('taskgroupId');
  const descussionId = params.get('descussionId');
  const taskId = params.get('taskId');
  const { courseId } = useParams();

  const { data: taskdata } = useQuery(GET_TASK, {
    variables: { taskId },
    skip: !taskId,
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const currtask = taskdata?.task;

  const renderLearningGroup = () => {
    const TabList = [
      {
        label: 'Active',
        component: <LearningGroupActive classRep={classRep} />,
      },
      {
        label: 'Archive',
        component: <LearningGroupArchive classRep={classRep} />,
      },
    ];

    const onTabChange = (value) => {
      setActiveTab(value);
    };

    return (
      <Box className={classes.container}>
        <Box className="header-container">
          {activeTab === 0 ? (
            <Typography className="title">Task</Typography>
          ) : (
            <Typography className="title">Learning Group</Typography>
          )}
          <AccessControl allowedRoles={UserRoles.LECTURER}>
            <Button
              className="add_btn"
              startIcon={<AddIcon />}
              onClick={() => history.push(`${PrivatePaths.CREATE_TASK}?courseId=${courseId}`)}>
              Add Task
            </Button>
          </AccessControl>
          {Boolean(classRep) && (
            <Button
              className="add_btn"
              startIcon={<AddIcon />}
              onClick={() => history.push(`${PrivatePaths.CREATE_TASK}?courseId=${courseId}`)}>
              Add Task
            </Button>
          )}
        </Box>
        <LearningGroupTabs tabs={TabList} onTabChange={onTabChange} />
      </Box>
    );
  };

  const getRenderView = () => {
    if (Boolean(taskgroupId && taskId && !descussionId)) {
      return <GroupDescussion task={currtask} />;
    } else if (Boolean(taskId && !descussionId)) {
      return <LearningGroupDetails task={task} classRep={classRep} />;
    } else if (Boolean(descussionId && taskgroupId)) {
      return <DiscussionReply task={currtask} />;
    } else {
      return renderLearningGroup();
    }
  };

  return <Box>{getRenderView()}</Box>;
};

export default LearningGroup;
