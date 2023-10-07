import React, { useState } from 'react';
import { Box, Radio, RadioGroup, FormControlLabel, TextField, MenuItem } from '@material-ui/core';
import { Controller } from 'react-hook-form';
import { getFormError } from 'utils/formError';
import { spaces } from '../../../Css';
import { daysOfTheWeek } from 'utils/constants';

const MONTHLY_OPTIONS = {
  ON_DAY: 'ON_DAY',
  ON_THE: 'ON_THE',
};

export default function RenderMonthlyInterval({ useFormUtils, isSelectedInterval }) {
  const [selectedRadioOption, setSelectedRadioOption] = useState(MONTHLY_OPTIONS.ON_DAY);
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
          value={MONTHLY_OPTIONS.ON_DAY}
          control={<Radio color="primary" />}
          label="On day"
        />
        <FormControlLabel
          value={MONTHLY_OPTIONS.ON_THE}
          control={<Radio color="primary" />}
          label="On the"
        />
      </RadioGroup>
      <Box>
        {selectedRadioOption === MONTHLY_OPTIONS.ON_DAY && (
          <Controller
            name="number"
            control={control}
            rules={{
              required:
                isSelectedInterval &&
                selectedRadioOption === MONTHLY_OPTIONS.ON_DAY &&
                'Number is required',
            }}
            render={({ ...rest }) => (
              <TextField
                {...rest}
                required
                variant="outlined"
                id="date"
                label="Number"
                type="number"
                error={getFormError('number', errors).hasError}
                helperText={getFormError('number', errors).message}
              />
            )}
          />
        )}
        {selectedRadioOption === MONTHLY_OPTIONS.ON_THE && (
          <>
            <Controller
              name="period"
              control={control}
              render={({ ref, ...rest }) => {
                return (
                  <TextField
                    {...rest}
                    style={{ minWidth: 150, marginRight: spaces.small }}
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
                    style={{ minWidth: 150 }}
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
          </>
        )}
      </Box>
    </Box>
  );
}
