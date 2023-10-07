import React from 'react';
import { NavLink, matchPath } from 'react-router-dom';
import { Box, Drawer, makeStyles } from '@material-ui/core';
import { CancelOutlined } from '@material-ui/icons';
import { useRoleNavigation } from 'hooks/useRoleNavigation';
import { fontFamily, spaces, fontSizes, colors } from '../../Css';

const MobileNavDrawer = ({ open, onClose, role }) => {
  const classes = useStyles();
  const { handleRoleBasedNav } = useRoleNavigation();

  return (
    <Drawer open={open} onClose={onClose} anchor="left">
      <Box className={classes.dialog}>
        <Box display="flex" justifyContent="flex-end" pb={12} className={classes.header}>
          <CancelOutlined style={{ cursor: 'pointer' }} onClick={onClose} />
        </Box>
        <Box className={classes.content}>
          {handleRoleBasedNav(role)?.map(({ tabName, link, id }) => {
            return (
              <Box mb={16}>
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
                  key={id}>
                  {tabName}
                </NavLink>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Drawer>
  );
};

const useStyles = makeStyles((theme) => ({
  header: {
    padding: theme.spacing(10),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(8),
    },
  },
  dialog: {
    maxWidth: 400,
    minWidth: 350,
    [theme.breakpoints.down('xs')]: {
      maxWidth: '100vw',
      minWidth: '99vw',
    },
  },
  content: {
    padding: '12px 24px',
    [theme.breakpoints.down('xs')]: {
      padding: '12px 16px',
    },
  },
  link: {
    textDecoration: 'none',
    padding: `0 ${spaces.small}px`,
    fontFamily: fontFamily.nunito,
    fontSize: fontSizes.large,
    color: colors.text,
  },
}));

export default MobileNavDrawer;
