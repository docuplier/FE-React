import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { memo } from 'react';
import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';
import { colors, fontSizes, fontWeight } from '../../Css';

const BubbleChart = ({ data, height = 350 }) => {
  const classes = useStyles();
  const { dataSet, labels } = data?.reduce(
    (acc, current) => {
      acc?.dataSet?.push(current?.data);
      acc?.labels?.push(current?.name);

      return acc;
    },
    { dataSet: [], labels: [] },
  );

  const customTooltip = ({ seriesIndex, w }) => {
    const tooltipData = data[seriesIndex]?.tooltipData || [
      { key: w?.globals?.labels[seriesIndex], value: data[seriesIndex]?.name },
    ];
    let listItems = '';

    tooltipData?.forEach((item) => {
      listItems += `
                    <div class="tooltip-container__list-item">
                      <p class="value"> ${item?.key} <span class="span">${item?.value}</span></p>
                    </div>
                `;
    });

    return `
              <div class="tooltip-container">
                <p class="tooltip-container__title">Learners' Interest</p>
                <p>${listItems}</p>
              </div>
          `;
  };

  const generateData = (dat) => {
    let series = [];
    let i = 0;

    for (i = 0; i < 1; i++) {
      let x = Math.floor(Math.random() * (100 - 25) + 25);
      let y = Math.floor(Math.random() * (75 - 20) + 20);
      let z = dat === 0 ? Math.floor(6 + 20) : Math.floor(dat + 6 + 22);

      series.push([x, y, z]);
    }

    return series;
  };

  const newDataSeries = (dat) => {
    return dat.map((item) => {
      return { ...item, data: generateData(item.data) };
    });
  };

  const options = {
    options: {
      series: newDataSeries(data),
      chart: {
        height: height,
        type: 'bubble',
        width: '100%',
      },
      grid: {
        show: false,
      },
      colors: ['#0050C8'],
      labels: labels,
      yaxis: {
        min: 10,
        max: Math.max(...dataSet) + 75,
        labels: {
          show: false,
        },
      },
      xaxis: {
        min: 10,
        max: Math.max(...dataSet) + 100,
        labels: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        tooltip: {
          enabled: false,
        },
      },
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: true,
        formatter: function (val, methods) {
          const { seriesIndex } = methods;
          return data[seriesIndex]?.name;
        },
        style: {
          fontSize: 14,
          fontFamily: 'Raleway',
          color: '#fff',
        },
      },
      tooltip: {
        enabled: true,
        custom: function ({ seriesIndex, w }) {
          return customTooltip({ seriesIndex, w });
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
        options={options?.options}
        series={options?.options.series || []}
        type="bubble"
        height={height}
      />
    </Box>
  );
};

BubbleChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      data: PropTypes.number,
      tooltipData: PropTypes.arrayOf(
        PropTypes.shape({
          key: PropTypes.string,
          value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        }),
      ),
    }),
  ),
  height: PropTypes.number,
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
      borderRadius: 8,

      textAlign: 'center',
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
    '& .indicator': {
      width: 10,
      height: 10,
      borderRadius: 2,
      marginRight: 8,
    },
  },
}));

export default memo(BubbleChart);
