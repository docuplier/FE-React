import { Box, IconButton, makeStyles } from '@material-ui/core';
import { Delete, Visibility } from '@material-ui/icons';
import { ReactComponent as FolderIcon } from 'assets/svgs/upload_folder_icon.svg';
import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';
import FilePreview from 'reusables/FilePreview';
import { colors, fontSizes } from '../Css';

/**
 * Default File Upload Reusable Component
 * Has an empty and non empty state which is controlled by passing a file to it
 * This component currently supports only single file upload
 */
function FileUpload({
  files: filesFromProps,
  multiple,
  onChange,
  accept,
  showPreview = false,
  fileSample,
  onRemove,
  subTitle = '',
  captionProps,
}) {
  const classes = useStyles();
  const [filesFromState, setFilesFromState] = useState([]);

  const files = useMemo(() => {
    return filesFromProps !== undefined ? filesFromProps : filesFromState;
  }, [filesFromProps, filesFromState]);

  const showFileUpload = useMemo(() => {
    return !multiple && files?.length !== 0 ? false : true;
  }, [multiple, files]);

  const handleUpload = (newFiles) => {
    setFilesFromState(newFiles);
    onChange?.(newFiles);
  };

  const handleRemoveFile = (index, file) => () => {
    onRemove?.(file);
    const newFiles = files.filter((_file, i) => i !== index);
    handleUpload(newFiles);
  };

  const handlePreview = (previewUrl) => () => {
    window.open(previewUrl);
  };

  const renderRightContent = (index, file) => {
    return (
      <div className={classes.rightContent}>
        {showPreview && (
          <IconButton style={{ padding: 0 }} onClick={handlePreview(file?.url)}>
            <Visibility className="visibility-icon" style={{ fontSize: fontSizes.xxlarge }} />
          </IconButton>
        )}
        <IconButton style={{ padding: 0 }} onClick={handleRemoveFile(index, file)}>
          <Delete style={{ fontSize: fontSizes.xxlarge, color: `${colors.deleteFileIconColor}` }} />
        </IconButton>
      </div>
    );
  };

  return (
    <Box>
      {showFileUpload && (
        <Box className={classes.uploadContainer}>
          <input
            type="file"
            id="avatar"
            name="avatar"
            multiple={multiple}
            onChange={(e) => handleUpload([...Array.from(e.target?.files), ...files])}
            className="file-input"
            accept={accept}
          />
          <Box className="file-input-cover">
            <FolderIcon className="file-input-cover-icon" />
            <Box component="span" mt={1} mb={4} className="file-input-cover-text">
              Drop your files here or click here to upload
            </Box>
            {subTitle !== '' && (
              <Box
                component="span"
                mt={-1}
                mb={4}
                style={{ color: '#6B6C7E' }}
                className="file-input-cover-text"
              >
                {subTitle}
              </Box>
            )}
            {Boolean(fileSample) && (
              <a
                mt={1}
                download
                href={fileSample}
                className="file-input-cover-caption"
                {...captionProps}
              >
                Click here to download sample
              </a>
            )}
          </Box>
        </Box>
      )}
      {files?.map((file, index) => (
        <Box mt={4}>
          <FilePreview
            key={index}
            file={{
              name: file?.name,
              size: file?.size,
              type: file?.type,
            }}
            limitInformationToSize={true}
            rightContent={renderRightContent(index, file)}
          />
        </Box>
      ))}
    </Box>
  );
}

const useStyles = makeStyles(() => ({
  uploadContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    textAlign: 'center',
    border: '1px dashed #BDBDBD',
    borderRadius: 2,
    padding: '27px 0px',
    '& .file-input': {
      opacity: 0,
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 99,
    },
    '& .file-input-cover': {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
    },
    '& .file-input-cover-icon': {
      height: 34,
      width: 29,
    },
    '& .file-input-cover-text': {
      color: '#1D2733',
      fontSize: fontSizes.medium,
    },
    '& .file-input-cover-caption': {
      color: '#0050C8',
      fontSize: fontSizes.small,
      textDecoration: 'none',
      zIndex: 100,
    },
  },
  rightContent: {
    display: 'flex',
    justifyContent: 'flex-end',
    '& .visibility-icon': {
      marginRight: 10,
    },
  },
}));

FileUpload.propTypes = {
  onChange: PropTypes.func.isRequired,
  accept: PropTypes.string.isRequired,
  subTitle: PropTypes.string,
  files: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      size: PropTypes.number,
      url: PropTypes.string,
    }),
  ),
  showPreview: PropTypes.bool,
  multiple: PropTypes.bool,
  fileSample: PropTypes.string,
  onRemove: PropTypes.func,
};

FileUpload.defaultProps = {
  subTitle: '',
};

/**
 * @FileUploadProxy serves as a proxy
 * Please remove this proxy once the rest of the codebase has been updated to use the new FileUpload component
 * In the new component [file] has been changed to [files]
 *
 * Also there is now support for multiple prop that can be used to upload multiple files
 */
export default function FileUploadProxy({
  file,
  files: filesFromProps,
  onChange,
  multiple,
  captionProps,
  ...rest
}) {
  let files = useMemo(() => {
    if (file !== undefined) {
      return file === null ? [] : [file];
    }
    return filesFromProps;
  }, [file, filesFromProps]);

  const handleChange = (files) => {
    if (!multiple) {
      files?.length === 0 ? onChange(null) : onChange(files?.[0]);
      return;
    }

    onChange(files);
  };

  return (
    <FileUpload
      multiple={multiple}
      onChange={handleChange}
      files={files}
      captionProps={captionProps}
      {...rest}
    />
  );
}
