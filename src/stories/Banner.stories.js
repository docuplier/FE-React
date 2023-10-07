import React from 'react';
import { text } from '@storybook/addon-knobs';

import Banner from 'reusables/Banner';
import theme from 'theme';
import { ThemeProvider } from '@material-ui/styles';

export default {
  title: 'Banner',
  component: Banner,
  decorators: [
    (storyFn) => (
      <ThemeProvider theme={theme}>
        <div style={{ margin: '32px', maxWidth: 500 }}>{storyFn()}</div>
      </ThemeProvider>
    ),
  ],
};

export const BannerStoryWithoutSwitch = () => (
  <Banner severity={text('severity', 'info')} title="Do something" message="We are thinking big" />
);

export const BannerStoryWithSwitch = () => (
  <Banner
    showSwitch={true}
    severity={text('severity', 'error')}
    title="Do something"
    message="We are thinking big"
  />
);
