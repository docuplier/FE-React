import React from 'react';
import { Box } from '@material-ui/core';
import PropTypes from 'prop-types';

const TabPanel = ({ children, value, index, ...rest }) => {
  return (
    <div role="tabpanel" hidden={value !== index} id={`app-tabpanel-${index}`} {...rest}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default TabPanel;
