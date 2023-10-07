import { Avatar, Box, Grid, makeStyles, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import { useHistory } from 'react-router-dom';
import Chip from 'reusables/Chip';
import FilterControl from 'reusables/FilterControl';
import LoadingView from 'reusables/LoadingView';
import ResourceTable from 'reusables/ResourceTable';
import StatisticCard from 'reusables/StatisticCard';
import { PrivatePaths } from 'routes';
import { getNameInitials } from 'utils/UserUtils';
import { DEFAULT_PAGE_OFFSET } from 'utils/constants';

const InstructorList = ({
  totalCountOfInstructors,
  activeCount,
  inactiveCount,
  data: { total, instructors },
  loading,
  onChangeQueryParams,
  queryParams,
}) => {
  const classes = useStyles();
  const history = useHistory();

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (_text, data) => (
        <Box display="flex" alignItems="center">
          <Avatar src={data?.image} className={classes.avatar}>
            {getNameInitials(data?.firstname, data?.lastname)}
          </Avatar>
          <Typography variant="body2" color="textSecondary">
            {data?.lastname} {data?.firstname}
          </Typography>
        </Box>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      render: (isActive) => (
        <Chip
          label={isActive ? 'ACTIVE' : 'DISABLED'}
          color={isActive ? 'active' : 'inactive'}
          variant="outlined"
          roundness="sm"
          size="md"
        />
      ),
    },
  ];

  const renderStatisics = () => {
    return (
      <Box mb={12}>
        <Grid container>
          <Grid item xs={3}>
            <StatisticCard
              title="Total Lecturers"
              description={totalCountOfInstructors || 0}
              hideImage
              data={[
                { label: `${activeCount || 0} active`, color: 'success' },
                { label: `${inactiveCount || 0} inactive`, color: 'error' },
              ]}
            />
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <>
      {renderStatisics()}
      <LoadingView isLoading={loading}>
        <ResourceTable
          columns={columns}
          dataSource={instructors}
          onChange={(pagination, filters, sorter) => console.log(pagination, filters, sorter)}
          onRow={(record) => ({
            onClick: () => history.push(`${PrivatePaths.USERS}/instructors/${record.id}`),
          })}
          filterControl={
            <FilterControl
              searchInputProps={{
                colSpan: {
                  xs: 12,
                },
                onChange: (evt) => onChangeQueryParams({ search: evt.target.value }),
              }}
            />
          }
          pagination={{
            total,
            onChangeLimit: (_offset, limit) =>
              onChangeQueryParams({ limit, offset: DEFAULT_PAGE_OFFSET }),
            onChangeOffset: (offset) => onChangeQueryParams({ offset }),
            limit: queryParams.limit,
            offset: queryParams.offset,
          }}
        />
      </LoadingView>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: 32,
    height: 32,
    marginRight: theme.spacing(8),
  },
}));

InstructorList.propTypes = {
  totalCountOfInstructors: PropTypes.number.isRequired,
  activeCount: PropTypes.number.isRequired,
  inactiveCount: PropTypes.number.isRequired,
  data: PropTypes.shape({
    total: PropTypes.number.isRequired,
    instructors: PropTypes.arrayOf(
      PropTypes.shape({
        imageSrc: PropTypes.string,
        firstname: PropTypes.string.isRequired,
        lastname: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        gender: PropTypes.string,
        isActive: PropTypes.bool,
      }),
    ),
  }),
};

export default React.memo(InstructorList);
