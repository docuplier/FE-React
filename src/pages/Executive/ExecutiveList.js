import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Typography, Box, Avatar, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { PrivatePaths } from 'routes';
import MaxWidthContainer from 'reusables/MaxWidthContainer';
import FilterControl from 'reusables/FilterControl';
import StatisticCard from 'reusables/StatisticCard';
import { fontSizes, colors } from '../../Css';
import { DEFAULT_PAGE_OFFSET, DEFAULT_PAGE_LIMIT, UserRoles } from 'utils/constants';
import ResourceTable from 'reusables/ResourceTable';
import Chip from 'reusables/Chip';
import { getNameInitials } from 'utils/UserUtils';
import { spaces } from '../../Css';
import { useQueryPagination } from 'hooks/useQueryPagination';
import useNotification from 'reusables/NotificationBanner/useNotification';
import { GET_USERS } from 'graphql/queries/users';
import { useMutation } from '@apollo/client';
import { UPDATE_USER } from 'graphql/mutations/users';
import ConfirmationDialog from 'reusables/ConfirmationDialog';
import LoadingButton from 'reusables/LoadingButton';

function ExecutiveList() {
  const history = useHistory();
  const classes = useStyles();
  const notification = useNotification();
  const [queryParams, setQueryParams] = useState({
    search: '',
    offset: DEFAULT_PAGE_OFFSET,
    limit: DEFAULT_PAGE_LIMIT,
    ordering: null,
  });
  const [confirmationDialogData, setConfirmationDialogData] = useState(null);

  const [updateUser, { loading: isLoadingUpdateUser }] = useMutation(UPDATE_USER, {
    onCompleted: (data) => {
      if (!data?.updateUser?.ok) {
        notification.error({
          message: data?.updateUser?.errors[0]?.messages[0],
        });
        return;
      }

      notification.success({
        message: 'user status updated',
      });
      setConfirmationDialogData(null);
      refetch();
    },
    onError: (error) => {
      notification.error({
        message: error.message,
      });
    },
  });

  const updateUserStatus = () => {
    updateUser({
      variables: {
        id: confirmationDialogData?.id,
        newUser: {
          isActive: confirmationDialogData?.isActive ? false : true,
        },
      },
    });
  };

  const {
    loading: isLoadingExecutives,
    data: executive,
    refetch,
  } = useQueryPagination(GET_USERS, {
    variables: {
      role: UserRoles.EXECUTIVE,
      limit: queryParams.limit,
      search: queryParams.search,
      offset: queryParams.offset,
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });
  const data = executive?.users;
  const executiveUsers = data?.results?.reduce((acc, executive) => {
    acc.push({
      id: executive?.id,
      firstname: executive?.firstname,
      lastname: executive?.lastname,
      email: executive?.email,
      phone: executive?.phone,
      school: executive?.institutions?.length,
      isActive: executive?.isActive,
    });
    return acc;
  }, []);

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
        <Avatar style={{ background: '#F48989' }}>{getNameInitials(firstname, lastname)}</Avatar>{' '}
        <Typography style={{ marginLeft: spaces.small }}>{fullName}</Typography>
      </Box>
    );
  };

  const renderStatusChip = (text, data) => (
    <Chip
      label={data.isActive ? 'ACTIVE' : 'INACTIVE'}
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
      title: 'Email',
      dataIndex: 'email',
      ellipsis: true,
      tooltip: true,
      width: '20%',
    },
    {
      title: 'Phone No.',
      dataIndex: 'phone',
      render: (text) => text || '-',
      width: '10%',
    },
    {
      title: 'School',
      dataIndex: 'school',
      render: (text) => text || '-',
      width: '20%',
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      render: renderStatusChip,
      align: 'justify',
    },
  ];

  const handleSelectOption = (option, data) => {
    switch (option) {
      case 'Edit':
        history.push(`${PrivatePaths.EXECUTIVE}/new-executive?id=${data?.id}`);
        break;
      case 'Deactivate':
        setConfirmationDialogData(data);
        break;
      case 'Activate':
        setConfirmationDialogData(data);
        break;
      default:
        break;
    }
  };

  return (
    <Box className={classes.pageLayout}>
      <MaxWidthContainer spacing="md" className={classes.content}>
        <Typography variant="h6" className="header-title">
          Executives
        </Typography>
        <Box width={360} height={113} mb={17}>
          <StatisticCard
            title="Total Executives"
            description={data?.totalCount}
            data={[
              { label: `${data?.active || 0} active`, color: 'success' },
              { label: `${data?.inactive || 0} inactive`, color: 'error' },
            ]}
          />
        </Box>
        <ResourceTable
          loading={isLoadingExecutives}
          columns={columns}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => history.push(`${PrivatePaths.USERS}/instructors/${record.id}`),
            };
          }}
          dataSource={executiveUsers}
          onChange={() => null}
          filterControl={
            <FilterControl
              renderCustomFilters={
                <Grid xs={4} style={{ textAlign: 'right' }}>
                  <LoadingButton
                    color="primary"
                    isLoading={false}
                    onClick={() => history.push(`${PrivatePaths.EXECUTIVE}/new-executive`)}>
                    New Executive
                  </LoadingButton>
                </Grid>
              }
              searchInputProps={{
                onChange: (evt) =>
                  handleChangeQueryParams({
                    search: evt.target.value,
                    offset: DEFAULT_PAGE_OFFSET,
                  }),
              }}
            />
          }
          options={(record) => ['Edit', record.isActive ? 'Deactivate' : 'Activate']}
          onSelectOption={handleSelectOption}
          pagination={{
            total: data?.totalCount,
            onChangeLimit: (_offset, limit) =>
              handleChangeQueryParams({ limit, offset: DEFAULT_PAGE_OFFSET }),
            onChangeOffset: (offset) => handleChangeQueryParams({ offset }),
            limit: queryParams.limit,
            offset: queryParams.offset,
          }}
        />
      </MaxWidthContainer>
      <ConfirmationDialog
        open={Boolean(confirmationDialogData)}
        onClose={() => setConfirmationDialogData(null)}
        title={`${confirmationDialogData?.isActive ? 'Deactivate' : 'Activate'} Executive`}
        description="Are you sure you want to perform this action?"
        okText={confirmationDialogData?.isActive ? 'Deactivate' : 'Activate'}
        onOk={updateUserStatus}
        okButtonProps={{
          variant: 'contained',
          color: 'primary',
          danger: confirmationDialogData?.isActive,
          isLoading: isLoadingUpdateUser,
        }}
      />
    </Box>
  );
}

export default ExecutiveList;

const useStyles = makeStyles((theme) => ({
  pageLayout: {
    background: colors.background,
    height: '100%',
    minHeight: '100vh',
  },
  content: {
    background: colors.background,
    '& .header-title': {
      fontSize: fontSizes.xlarge,
      marginBottom: 24,
    },
  },
}));
