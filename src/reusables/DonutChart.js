import { Box } from '@material-ui/core';
import React from 'react';
import Chart from 'react-apexcharts';
import Empty from 'reusables/Empty';
import PropTypes from 'prop-types';

const DonutChart = ({
  title = '',
  data,
  chartLabel = [],
  donutColors = ['#F48989', '#5ACA75'],
}) => {
  const option = {
    options: {
      chart: {
        type: 'donut',
      },
      fill: {
        colors: donutColors,
      },
      dataLabels: {
        enabled: false,
      },
      labels: chartLabel,
      legend: {
        show: false,
      },
      tooltip: {
        enabled: true,
        fillSeriesColor: false,
        theme: 'light',
        marker: {
          show: false,
        },
      },
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            legend: {
              show: false,
            },
            labels: {
              show: false,
              name: {
                show: false,
              },
            },
          },
        },
      },
    },
    series: data,
  };

  const DataCount = option?.series?.length;

  const renderEmpty = () => {
    return (
      <Box>
        <Empty description={`No ${title} data`} />
      </Box>
    );
  };

  return (
    <Box>
      {DataCount > 0 ? (
        <Chart
          options={option.options}
          series={option.series}
          type="donut"
          width="100%"
          height="280"
        />
      ) : (
        renderEmpty()
      )}
    </Box>
  );
};

DonutChart.propTypes = {
  colors: PropTypes.array,
  data: PropTypes.array,
  sizes: PropTypes.string,
  chartLabel: PropTypes.array,
  donutColors: PropTypes.array,
};
export default DonutChart;
