import { useState } from 'react';
import { memo, useRef } from 'react';
import { NetworkStatus, useMutation } from '@apollo/client';
import { Box, Typography, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useHistory } from 'react-router';

import WorkBenchAndSumaryCard from './WorkBenchAndSumaryCard';
import { DELETE_NOTIFICATION } from 'graphql/mutations/dashboard';
import { MARK_NOTIFICATIONS } from 'graphql/mutations/notification';
import { useNotification } from 'reusables/NotificationBanner';
import LoadingView from 'reusables/LoadingView';
import Empty from 'reusables/Empty';
import { fontWeight } from '../../../Css';
import { useQuery } from '@apollo/client';
import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET } from 'utils/constants';
import { GET_NOTIFICATIONS } from 'graphql/queries/notification';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import LoadingButton from 'reusables/LoadingButton';
import { routeNotificationToPath } from 'utils/NotificationUtils';

const WorkbenchList = () => {
  const classes = useStyles();
  const notification = useNotification();
  const contentContainerRef = useRef();
  const { userDetails } = useAuthenticatedUser();
  const history = useHistory();

  const [notificationQueryParams, setNotificationQueryParams] = useState({
    offset: DEFAULT_PAGE_OFFSET,
    limit: DEFAULT_PAGE_LIMIT,
  });

  const {
    data: notificationsData,
    loading: isLoadingNotifications,
    networkStatus,
    refetch,
  } = useQuery(GET_NOTIFICATIONS, {
    skip: !userDetails,
    variables: { workbench: true, ...notificationQueryParams },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const [deleteNotifications, { loading: isDeletingNotification }] = useMutation(
    DELETE_NOTIFICATION,
    {
      onCompleted: ({ deleteNotifications: { ok } }) => {
        if (ok) {
          refetch();
          notification.success({
            message: 'Notification deleted successfully',
          });
        } else {
          notification.error({
            message: 'An error occurred, please try again later',
          });
        }
      },
      onError: (error) => {
        notification.error({
          message: error?.message,
        });
      },
    },
  );
  const { totalCount = 0, results: notifications = [] } = notificationsData?.notifications || {};

  const handleDeleteNotification = (id) => {
    refetch();
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

  const hasMoreNotifications = !!getCursor(totalCount, notificationQueryParams.limit);

  const handleLoadMore = () => {
    let cursor = getCursor(totalCount, notificationQueryParams.limit);
    if (cursor) setNotificationQueryParams({ offset: 0, limit: cursor });
  };

  const [markNotifications, { loading: _isMarkNotificationsLoading }] =
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

  const notificationItems =
    notifications?.map(({ notification: item, id, createdAt }) => {
      return {
        date: createdAt || '',
        id: id || '',
        body: JSON.parse(item?.data) || [],
      };
    }) || {};

  return (
    <Box p={12} ml={8} component={Paper} elevation={0}>
      <div ref={contentContainerRef}>
        <Typography
          color="textPrimary"
          variant="body1"
          style={{ fontWeight: fontWeight.bold, paddingBottom: 24 }}
        >
          Workbench
        </Typography>
        <Box>
          <LoadingView
            isLoading={isLoadingNotifications && networkStatus !== NetworkStatus.fetchMore}
          >
            {totalCount === 0 ? (
              <Empty title="No workbench" description="No workbench data found" />
            ) : (
              <Box className={classes.wrapper}>
                {notificationItems?.map(({ id, date, body: { notification, data } }, index) => (
                  <Box className={classes.workBenchItem}>
                    <WorkBenchAndSumaryCard
                      key={index}
                      body={notification?.body}
                      date={date}
                      onClick={() => handleClick(data.object_type, data, id)}
                      disabled={isDeletingNotification}
                      onDelete={() => handleDeleteNotification(id)}
                    />
                  </Box>
                ))}
                {hasMoreNotifications && (
                  <LoadingButton
                    color="black"
                    disableElevation
                    isLoading={isLoadingNotifications}
                    onClick={handleLoadMore}
                    className={classes.loadMoreButton}
                  >
                    Load more
                  </LoadingButton>
                )}
              </Box>
            )}
          </LoadingView>
        </Box>
      </div>
    </Box>
  );
};

const useStyles = makeStyles(() => ({
  wrapper: {
    '& > :last-child': {
      margin: 0,
    },
  },
  workBenchItem: {
    marginBottom: 20,
  },
  loadMoreButton: {
    width: '100%',
    backgroundColor: '#FAFAFA',
  },
}));

export default memo(WorkbenchList);
