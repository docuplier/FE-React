import { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { useQuery } from '@apollo/client';

import Drawer from 'reusables/Drawer';
import { GET_COURSES } from 'graphql/queries/courses';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import { useNotification } from 'reusables/NotificationBanner';
import { DEFAULT_PAGE_OFFSET } from 'utils/constants';

const ChangeCourseDrawer = ({ open, onClose, onFilter, courseId }) => {
  const notification = useNotification();
  const { userDetails } = useAuthenticatedUser();
  const [searchText, setSearchText] = useState(undefined);
  const [filterParams, setFilterParams] = useState({
    courseId: undefined,
  });

  const { data: coursesData, loading: isLoadingCoursesData } = useQuery(GET_COURSES, {
    variables: {
      institutionId: userDetails?.institution?.id,
      offset: DEFAULT_PAGE_OFFSET,
      limit: 10,
      search: searchText,
      truncateResults: true,
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });
  const courses = coursesData?.courses?.results || [];

  useEffect(() => {
    if (open && courseId) {
      handleChangeFilterParams({ courseId });
    }
  }, [open, courseId]);

  const getCourseName = (courseId) => {
    return courses?.find((course) => course.id === courseId)?.title || '';
  };

  const handleChangeFilterParams = (changeset) => {
    setFilterParams((prevState) => ({
      ...prevState,
      ...changeset,
    }));
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Change Course"
      okText="Change"
      onOk={() => {
        onFilter?.(filterParams);
        onClose();
      }}>
      <Autocomplete
        id="course"
        onInputChange={(evt, newInputValue) => setSearchText(newInputValue)}
        onChange={(evt, newValue) => handleChangeFilterParams({ courseId: newValue?.id })}
        value={filterParams.courseId}
        getOptionSelected={(option, value) => option.id === value}
        options={courses}
        getOptionLabel={(courseId) => getCourseName(courseId)}
        renderOption={(course) => course.title}
        loading={isLoadingCoursesData}
        filterSelectedOptions
        filterOptions={(x) => x}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Search for Course"
            placeholder="Search for Course"
            fullWidth
          />
        )}
      />
    </Drawer>
  );
};

ChangeCourseDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onFilter: PropTypes.func.isRequired,
  courseId: PropTypes.string,
};

export default memo(ChangeCourseDrawer);
