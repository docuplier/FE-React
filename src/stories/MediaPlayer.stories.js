import { ThemeProvider } from '@material-ui/styles';
import React from 'react';
import MediaPlayer from 'reusables/MediaPlayer';
import { NotificationProvider } from 'reusables/NotificationBanner';
import theme from 'theme';

export default {
  title: 'MediaPlayer',
  component: MediaPlayer,
  decorators: [
    (storyFn) => (
      <ThemeProvider theme={theme}>
        <NotificationProvider>
          <div style={{ width: '100vw', height: 300 }}>{storyFn()}</div>
        </NotificationProvider>
      </ThemeProvider>
    ),
  ],
};

export const VideoMediaPlayer = () => {
  return <MediaPlayer url="https://www.youtube.com/watch?v=CmMMpaUD3g8" />;
};
