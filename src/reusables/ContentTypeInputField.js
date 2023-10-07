import { memo, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, TextField, FormHelperText } from '@material-ui/core';

import FileUpload from './FileUpload';
import { TextUploadFormats } from 'utils/constants';
import LinkInputField from './LinkInputField';
import Wysiwyg from './Wysiwyg';
import AudioVisualInputField from './AudioVisualInputField';

export const ContentFormats = {
  WYSIWYG: 'WYSIWYG',
  VIDEO: 'VIDEO',
  AUDIO: 'AUDIO',
  PDF: 'PDF',
  LINK: 'LINK',
};

/**
 * @doc
 * @param {*} param0
 * @returns
 *
 * This reusable is a secondary reusable which composes all input based reusables based on content format
 * Pass the contentFormat to display the right input
 *
 * This is considered as a secondary component because its an escape hatch to prevent us from repeting this composition
 * on multiple screens. Therefore we colocate the code here thereby providing a thin layer of abstraction
 */
const ContentTypeInputField = ({ value: valueFromProps, onChange, format, error, helperText }) => {
  const [valueFromState, setValueFromState] = useState(undefined);

  const value = useMemo(() => {
    return valueFromProps !== undefined ? valueFromProps : valueFromState;
  }, [valueFromState, valueFromProps]);

  const handleChange = (newValue) => {
    onChange(newValue);
    setValueFromState(newValue);
  };

  const renderContent = () => {
    switch (format) {
      case ContentFormats.LINK:
        return (
          <LinkInputField
            value={value}
            onChange={handleChange}
            placeholder="Enter link here"
            label="Link"
          />
        );
      case ContentFormats.WYSIWYG:
        return <Wysiwyg value={value} onChange={onChange} />;
      case ContentFormats.PDF:
        return <FileUpload accept={TextUploadFormats} file={value} onChange={onChange} />;
      case ContentFormats.AUDIO:
      case ContentFormats.VIDEO:
        return <AudioVisualInputField value={value} onChange={onChange} />;
      default:
        return null;
    }
  };

  return (
    <Box>
      {renderContent()}
      <FormHelperText error={error}>{helperText}</FormHelperText>
    </Box>
  );
};

ContentTypeInputField.propTypes = {
  ...TextField.propTypes,
  format: PropTypes.oneOf(Object.values(ContentFormats)),
};

export default memo(ContentTypeInputField);
