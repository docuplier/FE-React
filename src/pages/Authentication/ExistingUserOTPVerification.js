import { memo, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Box, makeStyles, Paper, Typography, Grid } from '@material-ui/core';
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';
import { useForm } from 'react-hook-form';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';

import logoSvg from 'assets/svgs/dslmsLogo.jpeg';
import AuthLayout from 'Layout/AuthLayout';
import { colors, fontWeight } from '../../Css';
import AuthenticationMethodPanel, {
  AuthenticationMethod,
} from 'components/Authentication/ExistingUserOTPVerification/AuthenticationMethodPanel';
import LoadingButton from 'reusables/LoadingButton';
import OTPModal from 'components/Authentication/ExistingUserOTPVerification/OTPModal';
import {
  GET_EXISTING_USER,
  VERIFY_EXISTING_USER_TOKEN,
  VERIFY_USER_TOKEN,
} from 'graphql/queries/auth';
import { useNotification } from 'reusables/NotificationBanner';
import { FORGOT_PASSWORD, RESET_EXISTING_USER_PASSWORD } from 'graphql/mutations/auth';
import LoadingView from 'reusables/LoadingView';
import { PublicPaths } from 'routes';
import useSubdomain from 'hooks/useSubDomain';

const ExistingUserOTPVerification = () => {
  const classes = useStyles();
  const [authenticationMethod, setAuthenticationMethod] = useState(null);
  const [otpSentTo, setOtpSentTo] = useState(null);
  const [token, setToken] = useState(null);
  const { handleSubmit } = useForm();
  const history = useHistory();
  const notification = useNotification();
  const urlParams = new URLSearchParams(useLocation().search);
  const identifier = urlParams.get('identifier');
  const existing = urlParams.get('existingUser');
  const resetPassword = urlParams.get('resetPassword');
  const { domainObject } = useSubdomain();
  const institutionId = domainObject?.id;

  const { data: existingUserData, loading: isLoadingExistingUser } = useQuery(GET_EXISTING_USER, {
    variables: {
      accountType: existing ? 'MIGRATION' : 'USER',
      identifier,
      institutionId,
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
    onCompleted: ({ existingUser }) => {
      if (existingUser) {
        setAuthenticationMethod(
          existingUser.phone ? AuthenticationMethod.PHONE : AuthenticationMethod.EMAIL,
        );
      }
    },
  });
  const existingUser = existingUserData?.existingUser || {};

  const [forgotPassword, { loading }] = useMutation(FORGOT_PASSWORD, {
    onCompleted: (data) => {
      if (data?.forgotPassword?.ok) {
        notification.success({
          message: 'Forgot email sent!',
          description: 'Please check your mail',
        });
      }
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const [verifyOTPToken, { loading: isVerifyingOTPToken }] = useLazyQuery(
    VERIFY_EXISTING_USER_TOKEN,
    {
      onError: (error) => {
        notification.error({
          message: error?.message,
        });
      },
      onCompleted: ({ verifyExistingUserTokenOtp: { isValid, existingUser } }) => {
        if (isValid) {
          notification.success({
            message: 'OTP validated successfully',
          });
          history.push(
            `${PublicPaths.EXISTING_USER_PASSWORD_CREATION}?identifier=${identifier}&token=${token}&email=${existingUser?.email}&existing=true`,
          );
          return;
        }

        notification.error({
          message: 'OTP is not valid',
        });
      },
    },
  );

  const [verifyOTPTokenRegular, { loading: isVerifyingOTPTokenRegular }] = useLazyQuery(
    VERIFY_USER_TOKEN,
    {
      onError: (error) => {
        notification.error({
          message: error?.message,
        });
      },
      onCompleted: ({ verifyRegisterToken: { isValid } }) => {
        if (isValid) {
          notification.success({
            message: 'OTP validated successfully',
          });
          history.push(`${PublicPaths.RESET_PASSWORD}?identifier=${identifier}&token=${token}`);
          return;
        }

        notification.error({
          message: 'OTP is not valid',
        });
      },
    },
  );

  const [sendOTP, { loading: isSendingOTP }] = useMutation(RESET_EXISTING_USER_PASSWORD, {
    onCompleted: ({ existingUserResetPassword: { ok } }) => {
      if (ok) {
        notification.success({
          message: 'OTP sent',
        });
        return;
      }

      notification.error({
        message: 'Failed to send OTP',
      });
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const onSendVerificationCode = () => {
    if (!resetPassword) {
      sendOTP({
        variables: {
          existingUserEmail:
            authenticationMethod === AuthenticationMethod.EMAIL ? existingUser?.email : undefined,
          existingUserPhone:
            authenticationMethod === AuthenticationMethod.PHONE ? existingUser?.phone : undefined,
          existingUserId: existingUser?.id,
        },
      }).then((data) => {
        if (data?.data?.existingUserResetPassword?.ok) {
          setOtpSentTo(authenticationMethod);
        }
      });
    } else {
      forgotPassword({
        variables: {
          deliveryMode: authenticationMethod,
          identifier,
        },
      }).then((data) => {
        if (data?.data?.forgotPassword?.ok) {
          setOtpSentTo(authenticationMethod);
        }
      });
    }
  };

  const handleVerifyOTP = (token) => {
    setToken(token);
    if (!resetPassword) {
      verifyOTPToken({
        variables: {
          token,
        },
      });
    } else {
      verifyOTPTokenRegular({
        variables: {
          token,
        },
      });
    }
  };

  const renderMatricNumber = () => {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        component={Paper}
        elevation={0}
        py={4}
        mb={12}
        className={classes.matricNumber}>
        <Typography component="span" color="textPrimary" variant="body2">
          {identifier}
        </Typography>
        <Box ml={2}>
          <CheckCircleOutlineOutlinedIcon className="checkIcon" />
        </Box>
      </Box>
    );
  };

  const renderAuthenticationMethods = () => {
    return (
      <Box>
        <Grid container spacing={7}>
          <Grid item xs={12} sm={6} style={{ margin: 'auto' }}>
            <AuthenticationMethodPanel
              method={AuthenticationMethod.EMAIL}
              checked={authenticationMethod === AuthenticationMethod.EMAIL}
              value={existingUser?.maskedEmail}
              onClick={() => setAuthenticationMethod(AuthenticationMethod.EMAIL)}
            />
          </Grid>

          <Grid item xs={12} sm={6} style={{ display: resetPassword ? 'none' : 'block' }}>
            <AuthenticationMethodPanel
              method={AuthenticationMethod.PHONE}
              checked={authenticationMethod === AuthenticationMethod.PHONE}
              value={existingUser?.maskedPhone}
              onClick={() => setAuthenticationMethod(AuthenticationMethod.PHONE)}
            />
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderAuthenticationMethodFoundUI = () => {
    return (
      <>
        <Box mb={12}>{renderAuthenticationMethods()}</Box>
        <LoadingButton
          fullWidth
          color="primary"
          isLoading={isSendingOTP || loading}
          onClick={onSendVerificationCode}>
          Proceed
        </LoadingButton>
        <Box mt={12}>
          <Typography component="span" color="textSecondary" variant="body1">
            Can't access any of these?
            <Typography
              component="span"
              color="primary"
              variant="body1"
              style={{ marginLeft: 4, fontWeight: fontWeight.bold }}>
              Contact administrator
            </Typography>
          </Typography>
        </Box>
      </>
    );
  };

  const renderAuthenticationMethodNotFoundUI = () => {
    return (
      <Box component={Paper} p={12} style={{ border: `1px solid ${colors.primary}` }}>
        We couldn't find any authentication method for this user. Kindly visit the administrator
      </Box>
    );
  };

  return (
    <AuthLayout
      imageSrc={logoSvg}
      title={resetPassword ? 'Reset Password' : 'Setup your account'}
      description="Enter a means of verification to proceed">
      {renderMatricNumber()}
      <LoadingView isLoading={isLoadingExistingUser}>
        {!existingUser?.email && !existingUser?.phone
          ? renderAuthenticationMethodNotFoundUI()
          : renderAuthenticationMethodFoundUI()}
      </LoadingView>
      <OTPModal
        open={Boolean(otpSentTo)}
        onClose={() => setOtpSentTo(null)}
        otpSentTo={otpSentTo}
        resendVerificationCode={handleSubmit(onSendVerificationCode)}
        isResendingVerificationCode={isSendingOTP}
        verifyOTP={handleVerifyOTP}
        isVerifyingOTP={isVerifyingOTPToken || isVerifyingOTPTokenRegular}
      />
    </AuthLayout>
  );
};

const useStyles = makeStyles((theme) => ({
  matricNumber: {
    background: '#F6F7F7',
    border: `1px solid ${colors.seperator}`,
    '& .checkIcon': {
      color: colors.successBg,
      marginLeft: theme.spacing(2),
    },
  },
}));

export default memo(ExistingUserOTPVerification);
