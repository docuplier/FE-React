import { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Avatar, Box, Typography } from '@material-ui/core';

import { fontWeight } from '../Css';
import Rating from 'reusables/Rating';
import { getNameInitials } from 'utils/UserUtils';

const LecturerRatingItem = ({ name, department, ratingProps, avatarProps, titleProps }) => {
  const avatarSizeStyle = useMemo(() => {
    switch (avatarProps?.size) {
      case 'lg':
        return { width: 64, height: 64 };
      case 'md':
        return { width: 32, height: 32 };
      default:
        return { width: 16, height: 16 };
    }
  }, [avatarProps]);

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Box display="flex" alignItems="center">
        <Avatar src={avatarProps?.src} style={{ ...avatarSizeStyle }}>
          {getNameInitials(name)}
        </Avatar>
        <Box ml={4}>
          <Typography
            color="textPrimary"
            variant="body1"
            {...titleProps}
            style={{ fontWeight: fontWeight.bold }}>
            {name}
          </Typography>
          {department && (
            <Typography color="textSecondary" variant="body2">
              {department}
            </Typography>
          )}
        </Box>
      </Box>
      <Rating {...ratingProps} />
    </Box>
  );
};

LecturerRatingItem.propTypes = {
  name: PropTypes.string.isRequired,
  department: PropTypes.string.isRequired,
  ratingProps: PropTypes.shape({
    ...Rating.propTypes,
  }),
  avatarProps: PropTypes.shape({
    src: PropTypes.string,
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
  }),
  titleProps: PropTypes.shape({
    ...Typography.propTypes,
  }),
};

export default memo(LecturerRatingItem);
