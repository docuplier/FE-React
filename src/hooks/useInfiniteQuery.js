import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { isEqual } from 'lodash';
import { usePrevious } from './usePrevious';

/**
 * This is a mirror of react-query's useInfiniteQuery
 * @see https://react-query.tanstack.com/reference/useInfiniteQuery#_top
 * 
 * @param {DocumentNode} query - A GraphQL query string parsed into an AST with the gql template literal.
 * @param {*} options - An Object containing the options from react-query as well as a `getNextPageVariable`
 * @returns {*}` - @see the `Returns` section
 * 
 * @description Rendering lists that can additively "load more" data onto an existing set of data or "infinite scroll" is also a very common UI pattern
 * This custom hooks helps with querying these types of lists
 * 
 * 
 * Custom Options
 * ==============================
 * ==> getNextPageVariables: (lastPage, lastVariables, allPages) => unknown | undefined
 *      - When new data is received for this query, this function receives both the last page of the infinite list of data and the full array of all pages.
 *      - It should return a single variable that will be passed as the last optional parameter to your query function.
 *      - Return undefined to indicate there is no next page available.
 * 
 * 
 * Returns
 * ==============================
 * ==> data.pages: TData[]
 *      - Array containing all pages.
 * 
 * ==> data.pageVariables: unknown[]
 *      - Array containing all page params.
 * 
 * ==> isFetchingNextPage: boolean
 *      - Will be `true` while fetching the next page with `fetchNextPage`.
 * 
 * ==> fetchNextPage: (variables?: { [key: string]: any }) => undefined
 *      - This function allows you to fetch the next "page" of results.
 *      - variables: allows you to manually specify a page variables instead of using `getNextPageVariables`
 * 
 * ==> hasNextPage: boolean
 *      - This will be `true` if there is a next page to be fetched (known via the `getNextPageVariables` option).
 * 
 * ==> loading: boolean
 *      - Only `true` when making the initial request
 * 
 * ==> isFetching: boolean
 *      - Always `true` when making requests
 * 
 * 
 * 
 * 
 * Example
 * ==============================
 * Imagine a mock query (user) returns a list users in this form
 * 
 * {
 *  totalCount: 2,
 *  results: [
 *      {name: "John Doe", },
 *      {name: "Jean Doe" }
 *  ]
 * }
 * 
 *  const { data, hasNextPage, isFetching, fetchNextPage, isFetchingNextPage, loading } = useInfiniteQuery(queryFn, {
 *     variables: {
 *         offset: 0,
 *         limit: 10
 *     },
 *     getNextPageVariables: (lastPageData, lastPageVariables) => {
 *           const numPages = Math.ceil(lastPageData?.user?.totalCount / lastPageVariables?.limit);
 *
 *          if (lastPageVariables?.offset + 1 === numPages) {
 *               return null
 *           }
 *          else{
 *               return = {
 *                  offset: lastPageVariables?.offset + 1
 *               }
 *          }
 *       }
 *  }) 
 * 
 * const renderData = () => {
 *      return data?.pages?.map((page) => {
 *          return page?.user?.results?.map((item) => {
 *              return <span>{item.name}</span>    
 *          })
 *      })
 * }
 * 
 * return (
 *  <>
 *      {loading && <span>Loading initial data...</span>}
 *      {isFetchingNextPage && <span>fetching next page</span>}
 *      <button disabled={!hasNextPage || isFetchingNextPage} onClick={() => fetchNextPage()}>
           Load more
        </button>
 *  </>
 * )
 * 
 */
export const useInfiniteQuery = (query, options = {}) => {
  const { variables: variablesFromOptions, getNextPageVariables, ...rest } = options;
  const [hasLoadedInitialQuery, setHasLoadedInitialQuery] = useState(false);
  const [variables, setVariables] = useState(variablesFromOptions);
  const [data, setData] = useState({
    pages: [],
    pageVariables: [],
  });
  const previousVariablesFromOptions = usePrevious(variablesFromOptions);

  const { data: recentPageData, loading, ...otherResponseFields } = useQuery(query, {
    fetchPolicy: 'no-cache',
    ...rest,
    variables,
  });

  useEffect(() => {
    if (!isEqual(variablesFromOptions, previousVariablesFromOptions)) {
      //reset the entire state of the hook if the variables from the argument is passed
      setHasLoadedInitialQuery(false);
      setVariables(variablesFromOptions);
      setData({
        pages: [],
        pageVariables: [],
      });
    }
    // eslint-disable-next-line
  }, [variablesFromOptions]);

  useEffect(() => {
    if (recentPageData && !hasLoadedInitialQuery) {
      setHasLoadedInitialQuery(true);
    }
  }, [recentPageData, hasLoadedInitialQuery]);

  useEffect(() => {
    if (recentPageData) {
      setData((prevState) => {
        let pages = [...prevState?.pages, recentPageData];
        let pageVariables = [...prevState?.pageVariables, variables];

        return {
          pages,
          pageVariables,
        };
      });
    }
    // eslint-disable-next-line
  }, [recentPageData]);

  const fetchNextPage = (customVariables) => {
    let modifiedVariables = null;
    let nextParam = getNextPageVariables?.(recentPageData, variables, data.pages);

    if (customVariables) {
      modifiedVariables = {
        ...variables,
        ...customVariables,
      };
    } else if (nextParam) {
      modifiedVariables = {
        ...variables,
        ...nextParam,
      };
    }

    if (modifiedVariables) {
      setVariables(modifiedVariables);
    }
  };

  return {
    ...otherResponseFields,
    isFetching: loading,
    loading: loading && !hasLoadedInitialQuery,
    isFetchingNextPage: loading && hasLoadedInitialQuery,
    hasNextPage: Boolean(getNextPageVariables?.(recentPageData, variables, data.pages)),
    fetchNextPage,
    data,
  };
};
