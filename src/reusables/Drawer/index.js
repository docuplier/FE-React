import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Drawer as MuiDrawer, Box } from '@material-ui/core';

import LoadingButton from 'reusables/LoadingButton';
import { fontSizes } from '../../Css';
import Header from './Header';
import Footer from './Footer';

/**
 *
 * @component
 * Modal handles the modal pop-up on the app.
 * It is built on Material Ui's Modal component
 *
 * This component also allows you pass a tabList to customize the tab header
 */
const Drawer = ({
  open,
  onClose,
  children,
  width,
  title,
  tabList,
  cancelText,
  cancelButtonProps,
  onOk,
  okText,
  okButtonProps,
  footer,
  containerWidth = 520,
  tabColor,
  tabTextColor,
  ...rest
}) => {
  const classes = useStyles({ hasTabs: Boolean(tabList), drawerWidth: width });
  const [currentTab, setCurrentTab] = useState(0);

  const renderTabPanel = (panel, index) => {
    return (
      <div
        role="tabpanel"
        hidden={currentTab !== index}
        id={`tabpanel-${index}`}
        aria-labelledby={`tab-${index}`}
      >
        {currentTab === index && panel}
      </div>
    );
  };

  return (
    <MuiDrawer
      anchor="right"
      open={open}
      classes={{ root: classes.dialog }}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      {...rest}
    >
      <Box role="presentation" className={classes.container} style={{ width: containerWidth }}>
        <Header
          title={title}
          currentTab={currentTab}
          onChangeTab={(value) => setCurrentTab(value)}
          tabList={tabList}
          color={tabColor}
          tabTextColor={tabTextColor}
        />
        <div className={classes.body}>
          {tabList?.map((tab, index) => (
            <React.Fragment key={index}>{renderTabPanel(tab.panel, index)}</React.Fragment>
          ))}
          {children}
        </div>
        {footer !== undefined ? (
          footer
        ) : (
          <Footer
            okText={okText}
            okButtonProps={okButtonProps}
            onOk={onOk}
            cancelText={cancelText}
            cancelButtonProps={cancelButtonProps}
            onClose={onClose}
          />
        )}
      </Box>
    </MuiDrawer>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'relative',
    overflow: 'hidden',
    height: '100%',
    width: (props) => props.drawerWidth,
    [theme.breakpoints.down('xs')]: {
      width: '100vw !important',
    },
  },
  body: {
    padding: theme.spacing(12), //24px
    fontSize: fontSizes.medium,
    wordWrap: 'break-word',
    background: '#fafafa',
    position: 'relative',
    marginTop: (props) => (props.hasTabs ? theme.spacing(50) : theme.spacing(37)),
    height: (props) => (props.hasTabs ? 'calc(100vh - 209px)' : 'calc(100vh - 183px)'),
    overflowY: 'scroll',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(10), //20px
    },
  },
}));

Drawer.propTypes = {
  ...MuiDrawer.propTypes,
  okButtonProps: PropTypes.shape({
    ...LoadingButton.propTypes,
  }),
  okText: PropTypes.node,
  onOk: PropTypes.func,
  cancelButtonProps: PropTypes.shape({
    ...LoadingButton.propTypes,
  }),
  cancelText: PropTypes.node,
  title: PropTypes.node,
  tabList: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      panel: PropTypes.node.isRequired,
    }),
  ),
  footer: PropTypes.node,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  minWidth: PropTypes.number,
};

Drawer.defaultProps = {
  cancelText: 'Cancel',
  okText: 'OK',
};

export default React.memo(Drawer);
