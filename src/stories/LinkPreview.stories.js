import { ThemeProvider } from '@material-ui/styles';
import React from 'react';
import LinkPreview from 'reusables/LinkPreview';
import theme from 'theme';

export default {
  title: 'LinkPreview',
  component: LinkPreview,
  decorators: [(storyFn) => <ThemeProvider theme={theme}>{storyFn()}</ThemeProvider>],
};

export const LinkPreviewStory = () => (
  <div style={{ width: 800, height: 200 }}>
    <LinkPreview url="https://fb.com" />
  </div>
);
