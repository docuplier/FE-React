import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Paper, Avatar, Typography, Box, makeStyles } from '@material-ui/core';
import classNames from 'classnames';

import Chip from './Chip';
import { ReactComponent as Line } from 'assets/svgs/Line.svg';
import defaultImage from 'assets/svgs/defaultImage.svg';
import { colors, fontSizes, fontWeight } from '../Css';
import { getNameInitials } from 'utils/UserUtils';
import TruncateText from 'reusables/TruncateText';

const BasicResourceCard = ({
  imageSrc,
  defaultImageSrc = defaultImage,
  disabled,
  onClick,
  statusChip,
  description = '---',
  title = '---',
  caption,
  metaList,
  creator,
  path,
  style,
}) => {
  const classes = useStyles({ disabled });

  const renderImage = () => {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        mb={8}
        className={classes.avatarContainer}>
        <img src={imageSrc || defaultImageSrc} alt="avatar" />
      </Box>
    );
  };

  const renderDetails = () => {
    return (
      <Box className={classes.detailsContainer}>
        <TruncateText
          className="title"
          text={title}
          fontSize="body1.fontSize"
          color="text.primary"
        />
        <TruncateText
          mt={4}
          className="description"
          text={description}
          fontSize="body2.fontSize"
          color="text.secondary"
        />
        {caption && (
          <Typography component="span" className="caption" color="textSecondary" variant="body1">
            {caption.count}
            <Typography component="span">{caption.label}</Typography>
          </Typography>
        )}
      </Box>
    );
  };

  const renderMetaList = () => {
    return (
      <Box display="flex" alignItems="center" mt={8} className={classes.metaListContainer}>
        {metaList?.map((meta, index) => {
          const seperator =
            index !== metaList?.length - 1 ? (
              <Box mr={8} ml={8}>
                <Line />
              </Box>
            ) : null;

          return (
            <React.Fragment key={index}>
              <Box>
                <Typography variant="body2" color="inherit">
                  {meta.label}
                </Typography>
                <Box display="flex" alignItems="center" mt={2}>
                  {meta.count}
                </Box>
              </Box>
              {seperator}
            </React.Fragment>
          );
        })}
      </Box>
    );
  };

  const renderFooter = () => {
    return (
      <Box display="flex" alignItems="center" mt={8}>
        <Avatar src={creator.imageSrc} className={classes.smallAvatar}>
          {getNameInitials(...creator?.name?.split(' '))}
        </Avatar>
        <Box mr={4} ml={4}>
          <Typography variant="body2" color="textSecondary">
            {creator.name}
          </Typography>
        </Box>
        <Chip {...creator.chip} />
      </Box>
    );
  };

  return (
    <Link to={path} className={classes.link}>
      <Paper
        className={classNames(classes.paperContainer, {
          disabled: disabled,
        })}
        onClick={onClick}
        style={style}>
        {statusChip && (
          <Box mb={8}>
            <Chip {...statusChip} />
          </Box>
        )}
        {imageSrc !== undefined && renderImage()}
        {renderDetails()}
        {metaList && renderMetaList()}
        {creator && renderFooter()}
      </Paper>
    </Link>
  );
};

BasicResourceCard.propTypes = {
  imageSrc: PropTypes.string,
  defaultImageSrc: PropTypes.string,
  disabled: PropTypes.bool,
  statusChip: PropTypes.shape({
    ...Chip.propTypes,
  }),
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  caption: PropTypes.shape({
    label: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
  }),
  onClick: PropTypes.func,
  metaList: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      count: PropTypes.number,
    }),
  ),
  creator: PropTypes.shape({
    name: PropTypes.string.isRequired,
    imageSrc: PropTypes.string,
    chip: PropTypes.shape({
      ...Chip.propTypes,
    }),
  }),
  path: PropTypes.string,
};

const useStyles = makeStyles((theme) => ({
  link: {
    display: 'block',
    textDecoration: 'none',
    height: '100%',
    boxSizing: 'border-box',
  },
  paperContainer: {
    minWidth: 1,
    padding: theme.spacing(12),
    transition: 'all .5s',
    height: '100%',
    boxSizing: 'border-box',
    '&.disabled': {
      background: colors.disabled,
    },
    '&:hover': {
      transform: 'scale(1.01)',
    },
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: '50%',
    background: colors.imageBackground,
    '& > img': {
      width: '50%',
      height: '50%',
    },
  },
  detailsContainer: {
    '& .title': {
      fontWeight: fontWeight.bold,
      minHeight: 38,
    },
    '& .description': {
      minHeight: 38,
    },
    '& .caption': {
      fontWeight: fontWeight.bold,
      '&>span:first-child': {
        fontWeight: fontWeight.regular,
        marginLeft: theme.spacing(4),
      },
    },
  },
  smallAvatar: {
    width: 24,
    height: 24,
    maxWidth: 24,
    maxHeight: 24,
    boxSizing: 'border-box',
    fontSize: fontSizes.xsmall,
    background: '#F48989',
  },
}));

export default React.memo(BasicResourceCard);
