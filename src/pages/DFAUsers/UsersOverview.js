import { useQuery } from '@apollo/client';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Menu,
  Typography,
} from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import UpsertAdministratorDrawer from 'components/Users/UpsertAdministratorDrawer';
import UpsertCustomUserDrawer from 'components/Users/UpsertCustomUserDrawer';
import UpsertInstructorDrawer from 'components/Users/UpsertInstructorDrawer';
import UpsertLearnerDrawer from 'components/Users/UpsertLearnerDrawer';
import { GET_FACULTIES_QUERY } from 'graphql/queries/institution';
import { USERS_STATISTICS } from 'graphql/queries/users';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import BlueHeaderPageLayout from 'Layout/BlueHeaderPageLayout';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import BasicResourceCard from 'reusables/BasicResourceCard';
import Chip from 'reusables/Chip';
import LoadingView from 'reusables/LoadingView';
import MaxWidthContainer from 'reusables/MaxWidthContainer';
import { useNotification } from 'reusables/NotificationBanner';
import { getNameInitials } from 'utils/UserUtils';
import { boxShadows, colors, fontSizes, fontWeight } from '../../Css';
import { getUsersOverview } from './mockData';
import GreenHeaderPageLayout from 'Layout/DFALayout/GreenHeaderPageLayout';

const drawers = {
  LEARNER: 'LEARNER',
  INSTRUCTOR: 'INSTRUCTOR',
  ADMINISTRATOR: 'ADMINISTRATOR',
  CUSTOM_USER: 'CUSTOM_USER',
  MIGRATION: 'MIGRATION',
};

const UsersOverview = () => {
  const classes = useStyles();
  const { pathname } = useLocation();
  const notification = useNotification();
  const { userDetails } = useAuthenticatedUser();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openedDrawer, setOpenedDrawer] = useState(null);

  const { loading, data, refetch } = useQuery(USERS_STATISTICS, {
    // fetchPolicy: 'network-only',
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const { data: facultiesData } = useQuery(GET_FACULTIES_QUERY, {
    variables: {
      institutionId: userDetails?.institution?.id,
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const handleShowMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const onUpsertUsersSuccess = () => {
    refetch();
    setOpenedDrawer(null);
  };

  const renderBannerRightContent = () => {
    return (
      <Button onClick={handleShowMenu} startIcon={<AddIcon />} variant="contained">
        Add User
      </Button>
    );
  };

  const renderUsersMetaData = () => {
    const { firstname, lastname } = userDetails?.institution?.administrator || {};

    return (
      <Box display="flex" alignItems="center" className={classes.metaDataContainer}>
        <Typography component="span" variant="body1">
          <Typography component="span" className="bold-text">
            {facultiesData?.faculties?.totalCount || 0}
          </Typography>
          Faculties
        </Typography>
        <Box ml={8} mr={8}>
          <Divider orientation="vertical" className="divider" />
        </Box>
        <Box display="flex" alignItems="center" mt={4}>
          <Avatar sizes="small" className={classes.avatar}>
            {userDetails?.institution?.administrator ? getNameInitials(firstname, lastname) : '-'}
          </Avatar>
          <Box mr={4} ml={4}>
            <Typography variant="body2" color="textSecondary" className={classes.adminName}>
              {userDetails?.institution?.administrator
                ? firstname + ' ' + lastname
                : 'No Administrator'}
            </Typography>
          </Box>
          <Chip label="Head" className={classes.label} />
        </Box>
      </Box>
    );
  };

  const renderDrawers = () => {
    return (
      <>
        <UpsertLearnerDrawer
          open={openedDrawer === drawers.LEARNER}
          onClose={() => setOpenedDrawer(null)}
          onOkSuccess={onUpsertUsersSuccess}
        />
        <UpsertInstructorDrawer
          open={openedDrawer === drawers.INSTRUCTOR}
          onClose={() => setOpenedDrawer(null)}
          onOkSuccess={onUpsertUsersSuccess}
        />
        <UpsertAdministratorDrawer
          open={openedDrawer === drawers.ADMINISTRATOR}
          onClose={() => setOpenedDrawer(null)}
          onOkSuccess={onUpsertUsersSuccess}
        />
        <UpsertCustomUserDrawer
          open={openedDrawer === drawers.CUSTOM_USER}
          onClose={() => setOpenedDrawer(null)}
          onOkSuccess={onUpsertUsersSuccess}
        />
      </>
    );
  };

  return (
    <div>
      <LoadingView isLoading={loading}>
        <GreenHeaderPageLayout
          isPageLoaded={Boolean(userDetails?.institution)}
          isTabBarHidden={true}
          rightContent={renderBannerRightContent()}
          title="Users"
          description="List of all the users onboarded to the system as School Administrator, Instructor and Learners."
          otherInformation={renderUsersMetaData()}
          links={[{ title: 'Home', to: '/' }]}
        >
          <MaxWidthContainer spacing="lg">
            <Grid container spacing={8}>
              {Array.isArray(data?.userStatistics) &&
                getUsersOverview(data?.userStatistics).map((d, index) => {
                  return (
                    <>
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <BasicResourceCard
                          path={
                            d.title !== `Custom Users` &&
                            `${pathname}/${d.title.split(' ').join('-').toLowerCase()}`
                          }
                          imageSrc={undefined}
                          title={d.title}
                          description={d.description}
                          caption={d.caption}
                          metaList={d.metaList}
                          disabled={d.disabled}
                          style={{ background: d.disabled && '#E7E7ED' }}
                        />
                      </Grid>
                    </>
                  );
                })}
            </Grid>
          </MaxWidthContainer>
        </GreenHeaderPageLayout>
      </LoadingView>
      <Menu
        id="add-users-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        classes={{
          paper: classes.menu,
        }}
      >
        <List component="div" aria-label="add users options">
          {addUserOptions.map((option, index) => (
            <ListItem key={index} button onClick={() => setOpenedDrawer(option.drawer)}>
              <ListItemText button className={classes.menuItem} primary={option.text} />
            </ListItem>
          ))}
        </List>
      </Menu>
      {renderDrawers()}
    </div>
  );
};

const addUserOptions = [
  {
    drawer: drawers.ADMINISTRATOR,
    text: 'Add administrators',
  },
  {
    drawer: drawers.INSTRUCTOR,
    text: 'Add lecturers',
  },
  {
    drawer: drawers.K12TEACHER,
    text: 'Add K12TEACHER',
  },
  {
    drawer: drawers.K12LEARNER,
    text: 'Add K12LEARNER',
  },
  {
    drawer: drawers.CUSTOM_USER,
    text: 'Add custom users',
  },
  {
    drawer: drawers.LEARNER,
    text: 'Add students',
  },
];

const useStyles = makeStyles((theme) => ({
  metaDataContainer: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    '& .bold-text': {
      fontWeight: fontWeight.bold,
      marginRight: 5,
    },
    '& .divider': {
      height: fontSizes.large,
      backgroundColor: colors.white,
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
  },
  avatar: {
    background: '#F48989',
  },
  adminName: {
    color: colors.white,
    fontSize: fontSizes.large,
  },
  menu: {
    boxShadow: boxShadows.primary,
    borderRadius: '4px',
    marginTop: 135,
  },
  menuItem: {
    color: colors.secondaryBlack,
    fontSize: fontSizes.medium,
  },
  label: {
    background: '#A7A9BC',
    fontWeight: 'bold',
  },
}));

export default React.memo(UsersOverview);
