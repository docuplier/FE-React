import { Box, Paper, Typography } from '@material-ui/core';
import React, { memo } from 'react';

import { fontWeight } from '../../../Css';
import BubbleChart from '../BubbleChart';
import Empty from 'reusables/Empty';
import LoadingView from 'reusables/LoadingView';

const LearnersInterest = ({ chartData = [], isLoading }) => {
  const isZero = chartData?.every(({ data }) => data === 0);

  return (
    <Box p={12} component={Paper} elevation={0}>
      <LoadingView isLoading={isLoading}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6" color="textPrimary" style={{ fontWeight: fontWeight.bold }}>
              Learners' Interests
            </Typography>
          </Box>
        </Box>
        {!chartData?.length || isZero ? (
          <Empty title="No learners interests'" />
        ) : (
          <BubbleChart data={chartData} />
        )}
      </LoadingView>
    </Box>
  );
};

export default memo(LearnersInterest);
