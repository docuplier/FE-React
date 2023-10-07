import { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';
import { Box, makeStyles } from '@material-ui/core';

import { fontFamily, fontSizes, fontWeight, colors } from '../../Css';
import KeyIndicators from 'reusables/KeyIndicators';

const PieChart = ({ data, width, title, height, basicTooltip, chartEvents }) => {
  const classes = useStyles();

  const total = useMemo(() => {
    return data?.reduce((acc, item) => item.count + acc, 0);
  }, [data]);

  const { series, labels, chartColors } = useMemo(() => {
    let { series, labels, chartColors } = data?.reduce(
      (acc, item) => {
        acc.series.push(item.count);
        acc.labels.push(item.label);
        acc.chartColors.push(`rgba(0, 80, 200, ${acc.currentColorOpacity})`);
        acc.currentColorOpacity -= 1 / data.length;

        return acc;
      },
      { series: [], labels: [], chartColors: [], currentColorOpacity: 1 },
    );

    if (total === 0) {
      return {
        series: [1],
        labels,
        chartColors: chartColors.fill('#bdbdbd'),
      };
    }

    return {
      series,
      labels,
      chartColors,
    };
  }, [data, total]);

  const customTooltip = ({ seriesIndex, w, series }) => {
    const tooltipData = data[seriesIndex]?.tooltipData || [
      { key: w.globals.labels[seriesIndex], value: series[seriesIndex] },
    ];
    let listItems = '';

    tooltipData.forEach((item) => {
      listItems += `
                <div class="tooltip-container__list-item">
                    <span class="key">${item.key}:</span>
                    <span class="value">${item.value}</span>
                </div>
            `;
    });

    return `
            <div class="tooltip-container">
                <span class="tooltip-container__title">${w.globals.labels[seriesIndex]}</span>
                ${listItems}
            </div>
        `;
  };

  const getKeyIndicators = () => {
    return labels.map((label, index) => ({
      label,
      color: total === 0 ? chartColors.fill('#bdbdbd') : chartColors[index],
    }));
  };

  const options = {
    chart: {
      type: 'pie',
      events: {
        click: function (event) {
          const parentElement = event.target.parentElement;
          const index = parentElement.getAttribute('data:realIndex');
          const label = parentElement.getAttribute('seriesName');
          const item = data?.find((_item, i) => i === Number(index));

          chartEvents?.onClick({
            index,
            label,
            item,
          });
        },
      },
    },
    labels,
    fill: {
      colors: chartColors,
    },
    title: {
      text: title,
      align: 'left',
      style: {
        fontSize: fontSizes.xlarge,
        fontWeight: fontWeight.bold,
        fontFamily: fontFamily.primary,
        color: colors.textHeader,
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: total !== 0 ? true : false,
      fillSeriesColor: false,
      theme: 'dark',
      marker: {
        show: false,
      },
      custom: basicTooltip
        ? undefined
        : function ({ series, seriesIndex, w }) {
            return customTooltip({ seriesIndex, w, series });
          },
    },
    marker: {
      colors: chartColors,
    },
  };

  return (
    <Box className={classes.container}>
      <Box mb={4}>
        <ReactApexChart options={options} series={series} type="pie" />
      </Box>
      <Box height={150} className="indicator-container">
        <KeyIndicators indicators={getKeyIndicators()} direction="vertical" />
      </Box>
    </Box>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    '& .indicator-container': {
      overflowY: 'auto',
      overflowX: 'hidden',
      scrollbarWidth: 'thin',
      scrollbarColor: '#757575',
    },
    '& .indicator-container::-webkit-scrollbar-track': {
      background: 'white',
    },
    '& .indicator-container::-webkit-scrollbar-thumb ': {
      backgroundColor: '#757575',
      borderRadius: 8,
    },
    '& .indicator-container::-webkit-scrollbar': {
      width: 7,
    },
    '& .tooltip-container': {
      position: 'relative',
      background: 'rgb(39, 40, 51, 0.5)',
      borderRadius: 8,
      padding: theme.spacing(4),
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
    },
  },
}));

PieChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
      tooltipData: PropTypes.arrayOf(
        PropTypes.shape({
          key: PropTypes.string.isRequired,
          value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        }),
      ),
    }),
  ).isRequired,
  title: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  basicTooltip: PropTypes.bool,
  chartEvents: PropTypes.shape({
    onClick: PropTypes.func.isRequired,
  }),
};

PieChart.defaultProps = {
  width: 300,
  height: 300,
};

export default memo(PieChart);
