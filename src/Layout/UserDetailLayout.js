import { useState } from 'react';
import { Box, Paper, Tabs, Tab } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import PropTypes from 'prop-types';

import DetailProfileCard from 'reusables/DetailProfileCard';
import MaxWidthContainer from 'reusables/MaxWidthContainer';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Breadcrumb from 'reusables/Breadcrumb';
import { PrivatePaths } from 'routes';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import { UserRoles } from 'utils/constants';

const UserDetailLayout = ({
  instructor,
  defaultTabIndex = 0,
  onTabChange,
  tabs,
  children,
  user,
  courseInfo,
  isPageLoaded = false,
}) => {
  const classes = useStyles();
  const [selectedTabIndex, setSelectedTabIndex] = useState(defaultTabIndex);
  const { userDetails } = useAuthenticatedUser();

  const renderLoadingState = () => (
    <Box my={10} ml={100}>
      <Box mt={10} mb={10} maxWidth={150}>
        <Skeleton />
        <Skeleton />
      </Box>
      <Skeleton style={{ maxWidth: 300 }} />
    </Box>
  );

  const handleChange = (event, newValue) => {
    setSelectedTabIndex(newValue);
    onTabChange(newValue);
  };

  const breadcrumbLink =
    userDetails?.selectedRole === UserRoles.GLOBAL_ADMIN
      ? [{ title: 'Home', to: '/' }]
      : [
          { title: 'Home', to: '/' },
          { title: 'Users', to: PrivatePaths.USERS },
          {
            title: instructor ? 'Lecturers' : 'Students',
            to: instructor ? `${PrivatePaths.USERS}/lecturers` : `${PrivatePaths.USERS}/students`,
          },
        ];

  return (
    <div className={classes.wrapper}>
      <Box className={classes.topNav} pt={10} position="fixed">
        <MaxWidthContainer>
          <Breadcrumb links={breadcrumbLink} />
        </MaxWidthContainer>
      </Box>
      <Box component={Paper} square color="#fff" mt={30}>
        <MaxWidthContainer spacing="md">
          <Box mb={-12}>
            {isPageLoaded ? (
              <DetailProfileCard user={user} courseInfo={courseInfo} />
            ) : (
              renderLoadingState()
            )}
            <StyledTabs
              indicatorColor="primary"
              textColor="primary"
              value={selectedTabIndex}
              onChange={handleChange}>
              {tabs.map((tab, i) => (
                <Tab disableRipple label={tab} key={i} />
              ))}
            </StyledTabs>
          </Box>
        </MaxWidthContainer>
      </Box>
      {children}
    </div>
  );
};

const useStyles = makeStyles(() => ({
  topNav: {
    background: 'linear-gradient(98.68deg, #041E44 14.09%, #0050C8 140.86%)',
    width: '100%',
    height: 50,
    color: '#00B0ED',
    top: 70,
    zIndex: 100,
  },
  wrapper: {
    backgroundColor: '#F6F7F7',
  },
}));

const StyledTabs = withStyles({
  root: {
    height: '100%',
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

UserDetailLayout.propTypes = {
  children: PropTypes.node,
  user: PropTypes.shape({
    imageSrc: PropTypes.string,
    name: PropTypes.string,
    id: PropTypes.string,
    department: PropTypes.string,
    gender: PropTypes.string,
    level: PropTypes.number,
    session: PropTypes.string,
    semester: PropTypes.string,
    location: PropTypes.string,
    age: PropTypes.number,
    transparent: PropTypes.bool,
  }),
  courseInfo: PropTypes.shape({
    total: PropTypes.number,
    learner: PropTypes.number,
    completion: PropTypes.number,
  }),
  maxWidthClassName: PropTypes.object,
  instructor: PropTypes.bool,
  tabs: PropTypes.arrayOf(PropTypes.string),
  onTabChange: PropTypes.func,
};

export default UserDetailLayout;
