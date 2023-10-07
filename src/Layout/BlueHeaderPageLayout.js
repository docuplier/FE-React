import { Avatar, Box, Grid, Tab, Tabs, Typography, useMediaQuery } from '@material-ui/core';
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import { Skeleton } from '@material-ui/lab';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import Breadcrumb from 'reusables/Breadcrumb';
import Chip from 'reusables/Chip';
import MaxWidthContainer from 'reusables/MaxWidthContainer';
import TruncateText from 'reusables/TruncateText';
import { colors, fontSizes, fontWeight } from '../Css';

/**
 * This is a layout component
 * @prop tabs : Let's you pass names of items on the navigation tab.
 * @prop onTabChange : Let's you specify a function that makes use of the selected tab index
 * @prop defaultTabIndex: Allows you set a default tab index according to the position index of a values passed in the tabs array
 * @prop isTabBarHidden: Allows you show or hide the entire navigation bar
 */

function BlueHeaderPageLayout(props) {
  const {
    tabs,
    onTabChange,
    isTabBarHidden = false,
    links,
    avatarSrc,
    title,
    description,
    chipLabel,
    rightContent,
    otherInformation,
    children,
    showDepartmentText, // This shows a small header text of Department above the title
    defaultTabIndex = 0,
    tabIndex: tabIndexFromProps,
    isPageLoaded = false,
    extendTitle,
  } = props;
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const classes = useStyles({ isPageLoaded, avatarSrc });
  const [tabIndexFromState, setTabIndexFromState] = React.useState(defaultTabIndex || 0);

  const tabIndex = useMemo(() => {
    return tabIndexFromProps !== undefined ? tabIndexFromProps : tabIndexFromState;
  }, [tabIndexFromProps, tabIndexFromState]);

  const handleChange = (event, newValue) => {
    setTabIndexFromState(newValue);
    onTabChange(newValue);
  };

  const renderLoadingState = () => (
    <Box mt={10}>
      <Skeleton style={{ maxWidth: 400 }} />
      <Box mt={10} mb={10} maxWidth={800}>
        <Skeleton />
        <Skeleton />
      </Box>
      <Skeleton style={{ maxWidth: 300 }} />
    </Box>
  );

  return (
    <div className={classes.wrapper}>
      <Box className={classes.header}>
        <MaxWidthContainer spacing="sm">
          <Box pb={12}>
            {isPageLoaded ? (
              <Grid container>
                <Grid item xs={12} lg={8} className={classes.leftContent}>
                  <div className="breadcrumb-wrapper">
                    <Breadcrumb links={links} />
                  </div>
                  {!!avatarSrc && (
                    <Avatar className="avatar" src={avatarSrc}>
                      Logo
                    </Avatar>
                  )}
                  <Box className="title-container">
                    {!!showDepartmentText && (
                      <Typography className="department-text">Department</Typography>
                    )}
                    <Box mb={4}>
                      {extendTitle} <Typography className="title">{title}</Typography>
                    </Box>
                    {!!chipLabel && (
                      <Chip label={chipLabel} className="chip" size="lg" roundness="lg" />
                    )}
                  </Box>
                  <TruncateText
                    text={description}
                    lines={isLargeScreen ? 2 : 3}
                    className="description"
                  />
                  <Box mb={isLargeScreen ? 8 : 10}>{otherInformation}</Box>
                </Grid>
                <Grid item xs={12} lg={4}>
                  <Box
                    height="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent={isLargeScreen ? 'flex-end' : 'flex-start'}
                  >
                    {rightContent}
                  </Box>
                </Grid>
              </Grid>
            ) : (
              renderLoadingState()
            )}
          </Box>
        </MaxWidthContainer>
      </Box>
      {!isTabBarHidden && (
        <Box className={classes.navigation}>
          <MaxWidthContainer>
            <StyledTabs
              indicatorColor="primary"
              textColor="primary"
              value={tabIndex}
              onChange={handleChange}
            >
              {tabs?.map((tab, i) => (
                <Tab disableRipple label={tab} key={i} />
              ))}
            </StyledTabs>
          </MaxWidthContainer>
        </Box>
      )}
      {children}
    </div>
  );
}

// Configurations for customizing the default Tab and Tabs component for MaterialUI
const StyledTabs = withStyles((theme) => ({
  root: {
    height: '100%',
    [theme.breakpoints.down('sm')]: {
      paddingRight: 20,
    },
    '& .MuiTabs-scroller': {
      overflowX: 'auto !important',
      scrollbarWidth: 'thin',
      scrollbarColor: '#F1F2F6',
    },
    '& .MuiTabs-scroller::-webkit-scrollbar-track': {
      background: 'white',
    },
    '& .MuiTabs-scroller::-webkit-scrollbar-thumb ': {
      backgroundColor: '#F1F2F6',
      borderRadius: 8,
    },
    '& .MuiTabs-scroller::-webkit-scrollbar': {
      width: 5,
    },
  },
}))((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const useStyles = makeStyles((theme) => ({
  wrapper: {
    background: colors.background,
    maxWidth: '100vw',
    minHeight: '100vh',
    width: '100%',
    height: '100%',
  },
  header: {
    background: 'linear-gradient(98.68deg, #041E44 14.09%, #0050C8 140.86%)',
    width: '100%',
    color: colors.white,
    minHeight: (props) => props.isPageLoaded === false && 200,
    '& .header-container': {
      paddingTop: 16,
      paddingBottom: 40,
    },
  },
  navigation: {
    background: '#FFFFFF',
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 70,
    zIndex: 100,
    '& .navigation-item': {
      marginRight: 15,
      height: '100%',
      borderBottom: '1px solid blue',
      borderRadius: '4px 5px 0px 0px',
    },
  },
  leftContent: {
    '& .title-container': {
      padding: '16px 0px',
    },
    '& .title': {
      fontSize: fontSizes.title,
      fontWeight: fontWeight.bold,
      display: 'inline-block',
    },
    '& .description': {
      fontSize: fontSizes.large,
      fontWeight: fontWeight.regular,
      color: '#F0F5FF',
      marginBottom: 20,
      maxWidth: 700,
      textAlign: 'justify',
      [theme.breakpoints.up('lg')]: {
        marginBottom: 16,
      },
    },
    '& .MuiTypography-root span': {
      color: `#F0F5FF !important`,
    },
    '& .chip': {
      height: 24,
      background: '#FFB321',
      color: '#1D2733',
      fontWeight: fontWeight.bold,
    },
    '& .breadcrumb-wrapper': {
      marginBottom: 16,
    },
    '& .avatar': {
      width: 100,
      height: 100,
      background: colors.seperator,
      color: colors.black,
    },
    '& .department-text': {
      fontSize: 14,
      fontWeight: fontWeight.regular,
    },
  },
}));

BlueHeaderPageLayout.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.string),
  onTabChange: PropTypes.func,
  isTabBarHidden: PropTypes.bool,
  avatarSrc: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  chipLabel: PropTypes.string,
  leftContent: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  rightContent: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  defaultTabIndex: PropTypes.number,
  otherInformation: PropTypes.element,
  children: PropTypes.element,
  showDepartmentText: PropTypes.string,
  links: Breadcrumb.propTypes,
  isLoading: PropTypes.bool,
  extendTitle: PropTypes.node,
  tabIndex: PropTypes.number,
};

export default BlueHeaderPageLayout;
