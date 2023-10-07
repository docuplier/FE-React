import React, { Fragment } from 'react';
import { Box, Typography, makeStyles } from '@material-ui/core';

import { colors, fontWeight } from '../../Css';

const UserDetails = ({ userDetails = [] }) => {
  const classes = useStyles();

  return (
    <Box mt={12} mb={12} className={classes.container}>
      {userDetails?.map(({ title, activeCount, inactiveCount, totalCount }, index) => (
        <Fragment key={index}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" className={classes.title}>
              {title}
            </Typography>
            <Typography variant="body2" className={classes.title}>
              {totalCount}
            </Typography>
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={4}
            mt={4}
            style={{ color: colors.grey }}>
            <Typography variant="caption">Active:</Typography>
            <Typography variant="caption">
              <strong>{activeCount}</strong>
            </Typography>
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={4}
            mt={4}
            style={{ color: colors.grey }}>
            <Typography variant="caption">Inactive:</Typography>
            <Typography variant="caption">
              <strong>{inactiveCount}</strong>
            </Typography>
          </Box>
        </Fragment>
      ))}
    </Box>
  );
};

const useStyles = makeStyles((theme) => ({
  title: {
    fontWeight: fontWeight.bold,
    color: colors.textAlternative,
  },
  container: {
    '&:last-child': {
      marginBottom: 0,
    },
  },
}));

export default UserDetails;
