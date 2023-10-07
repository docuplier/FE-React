import React from 'react';
import { Box } from '@material-ui/core';

import MaxWidthContainer from '../reusables/MaxWidthContainer';

export default {
  title: 'MaxWidthContainer',
  component: MaxWidthContainer,
};

export const MaxWidthContainerStory = () => (
  <MaxWidthContainer spacing="sm">
    <Box style={{ width: '100%', backgroundColor: 'red', height: '100px' }}>
      The width of this element has been limited
    </Box>
  </MaxWidthContainer>
);
