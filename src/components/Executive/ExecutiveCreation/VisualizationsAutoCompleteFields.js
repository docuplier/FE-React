import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { Autocomplete } from '@material-ui/lab';
import { getFormError } from 'utils/formError';
import { Box, TextField, Typography } from '@material-ui/core';
import { ExecutiveVisualizationOptions } from 'utils/constants';
import { convertToSentenceCase } from 'utils/TransformationUtils';

const VisualizationsAutoCompleteFields = ({ useFormUtils }) => {
  const { control, errors } = useFormUtils;
  const [searchText, setSearchText] = useState('');

  const handleAutoCompleteInputChange = (event, newInputValue) => {
    setSearchText(newInputValue);
  };

  return (
    <Controller
      name="visualizations"
      control={control}
      defaultValue={[]}
      rules={{
        required: true,
        validate: (value) => value?.length > 0,
      }}
      render={({ value, onChange, ...rest }) => (
        <Autocomplete
          {...rest}
          value={value}
          multiple
          onChange={(event, newValue) => {
            onChange(newValue);
          }}
          id="visualizations-autocomplete"
          inputValue={searchText}
          loading={false}
          options={Object.values(ExecutiveVisualizationOptions).filter(
            (opt) => opt !== ExecutiveVisualizationOptions.DEFAULT_STATISTICS,
          )}
          noOptionsText={!searchText ? 'Select visualizations' : 'No options'}
          onInputChange={handleAutoCompleteInputChange}
          fullWidth
          filterSelectedOptions
          getOptionLabel={(visualization) => convertToSentenceCase(visualization)}
          renderOption={(visualization) => (
            <Box display="flex" justifyContent="space-between" style={{ width: '100%' }}>
              <Typography color="textPrimary">{convertToSentenceCase(visualization)}</Typography>
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              required
              fullWidth
              label={'Select Visualization'}
              variant="outlined"
              error={getFormError('visualizations', errors)?.hasError || null}
              helperText={
                getFormError('visualizations', errors)?.hasError &&
                'Select at least one visualization'
              }
            />
          )}
        />
      )}
    />
  );
};

export default VisualizationsAutoCompleteFields;
