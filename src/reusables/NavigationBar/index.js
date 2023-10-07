import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink, matchPath } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  Avatar,
  Box,
  IconButton,
  makeStyles,
  Paper,
  Typography,
  Badge,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { NotificationsNone as NotificationsIcon, Menu as MenuIcon } from '@material-ui/icons';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import { useRoleNavigation } from 'hooks/useRoleNavigation';
import MaxWidthContainer from 'reusables/MaxWidthContainer';
import { useNotification } from 'reusables/NotificationBanner';
import { colors, fontFamily, fontSizes, fontWeight, spaces } from '../../Css';
import UserMenu from './UserMenu';
import useSubdomain from 'hooks/useSubDomain';
import MobileNavDrawer from './MobileNavDrawer';
import { ReactComponent as Favicon } from 'assets/svgs/fav-icon.svg';
import { GET_NOTIFICATIONS } from 'graphql/queries/notification';
import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET } from 'utils/constants';

const NavigationBar = () => {
  const { domainObject } = useSubdomain();
  const notification = useNotification();
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [isNotitificationPanelOpen, setNotificationPanelOpen] = useState(null);
  const { userDetails } = useAuthenticatedUser();
  const { handleRoleBasedNav } = useRoleNavigation();

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
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const notifications = data?.notifications?.results || [];
  const total = data?.notifications?.totalCount;
  const classes = useStyles();

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

  const handleShowMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const onCloseNotification = () => {
    return setNotificationPanelOpen(null);
  };

  const handleClick = (event) => {
    refetch();
    setNotificationPanelOpen(event.currentTarget);
  };

  const showBadge = () => {
    if (notifications.length > 0) return true;
    return false;
  };

  function renderMobileMenu() {
    return (
      <>
        <MenuIcon className={classes.menuIcon} onClick={() => setOpen(true)} />
        <MobileNavDrawer
          open={open}
          role={userDetails?.selectedRole}
          onClose={() => setOpen(false)}
        />
      </>
    );
  }

  return (
    <Paper className={classes.navigation}>
      <MaxWidthContainer spacing={'sm'}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            {!isSmallScreen && (
              <Box mr={5}>
                <Link to="/dashboard" className="link">
                  {domainObject?.logo ? (
                    <img src={domainObject?.logo} alt="logo" style={{ width: 40 }} />
                  ) : (
                    <Favicon style={{ width: 40 }} />
                  )}
                </Link>
              </Box>
            )}
            <>
              {isSmallScreen && renderMobileMenu()}
              <Typography className={classes.lms} color="textPrimary" component="h1">
                <Link to="/dashboard" className="link">
                  {domainObject?.abbreviation || 'LMS'}
                </Link>
              </Typography>
            </>
          </Box>
          <Box display="flex" alignItems="center">
            {!isSmallScreen && (
              <Box mr={`${spaces.medium}px`}>
                {handleRoleBasedNav(userDetails?.selectedRole)?.map(({ tabName, link, id }) => {
                  return (
                    <NavLink
                      to={link}
                      exact
                      className={classes.link}
                      activeClassName={classes.activeLink}
                      isActive={(_, location) => {
                        return matchPath(location.pathname, {
                          path: link,
                          exact: link === '/',
                        });
                      }}
                      key={id}
                    >
                      {tabName}
                    </NavLink>
                  );
                })}
              </Box>
            )}
            <IconButton>
              <Badge
                color="primary"
                variant="dot"
                invisible={!showBadge()}
                classes={{ root: classes.badge }}
              >
                <NotificationsIcon className={classes.notification} onClick={handleClick} />
              </Badge>
            </IconButton>
            <IconButton style={{ padding: 0 }} onClick={handleShowMenu}>
              <Avatar src={userDetails?.image} className={classes.avatar}>
                {userDetails?.initials}
              </Avatar>
            </IconButton>
          </Box>
          <UserMenu
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            notificationVisibility={isNotitificationPanelOpen}
            onCloseNotification={onCloseNotification}
            handleNotificationClick={handleClick}
            notifications={notifications}
            refetch={refetch}
            loading={loading}
            showBadge={showBadge}
            handleLoadMore={handleLoadMore}
            hasMoreResults={!!getCursor(total, queryParams.limit)}
          />
        </Box>
      </MaxWidthContainer>
    </Paper>
  );
};

NavigationBar.propTypes = {
  navLinks: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      to: PropTypes.string,
    }),
  ),
};

const useStyles = makeStyles((theme) => ({
  navigation: {
    position: 'sticky',
    top: 0,
    height: 70,
    background: colors.white,
    zIndex: 100,
    borderRadius: 0,
  },
  lms: {
    fontWeight: fontWeight.bold,
    fontSize: fontSizes.title,
    lineHeight: '33px',
    marginRight: spaces.large,
    '& .link': { color: 'inherit', textDecoration: 'none' },
  },
  menuIcon: {
    marginRight: 20,
    cursor: 'pointer',
  },
  notification: {
    color: colors.grey,
  },
  avatar: {
    marginLeft: spaces.small,
    color: colors.white,
    background: colors.purple,
    fontWeight: fontWeight.bold,
    fontSize: fontSizes.medium,
  },
  link: {
    textDecoration: 'none',
    padding: `0 ${spaces.small}px`,
    fontFamily: fontFamily.nunito,
    fontSize: fontSizes.large,
    color: colors.text,
  },
  activeLink: {
    color: colors.primary,
  },
  badge: {
    '& .MuiBadge-anchorOriginTopRightRectangle': {
      right: 5,
      top: 2,
    },
  },
}));

export default NavigationBar;
