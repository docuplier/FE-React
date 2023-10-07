import { Box, Paper } from '@material-ui/core';
import React, { memo } from 'react';
import PropTypes from 'prop-types';

import AreaChart from '../AreaChart';
import LineChartHeader from '../LineChartHeader';
import Empty from 'reusables/Empty';
import LoadingView from 'reusables/LoadingView';

const CourseEnrollmentTrend = ({ chartData = [], onClickFilter, isLoading, disabled }) => {
  return (
    <Box p={12} component={Paper} elevation={0}>
      <LoadingView isLoading={isLoading}>
        <LineChartHeader
          chartTitle={'Course Enrollment Trend'}
          indicators={[
            { label: 'Enrollment Rate', color: '#B3CDFF' },
            { label: 'Completion Rate', color: '#041E44' },
          ]}
          onClickFilter={onClickFilter}
          disabled={disabled}
          renderFilter={true}
        />
        {!chartData?.length ? (
          <Empty
            title="No course enrollment trend"
            description="Please use the filter button above"
          />
        ) : (
          <AreaChart data={chartData} bgColors={['#B3CDFF', '#041E44']} fillType={'solid'} />
        )}
      </LoadingView>
    </Box>
  );
};

CourseEnrollmentTrend.propTypes = {
  onClickFilter: PropTypes.func,
};
export default memo(CourseEnrollmentTrend);
