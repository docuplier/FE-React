import { useMemo } from 'react';
import { useQuery } from '@apollo/client';

/**
 *
 * @param {DocumentNode} query
 * @param {object} options
 * @returns
 *
 * This custom hook accepts the same parameter as the useQuery hook from react-apollo
 * It allows you pass an extra field [keepPreviousData] that tells the hook to keep
 * the result of the previous query while making the new request
 *
 * This is quite useful for pagination to avoid page flicker when navigating between pages
 */
export const useQueryPagination = (query, options = {}) => {
  const { keepPreviousData = true, ...rest } = options;

  const { previousData, data, loading, ...otherResponseFields } = useQuery(query, {
    // fetchPolicy: 'network-only',
    ...rest,
  });

  const queryData = useMemo(() => {
    if (keepPreviousData) {
      return loading && !data ? previousData : data;
    }
    return data;
  }, [keepPreviousData, data, loading, previousData]);

  return {
    ...otherResponseFields,
    data: queryData,
    loading,
    previousData,
  };
};
