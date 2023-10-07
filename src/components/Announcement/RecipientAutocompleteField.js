import { Controller } from 'react-hook-form';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Autocomplete } from '@material-ui/lab';
import { useQuery } from '@apollo/client';
import { Box, TextField, Typography } from '@material-ui/core';

import { getFormError } from 'utils/formError';
import { getReceiversList } from 'utils/receiversListUtils';
import { GET_RECIPIENTS } from 'graphql/queries/announcement';
import { DEFAULT_PAGE_LIMIT } from 'utils/constants';

const RecipientAutocompleteField = ({ control, errors, label, rules }) => {
  const [searchText, setSearchText] = useState('');
  const [recipientListData, setRecipientListData] = useState({});

  const { loading: loadingRecipientList } = useQuery(GET_RECIPIENTS, {
    variables: {
      search: searchText,
      limit: DEFAULT_PAGE_LIMIT,
    },
    skip: !searchText,
    onCompleted: (data) => {
      const { searchReceivers } = data;
      if (searchReceivers) {
        const listObject = getReceiversList(searchReceivers);
        setRecipientListData((prevState) => ({ ...prevState, ...listObject }));
      }
    },
  });

  const handleAutoCompleteInputChange = (event, newInputValue) => {
    setSearchText(newInputValue);
  };

  return (
    <Controller
      name="recipients"
      control={control}
      rules={rules}
      defaultValue={[]}
      render={({ onChange, value, ...rest }) => (
        <Autocomplete
          {...rest}
          value={value}
          multiple
          onChange={(event, newValue) => {
            onChange(newValue);
          }}
          inputValue={searchText}
          onInputChange={handleAutoCompleteInputChange}
          id="recipient-autocomplete"
          loading={loadingRecipientList}
          options={Object.values(recipientListData)}
          noOptionsText={!searchText ? 'Search for recipients' : 'No options'}
          fullWidth
          filterSelectedOptions
          getOptionLabel={(recipient) => recipient.name}
          renderOption={(recipient) => (
            <Box display="flex" justifyContent="space-between" style={{ width: '100%' }}>
              <Typography color="textPrimary">{recipient.name}</Typography>
              <Typography color="textSecondary" variant="body2">
                {recipient.type}
              </Typography>
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              required
              fullWidth
              label={label}
              variant="outlined"
              error={getFormError('recipients', errors)?.hasError || null}
              helperText={getFormError('recipients', errors)?.message || null}
            />
          )}
        />
      )}
    />
  );
};

RecipientAutocompleteField.propTypes = {
  control: PropTypes.object,
  errors: PropTypes.object,
  label: PropTypes.string,
  rules: PropTypes.object,
};

export default RecipientAutocompleteField;
