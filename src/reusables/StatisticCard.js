import React from 'react';
import PropTypes from 'prop-types';
import { Paper, Box, makeStyles, Typography, Divider } from '@material-ui/core';
import classNames from 'classnames';

import { colors, fontWeight } from '../Css';
import defaultInstitutionImage from 'assets/svgs/default_institution.svg';

const StatisticCard = ({
  title,
  description,
  data,
  imageSrc,
  defaultImageSrc = defaultInstitutionImage,
  hideImage,
}) => {
  const classes = useStyles();

  const renderData = () => {
    return (
      <Box display="flex">
        {data?.map((item, index) => {
          const divider =
            index !== data.length - 1 ? (
              <Box mr={4} ml={4}>
                <Divider orientation="vertical" classes={{ root: classes.divider }} />
              </Box>
            ) : null;

          return (
            <React.Fragment key={index}>
              <Typography
                color="textSecondary"
                className={classNames(classes.dataLabel, item.color)}>
                {item.label}
              </Typography>
              {divider}
            </React.Fragment>
          );
        })}
      </Box>
    );
  };

  return (
    <Paper>
      <Box p={8} display="flex">
        {!hideImage && (
          <Box
            display="flex"
            mr={8}
            justifyContent="center"
            alignItems="center"
            className={classes.avatarContainer}>
            <img src={imageSrc || defaultImageSrc} alt="stat avatar" />
          </Box>
        )}
        <Box>
          <Typography color="textSecondary" variant="body2" className={classes.boldText}>
            {title}
          </Typography>
          <Box mt={3} mb={3}>
            <Typography color="textPrimary" variant="h6" className={classes.boldText}>
              {description || 0}
            </Typography>
          </Box>
          {renderData()}
        </Box>
      </Box>
    </Paper>
  );
};

const useStyles = makeStyles((theme) => ({
  avatarContainer: {
    background: colors.lightBlue,
    width: 48,
    height: 48,
    borderRadius: '50%',
    '& > img': {
      width: '50%',
      height: '50%',
    },
  },
  boldText: {
    fontWeight: fontWeight.medium,
  },
  dataLabel: {
    textTransform: 'capitalize',
    '&.success': {
      color: colors.textSuccess,
    },
    '&.error': {
      color: colors.textError,
    },
    '&.draft': {
      color: '#878484',
    },
  },
  divider: {
    width: 2,
    backgroundColor: colors.dark,
  },
}));

StatisticCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.node.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      color: PropTypes.oneOf(['success', 'error']),
    }),
  ),
  imageSrc: PropTypes.string,
  defaultImageSrc: PropTypes.string,
  hideImage: PropTypes.bool,
};

export default React.memo(StatisticCard);
