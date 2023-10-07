import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import classNames from 'classnames';

/*
 * This reusable applies a max-width of 1128px on whatever element you wrap it with.
 * It also allows you to specify spacing as either sm, md or lg to apply a padding to the top and bottom of the container
 * You can specify your own styling by passing in a class name to the className prop
 */
function MaxWidthContainer(props) {
  const { spacing, className, children } = props;
  const getVerticalPadding = () => {
    switch (spacing) {
      case 'sm':
        return '16px';
      case 'md':
        return '24px';
      case 'lg':
        return '40px';
      default:
        return '0px';
    }
  };
  const classes = useStyles({ getVerticalPadding });

  return <Box className={classNames(classes.container, className)}>{children}</Box>;
}

const useStyles = makeStyles((theme) => ({
  container: (props) => ({
    height: 'auto',
    margin: 'auto',
    padding: `${props.getVerticalPadding()} 24px`,
    [theme.breakpoints.up('sm')]: {
      padding: `${props.getVerticalPadding()} 40px`,
    },
    [theme.breakpoints.up('lg')]: {
      padding: `${props.getVerticalPadding()} 0px`,
      maxWidth: 1128,
    },
  }),
}));

MaxWidthContainer.propTypes = {
  spacing: PropTypes.oneOfType(['sm', 'md', 'lg']),
  className: PropTypes.string,
  children: PropTypes.element,
};

export default MaxWidthContainer;
