import React from 'react';
import PropTypes from 'prop-types';
import { Box, Paper, Typography, makeStyles, Grid } from '@material-ui/core';

import { fontWeight, colors } from '../../Css';

const FacultyStats = ({ totalCount, activeCount, inactiveCount }) => {
  const classes = useStyles();
  const data = [
    { name: 'Total', count: totalCount, justify: 'flex-start' },
    { name: 'Active', count: activeCount, justify: 'center' },
    { name: 'Inactive', count: inactiveCount, justify: 'flex-end' },
  ];

  const renderStatistics = () => {
    return (
      <Box mt={8} p={8} className={classes.statBox}>
        <Grid container>
          {data.map((item, index) => (
            <Grid item xs={4} key={index}>
              <Box
                display="flex"
                height="100%"
                justifyContent={item.justify}
                className={index !== data.length - 1 && classes.grayBorder}>
                <Box>
                  <Typography color="textPrimary" variant="h6" className={classes.boldText}>
                    {item.count}
                  </Typography>
                  <Box mt={2}>
                    <Typography color="textSecondary" variant="body2">
                      {item.name}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  return (
    <Paper>
      <Box p={8}>
        <Typography variant="body1" color="textPrimary" className={classes.boldText}>
          Faculty
        </Typography>
        {renderStatistics()}
      </Box>
    </Paper>
  );
};

const useStyles = makeStyles({
  boldText: {
    fontWeight: fontWeight.bold,
  },
  statBox: {
    backgroundColor: '#F7F8F9',
  },
  grayBorder: {
    borderRight: `1px solid ${colors.seperator}`,
  },
});

FacultyStats.propTypes = {
  totalCount: PropTypes.number.isRequired,
  activeCount: PropTypes.number.isRequired,
  inactiveCount: PropTypes.number.isRequired,
};

export default React.memo(FacultyStats);
