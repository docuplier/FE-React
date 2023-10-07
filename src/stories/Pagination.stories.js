import React, { useState } from 'react';
import { NumberedBasedPagination, OffsetLimitBasedPagination } from 'reusables/Pagination';

export default {
  title: 'Pagination',
};

export const UncontrolledNumberedBasedPagination = () => <NumberedBasedPagination total={30} />;

export const ControlledNumberedBasedPagination = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  return (
    <NumberedBasedPagination
      total={24}
      page={page}
      pageSize={pageSize}
      onChangePage={(page, _pageSize) => setPage(page)}
      onChangePageSize={(_page, pageSize) => {
        setPageSize(pageSize);
        setPage(1);
      }}
    />
  );
};

export const NoPaperNumberedBasedPagination = () => (
  <NumberedBasedPagination paper={false} total={30} />
);

export const ControlledOffsetLimitBasedPagination = () => {
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);

  return (
    <OffsetLimitBasedPagination
      total={24}
      offset={offset}
      limit={limit}
      onChangeOffset={(offset, _limit) => setOffset(offset)}
      onChangeLimit={(_offset, limit) => {
        setLimit(limit);
        setOffset(0);
      }}
    />
  );
};

export const UncontrolledOffsetLimitBasedPagination = () => (
  <OffsetLimitBasedPagination total={30} />
);
