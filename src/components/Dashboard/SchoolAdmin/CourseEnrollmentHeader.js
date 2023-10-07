import { Box, Checkbox, Select, TextField, Typography } from '@material-ui/core';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { Autocomplete } from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import { fontWeight } from '../../../Css';

const CourseEnrollmentHeader = ({
  onSearch,
  searchArray,
  checkDisable,
  onChangeFilter,
  inputValue,
  onInputChange,
}) => {
  const classes = useStyles();
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const renderGraphHeader = () => {
    return (
      <Box display="flex" justifyContent="space-between" alignItems="baseline">
        <Typography variant="body1" color="textPrimary" style={{ fontWeight: fontWeight.bold }}>
          Course Enrollment
        </Typography>
        <Select
          native
          select
          placeholder="Filter"
          name="filter"
          style={{ width: 'max-content' }}
          className={classes.filterDropdown}
          onChange={onChangeFilter}>
          <option value={undefined}>Filter</option>
          <option value={true}>Top Courses</option>
          <option value={false}>Bottom Courses</option>
        </Select>
      </Box>
    );
  };

  const renderAutocomplete = () => {
    return (
      <Box my={8} className={classes.autocomplete}>
        <Autocomplete
          multiple
          onChange={(event, newValue) => {
            onSearch?.onClick(newValue);
          }}
          limitTags={10}
          id="checkboxes-tags-demo"
          options={searchArray}
          inputValue={inputValue}
          onInputChange={onInputChange}
          disableCloseOnSelect
          ListboxComponent="p"
          getOptionLabel={(option) => option?.title}
          getOptionDisabled={(option) => checkDisable()}
          renderOption={(option, { selected }) => (
            <>
              <Checkbox
                icon={icon}
                color="primary"
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              <Box display="flex" justifyContent="space-between" alignItems="center" width={'100%'}>
                <Typography> {option?.title} </Typography>
                <Typography> {option?.code} </Typography>
              </Box>
            </>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              type="search"
              variant="outlined"
              label="Search Courses"
            />
          )}
        />
      </Box>
    );
  };
  return (
    <div>
      {renderGraphHeader()}
      {renderAutocomplete()}
    </div>
  );
};

const useStyles = makeStyles(() => ({
  autocomplete: {
    '& label.MuiFormLabel-root.MuiInputLabel-root': {
      top: 5,
    },
  },
  filterDropdown: {
    width: 70,
    '&.MuiInput-underline:before': {
      borderBottom: '1px dashed rgba(0, 0, 0, 0.42)',
    },
  },
}));

export default CourseEnrollmentHeader;
