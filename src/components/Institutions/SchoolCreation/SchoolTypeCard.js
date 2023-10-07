import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { CheckCircleOutline } from '@material-ui/icons';
import { Box, makeStyles, Typography, Button } from '@material-ui/core';

import { spaces, fontSizes, colors } from '../../../Css';
import { ReactComponent as BuildingActive } from 'assets/svgs/buildings-color.svg';
import { ReactComponent as Building } from 'assets/svgs/buildings.svg';

function SchoolTypeCard(props) {
  const { label, value, schoolType, onSelect } = props;
  const classes = useStyles();
  return (
    <Button
      key={label}
      variant="outlined"
      position="relative"
      className={classNames(classes.schoolButton, {
        [classes.selected]: schoolType === value,
        [classes.notSelected]: schoolType !== value,
      })}
      name="type"
      value={schoolType}
      onClick={onSelect}>
      <Box>
        <Box textAlign="center">
          {schoolType === value ? (
            <BuildingActive textAlign="center" />
          ) : (
            <Building textAlign="center" />
          )}

          <Typography className={classes.schoolName}>{label}</Typography>
        </Box>
        <CheckCircleOutline className={classes.circle} />
      </Box>
    </Button>
  );
}

SchoolTypeCard.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  choolType: PropTypes.string,
  onRemove: PropTypes.func,
};

const useStyles = makeStyles(() => ({
  circle: {
    fontSize: fontSizes.xlarge,
    marginLeft: spaces.small,
    position: 'absolute',
    top: 5,
    right: 5,
  },
  schoolButton: {
    borderRadius: 4,
    height: '100%',
    width: '100%',
  },
  selected: {
    color: colors.primary,
    border: `1px solid ${colors.primary}`,
  },
  notSelected: {
    color: colors.grey,
  },
  schoolName: {
    fontSize: fontSizes.large,
    fontWeight: 800,
  },
}));

export default SchoolTypeCard;
