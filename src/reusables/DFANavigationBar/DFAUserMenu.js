import {
  Avatar,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Menu,
  Typography,
  Badge,
} from '@material-ui/core';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import PropTypes from 'prop-types';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { clearVault } from 'utils/Auth';
import { PrivatePaths } from 'routes';
import { boxShadows, colors, fontFamily, fontSizes, fontWeight, spaces } from '../../Css';
import Notification from 'components/Notification';
import { useNotification } from 'reusables/NotificationBanner';
import { useMutation } from '@apollo/client';
import { LOGOUT_USER } from 'graphql/mutations/auth';

const DFAUserMenu = ({
  anchorEl,
  onClose,
  onCloseNotification,
  notificationVisibility,
  handleNotificationClick,
  notifications,
  refetch,
  loading,
  showBadge,
  hasMoreResults,
  handleLoadMore,
}) => {
  const classes = useStyles();
  const history = useHistory();
  const { userDetails } = useAuthenticatedUser();
  const notification = useNotification();

  const [Logout] = useMutation(LOGOUT_USER, {
    onCompleted: ({ logout: { ok, success } }) => {
      if (ok) {
        notification.success({
          message: success?.messages,
        });
      } else {
        notification.error({
          message: 'Error Logging out of the application',
        });
      }
      clearVault();
      window.location.reload(false);
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });
  const handleLogout = () => {
    Logout();
  };

  return (
    <Menu
      id="simple-menu"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={onClose}
      classes={{
        paper: classes.menu,
      }}
    >
      <Box>
        <Box display="flex" style={{ padding: spaces.medium }}>
          <Avatar src={userDetails?.image} className={classes.avatar}>
            {userDetails?.initials}
          </Avatar>
          <Box ml={`${spaces.small}px`}>
            <Typography
              className={classes.name}
            >{`${userDetails?.firstname} ${userDetails?.lastname}`}</Typography>
            <Typography className={classes.email}>{userDetails?.email}</Typography>
          </Box>
        </Box>
        <Divider />
        <List component="nav" aria-label="secondary mailbox folders">
          <ListItem button onClick={() => history.push(PrivatePaths.PROFILE)}>
            <ListItemText className={classes.menuItem} primary="Edit Profile" />
          </ListItem>
          <Badge
            color="primary"
            variant="dot"
            invisible={!showBadge()}
            classes={{ root: classes.badge }}
          >
            <ListItem
              button
              onClick={handleNotificationClick}
              href="#simple-list"
              style={{ paddingRight: 175 }}
            >
              <ListItemText className={classes.menuItem} primary="Notification" />
            </ListItem>
          </Badge>
        </List>
        <Divider />
        <ListItem button onClick={() => history.push(PrivatePaths.PROFILE)}>
          <ListItemText className={classes.menuItem} primary="Saved Content" />
        </ListItem>
        <Divider />
        <List component="nav" aria-label="secondary mailbox folders">
          <ListItem button onClick={() => history.push(`/get-help`)} href="#simple-list">
            <ListItemText className={classes.menuItem} primary="Help" />
          </ListItem>
          <ListItem button onClick={handleLogout}>
            <ListItemText className={classes.menuItem} primary="Logout" />
          </ListItem>
        </List>
      </Box>
      <Notification
        isVisible={notificationVisibility}
        onClosePanel={onCloseNotification}
        user={userDetails}
        notifications={notifications}
        refetch={refetch}
        loading={loading}
        handleLoadMore={handleLoadMore}
        hasMoreResults={hasMoreResults}
      />
    </Menu>
  );
};

DFAUserMenu.propTypes = {
  anchorEl: PropTypes.oneOfType([PropTypes.object, PropTypes.node, PropTypes.func]),
  onClose: PropTypes.func.isRequired,
};

const useStyles = makeStyles({
  menu: {
    boxShadow: boxShadows.primary,
    borderRadius: '4px',
    marginTop: 55,
    maxWidth: 280,
    minWidth: 280,
  },
  name: {
    color: colors.secondaryBlack,
    fontWeight: fontWeight.bold,
  },
  menuItem: {
    color: colors.secondaryBlack,
    fontSize: fontSizes.medium,
  },
  email: {
    color: '#565D66',
    fontSize: fontSizes.small,
  },
  avatar: {
    color: colors.white,
    background: colors.purple,
    fontFamily: fontFamily.nunito,
    fontWeight: fontWeight.bold,
    fontSize: fontSizes.medium,
  },
  badge: {
    '& .MuiBadge-dot': {
      marginTop: 18,
      marginRight: 170,
    },
  },
});

export default DFAUserMenu;
