import { memo, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useHistory, useLocation } from 'react-router-dom';
import { Box, Button, Grid } from '@material-ui/core';
import { useQuery } from '@apollo/client';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';

import BlueHeaderPageLayout from 'Layout/BlueHeaderPageLayout';
import { PrivatePaths } from 'routes';
import FilterControl from 'reusables/FilterControl';
import CourseProgressCard from 'reusables/CourseProgressCard';
import { getContentImage } from 'utils/LibraryUtils';
import { convertToSentenceCase } from 'utils/TransformationUtils';
import { OffsetLimitBasedPagination } from 'reusables/Pagination';
import Empty from 'reusables/Empty';
import MaxWidthContainer from 'reusables/MaxWidthContainer';
import { useQueryPagination } from 'hooks/useQueryPagination';
import {
  GET_FIELD_OF_INTEREST,
  GET_LIBRARY_CONTENTS,
  GET_SAVED_CONTENTS,
} from 'graphql/queries/library';
import { useNotification } from 'reusables/NotificationBanner';
import {
  MULTIPLE_OF_TWELVE_DEFAULT_PAGE_LIMIT,
  DEFAULT_PAGE_OFFSET,
  UserRoles,
} from 'utils/constants';
import LoadingView from 'reusables/LoadingView';
import AccessControl from 'reusables/AccessControl';
import { colors } from '../../Css';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import UpsertCategoryDrawer from 'components/Library/UpsertCategoryDrawer';
import LoadingButton from 'reusables/LoadingButton';

const CategoryDetails = () => {
  const { categoryId } = useParams();
  const isSavedContents = !categoryId ? true : false;
  const history = useHistory();
  const notification = useNotification();
  const [isCategoryDrawerVisible, setIsCategoryDrawerVisible] = useState(null);
  const { userDetails } = useAuthenticatedUser();

  const [queryParams, setQueryParams] = useState({
    offset: DEFAULT_PAGE_OFFSET,
    limit: MULTIPLE_OF_TWELVE_DEFAULT_PAGE_LIMIT,
    search: '',
    interestId: isSavedContents ? undefined : categoryId,
  });

  const { data: fieldOfInterestData } = useQuery(GET_FIELD_OF_INTEREST, {
    variables: {
      interestId: categoryId,
    },
    skip: isSavedContents,
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });
  const fieldOfInterest = fieldOfInterestData?.fieldOfInterest || {};

  const { loading, data: queryData } = useQueryPagination(
    isSavedContents ? GET_SAVED_CONTENTS : GET_LIBRARY_CONTENTS,
    {
      variables: { ...queryParams },
      onError: (error) => {
        notification.error({
          message: error?.message,
        });
      },
    },
  );

  const data = useMemo(() => {
    if (queryData) {
      const response = isSavedContents ? queryData?.savedContents : queryData?.libraryContents;
      let { totalCount, results } = response || {};

      if (isSavedContents) {
        results = results?.reduce((acc, value) => {
          if (value.content) {
            acc.push(value.content);
          }
          return acc;
        }, []);
      }

      return {
        totalCount,
        results,
      };
    }

    return { totalCount: 0, results: [] };
  }, [queryData, isSavedContents]);

  const handleChangeQueryParams = (changeset) => {
    setQueryParams((prevState) => ({
      ...prevState,
      ...changeset,
    }));
  };

  const handleNavigateToContentDetails =
    ({ categoryId, contentId }) =>
    () => {
      history.push(`${PrivatePaths.LIBRARY}/categories/${categoryId}/contents/${contentId}`);
    };

  const renderEmpty = () => {
    return <Empty title="No Content" description="No content found" />;
  };

  const renderRightContent = () => {
    return (
      <AccessControl allowedRoles={[UserRoles.GLOBAL_ADMIN]}>
        <Box height="100%" display="flex" justifyContent="flex-end" alignItems="center">
          <Button
            variant="outlined"
            startIcon={<CreateOutlinedIcon />}
            style={{ color: colors.white }}
            onClick={() => setIsCategoryDrawerVisible(true)}>
            Edit
          </Button>
        </Box>
      </AccessControl>
    );
  };

  const renderContents = () => {
    return (
      <>
        <Box my={20}>
          <Grid container spacing={6}>
            {data?.results?.map((content) => (
              <Grid item xs={12} sm={6} md={3}>
                <CourseProgressCard
                  key={content?.id}
                  title={content?.name}
                  description={content?.description}
                  imageSrc={getContentImage(content?.thumbnail, content?.contentFormat)}
                  footerText={null}
                  onClick={
                    (console.log(content),
                    handleNavigateToContentDetails({
                      categoryId: isSavedContents
                        ? content?.fieldOfInterests[0]?.id
                        : fieldOfInterest?.id,
                      contentId: content?.id,
                    }))
                  }
                  chipProp={{
                    label: convertToSentenceCase(content?.contentFormat),
                    color: 'warning',
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
        <OffsetLimitBasedPagination
          total={data.totalCount}
          offset={queryParams.offset}
          limit={queryParams.limit}
          onChangeLimit={(_offset, limit) =>
            handleChangeQueryParams({
              offset: DEFAULT_PAGE_OFFSET,
              limit,
            })
          }
          onChangeOffset={(offset) => handleChangeQueryParams({ offset })}
          limitOptions={[12, 24, 36, 48]}
        />
      </>
    );
  };

  return (
    <BlueHeaderPageLayout
      isTabBarHidden={true}
      title={isSavedContents ? `Saved Contents (${data.totalCount})` : fieldOfInterest.name}
      description={isSavedContents ? fieldOfInterest.description : ''}
      links={[{ title: 'Library', to: PrivatePaths.LIBRARY }]}
      rightContent={renderRightContent()}
      isPageLoaded={!loading}>
      <MaxWidthContainer>
        <Box mt={16} pb={20}>
          <FilterControl
            renderCustomFilters={
              <Grid item xs={12} sm={4} style={{ textAlign: 'right' }}>
                {userDetails?.selectedRole === UserRoles.GLOBAL_ADMIN ? (
                  <LoadingButton
                    color="primary"
                    isLoading={false}
                    onClick={() =>
                      history.push(
                        `${PrivatePaths.LIBRARY}/create-content?categoryId=${fieldOfInterest?.id}`,
                      )
                    }>
                    Add New Content
                  </LoadingButton>
                ) : null}
              </Grid>
            }
            searchInputProps={{
              colSpan: {
                xs: 12,
                sm: 8,
              },
              onChange: (evt) =>
                handleChangeQueryParams({ search: evt.target.value, offset: DEFAULT_PAGE_OFFSET }),
            }}
          />
          <LoadingView isLoading={loading}>
            {data.results.length > 0 ? renderContents() : renderEmpty()}
          </LoadingView>
        </Box>
      </MaxWidthContainer>
      <UpsertCategoryDrawer
        open={isCategoryDrawerVisible}
        onClose={() => setIsCategoryDrawerVisible(false)}
        categoryId={fieldOfInterest?.id}
      />
    </BlueHeaderPageLayout>
  );
};

export default memo(CategoryDetails);
