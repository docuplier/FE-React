import { Box } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import Chart from 'react-apexcharts';
import Empty from 'reusables/Empty';

const BarChart = ({ XaxisData, Yaxis, title = '' }) => {
  const option = {
    options: {
      chart: {
        id: 'basic-bar',
      },
      xaxis: {
        categories: XaxisData,
      },
      fill: {
        colors: ['#FFCC2E'],
      },
    },
    series: [
      {
        name: Yaxis?.name,
        data: Yaxis?.data,
      },
    ],
  };

  const xAxisDataCount = option?.options?.xaxis?.categories?.length;
  const yAxisDataCount = option?.series[0]?.data?.length;

  const renderEmpty = () => {
    return <Empty description={`No ${title} data`} />;
  };

  return (
    <Box style={{ width: '100%' }}>
      {xAxisDataCount > 0 || yAxisDataCount > 0 ? (
        <Chart
          options={option.options}
          series={option.series}
          type="bar"
          width="90%"
          height="280"
        />
      ) : (
        renderEmpty()
      )}
    </Box>
  );
};

BarChart.propTypes = {
  XaxisData: PropTypes.array,
  Yaxis: PropTypes.shape({
    name: PropTypes.string,
    data: PropTypes.array,
  }),
  colors: PropTypes.array,
};
export default BarChart;
