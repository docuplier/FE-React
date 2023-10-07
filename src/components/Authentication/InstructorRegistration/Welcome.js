import { Box, TextField, Typography, Grid, InputAdornment, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import PasswordCriteria from 'reusables/PasswordCriteria';

import { fontWeight, fontSizes, fontFamily, colors, spaces, borderRadius } from '../../../Css';
import { ReactComponent as AngleRight } from 'assets/svgs/angle-right.svg';
import LoadingButton from 'reusables/LoadingButton';
import { useNotification } from 'reusables/NotificationBanner';
import LoadingView from 'reusables/LoadingView';
import { getFormError } from 'utils/formError';
import { RESET_PASSWORD, LOGIN_USER } from 'graphql/mutations/auth';
import { VERIFY_REG_TOKEN_QUERY } from 'graphql/queries/instructorsReg';
import { setAuthToken } from 'utils/Auth';
import { LOGGED_IN_USER_QUERY } from 'graphql/queries/auth';

const Welcome = ({ handleNextTab, activeTab }) => {
  const classes = useStyles();
  const { register, handleSubmit, errors, watch, getValues } = useForm();
  const notification = useNotification();
  const [hidePassword, setHidePassword] = useState(false);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(false);
  const { password } = watch();
  const params = new URLSearchParams(useLocation().search);
  const token = params.get('token');

  const [login, { isLoadingLogin, client }] = useMutation(LOGIN_USER);

  const cacheLoggedInUserData = (data) => {
    client.writeQuery({
      query: LOGGED_IN_USER_QUERY,
      data: {
        loggedInUser: data,
      },
    });
  };

  const onSubmit = (data) => {
    const { password, confirmPassword } = data;
    if (password !== confirmPassword) {
      notification.error({
        message: 'Password does not match',
      });
      return;
    } else {
      createPassword({
        variables: {
          newPassword: data.password,
          token,
        },
      });
    }
  };

  const loginUser = async () => {
    const password = getValues('password');
    try {
      const { data } = await login({
        variables: {
          email: tokenData?.verifyRegisterToken?.user?.email,
          password,
        },
      });
      setAuthToken(data.login.token);
      cacheLoggedInUserData(data.login.user);
      handleNextTab(activeTab + 1);
    } catch (err) {
      console.log(err.message);
    }
  };

  const [createPassword, { loading: isLoading }] = useMutation(RESET_PASSWORD, {
    onCompleted: () => {
      notification.success({
        message: 'Password created successfully',
      });
      loginUser();
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const { data: tokenData, loading } = useQuery(VERIFY_REG_TOKEN_QUERY, {
    variables: {
      token,
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  return (
    <>
      {loading && <LoadingView />}
      {tokenData?.verifyRegisterToken?.isValid ? (
        <div className={classes.container}>
          <div className={classes.header}>
            <Typography className="header-text">
              Welcome {tokenData?.verifyRegisterToken?.user?.firstname}
            </Typography>
            <Typography className="sub-header">
              We would work you through ........................
            </Typography>
          </div>
          <Box className={classes.info}>
            <Typography className="info-text">
              <Typography className="info-style"></Typography>You have been invited as an
              <span className="bold-info"> {tokenData?.verifyRegisterToken?.user?.roles[0]} </span>
              on the Learning Management System for{' '}
              <span className="bold-info">
                {tokenData?.verifyRegisterToken?.user?.institution?.name} (
                {tokenData?.verifyRegisterToken?.user?.institution?.abbreviation})
              </span>
              . Complete your account setup by filling the required information <br />
              <br /> Email:{' '}
              <span className="bold-info"> {tokenData?.verifyRegisterToken?.user?.email}</span>{' '}
              <br />
              Faculty:{' '}
              <span className="bold-info">
                {' '}
                {tokenData?.verifyRegisterToken?.user?.institution?.name}{' '}
              </span>{' '}
              <br />
              Department:{' '}
              <span className="bold-info">
                {' '}
                {tokenData?.verifyRegisterToken?.user?.department?.name}
              </span>
            </Typography>
          </Box>
          <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={10}>
              <Grid item xs={8}>
                <TextField
                  name="password"
                  label="Password"
                  inputRef={register({
                    required: true,
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*.,?&])(?=.{6,})/,
                  })}
                  className="text-field"
                  variant="outlined"
                  error={getFormError('password', errors).hasError}
                  type={hidePassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          className={classes.icon}
                          onClick={() => setHidePassword(!hidePassword)}>
                          {hidePassword ? 'Hide' : 'Show'}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  helperText={getFormError('password', errors).message}
                />

                <TextField
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  inputRef={register({
                    required: true,
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?.,&])(?=.{6,})/,
                  })}
                  className="text-field"
                  variant="outlined"
                  error={getFormError('confirmPassword', errors).hasError}
                  type={hideConfirmPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          className={classes.icon}
                          onClick={() => setHideConfirmPassword(!hideConfirmPassword)}>
                          {hideConfirmPassword ? 'Hide' : 'Show'}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  helperText={getFormError('confirmPassword', errors).message}
                />
              </Grid>
              <Grid item xs={4} style={{ marginTop: '-260px' }}>
                <PasswordCriteria password={password || ''} />
              </Grid>
            </Grid>
            <LoadingButton
              endIcon={<AngleRight />}
              className={classes.btn}
              type="submit"
              color="primary"
              isLoading={isLoading || isLoadingLogin}>
              Start
            </LoadingButton>
          </form>
        </div>
      ) : (
        <h2>Token expired or invalid token</h2>
      )}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    maxWidth: 800,
    margin: 'auto',
    padding: spaces.medium,
  },
  header: {
    '& .header-text': {
      fontWeight: fontWeight.medium,
      fontSize: fontSizes.title,
      fontFamilly: fontFamily.primary,
      color: colors.dark,
    },
    '& .sub-header': {
      fontWeight: fontWeight.regular,
      fontSize: fontSizes.xlarge,
      fontFamilly: fontFamily.primary,
      color: colors.grey,
      paddingBottom: spaces.large,
    },
  },
  info: {
    width: '60%',
    border: `solid ${colors.primary} 1px`,
    background: colors.primaryLight,
    borderRadius: borderRadius.small,
    color: colors.black,
    height: 'auto',
    padding: spaces.medium,
    marginRight: spaces.medium,
    '& .bold-info': {
      fontWeight: fontWeight.bold,
    },
    '& .info-style': {
      fontWeight: fontWeight.medium,
      paddingLeft: spaces.medium,
      paddingRight: 5,
      [theme.breakpoints.down('sm')]: {
        fontSize: fontSizes.small,
      },
    },
  },
  form: {
    margin: `${theme.spacing(12)}px 0`,
    '& .text-field': {
      width: '100%',
      marginBottom: spaces.medium,
    },
  },
  btn: {
    width: 154,
    height: 44,
    borderRadius: borderRadius.default,
    float: 'right',
    marginTop: 30,
  },
  strength: {
    maxWidth: 500,
    marginBottom: 5,
  },
  icon: {
    padding: 5,
    fontSize: fontSizes.medium,
  },
}));
export default Welcome;

/**https://deltalms-dev.netlify.app/verify-user/?token=MNFbBhgLParhpGeyvSKg9sCoidjmWCUvxPUHNXJed1Ggx8Y73SUZtkPD96WZlzK0Pi1il4oAUjzYnrUep7eHsNWE3FOGFYk6n1ESMnFHstXjNwJ18vhlXENZ&email=boomberbomb3@mailinator.com */
