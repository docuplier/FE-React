import React from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import PropTypes from 'prop-types';

const Carousel = ({ items, activeIndex, autoHeight, autoWidth, ...props }) => {
  const classes = useStyles();

  const renderPrevButton = () => {
    return (
      <IconButton classes={{ root: classes.btn }} style={{ left: 0 }}>
        <ChevronLeftIcon className={classes.icon} />
      </IconButton>
    );
  };

  const renderNextButton = () => {
    return (
      <IconButton classes={{ root: classes.btn }} style={{ right: 0 }}>
        <ChevronRightIcon className={classes.icon} />
      </IconButton>
    );
  };

  return (
    <AliceCarousel
      {...props}
      items={items}
      activeIndex={activeIndex}
      autoHeight={autoHeight}
      autoWidth={autoWidth}
      disableDotsControls={true}
      renderPrevButton={renderPrevButton}
      renderNextButton={renderNextButton}
      responsive={{
        0: {
          items: 1,
        },
        550: {
          items: 2,
        },
        720: {
          items: 3,
        },
        1024: {
          items: 4,
        },
      }}
    />
  );
};

const useStyles = makeStyles(() => ({
  btn: {
    top: 'calc(50% - 27px)',
    background: '#fff',
    border: 'solid rgba(0, 0,0,0.2) 2px',
    position: 'absolute',
    width: 50,
    height: 50,
    '&:hover': {
      color: '#fff',
      background: 'grey',
    },
  },
  icon: {
    fontSize: 30,
  },
}));

Carousel.propTypes = {
  items: PropTypes.array,
  activeIndex: PropTypes.number,
  autoHeight: PropTypes.bool,
  autoWidth: PropTypes.bool,
};

export default Carousel;
