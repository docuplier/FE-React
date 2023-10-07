import { Avatar, Box, Divider, Typography, makeStyles, Grid } from '@material-ui/core';
import UpsertMigrationDrawer from 'components/Users/UpsertMigrationDrawer';
import { GET_EXISTING_USERS } from 'graphql/queries/users';
import { useQueryPagination } from 'hooks/useQueryPagination';
import UserLayout from 'Layout/UserLayout';
import React, { useState } from 'react';
import FilterControl from 'reusables/FilterControl';
import ResourceTable from 'reusables/ResourceTable';
import LoadingButton from 'reusables/LoadingButton';
import { ReactComponent as DownloadIcon } from 'assets/svgs/download.svg';
import { downloadCSV } from 'download-csv';
import { csvData } from 'utils/csvDownloaderUtils';
import { useNotification } from 'reusables/NotificationBanner';
import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET } from 'utils/constants';
import { getNameInitials } from 'utils/UserUtils';
import { spaces, colors, fontSizes, fontWeight } from '../../Css';

const Migration = () => {
  const [queryParams, setQueryParams] = useState({
    search: '',
    offset: DEFAULT_PAGE_OFFSET,
    limit: DEFAULT_PAGE_LIMIT,
    ordering: null,
  });
  const [shouldExportData, setShouldExportData] = useState(false);
  const [existingUserToEdit, setExistingUserToEdit] = useState(null);
  const [isUpsertUpdateUserDrawerVisible, setIsUpsertUpdateUserDrawerVisible] = useState(false);
  const classes = useStyles();
  const notification = useNotification();

  const { loading, data, refetch } = useQueryPagination(GET_EXISTING_USERS, {
    variables: queryParams,
    onError(error) {
      notification.error({
        message: error?.message,
      });
    },
  });

  const { loading: isLoadingCsvData } = useQueryPagination(GET_EXISTING_USERS, {
    variables: { ...queryParams, limit: 100000, asExport: true },
    skip: !shouldExportData,
    onCompleted: (data) => {
      downloadCSV(
        csvData?.getMigrationTableData(data),
        csvData.getHeadingData(columns),
        'Migration-data.csv',
      );
    },
    onError(error) {
      notification.error({
        message: error?.message,
      });
    },
  });

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

  const columns = [
    {
      title: 'Name',
      dataIndex: 'firstname',
      render: renderNameCell,
    },
    {
      title: 'Matric No.',
      dataIndex: 'matricNumber',
      render: (text) => text || '-',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: 'Department',
      dataIndex: 'department',
      render: (_, data) => data?.department?.name || '-',
      ellipsis: true,
    },
    {
      title: 'Faculty',
      dataIndex: 'faculty',
      render: (_, data) => data?.faculty?.name || '-',
      ellipsis: true,
      tooltip: true,
    },
  ];

  const renderMigratedUsersMetaData = () => {
    return (
      <Box display="flex" alignItems="center" className={classes.metaDataContainer}>
        <Typography component="span" variant="body1">
          <Typography component="span" className="boldText">
            {data?.existingUsers?.totalCount || 0}
          </Typography>{' '}
          in total
        </Typography>
        <Box ml={8} mr={8}>
          <Divider orientation="vertical" className="divider" />
        </Box>
        <Typography component="span" variant="body1">
          <Typography component="span" className="boldText">
            {data?.existingUsers?.migrated || 0}
          </Typography>{' '}
          migrated
        </Typography>
        <Box ml={8} mr={8}>
          <Divider orientation="vertical" className="divider" />
        </Box>
        <Typography component="span" variant="body1">
          <Typography component="span" className="boldText">
            {data?.existingUsers?.pending || 0}
          </Typography>{' '}
          pending
        </Typography>
      </Box>
    );
  };

  return (
    <UserLayout
      btnAction={() => setIsUpsertUpdateUserDrawerVisible(true)}
      title="Migration"
      description="Users registered on the platform for the purpose of learning."
      isPageLoaded={data?.existingUsers}
      customInformation={renderMigratedUsersMetaData()}>
      <ResourceTable
        loading={loading}
        columns={columns}
        dataSource={data?.existingUsers?.results || []}
        rowSelection={{
          onChange: () => null,
        }}
        onRow={(record) => {
          return {
            onClick: () => {
              setExistingUserToEdit(record);
              setIsUpsertUpdateUserDrawerVisible(true);
            },
          };
        }}
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
                <Box display="flex" alignItems="center" justifyContent="flex-end">
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
        pagination={{
          total: data?.existingUsers?.totalCount,
          onChangeLimit: (_offset, limit) =>
            handleChangeQueryParams({ limit, offset: DEFAULT_PAGE_OFFSET }),
          onChangeOffset: (offset) => handleChangeQueryParams({ offset }),
          limit: queryParams.limit,
          offset: queryParams.offset,
        }}
      />
      <UpsertMigrationDrawer
        open={isUpsertUpdateUserDrawerVisible}
        onClose={() => {
          setIsUpsertUpdateUserDrawerVisible(false);
          setExistingUserToEdit(null);
        }}
        onOkSuccess={() => refetch()}
        existingUser={
          existingUserToEdit
            ? {
                ...existingUserToEdit,
                email: existingUserToEdit?.email,
                firstname: existingUserToEdit?.firstname,
                lastname: existingUserToEdit?.lastname,
                middlename: existingUserToEdit?.middlename,
                phone: existingUserToEdit?.phone,
                gender: existingUserToEdit?.gender,
                department: existingUserToEdit?.department?.id,
                matricNumber: existingUserToEdit?.matricNumber,
                level: existingUserToEdit?.level?.id,
                school: existingUserToEdit?.institution?.name,
                id: existingUserToEdit?.id,
              }
            : null
        }
      />
    </UserLayout>
  );
};

const useStyles = makeStyles({
  metaDataContainer: {
    '& .boldText': {
      fontWeight: fontWeight.bold,
    },
    '& .divider': {
      height: fontSizes.large,
      backgroundColor: colors.white,
    },
  },
  btn: {
    minWidth: 100,
    marginRight: 16,
    '&.MuiButton-contained': {
      color: colors.primary,
      background: colors.primaryLight,
    },
  },
});

export default React.memo(Migration);
