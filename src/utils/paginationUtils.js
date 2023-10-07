import { DEFAULT_PAGE_LIMIT } from './constants';

export const getCursor = (totalCount, limit) => {
  if (totalCount < DEFAULT_PAGE_LIMIT || limit >= totalCount) {
    return null;
  }
  return limit + DEFAULT_PAGE_LIMIT;
};
