import React, { useState } from 'react';
import { Grid } from '@material-ui/core';

import CourseFilter from 'components/Institutions/CourseFilter';
import CourseList from 'components/Institutions/CourseList';
import { useQueryPagination } from 'hooks/useQueryPagination';
import { GET_COURSES } from 'graphql/queries/courses';
import { DEFAULT_PAGE_OFFSET, DEFAULT_PAGE_LIMIT } from 'utils/constants';
import { useNotification } from 'reusables/NotificationBanner';
import LoadingView from 'reusables/LoadingView';

const CourseSection = () => {
  const notification = useNotification();
  const [queryParams, setQueryParams] = useState({
    search: '',
    offset: DEFAULT_PAGE_OFFSET,
    limit: DEFAULT_PAGE_LIMIT,
    ordering: null,
  });

  const { data: coursesData, loading: coursesLoading } = useQueryPagination(GET_COURSES, {
    variables: {
      offset: queryParams.offset,
      limit: queryParams.limit,
      searchTerm: queryParams.search,
      ordering: queryParams.ordering,
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const handleChangeQueryParams = (changeset) => {
    setQueryParams((prevState) => ({
      ...prevState,
      ...changeset,
    }));
  };

  return (
    <Grid container spacing={10}>
      <Grid item xs={4}>
        <CourseFilter queryParams={queryParams} handleQueryChange={handleChangeQueryParams} />
      </Grid>
      <Grid item xs={8}>
        <LoadingView isLoading={coursesLoading}>
          <CourseList
            data={coursesData?.courses?.results || []}
            handleSearch={handleChangeQueryParams}
            queryParams={queryParams}
          />
        </LoadingView>
      </Grid>
    </Grid>
  );
};

export default React.memo(CourseSection);
