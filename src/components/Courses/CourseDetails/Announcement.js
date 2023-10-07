import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Grid, Typography, TextField, Paper, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import AddIcon from '@material-ui/icons/Add';
import { useNotification } from 'reusables/NotificationBanner';
import LoadingView from 'reusables/LoadingView';
import Empty from 'reusables/Empty';
import { OffsetLimitBasedPagination } from 'reusables/Pagination';
import FilterControl from 'reusables/FilterControl';
import AnnouncementCard from 'reusables/AnnouncementCard';
import AccessControl from 'reusables/AccessControl';
import { GET_ANNOUNCEMENTS } from 'graphql/queries/announcement';
import { useQueryPagination } from 'hooks/useQueryPagination';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import { UserRoles } from 'utils/constants';
import { formatUserNameWithMiddleName } from 'utils/UserUtils';
import { DEFAULT_PAGE_OFFSET, DEFAULT_PAGE_LIMIT } from 'utils/constants';
import CreateAnnouncementModal from '../CreateAnnouncementModal';
import { colors, fontSizes, fontWeight } from '../../../Css';

const Announcement = ({ course }) => {
  const classes = useStyles();
  const { courseId } = useParams();
  const [isVisible, setIsVisible] = useState(false);
  const notification = useNotification();
  const { userDetails } = useAuthenticatedUser();
  const isClassRep = userDetails?.id === course?.classRep?.id;

  const defaultQueryParams = {
    typeIds: [courseId],
    search: '',
    offset: DEFAULT_PAGE_OFFSET,
    limit: DEFAULT_PAGE_LIMIT,
    ordering: null,
    datePublished: undefined,
  };
  const [queryParams, setQueryParams] = useState(defaultQueryParams);

  const { data, loading, refetch } = useQueryPagination(GET_ANNOUNCEMENTS, {
    variables: {
      ...queryParams,
      datePublished: queryParams.datePublished ? queryParams.datePublished : undefined,
    },
    // fetchPolicy: 'cache-and-network',
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const announcements = data?.announcements?.results;

  const refetchQueries = () => {
    handleChangeQueryParams(defaultQueryParams);
    if (queryParams.offset === DEFAULT_PAGE_OFFSET) refetch();
  };

  const handleChangeQueryParams = (changeset) => {
    setQueryParams((prevState) => ({
      ...prevState,
      ...changeset,
    }));
  };

  const renderEmptyState = () => {
    return <Empty title={'No Announcements'} description={'No announcements found'}></Empty>;
  };

  const renderAnnouncementCount = () => {
    return (
      <Box className={classes.container} display="flex" justifyContent="space-between">
        <Box>
          <Typography component="h4" className="title">
            Announcement
          </Typography>
          <Typography className="caption">
            {data?.announcements.totalCount || 0} in total{' '}
          </Typography>
        </Box>
        <AccessControl allowedRoles={[UserRoles.LECTURER]}>
          <Box>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              style={{ background: '#fff' }}
              onClick={() => setIsVisible(true)}>
              Add Announcement
            </Button>
          </Box>
        </AccessControl>
        <AccessControl allowedRoles={[UserRoles.STUDENT]}>
          {isClassRep && (
            <Box>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                style={{ background: '#fff' }}
                onClick={() => setIsVisible(true)}>
                Add Announcement
              </Button>
            </Box>
          )}
        </AccessControl>
      </Box>
    );
  };

  const renderSearchBox = () => {
    return (
      <Box component={Paper} mb={12} px={10} py={10}>
        <FilterControl
          searchInputProps={{
            name: 'search',
            colSpan: {
              xs: 12,
              sm: 9,
            },
            onChange: (evt) => handleChangeQueryParams({ search: evt.target.value }),
          }}
          renderCustomFilters={
            <>
              <Grid item xs={12} sm={3}>
                <TextField
                  id="date"
                  label="Post date"
                  variant="outlined"
                  type="date"
                  fullWidth
                  defaultValue="Post date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(evt) => handleChangeQueryParams({ datePublished: evt.target.value })}
                />
              </Grid>
            </>
          }
        />
      </Box>
    );
  };

  const renderQuestionSection = () => {
    return (
      <Box>
        {announcements?.map((announcement, index) => {
          return (
            <Box my={12}>
              <AnnouncementCard
                key={index}
                announcement={{
                  posterAvatar: announcement?.createdBy?.image,
                  poster: formatUserNameWithMiddleName(
                    announcement?.createdBy?.firstname,
                    announcement?.createdBy?.middlename,
                    announcement?.createdBy?.lastname,
                  ),
                  datePosted: announcement?.createdAt,
                  title: announcement?.title,
                  descriptionHtml: announcement?.body,
                }}
              />
            </Box>
          );
        })}
      </Box>
    );
  };

  return (
    <Box container spacing={10}>
      {renderAnnouncementCount()}
      {renderSearchBox()}
      <LoadingView isLoading={loading}>
        {Boolean(announcements?.length) ? (
          <>
            {renderQuestionSection()}
            <Box mt={12} pb={40}>
              <OffsetLimitBasedPagination
                total={data?.announcements?.totalCount}
                offset={queryParams.offset}
                limit={queryParams.limit}
                onChangeLimit={(_offset, limit) =>
                  handleChangeQueryParams({ limit, offset: DEFAULT_PAGE_OFFSET })
                }
                onChangeOffset={(offset) => handleChangeQueryParams({ offset })}
              />
            </Box>
          </>
        ) : (
          renderEmptyState()
        )}
        <CreateAnnouncementModal
          visible={isVisible}
          onClose={() => setIsVisible(false)}
          courseId={courseId}
          onCompletedCallback={refetchQueries}
        />
      </LoadingView>
    </Box>
  );
};

const useStyles = makeStyles(() => ({
  container: {
    color: '#393A4A',
    '& .title': {
      color: colors.dark,
      fontWeight: fontWeight.bold,
      fontSize: fontSizes.xxlarge,
    },
    '& .caption': {
      color: colors.grey,
      fontWeight: fontWeight.medium,
      fontSize: fontSizes.large,
      marginBottom: 34,
    },
  },
}));

export default Announcement;
