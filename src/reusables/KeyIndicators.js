import { memo } from 'react';
import { Box, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';

import { fontSizes } from '../Css';

const KeyIndicators = ({ indicators, direction = 'vertical' }) => {
  return (
    <Box
      display={direction === 'vertical' ? 'block' : 'flex'}
      flexWrap="wrap"
      mb={-8}
      mr={-8}
      justifyContent="flex-start">
      {indicators?.map((indicator, index) => {
        return (
          <Box
            key={index}
            mr={8}
            mb={8}
            display="flex"
            justifyContent="flex-start"
            alignItems="center">
            <Box mr={4} width={14} height={14} bgcolor={indicator.color} borderRadius={2} />
            <Typography color="textSecondary" style={{ fontSize: fontSizes.small }}>
              {indicator.label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

KeyIndicators.propTypes = {
  indicators: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    }),
  ).isRequired,
  direction: PropTypes.oneOf(['vertical', 'horizontal']),
};

KeyIndicators.defaultProps = {
  direction: 'horizontal',
};

export default memo(KeyIndicators);
