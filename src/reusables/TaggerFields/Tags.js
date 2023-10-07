import React from 'react';
import PropTypes from 'prop-types';
import { Box, Chip } from '@material-ui/core';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';

const Tags = ({ data, onDelete, wrap = true }) => {
  return (
    <Box display="flex" flexWrap={wrap ? 'wrap' : 'no-wrap'} mb={-4} mr={-8}>
      {data?.map((item) => (
        <Box display="flex" mr={8} mb={4} key={item.value}>
          <Chip
            key={item.value}
            roundness="md"
            variant="outlined"
            label={item.label}
            onDelete={() => onDelete(item.value)}
            deleteIcon={<CloseOutlinedIcon />}
          />
        </Box>
      ))}
    </Box>
  );
};

Tags.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ),
};

export default React.memo(Tags);
