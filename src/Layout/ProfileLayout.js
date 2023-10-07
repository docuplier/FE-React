import { useState } from 'react';
import { Box, Tabs, Tab } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import PropTypes from 'prop-types';

import DetailProfileCard from 'reusables/DetailProfileCard';
import MaxWidthContainer from 'reusables/MaxWidthContainer';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import NavigationBar from 'reusables/NavigationBar';
import { colors } from '../Css';

const ProfileLayout = ({
  defaultTabIndex = 0,
  onTabChange,
  tabs,
  children,
  onClick,
  editable = true,
  user,
  isPageLoaded = false,
}) => {
  const classes = useStyles();
  const [selectedTabIndex, setSelectedTabIndex] = useState(defaultTabIndex);

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

  return (
    <div>
      <NavigationBar />
      <Box className={classes.wrapper}>
        <MaxWidthContainer spacing="md">
          <Box>
            {isPageLoaded ? (
              <DetailProfileCard user={user} editable={editable} onClick={onClick} />
            ) : (
              renderLoadingState()
            )}
          </Box>
        </MaxWidthContainer>
      </Box>
      <Box className={classes.tabWrapper}>
        <MaxWidthContainer>
          <StyledTabs
            indicatorColor="primary"
            textColor="primary"
            value={selectedTabIndex}
            onChange={handleChange}
          >
            {tabs?.map((tab, i) => (
              <Tab disableRipple label={tab} key={i} />
            ))}
          </StyledTabs>
        </MaxWidthContainer>
      </Box>
      <MaxWidthContainer>{children}</MaxWidthContainer>
    </div>
  );
};

const useStyles = makeStyles(() => ({
  wrapper: {
    background: 'linear-gradient(98.68deg, #041E44 14.09%, #0050C8 140.86%)',
  },
  tabWrapper: {
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 70,
    background: colors.white,
    boxSizing: 'border-box',
    borderTop: `2px solid`,
    borderImageSource: ` 2px solid linear-gradient(98.68deg, #041E44 14.09%, #0050C8 140.86%)`,
    zIndex: 100,
  },
}));

const StyledTabs = withStyles({
  root: {
    height: '100%',
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

ProfileLayout.propTypes = {
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
  }),
  maxWidthClassName: PropTypes.object,
  tabs: PropTypes.arrayOf(PropTypes.string),
  onTabChange: PropTypes.func,
};

export default ProfileLayout;
