import { memo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Box, Drawer, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Cancel from '@material-ui/icons/Cancel';
import LoadingView from 'reusables/LoadingView';
import Empty from 'reusables/Empty';
import LecturerRatingItem from 'reusables/LecturerRatingItem';
import LoadingButton from 'reusables/LoadingButton';
import { fontWeight } from '../../../Css';
import { PrivatePaths } from 'routes';
import { GET_LECTURERS_RATING } from 'graphql/queries/users';
import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET } from 'utils/constants';
import { lecturerRating } from 'utils/SchoolAdminDashboardUtils';
import { getCursor } from 'utils/paginationUtils';
import useNotification from 'reusables/NotificationBanner/useNotification';

const LecturersPerformanceDrawer = ({ open, onClose, facultyIds }) => {
  const classes = useStyles();
  const history = useHistory();
  const notification = useNotification();
  const [queryParams, setQueryParams] = useState({
    offset: DEFAULT_PAGE_OFFSET,
    limit: DEFAULT_PAGE_LIMIT,
  });

  const { data: ratings, loading } = useQuery(GET_LECTURERS_RATING, {
    skip: facultyIds.length === 0,
    variables: {
      facultyIds: facultyIds,
      ...queryParams,
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });
  const data = lecturerRating(ratings)?.ratingProps;
  const total = ratings?.lecturerRatings?.totalCount;
  const hasMoreResults = !!getCursor(total, queryParams.limit);

  const handleLoadMore = () => {
    let cursor = getCursor(total, queryParams.limit);
    if (cursor) setQueryParams({ offset: 0, limit: cursor });
  };

  const renderEmptyState = () => {
    return <Empty title="No Ratings" description="No Ratings Avalaible." />;
  };
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <LoadingView isLoading={loading}>
        <Box
          component={Paper}
          elevation={0}
          square
          px={12}
          py={8}
          minWidth={378}
          display="flex"
          justifyContent="space-between">
          <Typography variant="h6" color="textPrimary" style={{ fontWeight: fontWeight.bold }}>
            Lecturers performance
          </Typography>
          <Cancel onClick={onClose} style={{ cursor: 'pointer' }} />
        </Box>
        <Box bgcolor="#F6F7F7" height={'auto'} px={8} pt={12}>
          {data?.length > 0 ? (
            <>
              {data?.map((rating) => {
                return (
                  <Box
                    mb={8}
                    onClick={() => history.push(`${PrivatePaths.USERS}/instructors/${rating?.id}`)}>
                    <LecturerRatingItem
                      name={rating?.name}
                      titleProps={{
                        variant: 'subtitle2',
                      }}
                      avatarProps={{
                        size: 'md',
                      }}
                      ratingProps={{
                        useNumberedLabel: true,
                        readOnly: true,
                        value: rating?.value,
                        size: 'small',
                      }}
                    />
                  </Box>
                );
              })}
              {hasMoreResults && (
                <LoadingButton
                  color="black"
                  disableElevation
                  isLoading={loading}
                  onClick={handleLoadMore}
                  className={classes.loadMoreButton}>
                  Load more
                </LoadingButton>
              )}
            </>
          ) : (
            renderEmptyState()
          )}
        </Box>
      </LoadingView>
    </Drawer>
  );
};

const useStyles = makeStyles({
  loadMoreButton: {
    width: '100%',
    backgroundColor: '#FAFAFA',
  },
});

export default memo(LecturersPerformanceDrawer);
