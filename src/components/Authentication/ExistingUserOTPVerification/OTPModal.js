import { memo, useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Typography, Box, Dialog, TextField, Button } from '@material-ui/core';

import { fontWeight } from '../../../Css';
import LoadingButton from 'reusables/LoadingButton';
import LoadingView from 'reusables/LoadingView';
import { otpExpiryCountDownTimer } from 'utils/AuthenticationUtils';
import { useNotification } from 'reusables/NotificationBanner';
import { convertTimeSpentToDuration } from 'utils/TransformationUtils';

const OTPModal = ({
  onClose,
  open,
  otpSentTo,
  resendVerificationCode,
  isResendingVerificationCode,
  verifyOTP,
  isVerifyingOTP,
}) => {
  const [otp, setOtp] = useState({});
  const [otpExpiresIn, setOtpExpiresIn] = useState(0);
  const notification = useNotification();
  const tokenInputRefs = useRef({});

  useEffect(() => {
    let intervalRef = otpExpiryCountDownTimer(computeExpiryTimeForOtp);

    return () => {
      clearInterval(intervalRef);
    };
  }, [open]);

  const computeExpiryTimeForOtp = ({ expiresIn }) => {
    setOtpExpiresIn(expiresIn);
  };

  const handleChangeOTP = (changeset) => {
    setOtp((prevState) => ({ ...prevState, ...changeset }));
  };

  const handleKeyDown = (index) => (evt) => {
    if (evt.target.value.length > 0) {
      tokenInputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmitOTP = () => {
    const otpString = Object.values(otp).join('');
    if (otpString.length !== 6) {
      notification.error({
        message: 'Invalid token',
      });
      return;
    }

    verifyOTP(otpString);
  };

  const renderOTPUI = () => {
    let boxSlots = Array.apply(null, Array(6));

    return (
      <Box my={12} display="flex" flexDirection="column" alignItems="center">
        <Box display="flex">
          {boxSlots.map((v, index) => (
            <Box ml={2}>
              <TextField
                variant="outlined"
                name={`otp-number-${index + 1}`}
                style={{ width: 48 }}
                autoFocus={index === 0 && true}
                inputRef={(element) => (tokenInputRefs.current[index] = element)}
                onChange={(evt) => handleChangeOTP({ [index]: evt.target.value })}
                onKeyUp={handleKeyDown(index)}
              />
            </Box>
          ))}
        </Box>
        <Box display="flex" alignItems="center" mt={8}>
          <Typography variant="body1" color="textSecondary">
            OTP expires in {convertTimeSpentToDuration(otpExpiresIn)}
          </Typography>
          <Button
            style={{ minHeight: 'auto' }}
            variant="text"
            color="primary"
            onClick={resendVerificationCode}>
            Resend
          </Button>
        </Box>
      </Box>
    );
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <LoadingView isLoading={isResendingVerificationCode}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography variant="h6" color="textPrimary">
            Enter OTP
          </Typography>
          <Box mt={2}>
            <Typography component="span" variant="body1" color="textSecondary">
              An OTP has been sent to
              <Typography
                variant="body1"
                component="span"
                color="textSecondary"
                style={{ fontWeight: fontWeight.bold }}>
                {' '}
                {otpSentTo}
              </Typography>
            </Typography>
          </Box>
          {renderOTPUI()}
        </Box>
        <LoadingButton
          fullWidth
          color="primary"
          isLoading={isVerifyingOTP}
          onClick={handleSubmitOTP}>
          Authorize
        </LoadingButton>
      </LoadingView>
    </Dialog>
  );
};

OTPModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  otpSentTo: PropTypes.string.isRequired,
  resendVerificationCode: PropTypes.func.isRequired,
  isResendingVerificationCode: PropTypes.bool,
  verifyOTP: PropTypes.func,
  isVerifyingOTP: PropTypes.bool,
};

export default memo(OTPModal);
