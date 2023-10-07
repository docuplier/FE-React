import { memo } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Paper } from '@material-ui/core';

import TruncateText from 'reusables/TruncateText';
import { colors } from '../../../Css';

const PreviewTextContent = ({ content, onClickReadMore }) => {
  return (
    <Box p={8} component={Paper} elevation={0} border={`1px solid ${colors.secondaryLightGrey}`}>
      <Box mb={3}>
        <TruncateText lines={4} text={content} variant="body2" color="textPrimary" />
      </Box>
      <Button variant="text" color="primary" onClick={onClickReadMore}>
        Read more
      </Button>
    </Box>
  );
};

PreviewTextContent.propTypes = {
  content: PropTypes.string.isRequired,
  onClickReadMore: PropTypes.func.isRequired,
};

export default memo(PreviewTextContent);
