import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import {
  Badge,
  Box,
  Divider,
  Typography,
  Button,
  Paper,
  TextField,
  MenuItem,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Close } from '@material-ui/icons';
import { useQuery } from '@apollo/client';
import { fontSizes, fontWeight, colors, spaces } from '../Css';
import { format, formatDistanceToNowStrict } from 'date-fns';
import { useParams } from 'react-router-dom';
import { ReactComponent as NotificationIcon } from 'assets/svgs/not-bell.svg';
import LoadingView from 'reusables/LoadingView';
import { useNotification } from 'reusables/NotificationBanner';
import LoadingButton from 'reusables/LoadingButton';
import { DELETE_NOTIFICATIONS, MARK_NOTIFICATIONS } from 'graphql/mutations/notification';
import { routeNotificationToPath } from 'utils/NotificationUtils';
import NavigationBar from 'reusables/NavigationBar';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import { GET_NOTIFICATIONS } from 'graphql/queries/notification';
import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET } from 'utils/constants';
import MaxWidthContainer from 'reusables/MaxWidthContainer';

const Notification = () => {
  const { userDetails } = useAuthenticatedUser();

  const history = useHistory();
  const notification = useNotification();
  const [filterBy, setFilterBy] = useState('All');
  const defaultQueryParams = {
    offset: DEFAULT_PAGE_OFFSET,
    limit: DEFAULT_PAGE_LIMIT,
  };
  const [queryParams, setQueryParams] = useState(defaultQueryParams);

  const { data, loading, refetch } = useQuery(GET_NOTIFICATIONS, {
    skip: !userDetails,
    variables: {
      offset: queryParams.offset,
      limit: queryParams.limit,
      isRead: filterBy === 'All' ? null : filterBy,
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const notifications = data?.notifications?.results || [];
  const notificationsLength = notifications.length;
  const total = data?.notifications?.totalCount;

  const [deleteNotifications, { loading: isDeleteNotificationsLoading }] = useMutation(
    DELETE_NOTIFICATIONS,
    {
      onCompleted: () => {
        notification.success({
          message: 'Deleted Notifcation Successfully',
        });
        refetch();
      },
      onError: (error) => {
        notification.error({
          message: error?.message,
        });
      },
    },
  );

  const [markNotifications, { loading: isMarkNotificationsLoading }] =
    useMutation(MARK_NOTIFICATIONS);

  const handleClick = (type, data, id) => {
    markNotifications({
      variables: {
        notificationIds: [id],
      },
    });

    let url = routeNotificationToPath(type, data);
    !!url && history.push(url);
  };

  const handleDelete = (id) => {
    deleteNotifications({
      variables: {
        notificationIds: [id],
      },
    });
  };

  const getCursor = (totalCount, limit) => {
    if (totalCount < DEFAULT_PAGE_LIMIT || limit >= totalCount) {
      return null;
    }
    return limit + DEFAULT_PAGE_LIMIT;
  };

  // The ideal situation would be to use the fetchMore method on the UseQuery hook but the refresh issue(refer to the Refresh Issue section of the README.md file for more details ) seems to occur with that.
  const handleLoadMore = () => {
    let cursor = getCursor(total, queryParams.limit);
    if (cursor) setQueryParams({ offset: 0, limit: cursor });
  };

  const formatDuration = (duration) => {
    const milliSecondsInAWeek = 604800000;
    const currentDate = new Date().getTime();
    const postDate = new Date(duration).getTime();
    const durationDifference = currentDate - postDate;

    if (milliSecondsInAWeek >= durationDifference) {
      return formatDistanceToNowStrict(new Date(duration), {
        addSuffix: true,
        includeSeconds: true,
      });
    } else {
      return format(new Date(duration), 'LLL dd, yyyy');
    }
  };

  const classes = useStyles({ notificationsLength });
  const hasMoreResults = !!getCursor(total, queryParams.limit);
  return (
    <Box bgcolor={colors.background} mt={12} pb={12} minHeight="100vh">
      <NavigationBar />
      <MaxWidthContainer>
        <Box pt={8}>
          <Button onClick={() => history.goBack()}>
            <Close /> Exit
          </Button>
        </Box>
        <Box my={8} component={Paper} square elevation={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center" px={12} py={8}>
            <Box>
              <Typography className={classes.notification} color="textPrimary">
                Notifications
              </Typography>
              <Typography color="textSecondary" variant="body2">
                Sample text for notifications sub heading will be here.
              </Typography>
            </Box>
            <TextField
              select
              style={{ width: 200 }}
              value={filterBy}
              variant="outlined"
              label="Filter By"
              onChange={(e) => setFilterBy(e.target.value)}
            >
              <MenuItem value={'All'}>All</MenuItem>
              <MenuItem value={true}>Read</MenuItem>
              <MenuItem value={false}>Unread</MenuItem>
            </TextField>
          </Box>
          <Divider style={{ width: '96%', margin: 'auto' }} />
          <Box px={12} py={12} className="scrollable-container">
            <LoadingView
              isLoading={loading || isDeleteNotificationsLoading || isMarkNotificationsLoading}
            >
              {notifications?.length > 0 ? (
                <>
                  {notifications?.map((item, i) => {
                    const { data, notification } = JSON.parse(item?.notification?.data);
                    return (
                      <Box key={item?.id} pb={5}>
                        <Box
                          display="flex"
                          alignItems="center"
                          mb={12}
                          justifyContent="space-between"
                        >
                          <Box display="flex" alignItems="center">
                            <NotificationIcon />
                            <Box ml={12}>
                              <Typography
                                color="textPrimary"
                                className={classes.action}
                                onClick={() => handleClick(item?.notification.type, data, item?.id)}
                              >
                                <span className="name">{notification?.body}</span>
                              </Typography>{' '}
                              <Typography className={classes.duration}>
                                {formatDuration(item?.createdAt)}
                              </Typography>
                            </Box>
                          </Box>
                          <Box textAlign="right">
                            <Box display="flex" alignItems="center">
                              <Badge
                                variant="dot"
                                color="primary"
                                style={{ marginRight: spaces.medium }}
                                invisible={item?.isRead}
                                anchorOrigin={{
                                  vertical: 'top',
                                  horizontal: 'right',
                                }}
                              />
                              <Close
                                fontSize="small"
                                color="#6B6C7E"
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleDelete(item?.id)}
                              />
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}
                </>
              ) : (
                <Typography>No Notifications</Typography>
              )}
            </LoadingView>
          </Box>
        </Box>
        {notifications?.length > 0 && hasMoreResults && (
          <LoadingButton
            style={{ background: colors.white, color: colors.text }}
            variant="contained"
            disableElevation
            isLoading={loading}
            onClick={handleLoadMore}
            className={classes.loadMoreButton}
          >
            See Older Messages
          </LoadingButton>
        )}
      </MaxWidthContainer>
    </Box>
  );
};

const useStyles = makeStyles({
  notification: {
    fontWeight: fontWeight.extraBold,
    fontSize: fontSizes.largeTitle,
  },
  action: {
    fontSize: fontSizes.medium,
    paddingRight: 5,
    cursor: 'pointer',
  },
  duration: {
    color: colors.primary,
    fontSize: fontSizes.small,
    fontFamily: 'Raleway, sans-serif',
  },
  loadMoreButton: {
    width: '100%',
    backgroundColor: '#FAFAFA',
  },
});
export default Notification;
