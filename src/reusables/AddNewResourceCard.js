import React from 'react';
import PropTypes from 'prop-types';
import { Paper, Typography, makeStyles, Box, Button } from '@material-ui/core';
import { Add } from '@material-ui/icons';

import { colors } from '../Css';

const AddNewResourceCard = ({ onClick, title }) => {
  const classes = useStyles();

  return (
    <Button className={classes.container} onClick={onClick}>
      <Paper elevation={0} className="paper">
        <Box
          display="flex"
          flexDirection="column"
          width="100%"
          height="100%"
          minHeight={100}
          justifyContent="center"
          alignItems="center">
          <Add />
          <Typography color="textSecondary" variant="body1">
            {title}
          </Typography>
        </Box>
      </Paper>
    </Button>
  );
};

const useStyles = makeStyles({
  container: {
    padding: 0,
    width: '100%',
    height: '100%',
    '& .paper': {
      height: '100%',
      width: '100%',
      border: `1px solid ${colors.secondaryLightGrey}`,
    },
    '& .MuiButton-label': {
      height: '100%',
    },
  },
});

AddNewResourceCard.propTypes = {
  onClick: PropTypes.func,
  title: PropTypes.string.isRequired,
};

export default React.memo(AddNewResourceCard);
