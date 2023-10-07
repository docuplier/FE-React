import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Box, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';

const RadialChart = ({
  height = 350,
  subtitle = '',
  series,
  title = '',
  size = '60%',
  sideSpacing,
}) => {
  const classes = useStyles();

  const option = {
    series: [series],
    options: {
      chart: {
        type: 'radialBar',
        height: height,
      },
      fill: {
        colors: ['#0050C8'],
      },
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 5,
            size: size,
          },

          dataLabels: {
            name: {
              show: false,
            },
            value: {
              color: '#393A4A',
              fontSize: '24px',
              fontWeight: 'bold',
              fontFamily: 'Raleway',
              show: true,
            },
          },
        },
      },
      stroke: {
        lineCap: 'round',
      },
      labels: ['Progress'],
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
    <Box>
      <ReactApexChart
        options={option.options}
        series={option.series}
        type="radialBar"
        height={height}
      />
      <Box px={sideSpacing}>
        <Typography className={classes.subtitle} variant="subtitle1">
          {subtitle}
        </Typography>
      </Box>
    </Box>
  );
};

RadialChart.propTypes = {
  height: PropTypes.number,
  series: PropTypes.number,
  subtitle: PropTypes.string,
  size: PropTypes.string,
  title: PropTypes.string,
};

const useStyles = makeStyles(() => ({
  subtitle: {
    textAlign: 'center',
    fontSize: 14,
    wordWrap: 'wrap',
  },
}));
export default RadialChart;
