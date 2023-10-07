import React, { useState } from 'react';
import {
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  MenuItem,
  Typography,
} from '@material-ui/core';
import { Controller } from 'react-hook-form';
import { getFormError } from 'utils/formError';
import { spaces } from '../../../Css';
import { daysOfTheWeek, monthNames } from 'utils/constants';

const ANNUAL_OPTIONS = {
  ON: 'ON',
  ON_THE: 'ON_THE',
};

export default function RenderAnnualInterval({ useFormUtils }) {
  const [selectedRadioOption, setSelectedRadioOption] = useState(ANNUAL_OPTIONS.ON);
  const { control, errors } = useFormUtils;

  return (
    <Box mb={15}>
      <RadioGroup
        row
        value={selectedRadioOption}
        onChange={(event) => setSelectedRadioOption(event.target.value)}
        aria-label="position"
        name="position">
        <FormControlLabel
          value={ANNUAL_OPTIONS.ON}
          control={<Radio color="primary" />}
          label="On"
        />
        <FormControlLabel
          value={ANNUAL_OPTIONS.ON_THE}
          control={<Radio color="primary" />}
          label="On the"
        />
      </RadioGroup>
      <Box display="flex" alignItems="center" flexWrap="wrap">
        {selectedRadioOption === ANNUAL_OPTIONS.ON && (
          <>
            <Controller
              name="month"
              control={control}
              render={({ ref, ...rest }) => {
                return (
                  <TextField
                    {...rest}
                    style={{ minWidth: 150, marginRight: spaces.small, marginTop: 10 }}
                    label="Month"
                    variant="outlined"
                    select
                    inputRef={ref}>
                    {monthNames.map((month) => (
                      <MenuItem key={month} value={month}>
                        {month}
                      </MenuItem>
                    ))}
                  </TextField>
                );
              }}
            />
            <Controller
              name="number"
              control={control}
              rules={{
                required: 'Number is required',
              }}
              render={({ ...rest }) => (
                <TextField
                  {...rest}
                  required
                  style={{ marginTop: 10 }}
                  variant="outlined"
                  id="date"
                  label="Number"
                  type="number"
                  error={getFormError('number', errors).hasError}
                  helperText={getFormError('number', errors).message}
                />
              )}
            />
          </>
        )}
        {selectedRadioOption === ANNUAL_OPTIONS.ON_THE && (
          <>
            <Controller
              name="period"
              control={control}
              render={({ ref, ...rest }) => {
                return (
                  <TextField
                    {...rest}
                    style={{ minWidth: 150, marginRight: spaces.small, marginTop: 10 }}
                    label="Period"
                    variant="outlined"
                    select
                    inputRef={ref}>
                    <MenuItem value="first">First</MenuItem>
                    <MenuItem value="Second">Second</MenuItem>
                    <MenuItem value="Third">Third</MenuItem>
                    <MenuItem value="Fourth">Fourth</MenuItem>
                    <MenuItem value="Last">Last</MenuItem>
                  </TextField>
                );
              }}
            />
            <Controller
              name="day"
              control={control}
              render={({ ref, ...rest }) => {
                return (
                  <TextField
                    {...rest}
                    style={{ minWidth: 150, marginTop: 10 }}
                    label="Day"
                    variant="outlined"
                    select
                    inputRef={ref}>
                    {daysOfTheWeek.map((day) => (
                      <MenuItem key={day.value} value={day.value}>
                        {day.value}
                      </MenuItem>
                    ))}
                  </TextField>
                );
              }}
            />
            <Box mx={10} width="max-content">
              <Typography style={{ display: 'inline-block' }}>of</Typography>
            </Box>
            <Controller
              name="month"
              control={control}
              render={({ ref, ...rest }) => {
                return (
                  <TextField
                    {...rest}
                    style={{ minWidth: 150, marginRight: spaces.small, marginTop: 10 }}
                    label="Month"
                    variant="outlined"
                    select
                    inputRef={ref}>
                    {monthNames.map((month) => (
                      <MenuItem key={month} value={month}>
                        {month}
                      </MenuItem>
                    ))}
                  </TextField>
                );
              }}
            />
          </>
        )}
      </Box>
    </Box>
  );
}
