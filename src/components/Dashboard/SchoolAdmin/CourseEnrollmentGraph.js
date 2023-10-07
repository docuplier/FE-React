import React from 'react';
import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';
import { Box, makeStyles } from '@material-ui/core';
import { colors, fontSizes, fontWeight } from '../../../Css';

const CourseEnrollmentGraph = ({ data, height, chartEvents, isLoading }) => {
  const classes = useStyles();

  const { label, value } = data.reduce(
    (acc, item) => {
      acc.label.push(item.label);
      acc.value.push(item.value);
      return acc;
    },
    { label: [], value: [] },
  );

  const customTooltip = ({ dataPointIndex, w, series }) => {
    const tooltipData = data[dataPointIndex]?.tooltipData || [
      { key: w.globals.labels[dataPointIndex], value: series[0][dataPointIndex] },
    ];
    let listItems = '';

    tooltipData.forEach((item) => {
      listItems += `
                <p class="faculty">${
                  data[dataPointIndex]?.faculty.length > 30
                    ? data[dataPointIndex]?.faculty.substring(0, 30) + '...'
                    : data[dataPointIndex]?.faculty
                }</p>
                <div class="tooltip-container__list-item">
                    <span class="key">${item.key}:</span>
                    <span class="value">${item.value}</span>
                </div>
            `;
    });

    return `
            <div class="tooltip-container">
            <h3>Course Enrollment</h3>
                ${listItems}
            </div>
        `;
  };

  const option = {
    series: [
      {
        data: value,
      },
    ],
    options: {
      chart: {
        type: 'bar',
        height: height,
        events: {
          click(_event, _chartContext, config) {
            const index = config?.dataPointIndex;
            const label = config?.globals?.labels[index];
            const item = data?.find((_item, i) => index === i);

            chartEvents?.onClick({
              index,
              label,
              item,
            });
          },
        },
      },
      tooltip: {
        enabled: true,
        fillSeriesColor: false,
        custom: function ({ series, w, dataPointIndex }) {
          return customTooltip({ dataPointIndex, w, series });
        },
      },
      fill: {
        colors: ['#0050C8'],
      },
      plotOptions: {
        bar: {
          borderRadius: 0,
          horizontal: true,
          padding: 20,
          barHeight: '25%',
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: label,
        axisBorder: {
          show: false,
        },
      },
      yaxis: {
        labels: {
          show: true,
          style: {
            colors: value.map(() => '#6B6C7E'),
            fontSize: '16px',
          },
        },
      },
      grid: {
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: false,
          },
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
      <ReactApexChart options={option.options} series={option.series} type="bar" height={height} />
    </Box>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    '& .tooltip-container': {
      position: 'relative',
      background: 'rgba(0,0,0,0.7)',
      borderRadius: 8,
      padding: theme.spacing(4),
      color: colors.white,
    },
    '& .tooltip-container__title': {
      color: colors.white,
      fontSize: fontSizes.medium,
      fontWeight: fontWeight.bold,
    },
    '& .tooltip-container__list-item': {
      display: 'flex',
      minWidth: 200,
      justifyContent: 'space-between',
      marginTop: theme.spacing(4),
      '& .key': {
        color: colors.white,
        fontSize: fontSizes.medium,
        textTransform: 'capitalize',
      },
      '& .value': {
        color: colors.white,
        fontSize: fontSizes.medium,
        fontWeight: fontWeight.bold,
      },
      '& .faculty': {
        fontWeight: fontWeight.regular,
        fontSize: fontSizes.title,
      },
    },
  },
  autocomplete: {
    '& label.MuiFormLabel-root.MuiInputLabel-root': {
      top: 5,
    },
  },
}));

CourseEnrollmentGraph.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      Yaxis: PropTypes.array,
      Xaxis: PropTypes.array,
    }),
  ),
  height: PropTypes.number,
  chartEvents: PropTypes.shape({
    onClick: PropTypes.func,
  }),
  onSearch: PropTypes.func,
};
export default CourseEnrollmentGraph;
