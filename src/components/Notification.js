import React, { useMemo } from 'react';
import { useMutation } from '@apollo/client';
import { useHistory, Link } from 'react-router-dom';
import { Badge, Box, Divider, Popover, Typography, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Close } from '@material-ui/icons';

import { boxShadows, fontSizes, fontWeight, colors } from '../Css';
import { format, formatDistanceToNowStrict } from 'date-fns';
import LoadingView from 'reusables/LoadingView';
import { useNotification } from 'reusables/NotificationBanner';
import LoadingButton from 'reusables/LoadingButton';
import { DELETE_NOTIFICATIONS, MARK_NOTIFICATIONS } from 'graphql/mutations/notification';
import { routeNotificationToPath } from 'utils/NotificationUtils';
import { PrivatePaths } from 'routes';
import { downloadCSV } from 'download-csv';

const Notification = ({
  onClosePanel,
  user,
  isVisible,
  notifications,
  refetch,
  loading,
  handleLoadMore,
  hasMoreResults,
}) => {
  const notificationsLength = notifications.length;
  const classes = useStyles({ notificationsLength });
  const history = useHistory();
  const notification = useNotification();

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

  // const notifyPop =  useMemo(
  //   (note) => {
  //     setTimeout(() => {
  //       notification.success({
  //         message: note?.body,
  //       });
  //     });
  //   },
  //   [note?.body],
  // );

  const notifyPop = (note) => {
    setTimeout(() => {
      notification.success({
        message: note?.body,
      });
    });
  };

  // React.useEffect(notifyPop, []);

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

  const handleDownloadClick = (fileName, title) => {
    const link = document.createElement('a');
    link.href = fileName;
    link.download = title;

    // Trigger a click event on the anchor element
    link.click();
  };

  return (
    <Popover
      id="simple-Popover"
      anchorEl={isVisible}
      placement="left-start"
      open={Boolean(isVisible)}
      onClose={onClosePanel}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'center',
        horizontal: 'right',
      }}
      classes={{
        paper: classes.Popover,
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" px={12} py={12}>
        <Typography className={classes.notification} color="textPrimary">
          Notification
        </Typography>
        <Link className={classes.email} to={PrivatePaths.NOTIFICATION}>
          view more
        </Link>
      </Box>
      <Divider />
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
                    <Box>
                      <Grid container>
                        <Grid item xs={10}>
                          {data?.type_text === 'Grade Download' ||
                          data?.type_text === 'Score Download' ? (
                            <Typography>
                              <Typography>
                                <span style={{ fontWeight: 900, color: '#272833' }}>
                                  {data?.type_text === 'Grade Download'
                                    ? data?.assessment_title
                                    : data?.type_text === 'Score Download' &&
                                      data?.assignment_title}
                                </span>{' '}
                                result is ready for download. Click{' '}
                                <span
                                  style={{ fontWeight: 900, color: '#0050C8', cursor: 'pointer' }}
                                  onClick={() =>
                                    data?.type_text === 'Grade Download'
                                      ? handleDownloadClick(data?.file_url, data?.assessment_title)
                                      : data?.type_text === 'Score Download' &&
                                        handleDownloadClick(data?.file_url, data?.assignment_title)
                                  }
                                >
                                  here
                                </span>{' '}
                                to download.
                              </Typography>
                            </Typography>
                          ) : (
                            <Typography
                              color="textPrimary"
                              className={classes.action}
                              onClick={() => handleClick(item?.notification.type, data, item?.id)}
                            >
                              <span className="name">{notification?.body}</span>
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={1}>
                          <Badge
                            variant="dot"
                            color="primary"
                            classes={{ root: classes.badge }}
                            invisible={item?.isRead}
                            anchorOrigin={{
                              vertical: 'top',
                              horizontal: 'right',
                            }}
                          />
                        </Grid>
                        <Grid item xs={1}>
                          <Close
                            fontSize="small"
                            color="#6B6C7E"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleDelete(item?.id)}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                    <Typography className={classes.duration}>
                      {formatDuration(item?.createdAt)}
                    </Typography>
                  </Box>
                );
              })}
              {hasMoreResults && (
                <LoadingButton
                  color="black"
                  disableElevation
                  isLoading={loading}
                  onClick={handleLoadMore}
                  className={classes.loadMoreButton}
                >
                  Load more
                </LoadingButton>
              )}
            </>
          ) : (
            <Typography>No Notifications</Typography>
          )}
        </LoadingView>
      </Box>
    </Popover>
  );
};

const useStyles = makeStyles({
  Popover: {
    boxShadow: boxShadows.primary,
    borderRadius: '4px',
    maxWidth: 325,
    minWidth: 325,
    marginLeft: 20,
    marginTop: 55,
    '& .scrollable-container': {
      overflowY: (props) => (props.notificationsLength > 0 ? 'scroll' : 'hidden'),
      maxHeight: 400,
      scrollbarWidth: 'thin',
      scrollbarColor: '#757575',
    },
    '& .scrollable-container::-webkit-scrollbar-track': {
      background: 'white',
    },
    '& .scrollable-container::-webkit-scrollbar-thumb ': {
      backgroundColor: '#757575',
      borderRadius: 8,
    },
    '& .scrollable-container::-webkit-scrollbar': {
      width: 7,
    },
  },
  notification: {
    fontWeight: fontWeight.extraBold,
    fontSize: fontSizes.medium,
  },
  email: {
    textDecoration: 'none',
    color: colors.textHeader,
    fontSize: fontSizes.large,
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
