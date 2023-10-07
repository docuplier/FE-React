import React, { useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { Box, TextField, Grid, MenuItem, Typography } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { format, addMinutes, isBefore } from 'date-fns';

import { LiveSessionRepeatMode, DEFAULT_PAGE_LIMIT } from 'utils/constants';
import { getFormError } from 'utils/formError';
import { spaces } from '../../../Css';
import { GET_ATTENDEES } from 'graphql/queries/liveSession';
import { getReceiversList } from 'utils/receiversListUtils';
import { useQuery } from '@apollo/client';

function UpsertLiveSessionInputFields({ useFormUtils }) {
  const [searchText, setSearchText] = useState('');
  const { control, errors, watch, setValue, clearErrors } = useFormUtils;
  const [attendeesListData, setAttendeesListData] = useState({});

  const { startDate, startTime, endDate } = watch();

  useEffect(() => {
    setValue('endDate', startDate);
    // eslint-disable-next-line
  }, [startDate]);

  useEffect(() => {
    const newEndTime = addMinutes(new Date(`${endDate}T${startTime}`), 30);
    setValue('endTime', format(newEndTime, 'HH:mm'));
    // eslint-disable-next-line
  }, [startTime]);

  const { loading: attendeesListLoading } = useQuery(GET_ATTENDEES, {
    variables: {
      search: searchText,
      limit: DEFAULT_PAGE_LIMIT,
      ordering: null,
    },
    skip: !searchText,
    onCompleted: (data) => {
      const { searchAttendees } = data;
      if (searchAttendees) {
        const listObject = getReceiversList(searchAttendees);
        setAttendeesListData((prevState) => ({ ...prevState, ...listObject }));
      }
    },
  });

  const handleAutoCompleteInputChange = (event, newInputValue) => {
    setSearchText(newInputValue);
  };

  const renderSessionDate = () => (
    <Box display="flex" alignItems="center" flexWrap="wrap">
      <Box display="flex" mt={10} style={{ maxWidth: 350, width: '100%' }}>
        <Controller
          name="startDate"
          control={control}
          rules={{
            required: 'Start date is required',
          }}
          render={({ ...rest }) => (
            <TextField
              {...rest}
              required
              variant="outlined"
              id="date"
              label="Start date"
              type="date"
              inputProps={{
                min: format(new Date(), 'yyyy-LL-dd'),
              }}
              style={{ marginRight: spaces.medium }}
              error={getFormError('startDate', errors).hasError}
              helperText={getFormError('startDate', errors).message}
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}
        />

        <Controller
          name="startTime"
          control={control}
          rules={{
            required: 'Start time is required',
            validate: {
              isTimePass: (value) =>
                !isBefore(new Date(`${startDate}T${value}`), new Date()) ||
                'Start time is in the past',
            },
          }}
          render={({ ...rest }) => (
            <TextField
              {...rest}
              id="time"
              required
              variant="outlined"
              label="Start time"
              type="time"
              error={getFormError('startTime', errors).hasError}
              helperText={getFormError('startTime', errors).message}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300, // 5 min
              }}
            />
          )}
        />
      </Box>
      <Box mx={10}>
        <span>&#8594;</span>
      </Box>
      <Box mt={10} style={{ maxWidth: 350, width: '100%' }} display="flex">
        <Controller
          name="endDate"
          control={control}
          rules={{
            required: 'End date is required',
            min: { value: startDate, message: 'End date cannot be less than start date' },
          }}
          render={({ ...rest }) => (
            <TextField
              {...rest}
              required
              variant="outlined"
              id="date"
              label="End date"
              type="date"
              onClick={() => clearErrors('endTime')}
              inputProps={{
                min: format(new Date(), 'yyyy-LL-dd'),
              }}
              style={{ marginRight: spaces.medium }}
              error={getFormError('endDate', errors).hasError}
              helperText={getFormError('endDate', errors).message}
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}
        />

        <Controller
          name="endTime"
          control={control}
          rules={{
            required: 'End time is required',
            validate: {
              isTimePass: (value) => {
                return (
                  !isBefore(new Date(`${endDate}T${value}`), new Date()) ||
                  'End time is in the past'
                );
              },
              isLessThanStart: (value) => {
                return (
                  !isBefore(
                    new Date(`${endDate}T${value}`),
                    new Date(`${startDate}T${startTime}`),
                  ) || 'End time cannot be earlier than Start time'
                );
              },
            },
          }}
          render={({ ...rest }) => (
            <TextField
              {...rest}
              id="time"
              required
              variant="outlined"
              label="End time"
              type="time"
              error={getFormError('endTime', errors).hasError}
              helperText={getFormError('endTime', errors).message}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300, // 5 min
              }}
            />
          )}
        />
      </Box>
    </Box>
  );

  const renderAttendeesAutocomplete = () => (
    <Controller
      name="attendees"
      control={control}
      rules={{
        required: 'Attendees is required',
        validate: {
          isTimePass: (value) => value?.length > 0 || 'Live session must have attendees',
        },
      }}
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
          id="attendees-autocomplete"
          loading={attendeesListLoading}
          options={Object.values(attendeesListData)}
          noOptionsText={!searchText ? 'Search for course, department, or faculty' : 'No options'}
          fullWidth
          filterSelectedOptions
          getOptionLabel={(attendee) => attendee.name}
          renderOption={(attendee) => (
            <Box display="flex" justifyContent="space-between" style={{ width: '100%' }}>
              <Typography color="textPrimary">{attendee.name}</Typography>
              <Typography color="textSecondary" variant="body2">
                {attendee.type}
              </Typography>
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              required
              fullWidth
              label="Attendees"
              variant="outlined"
              error={getFormError('attendees', errors).hasError}
              helperText={getFormError('attendees', errors).message}
            />
          )}
        />
      )}
    />
  );

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Controller
          name="title"
          control={control}
          rules={{
            required: 'Session title is required',
          }}
          render={({ ...rest }) => (
            <TextField
              {...rest}
              fullWidth
              required
              variant="outlined"
              label="Session title"
              error={getFormError('title', errors).hasError}
              helperText={getFormError('title', errors).message}
            />
          )}
        />
      </Grid>
      {renderSessionDate()}
      <Grid item xs={12}>
        {renderAttendeesAutocomplete()}
      </Grid>
      <Grid item xs={12}>
        <Box
          style={{
            background: '#F1F2F6',
            padding: spaces.medium,
            borderRadius: 10,
          }}>
          <Typography variant="body2" color="textSecondary">
            You are within the range of 500 maximum users. Exceeding will allow you to proceed,
            however, only 500 people can join the meeting.
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Controller
          name="repeatMode"
          control={control}
          render={({ ref, ...rest }) => {
            return (
              <TextField
                {...rest}
                label="Repeat mode"
                variant="outlined"
                select
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
                inputRef={ref}>
                {Object.values(LiveSessionRepeatMode)?.map((repeatMode) => (
                  <MenuItem key={repeatMode.value} value={repeatMode.value}>
                    {repeatMode.name}
                  </MenuItem>
                ))}
              </TextField>
            );
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name="description"
          control={control}
          rules={{
            required: 'Description is required',
          }}
          render={({ ...rest }) => (
            <TextField
              {...rest}
              multiline
              rows={6}
              fullWidth
              required
              variant="outlined"
              label="Meeting description"
              error={getFormError('description', errors).hasError}
              helperText={getFormError('description', errors).message}
            />
          )}
        />
      </Grid>
    </Grid>
  );
}

export default UpsertLiveSessionInputFields;
