import React, { useState, useMemo } from 'react';
import { Box, Paper } from '@material-ui/core';

import DonutChart from 'components/Dashboard/DonutChart';

export const UserStatisticsGraph = ({ UsersStatistics }) => {
  const [currentTabForUsersStat, setCurrentTabForUsersStat] = useState(0);

  const getUsersStat = useMemo(() => {
    const tabValues = {
      0: 'total',
      1: 'active',
      2: 'inactive',
    };

    return Object.keys(UsersStatistics).map((user) => ({
      label: user,
      count: UsersStatistics[user][tabValues[currentTabForUsersStat]],
    }));
    //eslint-disable-next-line
  }, [currentTabForUsersStat]);

  return (
    <Box component={Paper} elevation={0} p={12}>
      <DonutChart
        title="Total Users"
        tabs={['All', 'Active', 'Inactive']}
        onChangeTab={(_evt, newValue) => setCurrentTabForUsersStat(newValue)}
        data={getUsersStat}
        currentTab={currentTabForUsersStat}
      />
    </Box>
  );
};
