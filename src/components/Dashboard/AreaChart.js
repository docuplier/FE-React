import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';
import { colors, fontSizes, fontWeight } from '../../Css';

const AreaChart = ({ data, height = 350, bgColors, tooltipTitle, fillType = 'gradient' }) => {
  const classes = useStyles();
  const { enrollmentRate, completionRate, categories } = data?.reduce(
    (acc, current) => {
      acc?.enrollmentRate?.push(current?.topLineValue);
      acc?.completionRate?.push(current?.bottomLineValue);
      acc?.categories?.push(current?.name);

      return acc;
    },
    { enrollmentRate: [], completionRate: [], categories: [] },
  );

  const customTooltip = ({ seriesIndex, w, series, dataPointIndex }) => {
    tooltipTitle = data[dataPointIndex]?.name;

    const tooltipData = data[dataPointIndex]?.tooltipData || [
      { key: w?.globals?.labels[seriesIndex], value: series[dataPointIndex] },
    ];
    let listItems = '';
    tooltipData?.forEach((item) => {
      listItems += `
                    <div class="tooltip-container__list-item">
                      <p class="value">${item?.key} <span class="span">${item?.value}</span></p>
                    </div>
                `;
    });

    return `
              <div class="tooltip-container">
                <p class="tooltip-container__title">${tooltipTitle}</p>
                <p > ${listItems} </p>
              </div>
          `;
  };

  const series = [
    {
      name: 'Enrollment Rate ',
      data: enrollmentRate,
    },
    {
      name: 'Completion Rate',
      data: completionRate,
    },
  ];

  const options = {
    options: {
      chart: {
        height: height,
        type: 'area',
      },
      forecastDataPoints: {
        count: 7,
      },
      colors: bgColors,
      stroke: {
        width: 2,
        curve: 'straight',
      },
      fill: {
        type: fillType,
      },
      yaxis: {
        tickAmount: 7,
      },
      xaxis: {
        type: 'category',
        categories,
        labels: {
          rotate: -70,
          show: true,
          rotateAlways: true,
        },
        offsetY: 0,
        offsetX: 5,
        tooltip: {
          enabled: false,
        },
      },
      markers: {
        size: 4,
        colors: bgColors,
        fillOpacity: [1],
      },
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        enabled: true,
        fillSeriesColor: false,
        theme: 'light',
        marker: {
          show: false,
        },
        custom: function ({ series, seriesIndex, w, dataPointIndex }) {
          return customTooltip({ seriesIndex, w, series, dataPointIndex });
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
    },
  };

  return (
    <Box className={classes.container}>
      <ReactApexChart
        options={options?.options || {}}
        series={series}
        type="area"
        height={height}
      />
    </Box>
  );
};

AreaChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      topLineValue: PropTypes.number,
      bottomLineValue: PropTypes.number,
      tooltipData: PropTypes.arrayOf(
        PropTypes.shape({
          key: PropTypes.string,
          value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        }),
      ),
    }),
  ),
  tooltipTitle: PropTypes.string,
  height: PropTypes.number,
  bgColors: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
};

const useStyles = makeStyles((theme) => ({
  container: {
    boxSizing: 'border-box',
    '& div.apexcharts-toolbar': {
      display: 'none',
    },
    '& .tooltip-container': {
      position: 'relative',
      background: 'rgba(0,0,0,0.8)',
      borderRadius: 8,
      padding: theme.spacing(4),
      color: colors.white,
    },
    '& .tooltip-container__title': {
      color: colors.white,
      fontSize: fontSizes.medium,
      fontWeight: fontWeight.bold,
      paddingBottom: theme.spacing(4),
    },
    '& .tooltip-container__list-item': {
      minWidth: 200,
      marginTop: theme.spacing(4),
      '& .value': {
        color: colors.white,
        fontSize: fontSizes.medium,
      },
    },
    '& .span': {
      float: 'right',
      fontWeight: fontWeight.bold,
      paddingLeft: theme.spacing(15),
    },
  },
}));

export default AreaChart;
