import { Box, Button, Typography, makeStyles } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import { fontWeight } from '../../Css';
import FilterListIcon from '@material-ui/icons/FilterList';

const LineChartHeader = ({
  chartTitle,
  programName,
  onClickFilter,
  renderFilter,
  indicators,
  disabled,
  customFilterButton,
}) => {
  const classes = useStyles();

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" mb={8}>
      <Box>
        <Typography variant="h6" color="textPrimary" style={{ fontWeight: fontWeight.bold }}>
          {chartTitle}
          {programName && (
            <Typography component="span" variant="body1" color="textSecondary">
              / {programName}
            </Typography>
          )}
        </Typography>
      </Box>
      <Box display="flex" justifyContent="flex-start" alignItems="center">
        {indicators.map(({ label, color }, i) => (
          <Box display="flex" justifyContent="flex-start" alignItems="center" mr={8} key={i}>
            <Box width={14} height={14} bgcolor={color} mr={4} borderRadius={2}></Box>
            <Typography> {label}</Typography>
          </Box>
        ))}
        {renderFilter ? (
          <Button
            variant="outlined"
            onClick={onClickFilter}
            className={classes.dashedButton}
            disabled={disabled}>
            Filter <FilterListIcon />
          </Button>
        ) : (
          <Box mb={12}>{customFilterButton}</Box>
        )}
      </Box>
    </Box>
  );
};

const useStyles = makeStyles((theme) => ({
  dashedButton: {
    padding: 0,
    minHeight: 'max-content',
    border: 'none',
    borderRadius: 0,
    borderBottom: `1px dashed rgba(0, 0, 0, 0.23)`,
  },
}));

LineChartHeader.propTypes = {
  chartTitle: PropTypes.string,
  programName: PropTypes.string,
  onClickFilter: PropTypes.func,
  renderFilter: PropTypes.bool,
  customFilterButton: PropTypes.node,
  disabled: PropTypes.bool,
  indicators: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    }),
  ),
};
export default LineChartHeader;
