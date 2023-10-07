import { memo } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@material-ui/core';
import { Rating as MuiRating } from '@material-ui/lab';
import StarRateOutlinedIcon from '@material-ui/icons/StarRateOutlined';

import { colors } from '../Css';

const Rating = ({ label: labelFromProps, useNumberedLabel, value, ...rest }) => {
  const shouldDisplayLabel = useNumberedLabel || Boolean(labelFromProps);
  const label = useNumberedLabel ? value?.toFixed(1) : labelFromProps;

  return (
    <Box display="flex" alignItems="center">
      <MuiRating
        {...rest}
        value={value}
        precision={0.5}
        emptyIcon={<StarRateOutlinedIcon style={{ color: colors.seperator }} />}
      />
      {shouldDisplayLabel && (
        <Box ml={4}>
          <Typography component="span" color="textPrimary" variant="subtitle2">
            {label}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

Rating.propTypes = {
  ...MuiRating.propTypes,
  label: PropTypes.string,
  useNumberedLabel: PropTypes.bool,
};

Rating.defaultProps = {
  useNumberedLabel: false,
};

export default memo(Rating);
