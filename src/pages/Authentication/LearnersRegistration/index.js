import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useForm } from 'react-hook-form';
import { Typography, TextField, InputAdornment, IconButton, Paper } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import ReactPasswordStrengthBar from 'react-password-strength-bar';
import { useQuery, useMutation } from '@apollo/client';
import { useLocation } from 'react-router-dom';

import { colors, fontSizes, fontFamily, fontWeight, spaces } from '../../../Css.js';
import { getFormError } from 'utils/formError';
import PasswordCriteria from 'reusables/PasswordCriteria';
import LoadingButton from 'reusables/LoadingButton';
import { useNotification } from 'reusables/NotificationBanner';
import LoadingView from 'reusables/LoadingView';
import { VERIFY_REG_TOKEN_QUERY } from 'graphql/queries/instructorsReg';
import { RESET_PASSWORD, LOGIN_USER } from 'graphql/mutations/auth';
import { PublicPaths } from 'routes';
import { setAuthToken } from 'utils/Auth';
import { LOGGED_IN_USER_QUERY } from 'graphql/queries/auth';
import { EMAIL_REGEX } from 'utils/constants.js';

const LearnersRegistration = () => {
  const classes = useStyles();
  const history = useHistory();
  const [hidePassword, setHidePassword] = useState(false);
  const { handleSubmit, register, errors, watch, getValues } = useForm();
  const { password } = watch();
  const notification = useNotification();
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

  const onSubmit = (values) => {
    const { password } = values;
    resetPassword({
      variables: {
        token,
        newPassword: password,
      },
    });
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

      history.push(PublicPaths.LEARNERS_REGISTRATION_STAGES);
    } catch (err) {
      console.log(err.message);
    }
  };

  const [resetPassword, { loading: isLoading }] = useMutation(RESET_PASSWORD, {
    onCompleted: () => {
      notification.success({
        message: 'password created successfully',
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
        <div className={classes.pageWrapper}>
          <div className="content-area">
            <Paper className={classes.formPaper} square>
              <Typography align="center" color="textPrimary" variant="h5">
                Account Setup
              </Typography>
              <Typography align="center" variant="subtitle1">
                Fill in your details below to start registration
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
                <TextField
                  error={getFormError('email', errors).hasError}
                  size="medium"
                  name="email"
                  readOnly
                  disabled
                  value={tokenData?.verifyRegisterToken?.user?.email}
                  inputRef={register({
                    required: true,
                    pattern: { value: EMAIL_REGEX, message: 'Please enter a valid format' },
                  })}
                  fullWidth={true}
                  variant="outlined"
                  label="Email Address"
                  helperText={getFormError('email', errors).message}
                />
                <TextField
                  variant="outlined"
                  type={hidePassword ? 'text' : 'password'}
                  size="medium"
                  name="password"
                  inputRef={register({
                    required: true,
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%.,*?&])(?=.{6,})/,
                  })}
                  fullWidth={true}
                  label="Password"
                  error={getFormError('password', errors).hasError}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          style={{ padding: 5, fontSize: fontSizes.medium }}
                          onClick={() => setHidePassword(!hidePassword)}>
                          {hidePassword ? 'Hide' : 'Show'}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  helperText={getFormError('password', errors).message}
                />
                <ReactPasswordStrengthBar
                  password={password}
                  minLength={6}
                  minScore={2}
                  isRequired
                />
                <Typography align="center" variant="h4" className={classes.terms}>
                  By clicking Continue, you agree to our{' '}
                  <Link to="/" className={classes.link}>
                    Terms
                  </Link>{' '}
                  of Use and our
                  <Link to="/" className={classes.link}>
                    {' '}
                    Privacy Policy
                  </Link>
                </Typography>
                <LoadingButton
                  fullWidth
                  isLoading={isLoading || isLoadingLogin}
                  type="submit"
                  color="primary">
                  continue
                </LoadingButton>
                <Typography align="center" color="primary">
                  Already have an account? Sign In.
                </Typography>
              </form>
            </Paper>
            <PasswordCriteria password={password} />
          </div>
        </div>
      ) : (
        <h2>Token not valid or expired</h2>
      )}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  pageWrapper: {
    width: '100%',
    height: '100vh',
    backgroundColor: colors.secondary,
    '& .content-area': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingTop: 100,
    },
  },
  formPaper: {
    padding: 40,
    marginRight: 20,
  },
  terms: {
    fontFamily: fontFamily.primary,
    fontWeight: fontWeight.regular,
    fontSize: fontSizes.medium,
    color: colors.textLight,
    marginBottom: 20,
  },
  link: {
    fontWeight: fontWeight.regular,
    color: colors.primary,
    textDecoration: 'none',
  },
  form: {
    marginTop: spaces.medium,
    '& > *': {
      marginBottom: spaces.medium,
    },
  },
}));

export default LearnersRegistration;
