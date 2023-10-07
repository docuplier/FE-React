import { memo, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, Tabs, Tab } from '@material-ui/core';

import FileUpload from './FileUpload';
import { AudioUploadFormats, VideoUploadFormats } from 'utils/constants';
import LinkInputField from './LinkInputField';

const MediaSupportedExtensions = {
  VIDEO: VideoUploadFormats,
  AUDIO: AudioUploadFormats,
};

const AudioVisualInputField = ({ value: valueFromProps, onChange, format }) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [valueFromState, setValueFromState] = useState({
    selected: 'file',
    file: null,
    embeddedLink: '',
  });

  const value = useMemo(() => {
    return valueFromProps !== undefined ? valueFromProps : valueFromState;
  }, [valueFromState, valueFromProps]);

  const handleChangeTab = (tab) => {
    onChange({
      ...value,
      selected: tab === 0 ? 'file' : 'embeddedlink',
    });
    setCurrentTab(tab);
  };

  const handleChange = (currentValue) => {
    let valueByTab = currentTab === 0 ? { file: currentValue } : { embeddedLink: currentValue };
    let newValue = {
      ...value,
      ...valueByTab,
      selected: currentTab === 0 ? 'file' : 'embeddedlink',
    };

    onChange(newValue);
    setValueFromState(newValue);
  };

  const renderTabs = () => {
    return (
      <Box mb={10}>
        <Tabs
          indicatorColor="primary"
          value={currentTab}
          textColor="primary"
          style={{ marginTop: -16 }}
          onChange={(_evt, newValue) => handleChangeTab(newValue)}>
          <Tab label="Upload file" />
          <Tab label="Embedded link" />
        </Tabs>
      </Box>
    );
  };

  const renderFileUpload = () => {
    return (
      <FileUpload
        accept={MediaSupportedExtensions[format]}
        onChange={(file) => handleChange(file)}
        file={value?.file}
      />
    );
  };

  return (
    <>
      {renderTabs()}
      {currentTab === 0 && renderFileUpload()}
      {currentTab === 1 && (
        <LinkInputField
          value={value?.embeddedLink}
          onChange={handleChange}
          placeholder="Enter link here"
          label="Link"
        />
      )}
    </>
  );
};

AudioVisualInputField.propTypes = {
  value: PropTypes.shape({
    selected: PropTypes.oneOf(['file', 'embeddedLink']),
    file: PropTypes.object,
    embeddedLink: PropTypes.string,
  }),
  onChange: PropTypes.func.isRequired,
  format: PropTypes.oneOf(['VIDEO', 'AUDIO']),
};

export default memo(AudioVisualInputField);
