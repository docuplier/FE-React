import { useMutation } from '@apollo/client';
import { Avatar, Box, Button, Grid, makeStyles, Typography } from '@material-ui/core';
import UpsertAdministratorDrawer from 'components/Users/UpsertAdministratorDrawer';
import { DEACTIVATE_USERS, ACTIVATE_USERS } from 'graphql/mutations/users';
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
import LoadingButton from 'reusables/LoadingButton';
import { ReactComponent as DownloadIcon } from 'assets/svgs/download.svg';
import { downloadCSV } from 'download-csv';
import { csvData } from 'utils/csvDownloaderUtils';

const Administrator = () => {
  const classes = useStyles();
  const [queryParams, setQueryParams] = useState({
    search: '',
    offset: DEFAULT_PAGE_OFFSET,
    limit: DEFAULT_PAGE_LIMIT,
    ordering: null,
    role: UserRoles.SCHOOL_ADMIN,
  });
  const notification = useNotification();
  const [shouldExportData, setShouldExportData] = useState(false);
  const [userIdsArray, setUserIdsArray] = useState([]);
  const [administratorToEdit, setAdministratorToEdit] = useState(null);
  const [administratorToUpdateStaus, setAdministratorToUpdateStaus] = useState(null);
  const [openMultiUserTodelete, setOpenMultiUserTodelete] = useState(null);
  const [isUpsertAdministratorDrawerVisible, setIsUpsertAdministratorDrawerVisible] =
    useState(false);

  const { loading, data, refetch } = useQueryPagination(GET_USERS, {
    variables: queryParams,
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const { loading: isLoadingCsvData } = useQueryPagination(GET_USERS, {
    variables: { ...queryParams, limit: 1000, asExport: true },
    skip: !shouldExportData,
    onCompleted: (data) => {
      downloadCSV(
        csvData.getAdminstratorTableData(data),
        csvData.getHeadingData(columns),
        'Administrators.csv',
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
      setAdministratorToUpdateStaus(null);
      setOpenMultiUserTodelete(null);
    }
  }

  const handleChangeQueryParams = (changeset) => {
    setQueryParams((prevState) => ({
      ...prevState,
      ...changeset,
    }));
  };

  const handleSelectOption = (option, data) => {
    switch (option) {
      case 'Edit':
        setAdministratorToEdit(data);
        setIsUpsertAdministratorDrawerVisible(true);
        break;
      case 'Deactivate':
        setAdministratorToUpdateStaus(data);
        break;
      case 'Activate':
        setAdministratorToUpdateStaus(data);
        break;
      default:
        break;
    }
  };

  const onUpsertUsersSuccess = () => {
    refetch();
    setIsUpsertAdministratorDrawerVisible(false);
  };

  const handleUpdateUserStatus = (status) => {
    const userIds = administratorToUpdateStaus?.id;
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

  const handleMultiUpdateUserStatus = () => {
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
      dataIndex: 'firstname',
      width: '35%',
      render: renderNameCell,
    },
    {
      title: 'Email Address',
      dataIndex: 'email',
      align: 'justify',
      width: '35%',
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      render: renderStatusChip,
      align: 'justify',
    },
  ];

  return (
    <UserLayout
      actionBtnTxt="New Administrator"
      isPageLoaded={data?.users}
      btnAction={() => setIsUpsertAdministratorDrawerVisible(true)}
      title="Administrators"
      description="Users within an institution who is delegated to manage the activities on the platform."
      metaData={{
        inTotal: data?.users?.totalCount || 0,
        active: data?.users?.active || 0,
        inactive: data?.users?.inActive || 0,
      }}>
      <ResourceTable
        loading={loading}
        columns={columns}
        dataSource={data?.users?.results || []}
        rowSelection={{
          onChange: (_selectedRowKeys, selectedRows) =>
            setUserIdsArray(selectedRows?.map((item) => item?.id)),
        }}
        onRow={(record, rowIndex) => {
          if (record) {
            return {
              onClick: (event, record) => {
                if (record === undefined) {
                  return;
                }
                setUserIdsArray(record?.id);
              },
            };
          }
        }}
        onChange={() => null}
        filterControl={
          <FilterControl
            searchInputProps={{
              colSpan: {
                xs: 12,
                sm: 7,
              },
              onChange: (evt) =>
                handleChangeQueryParams({ search: evt.target.value, offset: DEFAULT_PAGE_OFFSET }),
            }}
            renderCustomFilters={
              <Grid item xs={12} sm={5}>
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
                </Box>
              </Grid>
            }
          />
        }
        options={(record) => [record.isActive ? 'Deactivate' : 'Activate', 'Edit']}
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
      <UpsertAdministratorDrawer
        open={isUpsertAdministratorDrawerVisible}
        onClose={() => {
          setIsUpsertAdministratorDrawerVisible(false);
          setAdministratorToEdit(null);
        }}
        onOkSuccess={onUpsertUsersSuccess}
        administrator={
          administratorToEdit
            ? {
                faculty: administratorToEdit?.faculty?.id,
                firstname: administratorToEdit?.firstname,
                lastname: administratorToEdit?.lastname,
                email: administratorToEdit?.email,
                id: administratorToEdit?.id,
              }
            : null
        }
      />
      <ConfirmationDialog
        title={`Are you sure you want to ${
          administratorToUpdateStaus?.isActive !== true ? 'enable' : 'disable'
        } ${administratorToUpdateStaus?.firstname} ${administratorToUpdateStaus?.lastname}`}
        description={
          administratorToUpdateStaus?.isActive !== true
            ? 'You are about to enable selected users'
            : 'Deleting this user will make the user unavailable as an Administrator in the institution'
        }
        okText={`${administratorToUpdateStaus?.isActive ? 'Deactivate User' : 'Activate user'}`}
        onOk={() => handleUpdateUserStatus(administratorToUpdateStaus?.isActive)}
        okButtonProps={{
          isLoading: deactivateUsersFeedback?.loading || activateFeedback?.loading,
          danger: true,
        }}
        onClose={() => {
          setAdministratorToUpdateStaus(null);
        }}
        open={Boolean(administratorToUpdateStaus)}
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
        onOk={handleMultiUpdateUserStatus}
        okButtonProps={{
          isLoading: deactivateUsersFeedback?.loading || activateFeedback?.loading,
          danger: true,
        }}
        onClose={() => {
          setOpenMultiUserTodelete(null);
        }}
        open={Boolean(openMultiUserTodelete)}
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

export default React.memo(Administrator);
