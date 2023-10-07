import React, { useState } from 'react';
import AssignmentDetailLayout from 'Layout/AssignmentDetailLayout';
import MaxWidthContainer from 'reusables/MaxWidthContainer';
import { Box, Button, Paper, TextField, Typography, makeStyles, Grid } from '@material-ui/core';
import { ArrowBackIos } from '@material-ui/icons';
import { useHistory, useLocation } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQuery } from '@apollo/client';

import Wysiwyg from 'reusables/Wysiwyg';
import { getFormError } from 'utils/formError';
import { colors, spaces, fontWeight } from '../Css';
import { ReactComponent as Pencil } from 'assets/svgs/pencil.svg';
import { CREATE_TASK, UPDATE_TASK } from 'graphql/mutations/task';
import { ReactComponent as Group } from 'assets/svgs/Group.svg';
import { useNotification } from 'reusables/NotificationBanner';
import LoadingButton from 'reusables/LoadingButton';
import NavigationBar from 'reusables/NavigationBar';
import Empty from 'reusables/Empty';
import { GET_TASK, GET_TASK_GROUPS } from 'graphql/queries/task';
import AddGroupDrawer from 'components/TaskGroup/AddGroupDrawer';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import { UserRoles } from 'utils/constants';
import { GET_COURSE_BY_ID } from 'graphql/queries/courses';
import { minDate } from 'utils/TransformationUtils';

const CreateTask = () => {
  const history = useHistory();
  const classes = useStyles();
  const params = new URLSearchParams(useLocation().search);
  const isEditing = params.get('edit');
  const courseId = params.get('courseId');
  const taskId = params.get('taskId');
  const notification = useNotification();
  const { userDetails } = useAuthenticatedUser();
  const [dataToOpenDraw, setDataToOpenDrawer] = useState(null);
  const { handleSubmit, control, errors, watch, reset } = useForm({
    taskName: '',
    content: '',
    dueDate: '',
  });
  const { content } = watch();

  const { data: course } = useQuery(GET_COURSE_BY_ID, {
    variables: { courseId },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const { data, refetch: refetchTask } = useQuery(GET_TASK, {
    variables: { taskId },
    skip: !taskId,
    onCompleted: (data) => {
      reset({
        taskName: data?.task?.title,
        content: { html: data?.task?.description, editorState: null },
        dueDate: data?.task?.dueDate,
      });
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const { data: taskgroupData, refetch } = useQuery(GET_TASK_GROUPS, {
    variables: { taskId },
    skip: !taskId,
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });
  const taskgroup = taskgroupData?.taskGroups;

  const onSubmit = (values) => {
    if (isEditing) {
      updateTask({
        variables: {
          id: data?.task?.id,
          newUpdateTask: {
            title: values.taskName,
            description: values.content?.html,
            dueDate: values.dueDate,
          },
        },
      });
    } else {
      craateTask({
        variables: {
          newTask: {
            course: courseId,
            title: values.taskName,
            description: values.content?.html,
            dueDate: values.dueDate,
          },
        },
      });
    }
  };

  const [craateTask, { loading: isCreatetingTask }] = useMutation(CREATE_TASK, {
    onCompleted: () => {
      notification.success({
        message: 'Task created Successfully',
      });
      reset({
        taskName: '',
        content: '',
        dueDate: '',
      });
      refetch();
      history.goBack();
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const [updateTask, { loading: isUpdatetingTask }] = useMutation(UPDATE_TASK, {
    onCompleted: () => {
      notification.success({
        message: 'Task updated Successfully',
      });
      refetchTask();
      refetch();
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const renderEmpty = () => {
    return <Empty title="No Group Added" description="Group added will apper herre" />;
  };

  const renderCountCard = () => {
    return (
      <Box display="flex" justifyContent="flex-start">
        <Box width="250px" height="90" component={Paper} square mr={12} p={12}>
          <Typography variant="subtitle1" color="textPrimary">
            {data?.task?.totalStudents || 0} <br /> Total Students
          </Typography>
        </Box>
        <Box width="265px" height="90" component={Paper} square p={12}>
          <Typography variant="subtitle1" color="textPrimary">
            {data?.task?.totalGroups || 0} <br /> Total Groups
          </Typography>
        </Box>
      </Box>
    );
  };

  const renderBottomCards = (array) => {
    return (
      <Grid container spacing={10} style={{ marginBottom: '16px' }}>
        {array?.map(({ id, name: task, totalStudents: count }, index) => {
          return (
            <Grid item xs={12} sm={6} lg={4}>
              <Box
                style={{ border: 'solid 1px #CDCED9' }}
                component={Paper}
                p={8}
                display="flex"
                justifyContent="space-between"
                alignItems="top">
                <Box>
                  <Typography variant="subtitle1" color="textSecondary">
                    Group {index + 1}
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{ fontWeight: fontWeight.bold }}
                    color="textPrimary">
                    {task}
                  </Typography>
                  <Typography variant="subtitle1" color="textPrimary">
                    <Group /> {count} students
                  </Typography>
                </Box>
                <Box>
                  <Pencil style={{ cursor: 'pointer' }} onClick={() => setDataToOpenDrawer(id)} />
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  return (
    <>
      <NavigationBar />
      <AssignmentDetailLayout
        withMaxWidth={false}
        links={[
          { title: 'Home', to: '/' },
          { title: 'Users', to: '' },
        ]}>
        <MaxWidthContainer>
          <Box maxWidth="750px" margin="auto">
            <Box my={12}>
              <Button
                variant="default"
                style={{ color: colors.primary }}
                onClick={() => history.goBack()}>
                <ArrowBackIos /> Back to learning group
              </Button>
            </Box>
            {renderCountCard()}
            <Box my={12} mb={20}>
              <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
                <Controller
                  name="taskName"
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ ref, ...rest }) => (
                    <TextField
                      {...rest}
                      inputRef={ref}
                      fullWidth
                      variant="outlined"
                      label="Task Name"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      error={getFormError('TaskName', errors).hasError}
                      helperText={getFormError('TaskName', errors).message}
                    />
                  )}
                />

                <Box>
                  <Controller
                    name="content"
                    control={control}
                    rules={{ required: true, maxLength: 250 }}
                    render={({ value, onChange }) => (
                      <Wysiwyg onChange={onChange} value={value} maxLength={250} />
                    )}
                  />
                  <Box alignItems="center" textAlign="right" component={Paper} p={6} elevation={0}>
                    <Typography variant="subtitle1">
                      Characters{' '}
                      {content?.html?.length === 7 ? 250 : 250 - content?.html?.length + 8}
                    </Typography>
                  </Box>
                </Box>

                <Controller
                  name="dueDate"
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ ref, ...rest }) => (
                    <TextField
                      {...rest}
                      type="date"
                      InputProps={{ inputProps: { min: minDate() } }}
                      inputRef={ref}
                      style={{ width: '50%' }}
                      variant="outlined"
                      label="Due date"
                      error={getFormError('dueDate', errors).hasError}
                      helperText={getFormError('dueDate', errors).message}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  )}
                />
              </form>
              {taskgroup?.length ? renderBottomCards(taskgroup) : renderEmpty()}
              <Box textAlign="right" mt={17}>
                <LoadingButton
                  disabled={
                    course?.course?.classRep?.id !== userDetails?.id &&
                    !userDetails?.roles?.includes(UserRoles.LECTURER)
                  }
                  isLoading={isCreatetingTask || isUpdatetingTask}
                  type="submit"
                  color="primary"
                  variant="contained"
                  onClick={handleSubmit(onSubmit)}>
                  {isEditing ? 'Update task' : 'Create Task'}
                </LoadingButton>
              </Box>
            </Box>
          </Box>
          <AddGroupDrawer
            open={dataToOpenDraw}
            onClose={() => setDataToOpenDrawer(null)}
            refetch={refetch}
            isUpdating={true}
            upDateId={dataToOpenDraw}
            skip={false}
          />
        </MaxWidthContainer>
      </AssignmentDetailLayout>
    </>
  );
};

export default CreateTask;

const useStyles = makeStyles(() => ({
  form: {
    '& > *': {
      marginBottom: spaces.large,
    },
  },
}));
