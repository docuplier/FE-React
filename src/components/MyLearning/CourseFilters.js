import React from 'react';
import { Box, Grid, MenuItem, TextField, useMediaQuery, useTheme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import FilterControl from 'reusables/FilterControl';
import { spaces } from '../../Css';
import { DEFAULT_PAGE_OFFSET, EnrolmentStatus } from 'utils/constants';
import { convertToSentenceCase } from 'utils/TransformationUtils';

const CourseFilters = ({ filters, onChange }) => {
  const classes = useStyles();
  const theme = useTheme();
  delete EnrolmentStatus.NONE;
  const handleChange = (e) => {
    onChange({ [e.target.name]: e.target.value, offset: DEFAULT_PAGE_OFFSET });
  };
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Box className={classes.inputField}>
      <FilterControl
        searchInputProps={{
          name: 'search',
          value: filters.search,
          onChange: handleChange,
          colSpan: {
            xs: isMediumScreen ? 7 : 10,
          },
        }}
        renderCustomFilters={
          <Grid item xs={isMediumScreen ? 5 : 2}>
            <TextField
              variant="outlined"
              select
              fullWidth
              label="All"
              name="enrolmentsStatus"
              onChange={handleChange}>
              <MenuItem value="all">All</MenuItem>
              {Object.values(EnrolmentStatus).map((value) => (
                <MenuItem key={value} value={value}>
                  {convertToSentenceCase(value)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        }
      />
    </Box>
  );
};

const useStyles = makeStyles(() => ({
  inputField: {
    '& .select-section': {
      marginBottom: spaces.medium,
      '& > *': {
        width: '20%',
        marginRight: spaces.medium,
      },
    },
  },
}));

export default CourseFilters;
