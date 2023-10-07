import { Box, Paper, Select, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { colors as color, fontSizes, fontWeight } from '../../../Css';
import { deviationChartColor } from 'utils/constants';
import Empty from 'reusables/Empty';
import LoadingView from 'reusables/LoadingView';

const DeviationChart = ({
  onChangeFilter,
  chartEvents,
  isLoading,
  faculties,
  chartData = [{}],
  selectedFacultyData,
}) => {
  const classes = useStyles();
  let { data } = chartData?.reduce(
    (acc, current) => {
      acc?.data?.push({
        facultyId: current?.id,
        x: current?.name,
        y: current?.totalDeviations,
      });
      return acc;
    },
    { data: [] },
  );
  const customTooltip = ({ dataPointIndex, w }) => {
    const tooltipData = data[dataPointIndex]?.tooltipData || [
      {
        key: w?.globals?.categoryLabels[dataPointIndex],
        value: w?.globals?.series[0][dataPointIndex],
      },
    ];
    let listItems = '';

    tooltipData?.forEach((item) => {
      listItems += `
                <div class="tooltip-container__list-item">
                    <span class="key">${item?.key}:</span>
                    <span class="value">${item?.value}</span>
                </div>
            `;
    });

    return `
            <div class="tooltip-container">
                <span class="tooltip-container__title">${'facultyName'}</span>
                ${listItems}
            </div>
        `;
  };

  const dataOptions = {
    series: [
      {
        data,
      },
    ],
    options: {
      legend: {
        show: false,
      },
      tooltip: {
        enabled: true,
        fillSeriesColor: false,
        theme: 'dark',
        marker: {
          show: false,
        },
        custom: function ({ seriesIndex, series, dataPointIndex, w }) {
          return customTooltip({ seriesIndex, dataPointIndex, w, series });
        },
      },
      chart: {
        height: 350,
        type: 'treemap',
        events: {
          click: function (_, __, config) {
            const index = config?.dataPointIndex;
            const label = config?.globals?.categoryLabels[index];
            const value = config?.globals?.series[0][index];
            const item = config?.globals?.initialSeries[0]?.data[index];

            chartEvents?.onClick({
              index,
              label,
              value,
              item,
            });
          },
        },
      },
      colors: deviationChartColor,
      dataLabels: {
        enabled: true,
        distributed: true,
        formatter: function (value) {
          return value.length > 25 ? value.substr(0, 25) + '...' : value;
        },
      },
      plotOptions: {
        treemap: {
          distributed: true,
          enableShades: false,
        },
      },
    },
  };
  const facultyArray = faculties?.faculties?.results;
  const facultyName = facultyArray?.filter((faculty) => faculty.id === selectedFacultyData);

  const renderEmpty = () => {
    return <Empty title="No deviation" description="You have no deviation for this faculty" />;
  };

  const renderGraphHeader = () => {
    return (
      <Box display="flex" justifyContent="space-between" alignItems="baseline">
        <Typography variant="h6" color="textPrimary" style={{ fontWeight: fontWeight.bold }}>
          Student Deviation for {facultyName?.[0]?.name || facultyArray?.[0]?.name}
        </Typography>
        <Select
          native
          select
          placeholder="Change Faculty"
          name="filter"
          style={{ width: 200 }}
          className={classes.filterDropdown}
          onChange={(e) => onChangeFilter(e)}>
          {facultyArray?.map((faculty) => (
            <option value={faculty?.id}>{faculty?.name}</option>
          ))}
        </Select>
      </Box>
    );
  };

  return (
    <LoadingView isLoading={isLoading}>
      <Box component={Paper} elevation={0} p={12} className={classes.container}>
        <Box>{renderGraphHeader()}</Box>
        {Boolean(data?.length) ? (
          <ReactApexChart
            options={dataOptions.options}
            series={dataOptions.series}
            type="treemap"
            height={350}
          />
        ) : (
          renderEmpty()
        )}
      </Box>
    </LoadingView>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    boxSizing: 'border-box',
    '& div.apexcharts-toolbar': {
      display: 'none',
    },
    '& .tooltip-container': {
      position: 'relative',
      background: 'rgba(0,0,0,0.5)',
      borderRadius: 8,
      padding: theme.spacing(4),
      color: color.white,
    },
    '& .tooltip-container__title': {
      color: color.white,
      fontSize: fontSizes.medium,
      fontWeight: fontWeight.bold,
      paddingBottom: theme.spacing(4),
    },
    '& .tooltip-container__list-item': {
      minWidth: 200,
      marginTop: theme.spacing(4),
      '& .value': {
        color: color.white,
        fontSize: fontSizes.medium,
      },
    },
    '& .span': {
      float: 'right',
      fontWeight: fontWeight.bold,
      paddingLeft: theme.spacing(15),
    },
  },
  filterDropdown: {
    width: 70,
    '&.MuiInput-underline:before': {
      borderBottom: '1px dashed rgba(0, 0, 0, 0.42)',
    },
  },
}));

export default DeviationChart;
