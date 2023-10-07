import { makeStyles } from '@material-ui/styles';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { borderRadius, colors, fontSizes, spaces } from '../../../Css';
import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Box } from '@material-ui/core';
import { format } from 'date-fns';

const WorkBenchAndSumaryCard = ({ body = '', date = '', onDelete, disabled, onClick }) => {
  const classes = useStyles();

  return (
    <Box className={classes.container} display="flex" justifyContent="space-between">
      <Box onClick={onClick}>
        <Typography className={classes.desc} color="textPrimary">
          {body}
        </Typography>
        <Typography color="textSecondary" variant="subtitle2">
          {format(new Date(date), "'@' hh:mm aaa '/' MMM dd, yyyy")}
        </Typography>
      </Box>
      <Box>
        <button
          type="button"
          onClick={onDelete}
          disabled={disabled}
          style={{ background: 'none', border: 'none' }}>
          <DeleteForeverIcon className={classes.icon} />
        </button>
      </Box>
    </Box>
  );
};

WorkBenchAndSumaryCard.propTypes = {
  body: PropTypes.string,
  date: PropTypes.string,
  onDelete: PropTypes.func,
  disabled: PropTypes.bool,
};

const useStyles = makeStyles(() => ({
  container: {
    background: '#F1F2F6',
    borderRadius: borderRadius.default,
    padding: '8px 16px',
    cursor: 'pointer',
  },
  icon: {
    color: colors.grey,
    width: 24,
    height: 24,
    borderRadius: '100%',
    background: colors.white,
    cursor: 'pointer',
    padding: 4,
  },
  desc: {
    fontSize: fontSizes.medium,
    paddingBottom: 4,
    paddingRight: spaces.small,
  },
}));
export default WorkBenchAndSumaryCard;
