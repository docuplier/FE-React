import React from 'react';
import PropTypes from 'prop-types';
import { Box, Paper } from '@material-ui/core';

import { colors } from '../Css';

const InstitutionRegistrationCard = ({ topComponent, bottomComponent }) => {
  return (
    <Box
      component={Paper}
      p={8}
      height="auto"
      boxSizing="border-box"
      border={`1px solid ${colors.secondaryLightGrey}`}
      elevation={1}>
      <Box>{topComponent}</Box>
      <Box mt={9}>{bottomComponent}</Box>
    </Box>
  );
};

InstitutionRegistrationCard.propTypes = {
  topComponent: PropTypes.node,
  bottomComponent: PropTypes.node,
};

export default InstitutionRegistrationCard;
