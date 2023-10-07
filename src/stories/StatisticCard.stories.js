import React from 'react';
import { text } from '@storybook/addon-knobs';
import StatisticCard from 'reusables/StatisticCard';

export default {
  title: 'StatisticCard',
  component: StatisticCard,
};

export const StatisticCardWithAvatar = () => (
  <div style={{ width: 500, height: 500 }}>
    <StatisticCard
      title="Total institutions"
      description={0}
      data={[
        { label: '0 active', color: 'success' },
        { label: '1 inactive', color: 'error' },
      ]}
    />
  </div>
);

export const StatisticCardWithoutAvatar = () => (
  <div style={{ width: 500, height: 500 }}>
    <StatisticCard
      title="Total institutions"
      description={0}
      hideImage
      data={[
        { label: '0 active', color: 'success' },
        { label: '1 inactive', color: 'error' },
      ]}
    />
  </div>
);
