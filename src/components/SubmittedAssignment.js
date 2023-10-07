import React from 'react';
import { IconButton, Box } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';

import Drawer from 'reusables/Drawer';
import FilePreview from 'reusables/FilePreview';
import { formatFileName, getFileExtension } from 'utils/TransformationUtils';
import { ReactComponent as DownloadIcon } from 'assets/svgs/download-ic.svg';

const SubmittedAssignment = ({ open, onClose, data }) => {
  const downloadFile = (file) => {
    const link = document.createElement('a');
    link.href = file;
    link.setAttribute('target', '_blank');
    link.setAttribute('download', file);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Assignment Submitted"
      okText="Done"
      onOk={() => {}}>
      {data?.map((assignment) => {
        return (
          <Box key={assignment.id} mb={4}>
            <FilePreview
              file={{
                name: formatFileName(assignment?.file),
                type: getFileExtension(assignment?.file),
                size: assignment.size,
                url: assignment.file,
              }}
              limitInformationToSize={true}
              rightContent={
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <IconButton size="small" onClick={() => window.open(assignment?.file, '_blank')}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    style={{ marginLeft: 8 }}
                    onClick={() => downloadFile(assignment?.file)}>
                    <DownloadIcon />
                  </IconButton>
                </Box>
              }
            />
          </Box>
        );
      })}
    </Drawer>
  );
};

export default SubmittedAssignment;
