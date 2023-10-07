import React from 'react';
import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';

const VerticalBarChart = ({ data, height, title, label }) => {
  const { Xaxis, Yaxis } = data?.reduce(
    (acc, item) => {
      acc?.Xaxis?.push(item?.Xaxis);
      acc?.Yaxis?.push(item?.Yaxis);
      return acc;
    },
    { Xaxis: [], Yaxis: [] },
  );

  const option = {
    series: [
      {
        name: label,
        data: Yaxis,
      },
    ],
    options: {
      chart: {
        type: 'bar',
        height: height,
      },
      fill: {
        colors: ['#0050C8'],
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          horizontal: true,
          padding: 20,
        },
        dataLabels: {
          position: 'bottom',
          maxItems: 100,
          hideOverflowingLabels: true,
        },
      },
      dataLabels: {
        enabled: false,
        textAnchor: 'middle',
      },
      xaxis: {
        categories: Xaxis,
      },
      yaxis: {
        labels: {
          align: 'center',
        },
      },
      noData: {
        text: 'No Chart data available',
        align: 'center',
        verticalAlign: 'middle',
        offsetX: 0,
        offsetY: 0,
        style: {
          color: 'Grey',
          fontSize: '14px',
          fontFamily: undefined,
        },
      },
      title: {
        text: title,
        align: 'left',
        margin: 10,
        offsetX: 0,
        offsetY: 0,
        floating: false,
        style: {
          fontSize: '18px',
          fontWeight: 'bold',
          fontFamily: 'Raleway',
          color: '#111C55',
        },
      },
    },
  };

  return (
    <ReactApexChart options={option.options} series={option.series} type="bar" height={height} />
  );
};

VerticalBarChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      Yaxis: PropTypes.array,
      Xaxis: PropTypes.array,
    }),
  ),
  height: PropTypes.number,
  title: PropTypes.string,
};
export default VerticalBarChart;
