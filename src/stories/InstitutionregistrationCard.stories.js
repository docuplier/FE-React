import React from 'react';
import InstitutionRegistrationCard from 'reusables/InstitutionRegistrationCard';
import { text, boolean } from '@storybook/addon-knobs';

export default {
  title: 'Institution Card',
  component: InstitutionRegistrationCard,
};

export const cardWithChip = () => (
  <InstitutionRegistrationCard
    level={text('level', '2')}
    chipLabel={text('chipLabel', '2nd semeter')}
    isActive={boolean('isActive', [true, false])}
    duration={text('duration', 'Feb 21, 2020 - Mar 31, 2021')}
    title={text('title', 'Undergraduate program')}
    onClick={() => {
      console.log('with chip');
    }}
  />
);
