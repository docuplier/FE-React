import React from 'react';
import BarChart from 'reusables/BarChart';

export default {
  title: 'barchart',
  component: BarChart,
};

export const barchart = () => (
  <BarChart
    XaxisData={['0 - 10', '11-20', '21 - 30', '31 - 40', '51 - 60', '61 - 70', '81-90', '91 - 100']}
    Yaxis={{ name: 'Submited', data: [50, 100, 150, 200, 250, 300, 350, 400, 600] }}
  />
);
