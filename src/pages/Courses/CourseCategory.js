import { Box, Button, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Add as AddIcon } from '@material-ui/icons';
import UpsertCategoryDrawer from 'components/Courses/CourseCategory/UpsertCategoryDrawer';
import BlueHeaderPageLayout from 'Layout/BlueHeaderPageLayout';
import { memo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import FilterControl from 'reusables/FilterControl';
import MaxWidthContainer from 'reusables/MaxWidthContainer';
import { OffsetLimitBasedPagination } from 'reusables/Pagination';
import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET } from 'utils/constants';
import { colors, spaces } from '../../Css';
import { GET_COURSE_CATEGORIES_QUERY } from 'graphql/queries/courses';
import { useNotification } from 'reusables/NotificationBanner';
import { useQueryPagination } from 'hooks/useQueryPagination';
import LoadingView from 'reusables/LoadingView';
import CategoriesAccordion from 'components/Courses/CourseCategory/CategoriesAccordion';
import { convertToSentenceCase } from 'utils/TransformationUtils';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_CATEGORY, UPDATE_CATEGORY } from 'graphql/mutations/courses';
import Empty from 'reusables/Empty';
import { GET_INSTITUTION_OVERVIEW } from 'graphql/queries/institution';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';

const CourseCategory = () => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [isUpsertCategoryDrawerVisible, setIsUpsertCategoryDrawerVisible] = useState(false);
  const [isAddingNewSubCategory, setIsAddingNewSubCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const notification = useNotification();
  const history = useHistory();
  const { handleSubmit, control, errors, reset } = useForm();
  const { pathname } = useLocation();
  const { userDetails } = useAuthenticatedUser();
  const institutionId = userDetails?.institution?.id;

  const [queryParams, setQueryParams] = useState({
    search: '',
    offset: DEFAULT_PAGE_OFFSET,
    limit: DEFAULT_PAGE_LIMIT,
  });

  const [createCategory, { loading: newCategoryLoading }] = useMutation(CREATE_CATEGORY, {
    onCompleted: (response) => onCompleted(response, 'createCategory'),
    onError,
  });

  const [updateCategory, { loading: updateCategoryLoading }] = useMutation(UPDATE_CATEGORY, {
    onCompleted: (response) => onCompleted(response, 'updateCategory'),
    onError,
  });

  const {
    loading: categoriesIsLoading,
    data: categoriesData,
    refetch,
  } = useQueryPagination(GET_COURSE_CATEGORIES_QUERY, {
    variables: queryParams,
    onError,
  });

  const { data: institutionOverview } = useQuery(GET_INSTITUTION_OVERVIEW, {
    variables: {
      institutionId,
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });
  const courseStat = institutionOverview?.institutionOverview;

  function onCompleted(response, key) {
    const { ok, errors, category } = response[key];
    const status = ok === false ? 'error' : 'success';
    const message = errors
      ? errors?.map((error) => error.messages).join('. ')
      : selectedCategory?.id === category?.id
      ? `Category has been updated successfully`
      : `Category has been created successfully`;

    notification[status]({
      message: `${convertToSentenceCase(status)}!`,
      description: message,
    });
    if (category) {
      reset({});
      setIsUpsertCategoryDrawerVisible(false);
      refetch();
    }
  }

  function onError(error) {
    notification.error({
      message: 'Error!',
      description: error?.message,
    });
  }

  const onCreateCategory = (values) => {
    return createCategory({
      variables: values,
    });
  };

  const onUpdateCategory = (values) => {
    return updateCategory({
      variables: values,
    });
  };

  const handleExpansion = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleChangeQueryParams = (changeset) => {
    setQueryParams((prevState) => ({
      ...prevState,
      ...changeset,
    }));
  };

  const handleOpenCategoryDrawer = (category) => {
    setSelectedCategory(category);
    setIsUpsertCategoryDrawerVisible(true);
  };

  const renderOtherInformation = () => {
    return (
      <Box display="flex">
        <Typography component="p" className={classes.infoContent}>
          <strong>{courseStat?.courseCount}</strong> Course
        </Typography>
        <Typography component="p" className={classes.infoContent} style={{ paddingLeft: 16 }}>
          <strong>{courseStat?.categoryCount}</strong> Category
        </Typography>
        <Typography
          component="p"
          className={classes.infoContent}
          style={{ borderRight: 0, paddingLeft: 16 }}>
          <strong>{courseStat?.subcategoryCount}</strong> Sub Category
        </Typography>
      </Box>
    );
  };

  const renderBannerRightContent = () => {
    return (
      <>
        <Button
          color="secondary"
          style={{ marginRight: spaces.medium }}
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleOpenCategoryDrawer}>
          Add Category
        </Button>
        <Button
          startIcon={<AddIcon />}
          style={{ background: '#fff' }}
          onClick={() => history.push(`${pathname}/create-course`)}
          variant="contained">
          New Course
        </Button>
      </>
    );
  };

  const renderContentBody = () => {
    return (
      <>
        <Grid item xs={12} lg={12}>
          <Grid container spacing={10}>
            <Grid item xs={12}>
              <FilterControl
                searchInputProps={{
                  colSpan: {
                    xs: 12,
                  },
                  onChange: (evt) =>
                    handleChangeQueryParams({
                      search: evt.target.value,
                      offset: DEFAULT_PAGE_OFFSET,
                    }),
                }}
              />
            </Grid>
          </Grid>

          <Box mt={12}>
            <LoadingView isLoading={categoriesIsLoading} size={60}>
              {categoriesData?.categories?.results?.map((category) => {
                return (
                  <CategoriesAccordion
                    category={category}
                    expanded={expanded}
                    onExpansion={handleExpansion}
                    setIsAddingNewSubCategory={setIsAddingNewSubCategory}
                    handleOpenCategoryDrawer={handleOpenCategoryDrawer}
                    isAddingNewSubCategory={isAddingNewSubCategory}
                    onCreateCategory={onCreateCategory}
                    onUpdateCategory={onUpdateCategory}
                  />
                );
              })}
              {categoriesData?.categories?.totalCount === 0 && (
                <Empty title="No Categories" description="No categories has been created." />
              )}
            </LoadingView>
          </Box>
        </Grid>
      </>
    );
  };

  return (
    <>
      <BlueHeaderPageLayout
        isTabBarHidden={true}
        title="Courses"
        description="Course categorization on the system. View all the categories and sub-categories created on the system for your institution."
        rightContent={renderBannerRightContent()}
        otherInformation={renderOtherInformation()}
        isPageLoaded={true}
        links={[{ title: 'Home', to: '/' }]}>
        <MaxWidthContainer>
          <Box mt={8} display="flex" justifyContent="flex-end">
            <Button color="primary" onClick={() => history.push('/courses/all')}>
              View All Courses
            </Button>
          </Box>
          <Box py={20}>
            <Grid container spacing={10}>
              {renderContentBody()}
              {Boolean(categoriesData?.categories?.totalCount) && (
                <Grid item xs={12} lg={12}>
                  <OffsetLimitBasedPagination
                    total={categoriesData?.categories?.totalCount}
                    onChangeLimit={(_offset, limit) =>
                      handleChangeQueryParams({
                        offset: DEFAULT_PAGE_OFFSET,
                        limit,
                      })
                    }
                    onChangeOffset={(offset) => handleChangeQueryParams({ offset })}
                    offset={queryParams.offset}
                    limit={queryParams.limit}
                  />
                </Grid>
              )}
            </Grid>
          </Box>
        </MaxWidthContainer>
      </BlueHeaderPageLayout>
      <UpsertCategoryDrawer
        open={isUpsertCategoryDrawerVisible}
        onClose={() => setIsUpsertCategoryDrawerVisible(false)}
        categoryField={selectedCategory}
        handleSubmit={handleSubmit}
        control={control}
        errors={errors}
        reset={reset}
        updateCategory={updateCategory}
        newCategoryLoading={newCategoryLoading}
        updateCategoryLoading={updateCategoryLoading}
        onCreateCategory={onCreateCategory}
        onUpdateCategory={onUpdateCategory}
      />
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  infoContent: {
    display: 'inline',
    paddingRight: theme.spacing(8),
    borderRight: `1px solid ${colors.white}`,
    '&:nth-child(2)': {
      borderLeft: `1px solid ${colors.white}`,
    },
    '&:nth-child(1)': {
      border: 'none',
    },
  },
}));

export default memo(CourseCategory);
