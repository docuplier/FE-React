import React, { useMemo, useState } from 'react';
import { Controller } from 'react-hook-form';
import { Autocomplete } from '@material-ui/lab';
import { getFormError } from 'utils/formError';
import { Box, TextField, Typography } from '@material-ui/core';
import { useQuery } from '@apollo/client';
import { GET_ALL_INSTITUTIONS } from 'graphql/queries/institution';
import { useNotification } from 'reusables/NotificationBanner';

const SchoolsAutocompleteFields = ({ useFormUtils }) => {
  const { control, errors, watch, setValue } = useFormUtils;
  const notification = useNotification();
  const [searchText, setSearchText] = useState('');

  const { loading, data } = useQuery(GET_ALL_INSTITUTIONS, {
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const currentInstitutions = useMemo(() => watch('schools') || [], [watch]);
  const selectAllOption = useMemo(() => ({ id: 'all', name: 'Select All' }), []);

  const institutions = useMemo(() => {
    if (data?.allInstitutions) return [selectAllOption, ...data?.allInstitutions];
    return [];
  }, [data, selectAllOption]);

  const isSelectAllOptionActiveForOldRecord = useMemo(() => {
    return Boolean(currentInstitutions.find((record) => record.id === 'all'));
  }, [currentInstitutions]);

  const handleAutoCompleteInputChange = (event, newInputValue) => {
    setSearchText(newInputValue);
  };

  const handleAddInstitution = (newValue) => {
    const isSelectAllOptionActive = newValue.some((institution) => institution.id === 'all');
    const userAddedNewOption = newValue.length > currentInstitutions.length;

    if (isSelectAllOptionActive && userAddedNewOption) {
      setValue('schools', [selectAllOption, ...data?.allInstitutions]);
      return;
    } else if (isSelectAllOptionActive && !userAddedNewOption) {
      setValue(
        'schools',
        newValue.filter((opt) => opt.id !== 'all'),
      );
      return;
    } else if (isSelectAllOptionActiveForOldRecord && !isSelectAllOptionActive) {
      setValue('schools', []);
      return;
    }

    setValue('schools', newValue);
  };

  return (
    <Controller
      name="schools"
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
            handleAddInstitution(newValue);
          }}
          id="schools-autocomplete"
          inputValue={searchText}
          loading={loading}
          options={institutions}
          noOptionsText={!searchText ? 'Search for schools' : 'No options'}
          onInputChange={handleAutoCompleteInputChange}
          fullWidth
          getOptionLabel={(school) => school.name}
          renderOption={(school) => (
            <Box display="flex" justifyContent="space-between" style={{ width: '100%' }}>
              <Typography color="textPrimary">{school.name}</Typography>
              <Typography color="textSecondary" variant="body2">
                {school.abbreviation}
              </Typography>
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              required
              fullWidth
              label={'Select School'}
              variant="outlined"
              error={getFormError('schools', errors)?.hasError || null}
              helperText={getFormError('schools', errors)?.hasError && 'Select at least one school'}
            />
          )}
        />
      )}
    />
  );
};

export default SchoolsAutocompleteFields;
