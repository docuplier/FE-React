import React, { memo } from 'react';
import { Box, Paper, Typography } from '@material-ui/core';

import PieChart from 'components/Dashboard/PieChart';
import Empty from 'reusables/Empty';
import LoadingView from 'reusables/LoadingView';
import { fontSizes } from '../../../Css';

const GenderAnalysis = ({ chartData = [], isLoading }) => {
  return (
    <Box component={Paper} elevation={0} p={12} pt={0}>
      <LoadingView isLoading={isLoading}>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
          <Typography color="textPrimary" style={{ fontSize: fontSizes.xlarge }}>
            <strong>Gender Analysis</strong>
          </Typography>
        </Box>
        {!chartData?.length ? (
          <Empty title="No Gender Statistics" />
        ) : (
          <PieChart data={chartData} direction="vertical" />
        )}
      </LoadingView>
    </Box>
  );
};

export default memo(GenderAnalysis);
