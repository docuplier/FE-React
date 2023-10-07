import React from 'react';
import DonutChart from 'reusables/DonutChart';

export default {
  title: 'donut chart',
  component: DonutChart,
};

export const donutChart = () => (
  <DonutChart data={[40, 60]} chartLabel={['submited', 'notSubmitted']} />
);
