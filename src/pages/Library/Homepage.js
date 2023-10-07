import { memo, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  MenuItem,
  makeStyles,
  Button,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { useLocation, useHistory } from 'react-router-dom';
import SettingsIcon from '@material-ui/icons/Settings';

import MaxWidthContainer from 'reusables/MaxWidthContainer';
import CategoryContentsList from 'components/Library/Homepage/CategoryContentsList';
import FilterControl from 'reusables/FilterControl';
import Empty from 'reusables/Empty';
import { colors } from '../../Css';
import { useQueryPagination } from 'hooks/useQueryPagination';
import { GET_FIELD_OF_INTERESTS_SEARCH, GET_SAVED_CONTENTS } from 'graphql/queries/library';
import { useNotification } from 'reusables/NotificationBanner';
import { DEFAULT_PAGE_OFFSET, DEFAULT_PAGE_LIMIT, UserRoles } from 'utils/constants';
import LoadingView from 'reusables/LoadingView';
import { OffsetLimitBasedPagination } from 'reusables/Pagination';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import AccessControl from 'reusables/AccessControl';
import { PrivatePaths } from 'routes';

const Homepage = () => {
  const { pathname } = useLocation();
  const history = useHistory();
  const classes = useStyles();
  const notification = useNotification();
  const { userDetails } = useAuthenticatedUser();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isGlobalAdmin = userDetails?.selectedRole === UserRoles.GLOBAL_ADMIN;
  const [interestsQueryParams, setInterestsQueryParams] = useState({
    offset: DEFAULT_PAGE_OFFSET,
    limit: DEFAULT_PAGE_LIMIT,
    searchByContent: '',
    interestId: null,
  });

  const { loading: isLoadingSavedContents, data: savedContentsData } = useQueryPagination(
    GET_SAVED_CONTENTS,
    {
      // fetchPolicy: 'cache-and-network',
      variables: {
        offset: 0,
        limit: 4,
      },
      onError: (error) => {
        notification.error({
          message: error?.message,
        });
      },
    },
  );
  const savedContents = savedContentsData?.savedContents?.results || [];

  const { loading: isLoadingFieldOfInterests, data: fieldOfInterestsData } = useQueryPagination(
    GET_FIELD_OF_INTERESTS_SEARCH,
    {
      // fetchPolicy: 'cache-and-network',
      variables: {
        ...interestsQueryParams,
        interestId:
          interestsQueryParams.interestId === 'all' ? null : interestsQueryParams.interestId,
      },
      onError: (error) => {
        notification.error({
          message: error?.message,
        });
      },
    },
  );
  const fieldOfInterests = fieldOfInterestsData?.fieldOfInterests?.results || [];

  const getLibraryContents = (contents, id) => {
    return contents?.map((content) => ({
      id: content.id,
      thumbnail: content.thumbnail,
      title: content.name,
      description: content.description,
      type: content.contentFormat,
      categoryId: id,
    }));
  };

  const getSavedContents = (contents) => {
    return contents?.reduce((acc, value) => {
      if (value.content) {
        acc.push({
          id: value.content.id,
          thumbnail: value.content.thumbnail,
          title: value.content.name,
          description: value.content.description,
          type: value.content.contentFormat,
          categoryId: value.content?.fieldOfInterests?.map(({ id }) => id)?.[0],
        });
      }
      return acc;
    }, []);
  };

  const handleChangeInterestsQueryParams = (changeset) => {
    setInterestsQueryParams((prevState) => ({
      ...prevState,
      ...changeset,
    }));
  };

  const handleNavigateToContentDetails = ({ categoryId, contentId }) => {
    history.push(`${pathname}/categories/${categoryId}/contents/${contentId}`);
  };

  const renderEmpty = () => {
    return <Empty title="No Categories" description="No categories found" />;
  };

  const renderSavedContents = () => {
    return (
      <LoadingView isLoading={isLoadingSavedContents}>
        <Box component={Paper} width="100%">
          <MaxWidthContainer>
            <Box mt={12}>
              <Typography color="textPrimary" variant="body1">
                Library
              </Typography>
              <Box py={16}>
                <CategoryContentsList
                  title="Saved contents"
                  showMorePath={`${pathname}/saved`}
                  libraryInterests={getSavedContents(savedContents)}
                  categoryId={null}
                  onClickContent={handleNavigateToContentDetails}
                />
              </Box>
            </Box>
          </MaxWidthContainer>
        </Box>
      </LoadingView>
    );
  };

  const renderCategories = () => {
    return (
      <LoadingView isLoading={isLoadingFieldOfInterests}>
        {fieldOfInterests.length > 0 ? (
          <>
            {fieldOfInterests.map((fieldOfInterest) => (
              <Box mt={20} key={fieldOfInterest.id}>
                <CategoryContentsList
                  title={fieldOfInterest.name}
                  showMorePath={`${pathname}/categories/${fieldOfInterest.id}`}
                  onClickContent={handleNavigateToContentDetails}
                  libraryInterests={getLibraryContents(
                    fieldOfInterest.libraryInterests,
                    fieldOfInterest.id,
                  )}
                  emptyNode="No contents found under this category"
                />
              </Box>
            ))}
            <Box mt={10}>
              <OffsetLimitBasedPagination
                total={fieldOfInterestsData?.fieldOfInterests?.totalCount}
                onChangeLimit={(_offset, limit) =>
                  handleChangeInterestsQueryParams({
                    offset: DEFAULT_PAGE_OFFSET,
                    limit,
                  })
                }
                onChangeOffset={(offset) => handleChangeInterestsQueryParams({ offset })}
                offset={interestsQueryParams.offset}
                limit={interestsQueryParams.limit}
              />
            </Box>
          </>
        ) : (
          renderEmpty()
        )}
      </LoadingView>
    );
  };

  const renderCustomFilters = () => {
    return (
      <Grid item md={isGlobalAdmin ? 6 : 3} xs={12}>
        <Box display="flex" justifyContent="space-between">
          <Box width={isGlobalAdmin ? '40%' : '100%'}>
            <TextField
              select
              label="Categories"
              variant="outlined"
              fullWidth
              onChange={(evt) => handleChangeInterestsQueryParams({ interestId: evt.target.value })}
              className={classes.categoryFilter}>
              <MenuItem value="all">All</MenuItem>
              {fieldOfInterests.map((fieldOfInterest) => (
                <MenuItem key={fieldOfInterest.id} value={fieldOfInterest.id}>
                  {fieldOfInterest.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <AccessControl allowedRoles={UserRoles.GLOBAL_ADMIN}>
            <Box display="flex" ml={isSmallScreen ? 8 : 0}>
              <Button
                variant="contained"
                color="primary"
                disableElevation
                style={{ minWidth: 'max-content' }}
                onClick={() => history.push(`${PrivatePaths.LIBRARY}/create-content`)}>
                Add New Item
              </Button>
              <Box ml={8}>
                <Button
                  variant="contained"
                  disableElevation
                  className={classes.cogButton}
                  onClick={() => history.push(`${PrivatePaths.LIBRARY}/categories`)}>
                  <SettingsIcon />
                </Button>
              </Box>
            </Box>
          </AccessControl>
        </Box>
      </Grid>
    );
  };

  const renderContent = () => {
    return (
      <Box mt={20} pb={36}>
        <MaxWidthContainer>
          <FilterControl
            searchInputProps={{
              colSpan: {
                xs: 12,
                sm: 12,
                md: isGlobalAdmin ? 6 : 9,
              },
              onChange: (evt) =>
                handleChangeInterestsQueryParams({ searchByContent: evt.target.value }),
            }}
            renderCustomFilters={renderCustomFilters()}
          />
          {renderCategories()}
        </MaxWidthContainer>
      </Box>
    );
  };

  return (
    <Box minHeight="100vh" style={{ background: colors.background }}>
      {renderSavedContents()}
      {renderContent()}
    </Box>
  );
};

const useStyles = makeStyles({
  categoryFilter: {
    '& .MuiOutlinedInput-root': {
      background: colors.white,
    },
  },
  cogButton: {
    color: colors.grey,
    border: `1px solid ${colors.secondaryLightGrey}`,
  },
});

export default memo(Homepage);
