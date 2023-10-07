import { memo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  TextField,
  makeStyles,
  Box,
  Paper,
  Typography,
  Avatar,
  Button,
} from '@material-ui/core';

import { getNameInitials } from 'utils/UserUtils';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import { colors, fontWeight } from '../../../Css';
import Announcement from './Announcement';
import AccessControl from 'reusables/AccessControl';
import { UserRoles } from 'utils/constants';
import CreateAnnouncementModal from '../CreateAnnouncementModal';
import LoadingView from 'reusables/LoadingView';
import { useNotification } from 'reusables/NotificationBanner';
import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET } from 'utils/constants';
import { useQueryPagination } from 'hooks/useQueryPagination';
import { GET_ANNOUNCEMENTS } from 'graphql/queries/announcement';
import { OffsetLimitBasedPagination } from 'reusables/Pagination';
import Empty from 'reusables/Empty';

const AnnouncementsTab = ({ currentLectureId, courseId, classRepId }) => {
  const classes = useStyles();
  const { userDetails } = useAuthenticatedUser();
  const [isCreateAnnouncementModalVisible, setIsCreateAnnouncementModalVisible] = useState(false);
  const notification = useNotification();
  const defaultQueryParams = {
    search: '',
    offset: DEFAULT_PAGE_OFFSET,
    limit: DEFAULT_PAGE_LIMIT,
    datePublished: null,
    typeIds: [courseId],
    showComments: true,
  };
  const [queryParams, setQueryParams] = useState(defaultQueryParams);
  const isClassRep = userDetails?.id === classRepId;

  const { data, loading, refetch } = useQueryPagination(GET_ANNOUNCEMENTS, {
    variables: queryParams,
    // fetchPolicy: 'cache-and-network',
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });
  const { totalCount, results } = data?.announcements || {};

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
    return (
      <Empty
        title={'No Announcements'}
        description={'No Announcements has been published for this course.'}
      />
    );
  };

  const renderFilters = () => {
    return (
      <Box mb={12}>
        <Grid container spacing={8}>
          <Grid item xs={4}>
            <TextField
              defaultValue=""
              placeholder="Filter by date"
              type="date"
              fullWidth
              variant="outlined"
              className={classes.filterInput}
              onChange={(evt) =>
                handleChangeQueryParams({
                  datePublished: evt.target.value,
                  offset: DEFAULT_PAGE_OFFSET,
                })
              }
            />
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderWriteAnnouncementBox = () => {
    return (
      <AccessControl allowedRoles={[UserRoles.LECTURER, UserRoles.STUDENT]}>
        {userDetails?.selectedRole === UserRoles.STUDENT && !isClassRep ? null : (
          <Box className={classes.writeCommentBox}>
            <Paper elevation={0}>
              <Box p={8}>
                <Typography variant="body1" color="textPrimary" className="title">
                  Write your announcement here
                </Typography>
                <Box display="flex" mt={8} width="100%">
                  <Avatar src={userDetails?.image}>
                    {getNameInitials(userDetails?.firstname, userDetails?.lastname)}
                  </Avatar>
                  <Box ml={5} width="100%">
                    <Button
                      variant="outlined"
                      className="CTAButton"
                      onClick={() => setIsCreateAnnouncementModalVisible(true)}>
                      Title or summary
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Box>
        )}
      </AccessControl>
    );
  };

  const renderAnnouncements = () => {
    return (
      <>
        {results?.map((announcement, i) => (
          <Box key={announcement.id} mt={i === 0 ? 12 : 20}>
            <Announcement
              id={announcement.id}
              creator={{
                firstname: announcement.createdBy.firstname,
                lastname: announcement.createdBy.lastname,
                image: announcement.createdBy.image,
              }}
              createdAt={announcement.createdAt}
              body={announcement.body}
              title={announcement.title}
              comments={announcement.comments}
              refetchAnnouncement={refetchQueries}
            />
          </Box>
        ))}
        <Box mt={4}>
          <OffsetLimitBasedPagination
            total={totalCount}
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
        </Box>
      </>
    );
  };

  return (
    <div>
      <LoadingView isLoading={loading}>
        {renderFilters()}
        {renderWriteAnnouncementBox()}
        {Boolean(totalCount) ? renderAnnouncements() : renderEmptyState()}
      </LoadingView>
      <CreateAnnouncementModal
        visible={isCreateAnnouncementModalVisible}
        onClose={() => setIsCreateAnnouncementModalVisible(false)}
        courseId={courseId}
        onCompletedCallback={refetchQueries}
      />
    </div>
  );
};

const useStyles = makeStyles({
  filterInput: {
    '& .MuiOutlinedInput-root': {
      background: '#F1F2F6',
    },
  },
  writeCommentBox: {
    '& .title': {
      fontWeight: fontWeight.bold,
    },
    '& .CTAButton': {
      background: '#F1F2F6',
      width: '100%',
      '& .MuiButton-label': {
        justifyContent: 'initial',
        color: colors.secondaryTextLight,
      },
    },
  },
});

AnnouncementsTab.propTypes = {
  currentLectureId: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
  classRepId: PropTypes.string,
};

export default memo(AnnouncementsTab);
