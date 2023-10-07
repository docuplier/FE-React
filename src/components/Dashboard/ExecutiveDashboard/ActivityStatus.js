import React, { memo } from 'react';
import { Box, Paper } from '@material-ui/core';
import PropTypes from 'prop-types';

import AreaChart from '../AreaChart';
import LineChartHeader from '../LineChartHeader';
import CustomFilter from './CustomFilter';
import Empty from 'reusables/Empty';
import LoadingView from 'reusables/LoadingView';

const ActivityStatus = ({
  chartData = [],
  options,
  onClickFilter,
  defaultText,
  inputLabel,
  value,
  isLoading,
  disabled,
}) => {
  const renderCustomFilterButton = () => {
    return (
      <CustomFilter
        inputLabel={inputLabel}
        value={value}
        defaultText={defaultText}
        onChange={onClickFilter}
        options={options}
        disabled={disabled}
      />
    );
  };

  return (
    <Box p={12} pt={0} component={Paper} elevation={0}>
      <LoadingView isLoading={isLoading}>
        <LineChartHeader
          chartTitle={'Activity Status'}
          indicators={[
            { label: 'Active', color: '#80ACFF' },
            { label: 'Inactive', color: '#F48989' },
          ]}
          customFilterButton={renderCustomFilterButton()}
        />
        {!chartData?.length ? (
          <Empty title="No Activity Status" description="Please use the filter button above" />
        ) : (
          <AreaChart data={chartData} bgColors={['#80ACFF', '#F48989']} />
        )}
      </LoadingView>
    </Box>
  );
};

ActivityStatus.propTypes = {
  onClickFilter: PropTypes.func,
  defaultText: PropTypes.string,
  inputLabel: PropTypes.string,
  value: PropTypes.string,
  options: PropTypes.array,
  disabled: PropTypes.bool,
};
export default memo(ActivityStatus);
