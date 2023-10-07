import React from 'react';
import LoadingButton from 'reusables/LoadingButton';
import { Add, ShoppingCart } from '@material-ui/icons';
import { text, boolean } from '@storybook/addon-knobs';

export default {
  title: 'LoadingButton',
  component: LoadingButton,
};

export const OutlinedButton = () => (
  <LoadingButton
    variant={text('variant', 'outlined')}
    color="primary"
    isLoading={boolean('isLoading', true)}
    onClick={() => console.log('clicked')}>
    Outlined
  </LoadingButton>
);

export const ButtonIcon = () => (
  <LoadingButton
    variant={text('variant', 'outlined')}
    color="primary"
    isLoading={boolean('isLoading', true)}
    endIcon={<Add />}
    onClick={() => console.log('clicked')}>
    Outlined
  </LoadingButton>
);

export const IconButton = () => (
  <LoadingButton
    variant={text('variant', 'outlined')}
    color="primary"
    isLoading={boolean('isLoading', true)}
    startIcon={<ShoppingCart />}
    onClick={() => console.log('clicked')}>
    Outlined
  </LoadingButton>
);

export const DangerButton = () => (
  <LoadingButton
    variant={text('variant', 'contained')}
    color="primary"
    danger
    isLoading={boolean('isLoading', false)}
    onClick={() => console.log('clicked')}>
    Danger
  </LoadingButton>
);
