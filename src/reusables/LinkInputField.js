import { memo, useMemo, useState } from 'react';
import { Box, TextField, Button, Paper, Typography } from '@material-ui/core';

import { colors, fontWeight } from '../Css';
import LinkPreview from './LinkPreview';

const LinkInputField = ({ value: valueFromProps, onChange, ...rest }) => {
  const [valueFromState, setValueFromState] = useState('');
  const [isLinkPreviewVisible, setIsLinkPreviewVisible] = useState(false);

  const value = useMemo(() => {
    return valueFromProps !== undefined ? valueFromProps : valueFromState;
  }, [valueFromState, valueFromProps]);

  const handleChange = (evt) => {
    setIsLinkPreviewVisible(false);
    onChange(evt.target.value);
    setValueFromState(evt.target.value);
  };

  const renderPreview = () => {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        component={Paper}
        elevation={0}
        mt={10}
        minHeight={100}
        height="100%"
        bgcolor={colors.seperator}>
        {!isLinkPreviewVisible ? (
          <Typography variant="body2" style={{ color: '#A7A9BC', fontWeight: fontWeight.bold }}>
            Link preview
          </Typography>
        ) : (
          <LinkPreview url={value} />
        )}
      </Box>
    );
  };

  return (
    <Box>
      <Box display="flex">
        <TextField {...rest} onChange={handleChange} fullWidth value={value} variant="outlined" />
        <Box ml={10}>
          <Button disableElevation variant="outlined" onClick={() => setIsLinkPreviewVisible(true)}>
            Fetch
          </Button>
        </Box>
      </Box>
      {renderPreview()}
    </Box>
  );
};

LinkInputField.propTypes = {
  ...TextField.propTypes,
};

export default memo(LinkInputField);
