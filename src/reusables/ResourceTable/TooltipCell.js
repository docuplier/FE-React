import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from '@material-ui/core';

const TooltipCell = ({ disabled, children, ...rest }) => {
  return disabled ? (
    children
  ) : (
    <Tooltip {...rest}>
      <span>{children}</span>
    </Tooltip>
  );
};

TooltipCell.propTypes = {
  ...Tooltip.propTypes,
  disabled: PropTypes.bool,
};

export default React.memo(TooltipCell);
