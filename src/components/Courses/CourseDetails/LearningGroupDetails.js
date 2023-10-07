import React, { useState } from 'react';
import { Box, Typography, Button, makeStyles, Grid, Paper } from '@material-ui/core';
import { colors, fontSizes, fontWeight } from '../../../Css';
import AddIcon from '@material-ui/icons/Add';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { GET_ALL_TASK_GROUPS } from 'graphql/queries/task';
import { PrivatePaths } from 'routes';
import { ReactComponent as GroupIcon } from 'assets/svgs/Group.svg';
import AddGroupDrawer from 'components/TaskGroup/AddGroupDrawer';
import { useQuery } from '@apollo/client';
import { useNotification } from 'reusables/NotificationBanner';
import Empty from 'reusables/Empty';
import LoadingView from 'reusables/LoadingView';

const useStyles = makeStyles((theme) => ({
  container: {
    color: '#393A4A',

    '& .back_btn': {
      background: '#F0F5FF',
      color: '#0050C8',
      borderRadius: '8px',
      fontWeight: 400,
      fontSize: fontSizes.large,
      [theme.breakpoints.down('xs')]: {
        marginBottom: 8,
      },
    },

    '& .header-container': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 34,
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
        alignItems: 'flex-start',
      },
    },
    '& .right-header-content': {
      textAlign: 'right',
    },
  },
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
  },
}));

const LearningGroupDetails = ({ task, classRep }) => {
  const notification = useNotification();
  const classes = useStyles();
  const history = useHistory();
  const { courseId } = useParams();
  const params = new URLSearchParams(useLocation().search);
  const taskId = params.get('taskId');

  const { data, loading, refetch } = useQuery(GET_ALL_TASK_GROUPS, {
    variables: { taskId },

    onError: (error) => {
      notification.error({
        message: error.message,
      });
    },
  });

  const allTaskGroups = data?.taskGroups;

  const [openAddGroupDrawer, setOpenAddGroupDrawer] = useState(null);

  const navigate = (id) => {
    if (classRep) {
      if (task?.currentGroup?.id !== id) {
        return notification.error({
          message: 'You do not belong to this group',
        });
      }
      return history.push(
        `${PrivatePaths.COURSES}/${courseId}?tab=learning-group&taskId=${taskId}&taskgroupId=${task?.currentGroup?.id}`,
      );
    } else {
      return history.push(
        `${PrivatePaths.COURSES}/${courseId}?tab=learning-group&taskId=${taskId}&taskgroupId=${id}`,
      );
    }
  };

  const renderEmpty = () => {
    return <Empty title="No Group" description="Groups added will display here" />;
  };

  const renderLearningGroupCard = (datam) => {
    return (
      <Box>
        {allTaskGroups?.length
          ? allTaskGroups?.map((allTaskGroups, i) => {
              return (
                <Grid
                  container
                  spacing={6}
                  key={allTaskGroups.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(allTaskGroups?.id)}>
                  <Grid item xs={12} sm={12}>
                    <Box className={classes.box} component={Paper} elevation={0} p={8} fullWidth>
                      <Typography variant="body2" gutterBottom>
                        Group {i + 1}
                      </Typography>
                      <Typography className="heading">{allTaskGroups.name}</Typography>
                      <Box className="student_no">
                        <Box display="flex" alignItems="center">
                          <GroupIcon />
                          <Typography className="text">{allTaskGroups.totalStudents}</Typography>
                          <Typography className="text">Student</Typography>
                        </Box>
                        <Box
                          className="assignment"
                          style={{
                            background: allTaskGroups.submitted ? '#0A8043' : '#E5E5EA',
                            color: allTaskGroups.submitted ? '#ffffff' : '#000000',
                          }}>
                          {allTaskGroups.submitted
                            ? 'Assignment: submitted'
                            : 'Assignment: not submitted'}
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              );
            })
          : renderEmpty()}
      </Box>
    );
  };

  return (
    <Box className={classes.container}>
      <Box className="header-container">
        <Button className="back_btn" onClick={() => history.goBack()}>
          Back to Tasks
        </Button>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            disabled={task?.isArchived}
            onClick={() => setOpenAddGroupDrawer(taskId)}>
            Add Group
          </Button>
        </Box>
      </Box>
      <LoadingView isLoading={loading}>
        <Box>{renderLearningGroupCard()}</Box>
      </LoadingView>
      <AddGroupDrawer
        onClose={() => setOpenAddGroupDrawer(null)}
        refetch={refetch}
        open={openAddGroupDrawer}
      />
    </Box>
  );
};

export default LearningGroupDetails;
