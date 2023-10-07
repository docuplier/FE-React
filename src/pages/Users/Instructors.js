import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Grid,
  makeStyles,
  Typography,
  MenuItem,
  Menu,
} from '@material-ui/core';
import UpsertInstructorDrawer from 'components/Users/UpsertInstructorDrawer';
import {
  ACTIVATE_USERS,
  DEACTIVATE_USERS,
  DELETE_MULTI_USER,
  DELETE_USER,
  RESEND_EMAIL,
} from 'graphql/mutations/users';
import { GET_USERS } from 'graphql/queries/users';
import { useQueryPagination } from 'hooks/useQueryPagination';
import UserLayout from 'Layout/UserLayout';
import React, { useState } from 'react';
import Chip from 'reusables/Chip';
import ConfirmationDialog from 'reusables/ConfirmationDialog';
import FilterControl from 'reusables/FilterControl';
import useNotification from 'reusables/NotificationBanner/useNotification';
import ResourceTable from 'reusables/ResourceTable';
import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET, UserRoles } from 'utils/constants';
import { getNameInitials } from 'utils/UserUtils';
import { colors, spaces } from '../../Css';
import { PrivatePaths } from 'routes';
import LoadingButton from 'reusables/LoadingButton';
import { ReactComponent as DownloadIcon } from 'assets/svgs/download.svg';
import { downloadCSV } from 'download-csv';
import { csvData } from 'utils/csvDownloaderUtils';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import emailGif from 'assets/gif/email.gif';
import delGif from 'assets/gif/delGif.gif';

const Instructors = () => {
  const history = useHistory();
  const classes = useStyles();
  const [userIdsArray, setUserIdsArray] = useState([]);
  const [shouldExportData, setShouldExportData] = useState(false);
  const [openMultiUserTodelete, setOpenMultiUserTodelete] = useState(null);
  const [isUpsertInstructorDrawerVisible, setIsUpsertInstructorDrawerVisible] = useState(false);
  const [instructorToEdit, setInstructorToEdit] = useState(null);
  const [instructorToUpdateStatus, setInstructorToUpdateStatus] = useState(null);
  const notification = useNotification();
  const [openMultiInstructorsToDelete, SetOpenMultiInstructorsToDelete] = useState(null);
  const [openMultiUserToMail, setOpenMultiUserToMail] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [lecturerToDelete, setLecturerToDelete] = useState(null);
  const [clearCheckedState, setClearCheckedState] = useState(false);
  const [learnerToResendEmail, setLearnerToResendEmail] = useState(null);
  const [queryParams, setQueryParams] = useState({
    search: '',
    offset: DEFAULT_PAGE_OFFSET,
    limit: DEFAULT_PAGE_LIMIT,
    ordering: null,
    role: UserRoles.LECTURER,
  });

  const { loading, data, refetch } = useQueryPagination(GET_USERS, {
    variables: queryParams,
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const { loading: isLoadingCsvData } = useQueryPagination(GET_USERS, {
    variables: { ...queryParams, limit: 10000, asExport: true },
    skip: !shouldExportData,
    onCompleted: (data) => {
      downloadCSV(
        csvData.getLecturerTableData(data),
        csvData.getHeadingData(columns),
        'Lecturers.csv',
      );
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const [deactivateUsersMutation, deactivateUsersFeedback] = useMutation(DEACTIVATE_USERS, {
    onCompleted: (response) => {
      onCompleted(response, 'deactivateUsers');
      notification.success({
        message: 'User deactivated successfully',
      });
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const [activateUserMutation, activateFeedback] = useMutation(ACTIVATE_USERS, {
    onCompleted: (response) => {
      onCompleted(response, 'activateUsers');
      notification.success({
        message: 'User activated successfully',
      });
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const [deleteUserMutation, deleteFeedback] = useMutation(DELETE_USER, {
    onCompleted: (response) => {
      onCompleted(response, 'deleteUser');
      notification.success({
        message: 'User deleted successfully',
      });
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const [deleteMultiUserMutation, deleteMultiFeedback] = useMutation(DELETE_MULTI_USER, {
    onCompleted: (response) => {
      notification.success({
        message: 'User(s) deleted successfully',
      });
      refetch();
      SetOpenMultiInstructorsToDelete(null);
      setUserIdsArray([]);
      setClearCheckedState(true);
      setTimeout(() => {
        setClearCheckedState(false);
      }, 500);
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const [ResendMailMutation, resendMailFeedback] = useMutation(RESEND_EMAIL, {
    onCompleted: (response) => {
      notification.success({
        message: 'Mail sent successfully',
      });
      refetch();
      setOpenMultiUserToMail(null);
      setLearnerToResendEmail(null);
      setUserIdsArray([]);
      setClearCheckedState(true);
      setTimeout(() => {
        setClearCheckedState(false);
      }, 500);
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const handleMultiDelete = () => {
    deleteMultiUserMutation({
      variables: {
        userIds: userIdsArray,
      },
    });
  };

  const handleResendEmail = (multi) => {
    if (multi) {
      return ResendMailMutation({
        variables: {
          userIds: userIdsArray,
        },
      });
    }
    return ResendMailMutation({
      variables: {
        userIds: [learnerToResendEmail?.id],
      },
    });
  };

  const handleDeleteUser = () => {
    deleteUserMutation({
      variables: {
        id: lecturerToDelete?.id,
      },
    });
  };

  function onCompleted(response, key) {
    const { ok, errors } = response[key];
    const status = ok === false ? 'error' : 'success';
    const errMessages =
      errors?.messages ||
      (Array.isArray(errors) && errors.map((error) => error.messages).join('. '));
    notification[status]({
      message: errMessages,
    });
    if (ok) {
      refetch();
      setInstructorToUpdateStatus(null);
      setOpenMultiUserTodelete(null);
      setLecturerToDelete(null);
      setUserIdsArray([]);
      setClearCheckedState(true);
      setTimeout(() => {
        setClearCheckedState(false);
      }, 500);
    }
  }

  const onUpsertUsersSuccess = () => {
    refetch();
    setIsUpsertInstructorDrawerVisible(false);
  };

  const handleSelectOption = (option, data) => {
    switch (option) {
      case 'Edit':
        setInstructorToEdit(data);
        setIsUpsertInstructorDrawerVisible(true);
        break;
      case 'Deactivate':
        setInstructorToUpdateStatus(data);
        break;
      case 'Activate':
        setInstructorToUpdateStatus(data);
        break;
      case 'Delete':
        setLecturerToDelete(data);
        break;
      case 'Resend Email':
        setLearnerToResendEmail(data);
        break;
      default:
        break;
    }
  };

  const handleChangeQueryParams = (changeset) => {
    setQueryParams((prevState) => ({
      ...prevState,
      ...changeset,
    }));
  };

  const handleUpdateStatus = (status) => {
    const userIds = instructorToUpdateStatus?.id;
    try {
      if (status === true) {
        deactivateUsersMutation({
          variables: {
            userIds,
          },
        });
      } else {
        activateUserMutation({
          variables: {
            userIds,
          },
        });
      }
    } catch (error) {
      notification.error({
        message: error.message,
      });
    }
  };

  const handleMultiUpdateStatus = () => {
    try {
      if (openMultiUserTodelete === 'Enable') {
        activateUserMutation({
          variables: {
            userIds: userIdsArray,
          },
        });
        setOpenMultiUserTodelete([]);
      } else {
        deactivateUsersMutation({
          variables: {
            userIds: userIdsArray,
          },
        });
        setOpenMultiUserTodelete([]);
      }
    } catch (error) {
      notification.error({
        message: error.message,
      });
    }
  };

  const renderNameCell = (text, { firstname, lastname }) => {
    const fullName = `${firstname} ${lastname}`;

    return (
      <Box display="flex" alignItems="center">
        <Avatar src={data?.image} style={{ background: '#F48989' }}>
          {getNameInitials(firstname, lastname)}
        </Avatar>
        <Typography style={{ marginLeft: spaces.small }}>{fullName}</Typography>
      </Box>
    );
  };

  const renderStatusChip = (text, data) => (
    <Chip
      label={data.isActive ? 'ENABLED' : 'DISABLED'}
      variant="outlined"
      roundness="sm"
      size="md"
      color={data.isActive ? 'active' : 'inactive'}
    />
  );

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: renderNameCell,
      width: '20%',
    },
    {
      title: 'Email Address',
      dataIndex: 'email',
      ellipsis: true,
      tooltip: true,
      width: '20%',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      render: (text) => text || '-',
      width: '10%',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      render: (_, data) => data?.department?.name || '-',
      width: '20%',
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      render: renderStatusChip,
      align: 'justify',
    },
  ];

  const renderMenu = () => {
    if (!userIdsArray?.length) return;
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
      <Box ml={4}>
        <Button
          variant="contained"
          disableElevation
          classes={{ root: classes.btn }}
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
          style={{ whiteSpace: 'nowrap', marginRight: '0px' }}>
          More Actions <MoreVertIcon />
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          style={{ top: '60px' }}
          onClose={handleClose}>
          <MenuItem
            onClick={() => {
              setOpenMultiUserToMail(userIdsArray);
              handleClose();
            }}>
            Resend Email
          </MenuItem>
          <MenuItem
            style={{ color: '#DA1414' }}
            onClick={() => {
              SetOpenMultiInstructorsToDelete(userIdsArray);
              handleClose();
            }}>
            Delete
          </MenuItem>
        </Menu>
      </Box>
    );
  };

  return (
    <UserLayout
      actionBtnTxt="Add Lecturer"
      btnAction={() => setIsUpsertInstructorDrawerVisible(true)}
      title="Lecturers"
      isPageLoaded={data?.users}
      description="Users registered on the platform for the purpose of delivering course contents."
      metaData={{
        inTotal: data?.users?.totalCount || 0,
        active: data?.users?.active || 0,
        inactive: data?.users?.inActive || 0,
      }}>
      <ResourceTable
        loading={loading}
        columns={columns}
        shouldClearCheckedState={clearCheckedState}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              setUserIdsArray(record?.id);
              history.push(`${PrivatePaths.USERS}/instructors/${record.id}`);
            },
          };
        }}
        dataSource={data?.users?.results || []}
        rowSelection={{
          onChange: (_selectedRowKeys, selectedRows) =>
            setUserIdsArray(selectedRows?.map((item) => item?.id)),
        }}
        onChange={() => null}
        filterControl={
          <FilterControl
            searchInputProps={{
              colSpan: {
                xs: 12,
                sm: 5,
              },
              onChange: (evt) =>
                handleChangeQueryParams({ search: evt.target.value, offset: DEFAULT_PAGE_OFFSET }),
            }}
            renderCustomFilters={
              <Grid item xs={12} sm={7}>
                <Box display="flex" alignItems="center" justifyContent="flex-start">
                  <Box mr={8} width={'100%'} display="flex" justifyContent="flex-end">
                    {userIdsArray?.length !== 0 && (
                      <>
                        <Button
                          variant="contained"
                          disableElevation
                          classes={{ root: classes.btn }}
                          onClick={() => setOpenMultiUserTodelete('Enable')}>
                          {`Enable (${userIdsArray?.length})`}
                        </Button>
                        <Button
                          variant="contained"
                          disableElevation
                          classes={{ root: classes.btn }}
                          onClick={() => setOpenMultiUserTodelete('Disable')}>
                          {`Disable (${userIdsArray?.length})`}
                        </Button>
                      </>
                    )}
                  </Box>
                  <Box display="flex" justifyContent="flex-start" alignItems="center">
                    <Typography color="textSecondary" style={{ paddingRight: 8 }}>
                      Export
                    </Typography>
                    <LoadingButton
                      color="primary"
                      isLoading={isLoadingCsvData}
                      onClick={() => setShouldExportData(true)}>
                      <DownloadIcon />
                    </LoadingButton>
                  </Box>
                  <Box>{renderMenu()}</Box>
                </Box>
              </Grid>
            }
          />
        }
        options={(record) => [
          record.isActive ? 'Deactivate' : 'Activate',
          'Edit',
          'Resend Email',
          'Delete',
        ]}
        onSelectOption={handleSelectOption}
        pagination={{
          total: data?.users?.totalCount,
          onChangeLimit: (_offset, limit) =>
            handleChangeQueryParams({ limit, offset: DEFAULT_PAGE_OFFSET }),
          onChangeOffset: (offset) => handleChangeQueryParams({ offset }),
          limit: queryParams.limit,
          offset: queryParams.offset,
        }}
      />
      <UpsertInstructorDrawer
        open={isUpsertInstructorDrawerVisible}
        onClose={() => {
          setIsUpsertInstructorDrawerVisible(false);
          setInstructorToEdit(null);
        }}
        onOkSuccess={onUpsertUsersSuccess}
        instructor={
          instructorToEdit
            ? {
                staffId: instructorToEdit?.staffId,
                title: instructorToEdit?.title,
                email: instructorToEdit?.email,
                firstname: instructorToEdit?.firstname,
                lastname: instructorToEdit?.lastname,
                middlename: instructorToEdit?.middlename,
                phone: instructorToEdit?.phone,
                gender: instructorToEdit?.gender,
                designation: instructorToEdit?.designation,
                faculty: instructorToEdit?.faculty?.id,
                department: instructorToEdit?.department?.id,
                id: instructorToEdit?.id,
              }
            : null
        }
      />
      <ConfirmationDialog
        title={`Are you sure you want to ${
          instructorToUpdateStatus?.isActive !== true ? 'enable' : 'disable'
        } ${instructorToUpdateStatus?.firstname} ${instructorToUpdateStatus?.lastname}`}
        description={
          instructorToUpdateStatus?.isActive !== true
            ? 'You are about to enable selected users'
            : 'Deleting this user will make the user unavailable as an Administrator in the institution'
        }
        okText={`${instructorToUpdateStatus?.isActive ? 'Deactivate User' : 'Activate user'}`}
        onOk={() => handleUpdateStatus(instructorToUpdateStatus?.isActive)}
        okButtonProps={{
          isLoading: deactivateUsersFeedback?.loading || activateFeedback?.loading,
          danger: true,
        }}
        onClose={() => {
          setInstructorToUpdateStatus(null);
        }}
        open={Boolean(instructorToUpdateStatus)}
      />
      <ConfirmationDialog
        title={`Are you sure you want to ${
          openMultiUserTodelete === 'Enable' ? 'enable' : 'disable'
        } selected users`}
        description={
          openMultiUserTodelete === 'Enable'
            ? 'You are about to enable selected users'
            : 'Deleting this user will make the user unavailable as an Administrator in the institution'
        }
        okText={openMultiUserTodelete === 'Enable' ? 'Enable users' : 'Deactivate Users'}
        onOk={handleMultiUpdateStatus}
        okButtonProps={{
          isLoading: deactivateUsersFeedback?.loading || activateFeedback?.loading,
          danger: true,
        }}
        onClose={() => {
          setOpenMultiUserTodelete(null);
        }}
        open={Boolean(openMultiUserTodelete)}
      />

      <ConfirmationDialog
        title={`Are you sure you want to Perform this action`}
        description={'Mail will be sent to selected users'}
        okText={`Resend`}
        onOk={() => handleResendEmail(true)}
        okButtonProps={{
          isLoading: resendMailFeedback?.loading,
          danger: true,
        }}
        gif={emailGif}
        onClose={() => {
          setOpenMultiUserToMail(null);
        }}
        open={Boolean(openMultiUserToMail)}
      />

      <ConfirmationDialog
        title={`Are you sure you want to Delete selected users`}
        description={'Deleting selected users will erase their information from the platform'}
        okText={`Delete`}
        onOk={handleMultiDelete}
        okButtonProps={{
          isLoading: deleteMultiFeedback?.loading,
          danger: true,
        }}
        onClose={() => {
          SetOpenMultiInstructorsToDelete(null);
        }}
        gif={delGif}
        open={Boolean(openMultiInstructorsToDelete)}
      />

      <ConfirmationDialog
        title={'Are you sure you want to perform this action'}
        description={`Mail will be sent to selected user`}
        okText={`Resend`}
        onOk={handleResendEmail}
        okButtonProps={{
          isLoading: resendMailFeedback.loading,
          danger: true,
        }}
        onClose={() => {
          setLearnerToResendEmail(null);
        }}
        gif={emailGif}
        open={Boolean(learnerToResendEmail)}
      />
      <ConfirmationDialog
        title={`Are you sure you want to delete ${lecturerToDelete?.firstname} ${lecturerToDelete?.lastname} `}
        description={'Deleting this user will make the user unavailable in the institution'}
        okText={`Delete User`}
        onOk={handleDeleteUser}
        okButtonProps={{
          isLoading: deleteFeedback?.loading,
          danger: true,
        }}
        onClose={() => {
          setLecturerToDelete(null);
        }}
        gif={delGif}
        open={Boolean(lecturerToDelete)}
      />
    </UserLayout>
  );
};

const useStyles = makeStyles(() => ({
  btn: {
    minWidth: 100,
    marginRight: 16,
    '&.MuiButton-contained': {
      color: colors.primary,
      background: colors.primaryLight,
    },
  },
}));
export default React.memo(Instructors);
