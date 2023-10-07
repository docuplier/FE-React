import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Paper,
  makeStyles,
  Box,
  Select,
  MenuItem,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import MuiPagination from '@material-ui/lab/Pagination';
import { fontSizes, spaces } from '../../Css';
import { useTheme } from '@material-ui/styles';

/**
 *
 * @component
 * Add the Pagination reusable to the app. This reusable can be used with any other reusable to
 * paginate data
 *
 * This component also uses the page and pageSize to achieve its purpose
 *
 * onChangePage ==> is called when the page number changes. It is called with the new page number and the current pageSize
 * onChangePage(newPage, pageSize)
 *
 * onChangePageSize ==> is called when the page size changes. It is called with the new page size and current page number
 * onChangePageSize(page, newPageSize)
 */
const NumberedBasedPagination = ({
  defaultPageSize,
  defaultPage,
  pageSize: pageSizeFromProps,
  page: pageFromProps,
  total,
  pageSizeOptions,
  onChangePage,
  onChangePageSize,
  paper,
  table,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const [pageSizeFromState, setPageSizeFromState] = useState(defaultPageSize);
  const [currentFromState, setCurrentFromState] = useState(defaultPage);
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const pageSize = useMemo(() => {
    return pageSizeFromProps !== undefined ? pageSizeFromProps : pageSizeFromState;
  }, [pageSizeFromProps, pageSizeFromState]);

  const page = useMemo(() => {
    return pageFromProps !== undefined ? pageFromProps : currentFromState;
  }, [pageFromProps, currentFromState]);

  const startCount = useMemo(() => {
    return page * pageSize - (pageSize - 1);
  }, [page, pageSize]);

  const endCount = useMemo(() => {
    let endCount = page * pageSize;
    return endCount < total ? endCount : total;
  }, [total, page, pageSize]);

  const handleChangePageSize = (evt) => {
    setPageSizeFromState(evt.target.value);
    onChangePageSize?.(page, evt.target.value);
  };

  const handleChangePage = (_evt, page) => {
    setCurrentFromState(page);
    onChangePage?.(page, pageSize);
  };

  const renderContent = () => {
    return (
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center">
          <Select
            value={pageSize}
            className={classes.select}
            onChange={handleChangePageSize}
            displayEmpty
            renderValue={(value) => `${value} items`}
            inputProps={{ 'aria-label': 'Change page size' }}>
            {pageSizeOptions.map((pageSizeOption) => (
              <MenuItem key={pageSizeOption} value={pageSizeOption}>
                {pageSizeOption}
              </MenuItem>
            ))}
          </Select>
          {(!isMediumScreen || table) && (
            <Typography variant="body2" className={classes.helperText}>
              Showing {startCount} to {endCount} of {total} entries.
            </Typography>
          )}
        </Box>
        <MuiPagination
          count={Math.ceil(total / pageSize)}
          shape="rounded"
          defaultPage={defaultPage}
          onChange={handleChangePage}
          page={page}
          size="small"
        />
      </Box>
    );
  };

  return paper ? <Paper className={classes.paper}>{renderContent()}</Paper> : renderContent();
};

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(8), //16px
  },
  helperText: {
    marginLeft: spaces.large,
  },
  select: {
    fontSize: fontSizes.medium,
    '&.MuiInput-underline:before': {
      border: 0,
    },
    '&:hover.MuiInput-underline:before': {
      border: 0,
    },
  },
}));

NumberedBasedPagination.propTypes = {
  defaultPageSize: PropTypes.number,
  defaultPage: PropTypes.number,
  pageSize: PropTypes.number,
  page: PropTypes.number,
  total: PropTypes.number.isRequired,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number.isRequired),
  onChangePage: PropTypes.func,
  onChangePageSize: PropTypes.func,
  paper: PropTypes.bool,
  table: PropTypes.bool,
};

NumberedBasedPagination.defaultProps = {
  defaultPageSize: 10,
  defaultPage: 1,
  total: 0,
  pageSizeOptions: [10, 20, 50, 100],
  paper: true,
};

export default React.memo(NumberedBasedPagination);
