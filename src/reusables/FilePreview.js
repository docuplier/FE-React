import { Box, IconButton, makeStyles, Paper, Typography } from '@material-ui/core';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import React from 'react';
import { colors, fontSizes, fontWeight } from '../Css';
import FileTypeIcon from './FileTypeIcon';
import TruncateText from 'reusables/TruncateText';

const FilePreview = ({
  file,
  metaData,
  rightContent,
  fileInformation,
  limitInformationToSize,
  ...props
}) => {
  const classes = useStyles();

  const downloadFile = () => {
    const link = document.createElement('a');
    link.href = file.url;
    link.setAttribute('target', '_blank');
    link.setAttribute('download', file?.name);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const getFileSize = () => {
    return Boolean(file?.size) ? `${(file?.size / 1000).toFixed(2)} kb` : '';
  };

  const getFileInformationContent = () => {
    if (fileInformation !== undefined) {
      return fileInformation;
    } else if (limitInformationToSize) {
      return getFileSize();
    }

    return (
      <>
        By {metaData?.author}
        <Typography component="span" className="disc">
          •
        </Typography>
        {getFileSize()}
        <Typography component="span" className="disc">
          •
        </Typography>
        Date published: {format(new Date(metaData?.datePublished), 'LLL dd, yyyy')}
      </>
    );
  };

  const renderFileInformation = () => {
    return (
      <Typography variant="caption" component="p" color="textSecondary">
        {getFileInformationContent()}
      </Typography>
    );
  };

  const renderRightContent = () => {
    return rightContent !== undefined ? (
      rightContent
    ) : (
      <IconButton className={classes.iconButton} onClick={downloadFile}>
        <SaveAltIcon />
      </IconButton>
    );
  };

  return (
    <Box
      {...props}
      component={Paper}
      p={4}
      width="100%"
      display="flex"
      justifyContent="space-between"
      boxSizing="border-box">
      <Box display="flex" className={classes.leftContent}>
        <FileTypeIcon iconType={file?.type} />
        <Box ml={4}>
          <TruncateText
            lines={1}
            text={file?.name}
            className="boldText"
            color="text.primary"
            fontSize={fontSizes.medium}
            maxWidth={240}
          />
          {renderFileInformation()}
        </Box>
      </Box>
      {renderRightContent()}
    </Box>
  );
};

FilePreview.propTypes = {
  file: PropTypes.shape({
    name: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    type: PropTypes.string,
    url: PropTypes.string,
  }),
  metaData: PropTypes.shape({
    datePublished: PropTypes.string,
    author: PropTypes.string,
  }),
  rightContent: PropTypes.node,
  fileInformation: PropTypes.node,
  limitInformationToSize: PropTypes.bool,
};

const useStyles = makeStyles((theme) => ({
  leftContent: {
    '& .boldText': {
      fontWeight: fontWeight.bold,
    },
    '& .disc': {
      margin: theme.spacing(0, 2),
      lineHeight: 0.5,
    },
  },
  iconButton: {
    padding: 0,
    color: colors.secondaryTextLight,
  },
}));

export default React.memo(FilePreview);
