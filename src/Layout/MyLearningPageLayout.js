import { Box, Tab, Tabs, Typography } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import CourseInfoHeader from 'reusables/CourseInfoHeader';
import MaxWidthContainer from 'reusables/MaxWidthContainer';
import { colors, fontSizes, fontWeight } from '../Css';

const MyLearningPageLayout = (props) => {
  const { tabs, onTabChange, title, children, defaultTabIndex = 0, stats } = props;
  const classes = useStyles();
  const [selectedTabIndex, setSelectedTabIndex] = useState(defaultTabIndex);

  const handleChange = (event, newValue) => {
    setSelectedTabIndex(newValue);
    onTabChange(newValue);
  };

  return (
    <div className={classes.wrapper}>
      <Box className={classes.header}>
        <MaxWidthContainer className="max-width-container">
          <Typography className={classes.title}>{title}</Typography>
          <Box className={classes.iconContainer}>
            <CourseInfoHeader {...stats} />
          </Box>
          <StyledTabs
            className={classes.tab}
            indicatorColor="primary"
            textColor="primary"
            value={selectedTabIndex}
            onChange={handleChange}>
            {tabs.map((tab, i) => (
              <Tab disableRipple label={tab} key={i} />
            ))}
          </StyledTabs>
        </MaxWidthContainer>
      </Box>
      {children}
    </div>
  );
};

const StyledTabs = withStyles({
  root: {
    height: '100%',
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const useStyles = makeStyles((theme) => ({
  wrapper: {
    background: colors.background,
    width: '100vw',
    minHeight: '100vh',
  },
  header: {
    background: colors.white,
    width: '100%',
    '& .max-width-container': {
      padding: '16px 0px 0px',
    },
  },
  iconContainer: {
    margin: '40px 0 40px 0',
  },
  title: {
    fontSize: fontSizes.title,
    color: 'black',
    fontWeight: fontWeight.bold,
    marginBottom: 4,
    boxSizing: 'border-box',
    [theme.breakpoints.down('md')]: {
      padding: '0 30px',
    },
  },
  tab: {
    boxSizing: 'border-box',
    [theme.breakpoints.down('md')]: {
      padding: '0 30px',
    },
  },
}));

MyLearningPageLayout.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.string),
  onTabChange: PropTypes.func,
  title: PropTypes.string,
  defaultTabIndex: PropTypes.number,
  children: PropTypes.node,
  stats: PropTypes.shape({
    ...CourseInfoHeader.propTypes,
  }),
};

export default MyLearningPageLayout;
