import React, { useState, useMemo, useEffect } from 'react';
import { TextField, Box, Checkbox, Typography } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { useMutation, useQuery } from '@apollo/client';

import Drawer from 'reusables/Drawer';
import { TASK_AVAIL_USERS, GET_TASK_GROUP } from 'graphql/queries/task';
import { useLocation } from 'react-router-dom';
import { useNotification } from 'reusables/NotificationBanner';
import { CREATE_TASK_GROUP, UPDATE_TASK_GROUP } from 'graphql/mutations/task';
import avatar from 'assets/svgs/avatar.png';

const AddGroupDrawer = ({ open, onClose, refetch, isUpdating, upDateId }) => {
  const notification = useNotification();
  const params = new URLSearchParams(useLocation().search);
  const taskId = params.get('taskId');
  const [currentLaed, setCurrentLead] = useState(null);
  const [groupData, setGroupData] = useState({ groupname: '', lead: '', students: [] });

  const {
    loading,
    data: users,
    refetch: refetchAvailableUsers,
  } = useQuery(TASK_AVAIL_USERS, {
    skip: !open,
    variables: {
      taskId,
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const formatUser = (userData) => {
    return Array.isArray(userData)
      ? userData
          ?.map((usr) => [
            {
              user: `${usr?.user?.firstname} ${usr?.user?.lastname}`,
              img: usr?.user?.image,
              id: usr?.user?.id,
            },
          ])
          ?.flat()
      : {
          user: `${userData?.firstname} ${userData?.lastname}`,
          img: userData?.image,
          id: userData?.id,
        };
  };

  const [createTaskGroup, { loading: isCreatingGroup }] = useMutation(CREATE_TASK_GROUP, {
    onCompleted: () => {
      notification.success({
        message: 'Task group created Successfully',
      });
      setGroupData({ groupname: '', lead: '', students: [] });
      onClose();
      refetch();
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const [updateTaskGroup, { loading: isUpdatingGroup }] = useMutation(UPDATE_TASK_GROUP, {
    onCompleted: () => {
      notification.success({
        message: 'Task group updated Successfully',
      });
      setGroupData({ groupname: '', lead: '', students: [] });
      onClose();
      refetch();
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const addlead = () => {
    setGroupData({
      ...groupData,
      students: Object.values(groupData.lead || {})?.length ? [groupData.lead] : [],
    });
  };

  useEffect(() => {
    if (Boolean(isUpdating)) {
      setGroupData({
        ...groupData,
        students: Object.values(groupData.lead || {})?.length
          ? [groupData.lead, ...groupData.students]
          : [],
      });
      return;
    } else {
      addlead();
    }
    // eslint-disable-next-line
  }, [currentLaed]);

  const students = (users?.taskAvailableUsers || [])
    ?.map((usr) => [{ user: `${usr.firstname} ${usr.lastname}`, img: usr.image, id: usr.id }])
    .flat();

  const formatStudentArray = (array) => {
    return array
      ?.map((std) => ({ user: std.id }))
      .flat()
      ?.filter((item) => item.user !== 'all');
  };

  const onSubmit = () => {
    if (Object.values(groupData).some((arr) => arr.length === 0)) {
      return notification.error({
        message: 'Please fill required fields',
      });
    }

    const groupId = upDateId || open;
    if (Boolean(isUpdating)) {
      return updateTaskGroup({
        variables: {
          id: groupId,
          newUpdateTaskgroup: {
            task: taskId,
            name: groupData.groupname,
            groupAdmin: groupData.lead?.id,
            groupUsers: formatStudentArray(groupData.students),
          },
        },
      });
    } else {
      return createTaskGroup({
        variables: {
          newTaskgroup: {
            task: taskId,
            name: groupData.groupname,
            groupAdmin: groupData.lead?.id,
            groupUsers: formatStudentArray(groupData.students),
          },
        },
      });
    }
  };

  const selectAllOption = useMemo(() => ({ user: 'Select All', id: 'all', img: null }), []);
  const allStudents = useMemo(() => {
    if (!loading) {
      return [selectAllOption, ...(students || [])];
    }

    return [];
    // eslint-disable-next-line
  }, [loading]);

  const taskGroupId = upDateId;
  const { data } = useQuery(GET_TASK_GROUP, {
    variables: { taskGroupId },
    skip: !taskGroupId,
    onCompleted: (data) => {
      if (data)
        setGroupData({
          groupname: data?.taskGroup?.name,
          students: formatUser(data?.taskGroup?.groupUsers),
          lead: formatUser(data?.taskGroup?.groupAdmin),
        });
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const prevSelectedUsers = formatUser(data?.taskGroup?.groupUsers) || [];
  const availableEditUser = Array.isArray(prevSelectedUsers) && [
    ...allStudents,
    ...prevSelectedUsers,
  ];

  const addAllAvailableOptions = () => {
    return setGroupData({
      ...groupData,
      students: prevSelectedUsers?.length ? [...allStudents, ...prevSelectedUsers] : allStudents,
    });
  };

  const handleAddAllStudents = (newValue, detail) => {
    const isSelectAllOptionActive = newValue.some((std) => std.id === 'all');
    const userAddedNewOption = newValue?.length > groupData.students?.length;

    if (isSelectAllOptionActive && userAddedNewOption) {
      addAllAvailableOptions();
      return;
    } else if (isSelectAllOptionActive && !userAddedNewOption) {
      setGroupData({
        ...groupData,
        students: newValue.filter((opt) => opt.id !== 'all'),
      });

      return;
    } else if (!isSelectAllOptionActive && detail?.option?.id === 'all') {
      setGroupData({ ...groupData, students: [] });
      return;
    }

    setGroupData({ ...groupData, students: newValue });
  };

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  return (
    <Drawer
      open={Boolean(open)}
      isLoading={isCreatingGroup || isUpdatingGroup}
      onClose={() => {
        setGroupData({ groupname: '', lead: '', students: [] });
        onClose();
        refetchAvailableUsers();
      }}
      title={Boolean(isUpdating) ? 'Update group' : 'Add Group'}
      okText={Boolean(isUpdating) ? 'Update' : 'Save'}
      onOk={onSubmit}
      okButtonProps={{
        isLoading: false,
      }}>
      <Box>
        <TextField
          name="groupname"
          fullWidth
          required
          value={groupData.groupname}
          onChange={(e) => setGroupData({ ...groupData, groupname: e.target.value })}
          label="Group Name"
          variant="outlined"
        />

        <Box mt={10}>
          <Autocomplete
            loading={loading}
            value={groupData?.lead}
            onChange={(_, newValue) => {
              setCurrentLead(newValue);
              setGroupData({ ...groupData, lead: newValue });
            }}
            getOptionSelected={(option, value) => {
              return option.id === value.id;
            }}
            options={Boolean(isUpdating) ? availableEditUser || [] : students || []}
            getOptionLabel={(option) => option?.user}
            renderOption={(option, { selected }) => (
              <>
                <Checkbox
                  icon={icon}
                  color="primary"
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                <Box display="flex" justifyContent="flex-start" alignItems="center" width={'100%'}>
                  <img
                    src={option?.img || avatar}
                    alt="img"
                    style={{ marginRight: 8, width: 40, height: 40, borderRadius: '50%' }}
                  />
                  <Typography> {option?.user} </Typography>
                </Box>
              </>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                variant="outlined"
                required
                label="Type to start searching (Select lead)"
              />
            )}
          />
        </Box>
        <Box mt={10}>
          <Autocomplete
            multiple
            freeSolo
            loading={loading}
            value={groupData?.students}
            limitTags={5}
            onChange={(event, newValue, _, detail) => {
              handleAddAllStudents(newValue, detail);
            }}
            options={Boolean(isUpdating) ? availableEditUser || [] : allStudents || []}
            disableCloseOnSelect
            getOptionLabel={(option) => option?.user}
            getOptionSelected={(option, value) => {
              return option.id === value.id;
            }}
            renderOption={(option, { selected }) => (
              <>
                <Checkbox
                  icon={icon}
                  color="primary"
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                <Box display="flex" justifyContent="flex-start" alignItems="center" width={'100%'}>
                  <img
                    src={option?.img || avatar}
                    alt="img"
                    style={{ marginRight: 8, width: 40, height: 40, borderRadius: '50%' }}
                  />
                  <Typography> {option?.user} </Typography>
                </Box>
              </>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                variant="outlined"
                label="Type to start searching Students"
                required
                InputProps={{
                  ...params.InputProps,
                  type: 'search',
                }}
              />
            )}
          />
        </Box>
      </Box>
    </Drawer>
  );
};

export default AddGroupDrawer;
