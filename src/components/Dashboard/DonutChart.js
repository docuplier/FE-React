import { memo, useMemo } from 'react';
import { Box, makeStyles, Tab, Tabs, Typography } from '@material-ui/core';
import Chart from 'react-apexcharts';
import PropTypes from 'prop-types';

import { colors, fontSizes, fontWeight } from '../../Css';
import KeyIndicators from 'reusables/KeyIndicators';

const DonutChart = ({ data, title, tabs, currentTab, onChangeTab }) => {
  const classes = useStyles();
  let colorOpacity = 1;

  const total = useMemo(() => {
    return data?.reduce((acc, item) => item.count + acc, 0);
  }, [data]);

  const { series, labels, colors } = useMemo(() => {
    let { series, labels, colors } = data.reduce(
      (acc, current) => {
        acc.series.push(current.count);
        acc.labels.push(current.label);
        acc.colors.push(`rgba(0, 80, 200, ${colorOpacity})`);
        //eslint-disable-next-line
        colorOpacity -= 1 / data.length;

        return acc;
      },
      { series: [], labels: [], colors: [] },
    );

    if (total === 0) {
      return {
        series: [1],
        labels,
        colors: colors.fill('#bdbdbd'),
      };
    }

    return {
      series,
      labels,
      colors,
    };
  }, [data, total]);

  const getKeyIndicators = () => {
    return labels.map((label, index) => ({
      label,
      color: total === 0 ? colors.fill('#bdbdbd') : colors[index],
    }));
  };

  const option = {
    options: {
      chart: {
        type: 'donut',
      },
      fill: {
        colors,
      },
      labels,
      legend: {
        show: false,
      },
      tooltip: {
        enabled: total !== 0 ? true : false,
        theme: 'dark',
        marker: {
          show: false,
        },
        fillSeriesColor: false,
      },
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            legend: {
              show: false,
            },
            labels: {
              show: total !== 0 ? true : false,
              name: {
                show: total !== 0 ? true : false,
              },
              total: {
                showAlways: total !== 0 ? true : false,
                show: total !== 0 ? true : false,
              },
            },
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
    },
    noData: {
      text: 'No Chart Data',
      align: 'center',
      verticalAlign: 'middle',
      offsetX: 0,
      offsetY: 0,
      style: {
        color: undefined,
        fontSize: '14px',
        fontFamily: undefined,
      },
    },
    series,
  };

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="body1" color="textPrimary" style={{ fontWeight: fontWeight.bold }}>
          {title}
        </Typography>
        {tabs && (
          <Tabs
            onChange={onChangeTab}
            indicatorColor="none"
            value={currentTab}
            textColor="primary"
            classes={{ root: classes.root }}>
            {tabs.map((tab, index) => (
              <Tab label={tab} key={index} />
            ))}
          </Tabs>
        )}
        <div role="tabpanel">
          <Chart
            options={option.options}
            series={option.series}
            type="donut"
            width="100%"
            height="280"
          />
        </div>
      </Box>
      <KeyIndicators indicators={getKeyIndicators()} />
    </Box>
  );
};

DonutChart.propTypes = {
  title: PropTypes.string,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      count: PropTypes.string,
    }),
  ),
  tabs: PropTypes.arrayOf(PropTypes.string.isRequired),
  onChangeTab: PropTypes.func,
  currentTab: PropTypes.number,
};

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(4),
    '& .MuiTab-wrapper ': {
      justifyContent: 'flex-start',
    },
    '& .MuiTab-textColorPrimary.Mui-selected': {
      background: '#E7E7ED',
      borderRadius: '8px',
      padding: '0 8px',
      color: colors.text,
    },
    '& .MuiTab-root': {
      fontSize: fontSizes.small,
      marginRight: theme.spacing(8),
      minHeight: theme.spacing(16),
    },
  },
}));

export default memo(DonutChart);
