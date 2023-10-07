import { Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { ReactComponent as ActiveCheckmark } from 'assets/svgs/active-checkmark.svg';
import { ReactComponent as InactiveCheckmark } from 'assets/svgs/inactive-checkmark.svg';
import PropTypes from 'prop-types';
import React from 'react';

const PasswordCriteria = ({ password = '' }) => {
  const classes = useStyles();

  const getValidators = () => {
    return [
      { text: 'Uppercase', isValid: /[A-Z]+/.test(password) },
      { text: 'Lowercase', isValid: /[a-z]+/.test(password) },
      { text: '8 or more characters', isValid: /.{8,}/.test(password) },
      { text: 'At least 1 number', isValid: /[0-9]+/.test(password) },
      // { text: 'Special character', isValid: /[@$!%*?&.#_-]+/.test(password) },
    ];
  };

  return (
    <Grid
      className={classes.section}
      container
      direction="row"
      justify="space-between"
      alignItems="center"
      whiteSpace="no-wrap">
      {getValidators().map((validator, index) => (
        <div key={index} className={classes.password}>
          <Typography color="textPrimary" variant="p" className={classes.password}>
            {validator.text}
          </Typography>
          <span style={{ display: 'flex' }}>
            {validator.isValid ? <ActiveCheckmark /> : <InactiveCheckmark />}
          </span>
        </div>
      ))}
    </Grid>
  );
};

const useStyles = makeStyles((theme) => ({
  section: {
    fontSize: '0.9rem',
  },
  password: {
    display: 'flex',
    alignItems: 'center',
    '&  > :first-child': {
      marginRight: 2.5,
    },
  },
}));

PasswordCriteria.propTypes = {
  password: PropTypes.string.isRequired,
};

export default React.memo(PasswordCriteria);
