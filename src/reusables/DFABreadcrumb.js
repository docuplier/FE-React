import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '@material-ui/core';
import { NavigateNext as NavigateNextIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import Proptypes from 'prop-types';

import { fontFamily, fontWeight, fontSizes } from '../Css';

const DFABreadcrumb = ({ links, breadCrumbProps }) => {
  const classes = useStyles();

  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      separator={
        <NavigateNextIcon fontSize="small" className={classes.icon} {...breadCrumbProps} />
      }
    >
      {links.map((link) => (
        <Link className={classes.link} {...breadCrumbProps} to={link.to} color="inherit">
          {link.title}
        </Link>
      ))}
    </Breadcrumbs>
  );
};

DFABreadcrumb.propTypes = {
  links: Proptypes.arrayOf(
    Proptypes.shape({
      title: Proptypes.string,
      to: Proptypes.string,
    }),
  ),
};

DFABreadcrumb.defaultProps = {
  links: [{ title: 'Home', to: '/' }],
};

const useStyles = makeStyles(() => ({
  link: {
    fontFamily: fontFamily.primary,
    fontWeight: fontWeight.normal,
    fontSize: fontSizes.medium,
    color: '#ffffff',
    cursor: 'pointer',
    textDecoration: 'none',
  },
  icon: {
    color: 'white',
  },
}));

export default DFABreadcrumb;
