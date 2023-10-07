import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Typography, Tabs, Tab } from '@material-ui/core';

import { colors, fontSizes, fontWeight } from '../../Css';

const Header = ({ title, tabList, onChangeTab, currentTab, color, tabTextColor }) => {
  const classes = useStyles();

  const a11yProps = (index) => {
    return {
      id: `tab-${index}`,
      'aria-controls': `tabpanel-${index}`,
    };
  };

  const renderTabList = () => {
    return (
      <Tabs
        value={currentTab}
        textColor="primary"
        indicatorColor="primary"
        TabIndicatorProps={{ style: { background: color ? color : 'primary' } }}
        onChange={(_evt, value) => onChangeTab(value)}
        aria-label="Modal tab"
      >
        {tabList.map((tab, index) => (
          <Tab
            label={
              <span style={{ color: currentTab == index ? tabTextColor : ' ' }}> {tab.label} </span>
            }
            {...a11yProps(index)}
          />
        ))}
      </Tabs>
    );
  };

  return (
    <div className={classes.header} style={{ paddingBottom: tabList && 0 }}>
      <Typography variant="body1" color="textPrimary" className="title">
        {title}
      </Typography>
      {tabList && renderTabList()}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  header: {
    padding: theme.spacing(12), //24px
    background: colors.white,
    position: 'absolute',
    width: '100%',
    top: 0,
    left: 0,
    boxSizing: 'border-box',
    boxShadow: `inset 0px -1px 0px #E7E7ED`,
    '& .title': {
      margin: 0,
      fontWeight: fontWeight.medium,
      wordWrap: 'break-word',
      fontSize: fontSizes.xlarge,
    },
  },
}));

Header.propTypes = {
  title: PropTypes.string.isRequired,
  tabList: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      panel: PropTypes.node.isRequired,
    }),
  ),
  currentTab: PropTypes.number,
  onChangeTab: PropTypes.func,
};

export default React.memo(Header);
