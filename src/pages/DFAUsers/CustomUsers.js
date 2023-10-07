import { Avatar, Box, Grid, makeStyles, Typography } from '@material-ui/core';
import UserLayout from 'Layout/UserLayout';
import React, { useState } from 'react';
import Chip from 'reusables/Chip';
import FilterControl from 'reusables/FilterControl';
import ResourceTable from 'reusables/ResourceTable';
import UpsertCustomUserDrawer from '../../components/Users/UpsertCustomUserDrawer';
import { colors, spaces } from '../../Css';
import LoadingButton from 'reusables/LoadingButton';
import { ReactComponent as DownloadIcon } from 'assets/svgs/download.svg';
import { CSVLink } from 'react-csv';
import { csvData } from 'utils/csvDownloaderUtils';

const CustomUsers = () => {
  const classes = useStyles();
  const [isUpsertUserDrawerVisible, setisUpsertUserDrawerVisible] = useState(false);

  const renderNameCell = () => {
    return (
      <Box display="flex" alignItems="center">
        <Avatar style={{ background: '#F48989' }}>OA</Avatar>{' '}
        <Typography style={{ marginLeft: spaces.small }}>Oderinde Adekunle</Typography>
      </Box>
    );
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: true,
      render: renderNameCell,
      width: '25%',
    },
    {
      title: 'Email Address',
      dataIndex: 'email',
      align: 'justify',
      width: '25%',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      sorter: true,
      width: '15%',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (text, data) => (
        <Chip label={text} variant="outlined" roundness="sm" color="inactive" size="md" />
      ),
      ellipsis: true,
      tooltip: true,
      align: 'justify',
    },
  ];

  return (
    <UserLayout
      actionBtnTxt="New User"
      btnAction={() => setisUpsertUserDrawerVisible(true)}
      isPageLoaded={true}
      title="Custom Users"
      description="Senior executives within the state government given different analytics permission."
      metaData={{ inTotal: 12, active: 9, inactive: 3 }}>
      <ResourceTable
        columns={columns}
        dataSource={dataSource}
        rowSelection={{
          onChange: (selectedRowKeys, selectedRows) => null,
        }}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => null,
          };
        }}
        onChange={(pagination, filters, sorter, { currentDataSource, action: changeAction }) =>
          null
        }
        filterControl={
          <FilterControl
            searchInputProps={{
              colSpan: {
                xs: 12,
                sm: 7,
              },
            }}
            renderCustomFilters={
              <Grid item xs={12} sm={5}>
                <Box display="flex" alignItems="center" justifyContent="flex-end">
                  <Box display="flex" justifyContent="flex-start" alignItems="center">
                    <Typography color="textSecondary" style={{ paddingRight: 8 }}>
                      Export
                    </Typography>
                    <CSVLink
                      filename={'Custom-users.csv'}
                      data={csvData?.getLecturerTableData('customUserCsvData')}
                      separator={','}
                      headers={csvData?.getHeadingData(columns)}>
                      <LoadingButton color="primary" isLoading={false}>
                        <DownloadIcon />
                      </LoadingButton>
                    </CSVLink>
                  </Box>
                </Box>
              </Grid>
            }
          />
        }
        options={(record) => ['Edit', 'Delete', record.active ? 'Deactivate' : 'Activate']}
        onSelectOption={(option, data) => null}
        pagination={{
          total: 30,
        }}
      />
      <UpsertCustomUserDrawer
        open={isUpsertUserDrawerVisible}
        onClose={() => setisUpsertUserDrawerVisible(false)}
        knownFormFields={{
          faculty: null,
          department: null,
          level: null,
        }}
      />
    </UserLayout>
  );
};

const dataSource = [
  {
    name: 'Gbenga Adeyemo',
    status: 'DISABLED',
    gender: 'Male',
    email: 'gbenga.adeyemo@gmail.com',
    active: false,
  },
  {
    name: 'Toyin Davis',
    status: 'ENABLED',
    gender: 'Female',
    email: 'feranmi.davis@email.com',
    active: true,
  },
  {
    name: 'Tobi Odunlade',
    status: 'DISABLED',
    gender: 'Male',
    email: 'Odunlade.segun@email.com',
    active: false,
  },
  {
    name: 'Gbenga Adeyemo',
    status: 'DISABLED',
    gender: 'Male',
    email: 'gbenga.adeyemo@gmail.com',
    active: false,
  },
  {
    name: 'Toyin Davis',
    status: 'ENABLED',
    gender: 'Female',
    email: 'feranmi.davis@email.com',
    active: true,
  },
  {
    name: 'Tobi Odunlade',
    status: 'DISABLED',
    gender: 'Male',
    email: 'Odunlade.segun@email.com',
    active: false,
  },
  {
    name: 'Gbenga Adeyemo',
    status: 'DISABLED',
    gender: 'Male',
    email: 'gbenga.adeyemo@gmail.com',
    active: false,
  },
  {
    name: 'Toyin Davis',
    status: 'ENABLED',
    gender: 'Female',
    email: 'feranmi.davis@email.com',
    active: true,
  },
  {
    name: 'Tobi Odunlade',
    status: 'DISABLED',
    gender: 'Male',
    email: 'Odunlade.segun@email.com',
    active: false,
  },
];

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
export default React.memo(CustomUsers);
