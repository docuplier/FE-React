import { CircularProgress, makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

/**
 *
 * @component
 * LoadingView manages the loading view around the app. This can be used as a wrapper
 * for providing loading across the app and pages
 */
const LoadingView = ({ children, isLoading, size }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.childContainer}>{children}</div>
      {isLoading && (
        <div>
          <div className={classes.overlay}>
            <div>
              <CircularProgress color="primary" value={size || 50} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const useStyles = makeStyles({
  container: {
    position: 'relative',
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    background: 'rgba(255,255,255,0.4)',
    zIndex: 4,
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
    '& > div:first-child': {
      position: 'absolute',
      top: '50%',
      left: '50%',
      margin: -10,
    },
  },
  childContainer: {
    position: 'relative',
  },
});

LoadingView.propTypes = {
  children: PropTypes.node,
  isLoading: PropTypes.bool,
  size: PropTypes.number,
};

export default React.memo(LoadingView);
