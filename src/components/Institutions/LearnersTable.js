import React, { useState } from 'react';
import { useParams, useLocation, useHistory } from 'react-router-dom';

import ResourceTable from 'reusables/ResourceTable';
import Chip from 'reusables/Chip';
import FilterControl from 'reusables/FilterControl';
import { GET_USERS } from 'graphql/queries/users';
import { UserRoles, DEFAULT_PAGE_OFFSET, DEFAULT_PAGE_LIMIT } from 'utils/constants';
import { Typography } from '@material-ui/core';
import { useQueryPagination } from 'hooks/useQueryPagination';
import LoadingView from 'reusables/LoadingView';
import { useNotification } from 'reusables/NotificationBanner';
import { PrivatePaths } from 'routes';

const LearnersTable = () => {
  const { departmentId, levelId, institutionId } = useParams();
  const notification = useNotification();
  const params = new URLSearchParams(useLocation().search);
  const programId = params.get('programId');
  const programType = params.get('programType');
  const history = useHistory();
  const [queryParams, setQueryParams] = useState({
    search: '',
    offset: DEFAULT_PAGE_OFFSET,
    limit: DEFAULT_PAGE_LIMIT,
    ordering: null,
    program: programId.toLowerCase() === 'all' ? null : programId,
    programType: programType.toLowerCase() === 'all' ? null : programType,
    role: UserRoles.STUDENT,
    department: departmentId,
    level: levelId,
    institutionId,
  });

  const { loading: userDataLoading, data: usersData } = useQueryPagination(GET_USERS, {
    variables: queryParams,
    onError: (error) => {
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

  const renderNameCell = (text, data) => {
    const fullName = data.firstname + ' ' + data.lastname;
    return <Typography>{fullName}</Typography>;
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
    },
    {
      title: 'Emails',
      dataIndex: 'email',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: 'Learners ID',
      dataIndex: 'matricNumber',
      sorter: true,
    },
    {
      title: 'No. of Courses',
      dataIndex: 'numberOfCourses',
      sorter: true,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      render: renderStatusChip,
    },
  ];

  return (
    <LoadingView isLoading={userDataLoading}>
      <ResourceTable
        columns={columns}
        dataSource={usersData?.users?.results}
        rowSelection={{
          onChange: (_selectedRowKeys, selectedRows) => console.log(selectedRows),
        }}
        onRow={(record) => ({
          onClick: () => history.push(`${PrivatePaths.USERS}/learners/${record.id}`),
        })}
        onChange={(pagination, filters, sorter) => console.log(pagination, filters, sorter)}
        filterControl={
          <FilterControl
            searchInputProps={{
              colSpan: {
                xs: 12,
              },
              onChange: (evt) => handleChangeQueryParams({ search: evt.target.value }),
            }}
          />
        }
        pagination={{
          total: usersData?.users?.totalCount,
          onChangeLimit: (_offset, limit) =>
            handleChangeQueryParams({ limit, offset: DEFAULT_PAGE_OFFSET }),
          onChangeOffset: (offset) => handleChangeQueryParams({ offset }),
          limit: queryParams.limit,
          offset: queryParams.offset,
        }}
      />
    </LoadingView>
  );
};

export default React.memo(LearnersTable);
