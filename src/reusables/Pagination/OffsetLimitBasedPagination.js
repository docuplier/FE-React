import React from 'react';
import PropTypes from 'prop-types';

import NumberedBasedPagination from './NumberedBasedPagination';

/**
 *
 * @component
 * This reusable is built on the NumberedBasedPagination component. We use composition to extend the features of an
 * offset based pagination rather than inheritance.
 *
 * This component uses offset and limit to handle paging. It also works very similar to the NumberedBasedPagination
 *
 * onChangeOffset ==> is called when the offset changes. It is called with the new offset and the current limit
 * onChangeOffset(newOffset, limit)
 *
 * onChangeLimit ==> is called when the limit changes. It is called with the new limit and current offset
 * onChangeLimit(offset, newLimit)
 */
const OffsetLimitBasedPagination = ({
  defaultOffset,
  defaultLimit,
  offset,
  limit,
  onChangeLimit,
  onChangeOffset,
  limitOptions,
  total,
  paper,
  table,
}) => {
  const handleChangePage = (page, pageSize) => {
    const offset = pageSize * (page - 1);
    onChangeOffset?.(offset, pageSize);
  };

  const handleChangePageSize = (page, pageSize) => {
    const offset = pageSize * (page - 1);
    onChangeLimit?.(offset, pageSize);
  };

  return (
    <NumberedBasedPagination
      defaultPageSize={defaultLimit}
      defaultPage={defaultOffset !== undefined ? defaultOffset / defaultLimit + 1 : undefined}
      pageSize={limit}
      page={offset !== undefined ? offset / limit + 1 : undefined}
      total={total}
      pageSizeOptions={limitOptions}
      onChangePage={handleChangePage}
      onChangePageSize={handleChangePageSize}
      paper={paper}
      table={table}
    />
  );
};

OffsetLimitBasedPagination.propTypes = {
  defaultOffset: PropTypes.number,
  defaultLimit: PropTypes.number,
  offset: PropTypes.number,
  limit: PropTypes.number,
  onChangeLimit: PropTypes.func,
  onChangeOffset: PropTypes.func,
  paper: PropTypes.bool,
  total: PropTypes.number.isRequired,
  offsetOptions: PropTypes.arrayOf(PropTypes.number.isRequired),
  table: PropTypes.bool,
};

OffsetLimitBasedPagination.defaultProps = {
  defaultOffset: 0,
  defaultLimit: 10,
  total: 0,
  offsetOptions: [10, 20, 50, 100],
  paper: true,
};

export default React.memo(OffsetLimitBasedPagination);
