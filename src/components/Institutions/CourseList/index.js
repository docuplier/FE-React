import React from 'react';
import PropTypes from 'prop-types';

import FilterControl from 'reusables/FilterControl';
import Course from './Course';

const CourseList = ({ data, handleSearch, queryParams }) => {
  return (
    <>
      <FilterControl
        searchInputProps={{
          colSpan: {
            xs: 12,
          },
          onChange: (evt) => handleSearch({ search: evt.target.value }),
          value: queryParams.search,
        }}
      />
      {data?.map((item) => (
        <Course key={item.id} {...item} />
      ))}
    </>
  );
};

CourseList.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      ...Course.propTypes,
    }),
  ),
};

export default React.memo(CourseList);
