import React, { useState } from 'react';
import FileUpload from '../reusables/FileUpload';

export default {
  title: 'FileUpload',
  component: FileUpload,
  decorators: [
    (storyFn) => <div style={{ width: 500, height: 300, margin: '14px 0px' }}>{storyFn()}</div>,
  ],
};

export const FileUploadStory = () => {
  const [file, setFile] = useState(null);
  return <FileUpload onChange={(file) => setFile(file)} />;
};
