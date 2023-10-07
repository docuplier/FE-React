import { Box, Dialog, Typography, DialogContentText, DialogContent } from '@material-ui/core';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { fontWeight, fontSizes } from '../Css';
import SuccessGIF from 'assets/gif/action-success.gif';

const HelpMessageSuccessModal = ({ visible, onClose }) => {
  const classes = useStyles();
  return (
    <div>
      <Dialog
        open={visible}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Box textAlign="center" className={classes.wrapper}>
              <Box mt={18} mb={22}>
                <img src={SuccessGIF} alt="loading..." height="300px" width="300px" />
              </Box>
              <Typography className="header" color="textPrimary">
                Message sent successfully
              </Typography>
              <Typography className="desc" color="textSecondary">
                Thank you for reaching out. We will get back to you in less than 24hrs
              </Typography>
            </Box>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const useStyles = makeStyles(() => ({
  wrapper: {
    '& .header': {
      fontWeight: fontWeight.medium,
      fontSize: fontSizes.xxlarge,
      paddingBottom: 16,
    },
    '& .desc': {
      fontSize: fontSizes.large,
    },
  },
}));
export default HelpMessageSuccessModal;
