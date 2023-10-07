import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { InputBase, Paper } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import PropTypes from 'prop-types';

import { colors } from '../Css';

export default function SearchBox({ handleChange, value }) {
  const classes = useStyles();

  return (
    <Paper component="form" className={classes.root}>
      <SearchIcon className={classes.iconButton} />
      <InputBase
        className={classes.input}
        placeholder="Search"
        inputProps={{ 'aria-label': 'search' }}
        onChange={handleChange}
        value={value}
      />
    </Paper>
  );
}

SearchBox.propTypes = {
  handleChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    minWidth: '400px',
    background: '#F6F7F7',
    border: '1px solid #CDCED9',
    borderRadius: '8px',
    boxShadow: 'none',
  },
  input: {
    flex: 1,
  },
  iconButton: {
    padding: 10,
    color: colors.grey,
  },
}));
