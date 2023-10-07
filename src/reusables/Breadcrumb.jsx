import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '@material-ui/core';
import { NavigateNext as NavigateNextIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import Proptypes from 'prop-types';

import { fontFamily, fontWeight, fontSizes } from '../Css';

const Breadcrumb = ({ links }) => {
  const classes = useStyles();
  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextIcon fontSize="small" className={classes.icon} />}
    >
      {links.map((link) => (
        <Link className={classes.link} to={link.to} color="inherit">
          {link.title}
        </Link>
      ))}
    </Breadcrumbs>
  );
};

Breadcrumb.propTypes = {
  links: Proptypes.arrayOf(
    Proptypes.shape({
      title: Proptypes.string,
      to: Proptypes.string,
    }),
  ),
};

Breadcrumb.defaultProps = {
  links: [{ title: 'Home', to: '/' }],
};

const useStyles = makeStyles(() => ({
  link: {
    fontFamily: fontFamily.primary,
    fontWeight: fontWeight.normal,
    fontSize: fontSizes.medium,
    color: '#00B0ED',
    cursor: 'pointer',
    textDecoration: 'none',
  },
  icon: {
    color: '#00B0ED',
  },
}));

export default Breadcrumb;
