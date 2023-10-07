import React from 'react';
import { select } from '@storybook/addon-knobs';
import FileTypeIcon from '../reusables/FileTypeIcon';

export default {
  title: 'FileTypeIcon',
  component: FileTypeIcon,
};

export const FileTypeIconStory = () => (
  <FileTypeIcon iconType={select('types', ['pdf', 'ppt', '', 'jpg', 'doc'])} />
);
