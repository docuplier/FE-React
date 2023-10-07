import React from 'react';
import { Box, Checkbox, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';

const DefaultLevel = ({ checked, onSelect, name }) => {
  return (
    <Box display="flex" alignItems="center">
      <Checkbox color="primary" checked={checked} onChange={onSelect} />
      <Box ml={4}>
        <Typography color="textPrimary" variant="body1">
          {name}
        </Typography>
      </Box>
    </Box>
  );
};

DefaultLevel.propTypes = {
  checked: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default React.memo(DefaultLevel);
