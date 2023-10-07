import '@brainhubeu/react-carousel/lib/style.css';
import { Box, Button, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Add as AddIcon } from '@material-ui/icons';
import { useHistory, useLocation } from 'react-router-dom';

import CourseFilterSidebar from 'components/Courses/CourseFilterSidebar';
import BlueHeaderPageLayout from 'Layout/BlueHeaderPageLayout';
import { useState } from 'react';
import AccessControl from 'reusables/AccessControl';
import MaxWidthContainer from 'reusables/MaxWidthContainer';
import { OffsetLimitBasedPagination } from 'reusables/Pagination';
import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET, UserRoles } from 'utils/constants';
import { colors } from '../../Css';
import CourseListContent from 'components/Courses/CourseListContent';
import { GET_COURSES } from 'graphql/queries/courses';
import { useNotification } from 'reusables/NotificationBanner';
import { PrivatePaths } from 'routes';
import { useQueryPagination } from 'hooks/useQueryPagination';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import { GET_INSTITUTION_OVERVIEW } from 'graphql/queries/institution';
import { useQuery } from '@apollo/client';

const CourseList = () => {
  const classes = useStyles();
  const notification = useNotification();
  const history = useHistory();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const categoryId = params.get('categoryId');
  const subCategoryId = params.get('subCategoryId');
  const { userDetails } = useAuthenticatedUser();
  const institutionId = userDetails?.institution?.id;
  const [queryParams, setQueryParams] = useState({
    search: '',
    offset: DEFAULT_PAGE_OFFSET,
    limit: DEFAULT_PAGE_LIMIT,
    ordering: [],
  });

  const { data: courseLists, loading } = useQueryPagination(GET_COURSES, {
    variables: {
      categoryId: subCategoryId || categoryId || undefined,
      search: queryParams.search,
      limit: queryParams.limit,
      offset: queryParams.offset,
      institutionId,
      truncateResults: true,
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
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

  const handleChangeQueryParams = (changeset) => {
    setQueryParams((prevState) => ({
      ...prevState,
      ...changeset,
    }));
  };

  const handleChangeFilters = (changeset) => {
    let url = new URL(`${window.location.origin}${window.location.pathname}`);
    const filters = {
      categoryId,
      subCategoryId,
      ...changeset,
    };

    Object.keys(filters).forEach((filter) => {
      let value = filters[filter];
      if (value) {
        url.searchParams.set(filter, value);
      }
    });
    history.push(`${url.pathname}${url.search}`);
  };

  const renderOtherInformation = () => {
    return (
      <Box display="flex">
        <Typography component="p" className={classes.infoContent}>
          <strong>{courseStat?.courseCount}</strong> Courses
        </Typography>
        <AccessControl allowedRoles={[UserRoles.STUDENT, UserRoles.SCHOOL_ADMIN]}>
          <Typography component="p" className={classes.infoContent} style={{ paddingLeft: 16 }}>
            <strong>{courseStat?.categoryCount}</strong> Category
          </Typography>
        </AccessControl>
        <AccessControl allowedRoles={[UserRoles.STUDENT, UserRoles.SCHOOL_ADMIN]}>
          <Typography
            component="p"
            className={classes.infoContent}
            style={{ borderRight: 0, paddingLeft: 16 }}>
            <strong>{courseStat?.subcategoryCount}</strong> Subcategories
          </Typography>
        </AccessControl>
      </Box>
    );
  };

  const renderBannerRightContent = () => {
    return (
      <AccessControl allowedRoles={[UserRoles.SCHOOL_ADMIN]}>
        <Button
          startIcon={<AddIcon />}
          style={{ background: '#fff' }}
          onClick={() => history.push(`${PrivatePaths.COURSES}/create-course`)}
          variant="contained">
          New Course
        </Button>
      </AccessControl>
    );
  };

  return (
    <BlueHeaderPageLayout
      onTabChange={(value) => value}
      isTabBarHidden={true}
      title={'Courses'}
      description={`Courses and lecture contents created by Administrative Users and Instructors for students' consumption. All academic courses for each department, level and semester are shown under this section.`}
      rightContent={renderBannerRightContent()}
      otherInformation={renderOtherInformation()}
      isPageLoaded={Boolean(courseLists?.courses)}
      links={[{ title: 'Home', to: '/' }]}>
      <MaxWidthContainer>
        <Box py={20}>
          <Grid container spacing={10}>
            <Grid item xs={12} md={3}>
              <CourseFilterSidebar
                filters={{
                  categoryId,
                  subCategoryId,
                }}
                onChangeFilter={handleChangeFilters}
              />
            </Grid>
            <Grid item xs={12} md={9}>
              <Box mb={10}>
                <CourseListContent
                  courseLists={courseLists}
                  loading={loading}
                  queryParams={queryParams}
                  onChange={handleChangeQueryParams}
                />
              </Box>
              {Boolean(courseLists?.courses?.results?.length) && (
                <OffsetLimitBasedPagination
                  total={courseLists?.courses?.totalCount}
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
              )}
            </Grid>
          </Grid>
        </Box>
      </MaxWidthContainer>
    </BlueHeaderPageLayout>
  );
};

const useStyles = makeStyles((theme) => ({
  topicContainer: {
    border: `1px solid ${colors.seperator}`,
  },
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

export default CourseList;
