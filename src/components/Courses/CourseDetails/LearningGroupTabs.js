import React from 'react';
import { Box, Tab, Tabs, styled } from '@material-ui/core';
import TabPanel from './TabPanel';

const a11yProps = (index) => {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
};

const LearningGroupTabs = ({ tabs, onTabChange }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    onTabChange && onTabChange(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box>
        <StyledTabs textColor="primary" value={value} onChange={handleChange} aria-label="tabs">
          {tabs.map(({ label }, index) => (
            <StyledTab label={label} {...a11yProps(index)} />
          ))}
        </StyledTabs>
      </Box>
      {tabs.map(({ component }, index) => (
        <TabPanel value={value} index={index}>
          {component}
        </TabPanel>
      ))}
    </Box>
  );
};

const StyledTabs = styled((props) => (
  <Tabs {...props} TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }} />
))(({ theme }) => ({
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    height: 4,
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: 59,
    width: '100%',
    backgroundColor: theme.palette.primary.main,
    borderRadius: '4px 4px 0px 0px',
  },
}));

const StyledTab = styled((props) => <Tab disableRipple {...props} />)(({ theme }) => ({
  textTransform: 'none',
  marginRight: theme.spacing(8),
  color: theme.palette.text.main,
  fontSize: theme.typography.fontSizeSmall,
  '&.Mui-selected': {
    color: theme.palette.primary.main,
  },
  '&.Mui-focusVisible': {
    backgroundColor: 'rgba(100, 95, 228, 0.32)',
  },
}));

export default LearningGroupTabs;
