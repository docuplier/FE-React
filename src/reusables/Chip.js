import { Chip as MuiChip, makeStyles } from '@material-ui/core';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { colors } from '../Css';

/**
 *  This is based on Material UI Chip component with some modification
 *  @see https://material-ui.com/components/chips/
 *  This Chip extends the color prop of the MUI chip to allow 'active' and 'inactive' mode colors to be set
 *  The Chip also has additional 'size' and 'background' props which can either take 'sm', 'md', 'lg' to modify the height and border-radius of the chip respectively
 */
const Chip = (props) => {
  const { size, roundness, className, color, variant = 'default' } = props;
  const getChipSize = () => {
    switch (size) {
      case 'sm':
        return 17;
      case 'md':
        return 19;
      case 'lg':
        return 24;
      default:
        return 27;
    }
  };
  const getBorderRadius = () => {
    switch (roundness) {
      case 'sm':
        return 2;
      case 'md':
        return 8;
      case 'lg':
        return 16;
      default:
        return 16;
    }
  };

  const classes = useStyles({ getBorderRadius, getChipSize });
  return (
    <MuiChip
      {...props}
      classes={{
        root: classNames(classes.chip, className, {
          [classes.activeOutlined]: color === 'active' && variant === 'outlined',
          [classes.inactiveOutlined]: color === 'inactive' && variant === 'outlined',
          [classes.activeDefault]: color === 'active' && variant === 'default',
          [classes.inactiveDefault]: color === 'inactive' && variant === 'default',
        }),
      }}
    />
  );
};

Chip.propTypes = {
  ...MuiChip.propTypes,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  roundness: PropTypes.oneOf(['sm', 'md', 'lg']),
  color: PropTypes.oneOf(['primary', 'secondary', 'active', 'inactive']),
};

export default Chip;

const useStyles = makeStyles(() => ({
  chip: {
    borderRadius: (props) => props.getBorderRadius(),
    height: (props) => props.getChipSize(),
    '&.MuiChip-colorPrimary': {
      color: colors.primary,
      background: colors.imageBackground,
    },
    '&.MuiChip-outlinedPrimary.MuiChip-colorPrimary': {
      background: colors.white,
    },
  },
  inactiveOutlined: {
    background: '#FFFFFF',
    color: '#DA1414',
    borderColor: '#DA1414',
  },
  activeOutlined: {
    background: '#FFFFFF',
    color: '#287D3C',
    borderColor: '#287D3C',
  },
  inactiveDefault: {
    background: '#FEEFEF',
    color: '#DA1414',
  },
  activeDefault: {
    background: '#EDF9F0',
    color: '#287D3C',
  },
}));
