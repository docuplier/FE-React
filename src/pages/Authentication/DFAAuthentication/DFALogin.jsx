import { useMutation } from '@apollo/client';
import { Checkbox, IconButton, InputAdornment, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import logoSvg from 'assets/svgs/newDFA-logo.svg';
import { LOGIN_USER } from 'graphql/mutations/auth';
import { LOGGED_IN_USER_QUERY } from 'graphql/queries/auth';
import useSubdomain from 'hooks/useSubDomain';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import LoadingButton from 'reusables/LoadingButton';
import useNotification from 'reusables/NotificationBanner/useNotification';
import { PublicPaths } from 'routes';
import { setAuthToken } from 'utils/Auth';
import { getFormError } from 'utils/formError';
import { getSelectedRole } from 'utils/UserUtils';
import { navigateToDefaultDFARoute } from 'utils/RouteUtils';
import { colors, fontFamily, fontSizes, fontWeight, spaces } from '../../../Css';
import { green } from '@material-ui/core/colors';
import DFAAuthLayout from 'Layout/DFALayout/DFAAuthLayout';

const Index = () => {
  const classes = useStyles();
  const { loading: isDomainLoading, domainObject } = useSubdomain();
  const [hidePassword, setHidePassword] = useState(false);
  const { register, handleSubmit, errors } = useForm();
  const notification = useNotification();
  const [login, { loading, client }] = useMutation(LOGIN_USER, {
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const cacheLoggedInUserData = (data) => {
    client.writeQuery({
      query: LOGGED_IN_USER_QUERY,
      data: {
        loggedInUser: data,
      },
    });
  };

  const onSubmit = async (values) => {
    try {
      const {
        data: {
          login: { token, user },
        },
      } = await login({
        variables: { ...values, email: values.username, institutionId: domainObject?.id },
      });
      setAuthToken(token);
      cacheLoggedInUserData(user);

      navigateToDefaultDFARoute({
        ...user,
        selectedRole: getSelectedRole(user?.selectedRole || user?.roles[0] || null),
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <DFAAuthLayout
      imageSrc={logoSvg}
      title="Login"
      //   renderSecondaryContent={renderSecondaryContent()}
    >
      <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
        <TextField
          error={getFormError('username', errors).hasError}
          size="medium"
          name="username"
          inputRef={register({
            required: true,
          })}
          placeholder={'email or matric number'}
          fullWidth={true}
          variant="outlined"
          label="Email"
          helperText={getFormError('username', errors).message}
        />
        <TextField
          variant="outlined"
          type={hidePassword ? 'text' : 'password'}
          size="medium"
          name="password"
          inputRef={register({ required: true })}
          fullWidth={true}
          label="Password"
          error={getFormError('password', errors).hasError}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  style={{ padding: 5, fontSize: fontSizes.medium }}
                  onClick={() => setHidePassword(!hidePassword)}
                >
                  {hidePassword ? 'Hide' : 'Show'}
                </IconButton>
              </InputAdornment>
            ),
          }}
          helperText={getFormError('password', errors).message}
        />
        <div className={classes.footer}>
          <Typography className={classes.rememberPassword} variant="subtitle2">
            <Checkbox color="primary" /> Remember Password
          </Typography>
          <Typography variant="subtitle2">
            <Link to={PublicPaths.FORGOT_PASSWORD} className={classes.link}>
              Forgot Password?
            </Link>
          </Typography>
        </div>
        <Typography variant="h4" className={classes.footerText}>
          By clicking Sign In, you agree to our{' '}
          <Link to="/" className={classes.link}>
            Terms of Use
          </Link>{' '}
          and our
          <Link
            target="_blank"
            to={{ pathname: 'https://www.dslms.ng/privacy-policy' }}
            className={classes.link}
          >
            {' '}
            Privacy Policy
          </Link>
        </Typography>
        <LoadingButton
          fullWidth
          isLoading={loading || isDomainLoading}
          type="submit"
          className={classes.button}
        >
          Login
        </LoadingButton>
        <Typography variant="h4" className={classes.footerText}>
          Don't have an account?{' '}
          <Link to="/" className={classes.strongLink}>
            Sign Up
          </Link>{' '}
        </Typography>
      </form>
    </DFAAuthLayout>
  );
};

export default Index;

const useStyles = makeStyles((theme) => ({
  rememberPassword: {
    fontSize: fontSizes.medium,
    fontFamily: fontFamily.nunito,
    fontWeight: fontWeight.regular,
    color: colors.textLight,
    [theme.breakpoints.down('xs')]: {
      fontSize: 13,
    },
  },
  footer: {
    fontSize: fontSizes.medium,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontFamily: fontFamily.nunito,
    fontWeight: fontWeight.regular,
    fontSize: fontSizes.medium,
    color: colors.textLight,
  },
  link: {
    fontSize: fontSizes.large,
    fontFamily: fontFamily.nunito,
    fontWeight: fontWeight.regular,
    color: colors.successBg,
    textDecoration: 'none',
    [theme.breakpoints.down('xs')]: {
      fontSize: 13,
    },
  },
  regularLink: {
    fontSize: fontSizes.medium,
    fontFamily: fontFamily.nunito,
    fontWeight: fontWeight.regular,
    color: colors.successBg,
    textDecoration: 'none',
    [theme.breakpoints.down('xs')]: {
      fontSize: 13,
    },
  },
  strongLink: {
    fontSize: fontSizes.large,
    fontFamily: fontFamily.primary,
    fontWeight: 900,
    color: colors.successBg,
    textDecoration: 'none',
    [theme.breakpoints.down('xs')]: {
      fontSize: 13,
    },
  },
  existingUsersLink: {
    textDecoration: 'none',
    color: 'inherit',
  },
  form: {
    '& > *': {
      marginBottom: spaces.medium,
    },
  },
  button: {
    color: '#fff',
    backgroundColor: colors.successBg,
    '&:hover': {
      backgroundColor: green[700],
    },
  },
}));
