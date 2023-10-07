import { borderRadius, fontWeight } from '../../Css';
import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@material-ui/core';
import Icon from 'assets/svgs/graduate.svg';

const CountCard = ({ count, label, icon = Icon, cardWidth, mode = 'dark' }) => {
  return (
    <div>
      <Box
        display="flex"
        justifyContent="flex-start"
        alignItems="center"
        p={12}
        width={cardWidth}
        bgcolor={mode === 'light' ? '#fff' : '#F1F2F6'}
        borderRadius={borderRadius.default}>
        <Box
          mr={4}
          bgcolor={mode === 'light' ? '#F1F2F6' : '#fff'}
          p={5}
          borderRadius={borderRadius.full}>
          <img src={icon} alt="icon" />
        </Box>
        <Box ml={4}>
          <Typography
            className="count"
            style={{ fontWeight: fontWeight.bold }}
            color="textSecondary"
            variant="h6">
            {count}
          </Typography>
          <Typography className="label" color="textSecondary" variant="body2">
            {label}
          </Typography>
        </Box>
      </Box>
    </div>
  );
};

CountCard.propTypes = {
  label: PropTypes.string,
  count: PropTypes.number,
  icon: PropTypes.node,
  cardWidth: PropTypes.number,
};

export default CountCard;
