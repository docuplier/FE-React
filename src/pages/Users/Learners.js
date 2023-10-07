import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import {
  Avatar,
  Box,
  Grid,
  Typography,
  Button,
  makeStyles,
  MenuItem,
  Menu,
} from '@material-ui/core';
import UpsertLearnerDrawer from 'components/Users/UpsertLearnerDrawer';
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
import { useNotification } from 'reusables/NotificationBanner';
import ResourceTable from 'reusables/ResourceTable';
import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET, UserRoles } from 'utils/constants';
import { getNameInitials } from 'utils/UserUtils';
import { spaces, colors } from '../../Css';
import { PrivatePaths } from 'routes';
import LoadingButton from 'reusables/LoadingButton';
import { ReactComponent as DownloadIcon } from 'assets/svgs/download.svg';
import { downloadCSV } from 'download-csv';
import { csvData } from 'utils/csvDownloaderUtils';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import emailGif from 'assets/gif/email.gif';
import delGif from 'assets/gif/delGif.gif';

const Learners = () => {
  const classes = useStyles();
  const [queryParams, setQueryParams] = useState({
    search: '',
    offset: DEFAULT_PAGE_OFFSET,
    limit: DEFAULT_PAGE_LIMIT,
    ordering: null,
    role: UserRoles.STUDENT,
  });
  const [shouldExportData, setShouldExportData] = useState(false);
  const [learnerToEdit, setLearnerToEdit] = useState(null);
  const [learnerToDelete, setLearnerToDelete] = useState(null);
  const [learnerToUpdateStatus, setLearnerToUpdateStatus] = useState(null);
  const notification = useNotification();
  const history = useHistory();
  const [isUpsertLearnerDrawerVisible, setIsUpsertLearnerDrawerVisible] = useState(false);
  const [userIdsArray, setUserIdsArray] = useState([]);
  const [openMultiUserTodelete, setOpenMultiUserTodelete] = useState(null);
  const [openMultiLearnerToDelete, setOpenMultiLearnerToDelete] = useState(null);
  const [openMultiUserToMail, setOpenMultiUserToMail] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [clearCheckedState, setClearCheckedState] = useState(false);
  const [learnerToResendEmail, setLearnerToResendEmail] = useState(null);
  const { loading, data, refetch } = useQueryPagination(GET_USERS, {
    variables: queryParams,
  });
  console.log({ clearCheckedState });
  const { loading: isLoadingCsvData } = useQueryPagination(GET_USERS, {
    variables: { ...queryParams, limit: 100000, asExport: true },
    skip: !shouldExportData,
    onCompleted: (data) => {
      downloadCSV(
        csvData.getStudentTableData(data),
        csvData.getHeadingData(columns),
        'Students.csv',
      );
    },
  });

  const [deactivateUserMutation, deleteUserFeedback] = useMutation(DEACTIVATE_USERS, {
    onCompleted: (response) => onCompleted(response, 'deactivateUsers'),
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
      setOpenMultiUserTodelete(null);
      setOpenMultiLearnerToDelete(null);
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
        id: learnerToDelete?.id,
      },
    });
  };
  function onCompleted(response, key) {
    const { ok, errors } = response[key];
    const status = ok === false ? 'error' : 'success';
    const message =
      ok === true
        ? 'User was deactvated successfully'
        : Array.isArray(errors) && errors.map((error) => error.messages).join('. ');

    notification[status]({
      message: message,
    });

    if (ok) {
      refetch();
      setLearnerToUpdateStatus(null);
      setOpenMultiUserTodelete(null);
      setLearnerToDelete(null);
      setUserIdsArray([]);
      setClearCheckedState(true);
      setTimeout(() => {
        setClearCheckedState(false);
      }, 500);
    }
  }

  const onUpsertUsersSuccess = () => {
    refetch();
    setIsUpsertLearnerDrawerVisible(false);
  };

  const handleSelectOption = (option, data) => {
    switch (option) {
      case 'Edit':
        setLearnerToEdit(data);
        setIsUpsertLearnerDrawerVisible(true);
        break;
      case 'Deactivate':
        setLearnerToUpdateStatus(data);
        break;
      case 'Activate':
        setLearnerToUpdateStatus(data);
        break;
      case 'Delete':
        setLearnerToDelete(data);
        break;
      case 'Resend Email':
        setLearnerToResendEmail(data);
        break;
      default:
        break;
    }
  };

  const handleUpdateStatus = (status) => {
    const userIds = learnerToUpdateStatus?.id;
    try {
      if (status === true) {
        deactivateUserMutation({
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
        deactivateUserMutation({
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
          onClose={handleClose}
          style={{ top: '60px' }}>
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
              setOpenMultiLearnerToDelete(userIdsArray);
              handleClose();
            }}>
            Delete
          </MenuItem>
        </Menu>
      </Box>
    );
  };

  const handleChangeQueryParams = (changeset) => {
    setQueryParams((prevState) => ({
      ...prevState,
      ...changeset,
    }));
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
      dataIndex: 'firstname',
      render: renderNameCell,
      width: '20%',
    },
    {
      title: "Student's ID",
      dataIndex: 'matricNumber',
      render: (text) => text || '-',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: 'Faculty',
      dataIndex: 'faculty',
      render: (_, data) => data?.faculty?.name || '-',
      width: '20%',
      ellipsis: true,
    },
    {
      title: 'Department',
      dataIndex: 'department',
      render: (_, data) => data?.department?.name || '-',
      width: '15%',
      ellipsis: true,
    },
    {
      title: 'Level',
      dataIndex: 'level',
      render: (_, data) => data?.level?.name || '-',
      width: '7%',
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      render: renderStatusChip,
      width: '5%',
    },
  ];

  return (
    <UserLayout
      actionBtnTxt="Add Student"
      btnAction={() => setIsUpsertLearnerDrawerVisible(true)}
      title="Students"
      description="Users registered on the platform for the purpose of learning."
      isPageLoaded={data?.users}
      metaData={{
        inTotal: data?.users?.totalCount || 0,
        active: data?.users?.active || 0,
        inactive: data?.users?.inActive || 0,
      }}>
      <ResourceTable
        loading={loading}
        columns={columns}
        dataSource={data?.users?.results || []}
        shouldClearCheckedState={clearCheckedState}
        rowSelection={{
          onChange: (_selectedRowKeys, selectedRows) =>
            setUserIdsArray(selectedRows?.map((item) => item?.id)),
        }}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              setUserIdsArray(record?.id);
              history.push(`${PrivatePaths.USERS}/learners/${record.id}`);
            },
          };
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
      <UpsertLearnerDrawer
        open={isUpsertLearnerDrawerVisible}
        onClose={() => {
          setIsUpsertLearnerDrawerVisible(false);
          setLearnerToEdit(null);
        }}
        onOkSuccess={onUpsertUsersSuccess}
        learner={
          learnerToEdit
            ? {
                title: learnerToEdit?.title,
                email: learnerToEdit?.email,
                firstname: learnerToEdit?.firstname,
                lastname: learnerToEdit?.lastname,
                middlename: learnerToEdit?.middlename,
                phone: learnerToEdit?.phone,
                gender: learnerToEdit?.gender,
                faculty: learnerToEdit?.faculty?.id,
                department: learnerToEdit?.department?.id,
                matricNumber: learnerToEdit?.matricNumber,
                program: learnerToEdit?.program?.id,
                programType: learnerToEdit?.programType,
                level: learnerToEdit?.level?.id,
                id: learnerToEdit?.id,
              }
            : null
        }
      />
      <ConfirmationDialog
        title={`Are you sure you want to ${
          learnerToUpdateStatus?.isActive !== true ? 'enable' : 'disable'
        } ${learnerToUpdateStatus?.firstname} ${learnerToUpdateStatus?.lastname}`}
        description={
          learnerToUpdateStatus?.isActive !== true
            ? 'You are about to enable selected users'
            : 'Deleting this user will make the user unavailable as an Administrator in the institution'
        }
        okText={`${learnerToUpdateStatus?.isActive ? 'Deactivate User' : 'Activate user'}`}
        onOk={() => handleUpdateStatus(learnerToUpdateStatus?.isActive)}
        okButtonProps={{
          isLoading: deleteUserFeedback?.loading || activateFeedback?.loading,
          danger: true,
        }}
        onClose={() => {
          setLearnerToUpdateStatus(null);
        }}
        open={Boolean(learnerToUpdateStatus)}
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
          isLoading: deleteUserFeedback?.loading || activateFeedback?.loading,
          danger: true,
        }}
        onClose={() => {
          setOpenMultiUserTodelete(null);
        }}
        open={Boolean(openMultiUserTodelete)}
      />
      <ConfirmationDialog
        title={`Are you sure you want to delete ${learnerToDelete?.firstname} ${learnerToDelete?.lastname} `}
        description={'Deleting this user will make the user unavailable in the institution'}
        okText={`Delete User`}
        onOk={handleDeleteUser}
        okButtonProps={{
          isLoading: deleteFeedback?.loading,
          danger: true,
        }}
        onClose={() => {
          setLearnerToDelete(null);
        }}
        open={Boolean(learnerToDelete)}
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
          setOpenMultiLearnerToDelete(null);
        }}
        gif={delGif}
        open={Boolean(openMultiLearnerToDelete)}
      />

      <ConfirmationDialog
        title={'Are you sure you want to perform this action'}
        description={`Mail will be sent to selected user`}
        okText={`Resend`}
        onOk={handleResendEmail}
        okButtonProps={{
          isLoading: resendMailFeedback?.loading,
          danger: true,
        }}
        onClose={() => {
          setLearnerToResendEmail(null);
        }}
        gif={emailGif}
        open={Boolean(learnerToResendEmail)}
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

export default React.memo(Learners);
