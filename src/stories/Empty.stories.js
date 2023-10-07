import React from 'react';
import Empty from 'reusables/Empty';
import { text } from '@storybook/addon-knobs';
import { ReactComponent as EmptyIcon } from 'assets/svgs/EmptySearchResults.svg';

export default {
  title: 'empty search',
  component: Empty,
};

export const empty = () => (
  <Empty
    title={text('title', 'Some heading')}
    description={text(
      'description',
      'You currrently have no registered institution. Click the button below to add new.',
    )}
    icon={<EmptyIcon />}>
    Children prop here
  </Empty>
);
