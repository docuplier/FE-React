import React from 'react';
import PropTypes from 'prop-types';
import { TextField, Grid, Box, Paper, makeStyles } from '@material-ui/core';

import LoadingButton from './LoadingButton';

const FilterControl = ({ renderCustomFilters, okButtonProps, searchInputProps, paper }) => {
  const classes = useStyles();

  const renderContent = () => {
    return (
      <Grid container justify="space-between" spacing={10}>
        <Grid item xs={12} sm={okButtonProps ? 9 : 12}>
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={8} {...searchInputProps?.colSpan}>
              <TextField
                id="outlined-search"
                label="Search"
                type="search"
                variant="outlined"
                fullWidth
                {...searchInputProps}
              />
            </Grid>
            {renderCustomFilters}
          </Grid>
        </Grid>
        {okButtonProps && (
          <Grid item xs={12} sm={2}>
            <Box display="flex" justifyContent="flex-end">
              <LoadingButton {...okButtonProps} />
            </Box>
          </Grid>
        )}
      </Grid>
    );
  };

  return paper ? <Paper className={classes.paper}>{renderContent()}</Paper> : renderContent();
};

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(8), //16px
  },
}));

FilterControl.propTypes = {
  searchInputProps: PropTypes.shape({
    ...TextField.propTypes,
    colSpan: PropTypes.shape({
      xs: PropTypes.number,
      sm: PropTypes.number,
      md: PropTypes.number,
      lg: PropTypes.number,
    }),
  }),
  renderCustomFilters: PropTypes.node,
  okButtonProps: PropTypes.shape({
    ...LoadingButton.propTypes,
  }),
  paper: PropTypes.bool,
};

export default React.memo(FilterControl);
