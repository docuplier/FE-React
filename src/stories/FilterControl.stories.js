import React from 'react';
import { TextField, MenuItem, Grid } from '@material-ui/core';
import FilterControl from 'reusables/FilterControl';

export default {
  title: 'FilterControl',
  component: FilterControl,
};

export const FilterControlWithOnlySearch = () => (
  <FilterControl
    searchInputProps={{
      colSpan: {
        xs: 12,
      },
    }}
  />
);

export const FilterControlWithOkButton = () => (
  <FilterControl
    okButtonProps={{
      isLoading: false,
      children: 'Add Department',
    }}
  />
);

export const FilterControlWithCustomFilters = () => (
  <FilterControl
    okButtonProps={{
      isLoading: false,
      children: 'Add Department',
    }}
    renderCustomFilters={
      <>
        <Grid item xs={2}>
          <TextField select label="Status" variant="outlined" fullWidth>
            <MenuItem value="ongoing">Ongoing</MenuItem>
            <MenuItem value="ended">Ended</MenuItem>
          </TextField>
        </Grid>
      </>
    }
  />
);

export const FilterControlWithPaper = () => (
  <FilterControl
    paper
    okButtonProps={{
      isLoading: false,
      children: 'Add Department',
    }}
  />
);
