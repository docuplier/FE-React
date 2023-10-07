import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Tabs, Tab, Grid } from '@material-ui/core';
import Proptypes from 'prop-types';

import { colors, fontSizes, spaces } from '../Css';

const VerticalTabs = ({ tabList, activeTab, handleNextTab }) => {
  const classes = useStyles();

  const a11yProps = (index) => {
    return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
    };
  };

  const handleChange = (_event, newValue) => {
    handleNextTab(newValue);
  };

  const renderTabPanel = (index, component) => {
    return (
      <div
        role="tabpanel"
        hidden={activeTab !== index}
        key={index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}>
        {activeTab === index && component}
      </div>
    );
  };

  return (
    <Grid container>
      <Grid item sm={3}>
        <Box mb={10}>
          <Tabs
            orientation="vertical"
            value={activeTab}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            centered={false}
            textColor="primary"
            classes={{ indicator: classes.indicator }}
            className={classes.tabs}>
            {tabList?.map((tab, index) => (
              <Tab
                key={index}
                classes={{
                  root: classes.tab,
                  wrapper: classes.wrapper,
                }}
                label={tab.label}
                {...a11yProps(index)}
              />
            ))}
          </Tabs>
        </Box>
      </Grid>
      <Grid item sm={9} className={classes.mainContent}>
        {tabList?.map((tab, index) => renderTabPanel(index, tab.component))}
      </Grid>
    </Grid>
  );
};

VerticalTabs.propTypes = {
  tabList: Proptypes.arrayOf(
    Proptypes.shape({
      label: Proptypes.string,
      component: PropTypes.node,
    }),
  ),
};

const useStyles = makeStyles((theme) => ({
  tab: {
    borderLeft: `5px solid ${theme.palette.divider}`,
  },
  wrapper: {
    display: 'inline',
    textTransform: 'capitalize',
    textAlign: 'left',
    fontSize: fontSizes.large,
    paddingLeft: spaces.medium,
  },
  indicator: {
    left: 0,
    width: 5,
    background: colors.lightBlue,
  },
  mainContent: {
    maxWidth: 800,
  },
}));

export default VerticalTabs;
