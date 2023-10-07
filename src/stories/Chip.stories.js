import React from 'react';
import Chip from 'reusables/Chip';
import { text, select } from '@storybook/addon-knobs';

export default {
  title: 'Chip',
  component: Chip,
};

export const MuiChip = () => (
  <Chip
    label={text('label', 'Chip')}
    variant={select('variant', ['default', 'outlined'])}
    size={select('size', ['sm', 'md', 'lg'])}
    roundness={select('roundness', ['sm', 'md', 'lg'])}
    color={select('color', ['primary', 'secondary', 'active', 'inactive'])}
  />
);
