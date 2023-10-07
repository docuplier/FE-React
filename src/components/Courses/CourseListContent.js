import React from 'react';
import { Box, Grid } from '@material-ui/core';

import FilterControl from 'reusables/FilterControl';
import CourseListItem from 'components/Courses/CourseListItem';
import LoadingView from 'reusables/LoadingView';

const CourseListContent = ({ courseLists, loading, queryParams, onChange }) => {
  const courseItem = courseLists?.courses?.results;
  const renderContentBody = () => {
    return (
      <>
        <Grid container spacing={10}>
          <Grid item xs={12}>
            <FilterControl
              searchInputProps={{
                colSpan: {
                  xs: 12,
                },
                onChange: (e) => onChange({ [e.target.name]: e.target.value }),
                name: 'search',
                value: queryParams.search,
              }}
            />
            <Box my={12}>
              <LoadingView isLoading={loading}>
                <CourseListItem courseInformation={courseItem} />
              </LoadingView>
            </Box>
          </Grid>
        </Grid>
      </>
    );
  };

  return <Box>{renderContentBody()}</Box>;
};

export default CourseListContent;
