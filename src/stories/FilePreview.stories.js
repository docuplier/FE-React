import { ThemeProvider } from '@material-ui/styles';
import React from 'react';
import theme from 'theme';
import FilePreview from '../reusables/FilePreview';

export default {
  title: 'FilePreview',
  component: FilePreview,
  decorators: [(storyFn) => <ThemeProvider theme={theme}>{storyFn()}</ThemeProvider>],
};

export const FilePreviewStory = () => (
  <FilePreview
    file={{
      name: 'new_user_template.pdf',
      type: 'pdf',
      size: 2000,
      url: '',
    }}
    metaData={{
      author: 'Prof Emeka Chuks',
      datePublished: '12-03-2021',
    }}
  />
);

export const FilePreviewWithInformationLimitToSize = () => (
  <FilePreview
    file={{
      name: 'new_user_template.pdf',
      type: 'pdf',
      size: 2000,
      url: '',
    }}
    metaData={{
      author: 'Prof Emeka Chuks',
      datePublished: '12-03-2021',
    }}
    limitInformationToSize={true}
  />
);

export const FilePreviewWithCustomFileInformation = () => (
  <FilePreview
    file={{
      name: 'new_user_template.pdf',
      type: 'pdf',
      size: 2000,
      url: '',
    }}
    metaData={{
      author: 'Prof Emeka Chuks',
      datePublished: '12-03-2021',
    }}
    fileInformation={<span>File Information here</span>}
  />
);

export const FilePreviewWithCustomRightContent = () => (
  <FilePreview
    file={{
      name: 'new_user_template.pdf',
      type: 'pdf',
      size: 2000,
      url: '',
    }}
    metaData={{
      author: 'Prof Emeka Chuks',
      datePublished: '12-03-2021',
    }}
    rightContent={<span>Right content here</span>}
  />
);
