import React from 'react';
import { Box, Paper } from '@material-ui/core';
import PropTypes from 'prop-types';
import LoadingView from 'reusables/LoadingView';
import Empty from 'reusables/Empty';
import AreaChart from '../AreaChart';
import LineChartHeader from '../LineChartHeader';

const CourseEnrollmentTrend = ({ data = [], programName, onClickFilter, isLoading }) => {
  return (
    <Box p={12} component={Paper} elevation={0}>
      <LoadingView isLoading={isLoading}>
        <LineChartHeader
          chartTitle={'Course Enrollment Trend'}
          programName={programName || 'N/A'}
          onClickFilter={onClickFilter}
          indicators={[
            { label: 'Enrollment Rate', color: '#B3CDFF' },
            { label: 'Completion Rate', color: '#0050C8' },
          ]}
          renderFilter={true}
        />
        {data.length === 0 ? (
          <Empty title="No sessions available" description="Please use the filter dropdown above" />
        ) : (
          <AreaChart data={data} bgColors={['#B3CDFF', '#0050C8']} tooltipTitle={'Courses'} />
        )}
      </LoadingView>
    </Box>
  );
};

CourseEnrollmentTrend.propTypes = {
  data: PropTypes.shape({
    ...AreaChart.propTypes.data,
  }),
  programName: PropTypes.string,
  isLoading: PropTypes.bool,
};

export default CourseEnrollmentTrend;
