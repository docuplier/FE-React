import { memo } from 'react';
import PropTypes from 'prop-types';
import { Box, Paper, makeStyles, Typography } from '@material-ui/core';
import ReactLinkPreview from '@ashwamegh/react-link-preview';
import classNames from 'classnames';
import TruncateText from 'reusables/TruncateText';

import LoadingView from './LoadingView';
import { borderRadius, colors } from '../Css';

const CustomComponent = ({ loading, preview, classes, customClasses }) => {
  return (
    <LoadingView isLoading={loading}>
      <Box
        component={Paper}
        elevation={0}
        display="flex"
        width="100%"
        boxSizing="border-box"
        className={classNames('customComponent', customClasses?.customComponent)}>
        <Box className={classNames(classes.imageContainer, customClasses?.imageContainer)}>
          <img
            alt={preview.title}
            src={preview.img}
            className={classNames('previewImage', customClasses?.image)}
          />
        </Box>
        <Box ml={8} p={4} pr={12} boxSizing="border-box">
          <Typography variant="body2" color="textPrimary">
            {preview.title}
          </Typography>
          <Box mt={2}>
            <TruncateText text={preview.description} lines={1} />
          </Box>
        </Box>
      </Box>
    </LoadingView>
  );
};

const LinkPreview = ({ url, classes: classesFromProps }) => {
  const classes = useStyles();

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={classNames(classes.container, classesFromProps?.container)}>
      <ReactLinkPreview
        url={url}
        render={(props) => (
          <CustomComponent {...props} classes={classes} customClasses={classesFromProps} />
        )}
      />
    </a>
  );
};

const useStyles = makeStyles({
  container: {
    display: 'block',
    width: '100%',
    textDecoration: 'none',
    '& .customComponent': {
      border: `1px solid ${colors.secondaryLightGrey}`,
    },
  },
  imageContainer: {
    width: 200,
    minWidth: 100,
    height: 96,
    background: colors.imageBackground,
    '& .previewImage': {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderTopLeftRadius: borderRadius.default,
      borderBottomLeftRadius: borderRadius.default,
    },
  },
});

LinkPreview.propTypes = {
  url: PropTypes.string.isRequired,
  classes: PropTypes.shape({
    container: PropTypes.string,
    customComponent: PropTypes.string,
    imageContainer: PropTypes.string,
    image: PropTypes.string,
  }),
};

export default memo(LinkPreview);
