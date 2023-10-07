import { useMutation } from '@apollo/client';
import { Box, ListItemText, Menu, MenuItem, TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Autocomplete } from '@material-ui/lab';
import { UPDATE_COURSE } from 'graphql/mutations/course';
import { GET_USERS } from 'graphql/queries/users';
import { useQueryPagination } from 'hooks/useQueryPagination';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Banner from 'reusables/Banner';
import Drawer from 'reusables/Drawer';
import { useNotification } from 'reusables/NotificationBanner';
import { DEFAULT_PAGE_LIMIT, UserRoles } from 'utils/constants';
import { convertToSentenceCase } from 'utils/TransformationUtils';
import { spaces } from '../../../Css';

const StyledMenu = withStyles({
  paper: {
    minWidth: 200,
    marginTop: spaces.small,
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
));

export default function CourseMoreActions({ anchorEl, onClose, refetch, course = {} }) {
  const [actionType, setActionType] = useState(null);
  const [userName, setUserName] = useState('');
  const { control, handleSubmit, reset } = useForm();
  const notification = useNotification();
  const { leadInstructor } = course;
  const { inputName, role, inputLabel, title } = actionTypes[actionType] || {};

  useEffect(() => {
    reset({
      instructors: course.instructors?.map((user) => ({
        firstname: user.firstname,
        id: user.id,
        lastname: user.lastname,
      })),
      classRep: !!course.classRep
        ? {
            firstname: course.classRep?.firstname,
            id: course.classRep?.id,
            lastname: course.classRep?.lastname,
          }
        : null,
    });
    // eslint-disable-next-line
  }, [course.instructors, course.classRep, inputName]);

  const { loading: usersListLoading, data: usersListData } = useQueryPagination(GET_USERS, {
    variables: {
      search: userName,
      limit: DEFAULT_PAGE_LIMIT,
      ordering: null,
      role,
    },
  });

  const [updateCourse, { loading: courseUpdateLoading }] = useMutation(UPDATE_COURSE, {
    onCompleted,
    onError,
  });

  function onCompleted(response, key) {
    const { course } = response.updateCourse;
    showCourseNotification(response.updateCourse);
    refetch();
    if (course) {
      handleCloseDrawer();
    }
  }

  function showCourseNotification({ ok, errors, course }) {
    const status = ok === false ? 'error' : 'success';
    const message = errors
      ? errors.map((error) => error.messages).join('. ')
      : `Course has been updated with ${
          inputName === 'instructors' ? 'instructor(s)' : 'a class rep'
        }`;
    notification[status]({
      message: convertToSentenceCase(status),
      description: message,
    });
  }

  function onError(error) {
    notification.error({
      message: 'Error!',
      description: error?.message,
    });
  }

  const handleCloseMenu = () => {
    onClose();
  };

  const handleCloseDrawer = () => {
    onClose();
    setActionType(null);
    reset({});
  };

  const handleActionClick = (actionType) => () => {
    onClose();
    setActionType(actionType);
  };

  const onSubmit = (values) => {
    const variables = {
      newCourse: {
        classRep: course?.classRep?.id,
        instructors: course?.instructors?.map((user) => user?.id),
      },
      id: course.id,
    };
    if (inputName === 'instructors') {
      variables.newCourse[inputName] = values[inputName]?.map((user) => user.id);
    }
    if (inputName === 'classRep') {
      variables.newCourse[inputName] = values[inputName]?.id;
    }
    updateCourse({
      variables,
    });
  };

  const getUserOptions = (addedUsers) => {
    if (actionType === actionTypes.ADD_INSTRUCTOR.type) {
      const idsOfAddedUsers = addedUsers?.map((user) => user?.id);
      idsOfAddedUsers?.push(leadInstructor.id);

      return (
        usersListData?.users?.results?.filter((user) => idsOfAddedUsers?.indexOf(user.id) === -1) ||
        []
      );
    } else {
      return usersListData?.users?.results || [];
    }
  };

  return (
    <>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}>
        <MenuItem>
          <ListItemText
            color="primary"
            primary="Add Instructor"
            button
            onClick={handleActionClick(actionTypes.ADD_INSTRUCTOR.type)}
          />
        </MenuItem>
        <MenuItem>
          <ListItemText
            color="primary"
            primary="Add Course Rep"
            button
            onClick={handleActionClick(actionTypes.ADD_CLASS_REP.type)}
          />
        </MenuItem>
      </StyledMenu>
      <Drawer
        open={Boolean(actionType)}
        onClose={handleCloseDrawer}
        title={`Add ${title}`}
        okText="Update"
        okButtonProps={{
          isLoading: courseUpdateLoading,
        }}
        onOk={handleSubmit(onSubmit)}>
        <Banner
          showSwitch={false}
          severity="info"
          title={title}
          message="Type in the field to search for a user"
        />
        <Box mt={10}>
          <Controller
            name={inputName || ''}
            control={control}
            render={({ ref, value, onChange, ...rest }) => (
              <Autocomplete
                multiple={inputName === 'instructors'}
                id="assistant-lecturers"
                inputValue={userName}
                value={value}
                onChange={(event, newValue) => {
                  onChange(newValue);
                }}
                onInputChange={(event, newInputValue) => {
                  setUserName(newInputValue);
                }}
                options={getUserOptions(value)}
                getOptionLabel={(user) => user?.firstname + ' ' + user?.lastname}
                renderOption={(user) => (
                  <>
                    {user?.firstname} {user?.lastname}
                  </>
                )}
                loading={usersListLoading}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField {...params} variant="outlined" label={inputLabel || ''} />
                )}
              />
            )}
          />
        </Box>
      </Drawer>
    </>
  );
}

const actionTypes = {
  ADD_INSTRUCTOR: {
    title: 'Instructor',
    type: 'ADD_INSTRUCTOR',
    role: UserRoles.LECTURER,
    inputLabel: 'Select Instructor',
    inputName: 'instructors',
  },
  ADD_CLASS_REP: {
    title: 'Class Rep',
    type: 'ADD_CLASS_REP',
    role: UserRoles.STUDENT,
    inputLabel: 'Select Class Rep',
    inputName: 'classRep',
  },
};
