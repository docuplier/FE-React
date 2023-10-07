import { Box, Typography, Drawer as MuiDrawer, makeStyles } from '@material-ui/core';
import { CancelOutlined } from '@material-ui/icons';
import { fontWeight } from '../../../Css';
import React from 'react';

const Drawer = ({ open, onClose, title, children, hasBorder = true }) => {
  const classes = useStyles({ hasBorder });

  return (
    <MuiDrawer
      open={open}
      onClose={onClose}
      anchor="right"
      aria-labelledby="modal-title"
      aria-describedby="modal-description">
      <Box className={classes.dialog}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          pb={12}
          className={classes.header}>
          <Typography color="textSecondary" variant="body1" className={classes.headerText}>
            {title}
          </Typography>
          <CancelOutlined style={{ cursor: 'pointer' }} onClick={onClose} />
        </Box>
        <Box className={classes.content}>{children}</Box>
      </Box>
    </MuiDrawer>
  );
};

const useStyles = makeStyles((theme) => ({
  header: {
    boxShadow: (props) => (props.hasBorder ? 'inset 0px -1px 0px #E7E7ED' : 'none'),
    padding: theme.spacing(12),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(8),
    },
  },
  headerText: {
    fontWeight: fontWeight.bold,
    color: '#111C55',
  },
  dialog: {
    maxWidth: 400,
    [theme.breakpoints.down('xs')]: {
      maxWidth: '95vw',
    },
  },
  content: {
    padding: '12px 24px',
    [theme.breakpoints.down('xs')]: {
      padding: '12px 16px',
    },
  },
}));

export default Drawer;
