import React from 'react';
import PropTypes from 'prop-types';

import { Box, Grid, Typography, makeStyles } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import LoadingButton from 'reusables/LoadingButton';
import { colors, fontSizes, fontWeight } from '../../../Css';
import { EnrolmentStatus } from 'utils/constants';

function ParticipationModal(props) {
  const { onClose, open, onSelect, loading } = props;
  const classes = useStyles();

  return (
    <Dialog
      aria-labelledby="simple-dialog-title"
      onClose={onClose}
      open={open}
      className={classes.Dialog}>
      <DialogTitle id="simple-dialog-title">Select how you want to participate</DialogTitle>

      <Grid container spacing={10}>
        <Grid item xs={12} sm={6}>
          <Box className="grid-item">
            <Typography>
              Auditing a course will give you access to consume the course content but you can’t
              access assignments and assessments
            </Typography>
            <LoadingButton
              className="action-button"
              variant="contained"
              onClick={() => onSelect(EnrolmentStatus.AUDIT)}
              disabled={loading}>
              Audit
            </LoadingButton>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box className="grid-item">
            <Typography>
              Enroll for courses as part of the required courses for the semester
            </Typography>
            <LoadingButton
              className="action-button"
              color="primary"
              onClick={() => onSelect(EnrolmentStatus.ENROL)}
              disabled={loading}>
              Enroll
            </LoadingButton>
          </Box>
        </Grid>
      </Grid>
    </Dialog>
  );
}

ParticipationModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
const useStyles = makeStyles(() => ({
  Dialog: {
    textAlign: 'center',
    padding: '40px 30px',
    borderRadius: 0,

    '& #simple-dialog-title': {
      marginBottom: 24,
      fontSize: fontSizes.xlarge,
      fontWeight: fontWeight.bold,
      color: colors.secondaryBlack,
    },
    '& .grid-item': {
      padding: 16,
      borderRadius: 4,
      border: `1px solid ${colors.secondaryLightGrey}`,
      textAlign: 'center',
    },
    '& .action-button': {
      marginTop: 24,
      width: '100%',
    },
  },
}));

export default ParticipationModal;
