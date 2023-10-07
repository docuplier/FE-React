import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ReactComponent as EmptySearchResults } from 'assets/svgs/EmptySearchResults.svg';
import PropTypes from 'prop-types';
import React from 'react';
import { colors, fontSizes, fontWeight, spaces } from '../Css';

const Empty = ({ title, description, children, icon = <EmptySearchResults />, iconClassName }) => {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <div className={iconClassName}>{icon}</div>
      <div className={classes.container}>
        {title && <Typography className="header">{title}</Typography>}
        {description && <Typography className="description">{description}</Typography>}
      </div>
      {children && (
        <div style={{ marginTop: spaces.medium, marginBottom: spaces.medium }}>{children}</div>
      )}
    </div>
  );
};

Empty.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  icon: PropTypes.node,
  iconClassName: PropTypes.string,
};

export default Empty;

const useStyles = makeStyles(() => ({
  wrapper: {
    overflowX: 'hidden',
    textAlign: 'center',
    display: 'grid',
    placeItems: 'center',
    marginTop: 50,
  },
  container: {
    '& .header': {
      fontWeight: fontWeight.bold,
      fontSize: fontSizes.xxlarge,
      color: colors.dark,
      paddingTop: spaces.medium,
    },
    '& .description': {
      fontWeight: fontWeight.regular,
      fontSize: fontSizes.large,
      color: colors.grey,
      width: 350,
    },
  },
}));
