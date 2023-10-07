import React, { useState } from 'react';
import { TextField, Box, Paper, Typography } from '@material-ui/core';
import { useQuery } from '@apollo/client';

import CourseCategoryAccordion from './CourseCategoryAccordion';
import { useNotification } from 'reusables/NotificationBanner';
import { GET_COURSE_CATEGORIES_QUERY } from 'graphql/queries/courses';
import Drawer from 'reusables/Drawer';

const CourseCreationCategoryDrawer = ({ open, onClose, setSelectedCategories }) => {
  const [expanded, setExpanded] = useState(null);
  const [searchtext, setSearchtext] = useState(null);
  const [normalizeCourseCategories, setNormalizeCourseCategories] = useState({});
  const notification = useNotification();

  useQuery(GET_COURSE_CATEGORIES_QUERY, {
    variables: { search: searchtext },
    onCompleted: (response) => {
      let { results } = response?.categories;
      if (results) {
        let categoriesObj = {};

        results.forEach((category) => {
          let subCategoriesObj = {};
          category.child.forEach((subCategory) => {
            subCategoriesObj[subCategory.id] = subCategory;
          });
          categoriesObj[category.id] = {
            ...category,
            child: subCategoriesObj,
          };
        });

        setNormalizeCourseCategories(categoriesObj);
      }
    },
    onError,
  });

  function onError(error) {
    notification.error({
      message: 'Error!',
      description: error?.message,
    });
  }

  const onSelectCategory = (category) => {
    setNormalizeCourseCategories((prevState) => ({
      ...prevState,
      [category.id]: category,
    }));
  };

  const getSelectedCourse = () => {
    return Object.values(normalizeCourseCategories)
      .map((category) => Object.values(category.child) || [])
      .flat(1)
      .filter((category) => category.selected === true)
      .map((category) => category.id);
  };

  const onSaveSelectedCourse = () => {
    setSelectedCategories(getSelectedCourse());
    onClose();
  };

  const handleExpand = (categoryId) => (_, newExpanded) => {
    setExpanded(newExpanded ? categoryId : null);
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Select Course Categories"
      onOk={onSaveSelectedCourse}>
      <Box>
        <TextField
          value={searchtext}
          onChange={(event) => setSearchtext(event.target.value)}
          fullWidth
          variant="outlined"
          label="Search"
        />
      </Box>
      <Box mt={10} ml={-10} mr={-10} style={{ boxShadow: 'inset 0px -1px 0px #E7E7ED' }}>
        <Paper elevation={1} style={{ background: '#F1F2F6', padding: '10px 20px' }}>
          <Typography color="textPrimary">
            Selected sub level: {getSelectedCourse().length}
          </Typography>
        </Paper>
      </Box>
      <Box mt={20}>
        {Object.values(normalizeCourseCategories).map((category) => (
          <Box mb={5} key={category.id}>
            <CourseCategoryAccordion
              expanded={expanded}
              onExpandChange={handleExpand(category.id)}
              category={category}
              onSelectCategory={onSelectCategory}
            />
          </Box>
        ))}
      </Box>
    </Drawer>
  );
};

export default React.memo(CourseCreationCategoryDrawer);
