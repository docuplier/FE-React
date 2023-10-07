import React, { useMemo, useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Checkbox,
  makeStyles,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import classNames from 'classnames';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

import { ReactComponent as EmptyIcon } from 'assets/svgs/EmptySearchResults.svg';
import Empty from 'reusables/Empty';
import LoadingView from 'reusables/LoadingView';
import { OffsetLimitBasedPagination } from '../Pagination';
import TableHead, { SortOrder } from './TableHead';
import TooltipCell from './TooltipCell';

/**
 * @component
 * ResourceTable manages tables on the application. This component has similar apis with the antd Table
 * with very little modification.
 * @see https://ant.design/components/table/#header
 *
 * This component also has extra support for options or actions, ellipsis, cell tooltips and a custom
 * filterControl component can be passed
 *
 *  Check the stories for usage
 */
const ResourceTable = ({
  columns = [],
  dataSource = [],
  rowSelection, // exposes an onChange method where you can pass the callback to be executed when rows are selected using the checkbox
  onRow, // exposes an onClick method where you can pass the callback to be executed when a particular row is clicked directly
  loading,
  onChangeSort, // callback executed when sorter changes
  pagination,
  filterControl,
  options, // list of actions that can be performed
  onSelectOption, // the callback to be fired when a option from the actions dropdown is selected
  shouldClearCheckedState,
}) => {
  const theme = useTheme();
  const classes = useStyles({
    clickable: Boolean(onRow),
    hasCheckBox: Boolean(rowSelection),
    isMediumScreen: useMediaQuery(theme.breakpoints.down('sm')),
  });
  const [order, setOrder] = useState(SortOrder.ASC);
  const [orderBy, setOrderBy] = useState(null);
  const [selected, setSelected] = React.useState([]);
  const tableRef = useRef({ current: null });
  const [tableWidth, setTableWidth] = useState('auto');
  const [menuMetas, setMenuMetas] = React.useState({
    anchorEl: null,
    data: null,
  });

  useEffect(() => {
    setTableWidthOnResize();
  }, [dataSource]);

  useEffect(() => {
    window.addEventListener('resize', setTableWidthOnResize);

    return () => {
      window.removeEventListener('resize', setTableWidthOnResize);
    };
  }, []);

  const dataKeys = useMemo(() => {
    //This returns the keys of the dataSource. We use the key field if available
    //and fallback to the index if not available
    return dataSource.map((item, index) => item.key || index);
  }, [dataSource]);

  const getOptionColumn = useMemo(
    () => ({
      title: 'Action',
      dataIndex: 'action',
      align: 'right',
      render: (text, data) => <MoreVertIcon onClick={handleOpenOptions(data)} />,
    }),
    [],
  );

  const clearCheckedState = () => {
    setSelected([]);
  };

  useEffect(() => {
    if (!shouldClearCheckedState) return;
    clearCheckedState();
  }, [shouldClearCheckedState]);

  const modifiedColumns = useMemo(() => {
    //Check if options is passed and add an extra column to handle it if it is passed
    if (options) {
      return [...columns, getOptionColumn];
    }
    return columns;

    // eslint-disable-next-line
  }, [columns]);

  function setTableWidthOnResize() {
    setTableWidth(tableRef?.current?.offsetWidth);
  }

  const getSelectedData = (selectedKeys) => {
    return dataSource.filter((item, index) => selectedKeys.indexOf(item.key || index) !== -1);
  };

  const isSelected = (key) => selected.indexOf(key) !== -1;

  const handleRequestSort = (_event, property) => {
    const isAsc = orderBy === property && order === SortOrder.ASC;
    const newOrder = isAsc ? SortOrder.DESC : SortOrder.ASC;
    setOrder(newOrder);
    setOrderBy(property);

    onChangeSort?.(newOrder, property);
  };

  const handleOpenOptions = (data) => (event) => {
    event.stopPropagation();

    setMenuMetas({
      anchorEl: event.currentTarget,
      data,
    });
  };

  const handleSelectAll = (event) => {
    let newSelected = event.target.checked ? dataKeys : [];

    setSelected(newSelected);
    rowSelection?.onChange(newSelected, getSelectedData(newSelected));
  };

  const handleSelect = (key) => (event) => {
    event.stopPropagation();

    const selectedIndex = selected.indexOf(key);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, key);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
    rowSelection?.onChange(newSelected, getSelectedData(newSelected));
  };

  const handleRowClick = (row, rowIndex) => (event) => {
    onRow?.(row, rowIndex)?.onClick(event);
  };

  const handleSelectOption = (option) => (event) => {
    event.stopPropagation();
    onSelectOption?.(option, menuMetas.data);
    setMenuMetas({ anchorEl: null, data: null });
  };

  const renderCellData = (column, row, index) => {
    if (column.render) return column.render(row[column?.dataIndex], row, index) ?? null;
    return row[column?.dataIndex] ?? null;
  };

  const renderCellTooltipData = (column, row, index) => {
    if (column.renderTooltip) return column.renderTooltip(row[column?.dataIndex], row, index);
    return row[column?.dataIndex];
  };

  const renderMenu = () => {
    let _options = [];

    if (options && menuMetas.data) {
      _options = typeof options === 'function' ? options(menuMetas.data) : options;
    }

    return options ? (
      <Menu
        id="menu"
        anchorEl={menuMetas.anchorEl}
        keepMounted
        open={Boolean(menuMetas.anchorEl)}
        onClose={() => setMenuMetas({ anchorEl: null, data: null })}>
        {_options.map((option, index) => (
          <MenuItem
            style={{ color: option === 'Delete' ? '#DA1414' : '#272833' }}
            key={index}
            onClick={handleSelectOption(option)}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    ) : null;
  };

  const renderEmptyState = () => {
    const colSpan = rowSelection ? 1 + modifiedColumns?.length : modifiedColumns?.length;

    return (
      <TableRow className={classes.row} tabIndex={-1}>
        <TableCell colSpan={colSpan} style={{ textAlign: 'center' }}>
          <Box mt={16} mb={16}>
            <Empty description={'No Data Available'} icon={<EmptyIcon />} />
          </Box>
        </TableCell>
      </TableRow>
    );
  };

  const renderDataItems = () => {
    return dataSource.map((row, rowIndex) => {
      const key = dataKeys[rowIndex];
      const isItemSelected = isSelected(key);
      const labelId = `enhanced-table-checkbox-${rowIndex}`;

      return (
        <TableRow
          hover
          className={classes.row}
          onClick={handleRowClick(row, rowIndex)}
          role="checkbox"
          aria-checked={isItemSelected}
          tabIndex={-1}
          key={key}
          selected={isItemSelected}>
          {rowSelection && (
            <TableCell padding="checkbox">
              <Checkbox
                checked={isItemSelected}
                onChange={handleSelect(key)}
                onClick={(event) => event.stopPropagation()}
                inputProps={{ 'aria-labelledby': labelId }}
                color="primary"
              />
            </TableCell>
          )}
          {modifiedColumns.map((column) => (
            <TableCell
              align={column.align}
              className={classNames({
                [classes.ellipsisCell]: column.ellipsis,
              })}
              style={{ width: column.width }}>
              <TooltipCell
                title={renderCellTooltipData(column, row, rowIndex)}
                disabled={!Boolean(column.tooltip)}>
                {renderCellData(column, row, rowIndex)}
              </TooltipCell>
            </TableCell>
          ))}
        </TableRow>
      );
    });
  };

  return (
    <React.Fragment>
      <Box mb={12}>{filterControl}</Box>
      <LoadingView isLoading={loading}>
        <TableContainer component={Paper}>
          <Table
            ref={tableRef}
            aria-label="table"
            size="medium"
            aria-labelledby="tableTitle"
            classes={{ root: classes.table }}>
            <TableHead
              numberOfSelectedRows={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAll={handleSelectAll}
              onRequestSort={handleRequestSort}
              totalNumberOfRows={dataSource.length}
              canSelectAll={Boolean(rowSelection)}
              columns={modifiedColumns}
            />
            <TableBody>
              {dataSource?.length === 0 ? renderEmptyState() : renderDataItems()}
            </TableBody>
          </Table>
          <Box width={tableWidth}>
            <OffsetLimitBasedPagination table {...pagination} />
          </Box>
        </TableContainer>
      </LoadingView>
      {renderMenu()}
    </React.Fragment>
  );
};

const useStyles = makeStyles({
  row: {
    cursor: (props) => (props.clickable ? 'pointer' : 'default'),
  },
  table: {
    width: (props) => (props.isMediumScreen ? 'auto' : '100%'),
    tableLayout: 'fixed',
    '& .MuiTableCell-root': {
      paddingLeft: (props) => props.hasCheckBox === false && 16,
      paddingRight: (props) => props.hasCheckBox === false && 16,
    },
  },
  ellipsisCell: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});

ResourceTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.node,
      dataIndex: PropTypes.string.isRequired,
      render: PropTypes.func,
      sorter: PropTypes.bool,
      align: PropTypes.oneOfType(['center', 'inherit', 'justify', 'left', 'right']),
      width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      ellipsis: PropTypes.bool,
      tooltip: PropTypes.bool,
    }),
  ),
  dataSource: PropTypes.arrayOf(PropTypes.object),
  rowSelection: PropTypes.shape({
    onChange: PropTypes.func,
  }),
  onRow: PropTypes.func,
  loading: PropTypes.bool,
  onChange: PropTypes.func,
  filterControl: PropTypes.node,
  options: PropTypes.oneOf([PropTypes.func, PropTypes.arrayOf(PropTypes.string)]),
  onSelectOption: PropTypes.func,
  pagination: PropTypes.shape({
    ...OffsetLimitBasedPagination.propTypes,
  }),
};

export default React.memo(ResourceTable);
export { SortOrder };
