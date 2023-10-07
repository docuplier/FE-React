import React from 'react';
import { Box } from '@material-ui/core';
import TabPanel from 'components/Courses/CourseDetails/TabPanel';

const AssessmentTabs = ({ tabs, value }) => {
  return (
    <Box sx={{ width: '100%' }}>
      {tabs.map(({ component }, index) => (
        <TabPanel value={value} index={index}>
          {component}
        </TabPanel>
      ))}
    </Box>
  );
};

export default AssessmentTabs;
