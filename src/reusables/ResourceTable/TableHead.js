import React from 'react';
import PropTypes from 'prop-types';
import {
  TableHead as MuiTableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  Checkbox,
  makeStyles,
} from '@material-ui/core';

export const SortOrder = {
  ASC: `asc`,
  DESC: `desc`,
};

const TableHead = ({
  columns,
  onSelectAll,
  canSelectAll,
  numberOfSelectedRows,
  totalNumberOfRows,
  order,
  orderBy,
  onRequestSort,
}) => {
  const classes = useStyles();

  const handleSort = (property) => (event) => {
    onRequestSort(event, property);
  };

  const renderCheckbox = () => {
    return (
      <TableCell padding="checkbox">
        <Checkbox
          indeterminate={numberOfSelectedRows > 0 && numberOfSelectedRows < totalNumberOfRows}
          checked={totalNumberOfRows > 0 && numberOfSelectedRows === totalNumberOfRows}
          onChange={onSelectAll}
          inputProps={{ 'aria-label': 'select all' }}
          color="primary"
        />
      </TableCell>
    );
  };

  return (
    <MuiTableHead>
      <TableRow>
        {canSelectAll && renderCheckbox()}
        {columns.map((column, index) => {
          const { dataIndex, align, sorter, title, width } = column;

          return (
            <TableCell
              align={align}
              key={dataIndex || index}
              style={{ width }}
              sortDirection={sorter && orderBy === dataIndex ? order : false}>
              <TableSortLabel
                active={sorter && orderBy === dataIndex}
                direction={sorter && orderBy === dataIndex ? order : SortOrder.ASC}
                onClick={handleSort(dataIndex)}>
                {title}
                {orderBy === dataIndex ? (
                  <span className={classes.visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>
          );
        })}
      </TableRow>
    </MuiTableHead>
  );
};

const useStyles = makeStyles({
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
});

TableHead.propTypes = {
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
  onSelectAll: PropTypes.func,
  canSelectAll: PropTypes.bool,
  numberOfSelectedRows: PropTypes.number,
  totalNumberOfRows: PropTypes.number,
  order: PropTypes.oneOfType(Object.values(SortOrder)),
  orderBy: PropTypes.string,
  onRequestSort: PropTypes.func.isRequired,
};

export default React.memo(TableHead);
