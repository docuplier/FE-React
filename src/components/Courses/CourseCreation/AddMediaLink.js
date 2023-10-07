import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { Box, TextField, Typography, Button } from '@material-ui/core';

import { fontWeight, spaces } from '../../../Css';
import { getFormError } from 'utils/formError';
import LinkPreview from 'reusables/LinkPreview';

function AddMediaLink(props) {
  const { control, errors, watch } = props;
  const [isLinkPreviewVisible, setIsLinkPreviewVisible] = useState(false);
  const URL_REGEX = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
  const { embeddedLink } = watch();

  return (
    <Box>
      <Box display="flex" alignItems="flex-start">
        <Controller
          name="embeddedLink"
          control={control}
          rules={{
            required: 'A valid URL is required',
            pattern: {
              value: URL_REGEX,
              message: 'Link is not a valid URL',
            },
          }}
          render={({ ref, onChange, ...rest }) => {
            const handleChange = (event) => {
              const { value } = event.target;
              onChange(value);
            };

            return (
              <TextField
                {...rest}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                inputRef={ref}
                placeholder="e.g www.file-link.com"
                error={getFormError('embeddedLink', errors).hasError}
                helperText={getFormError('embeddedLink', errors).message}
              />
            );
          }}
        />
        <Button
          onClick={() => setIsLinkPreviewVisible(true)}
          style={{
            marginLeft: spaces.medium,
            border: '1px solid #CDCED9',
          }}>
          Fetch
        </Button>
      </Box>

      <Box
        mt={10}
        display="flex"
        alignItems="center"
        justifyContent="center"
        style={{
          minHeight: 100,
          background: '#E7E7ED',
          borderRadius: 4,
        }}>
        {!isLinkPreviewVisible ? (
          <Typography variant="body2" style={{ color: '#A7A9BC', fontWeight: fontWeight.bold }}>
            Link preview
          </Typography>
        ) : (
          <LinkPreview url={embeddedLink} />
        )}
      </Box>
    </Box>
  );
}

AddMediaLink.propTypes = {};

export default AddMediaLink;
