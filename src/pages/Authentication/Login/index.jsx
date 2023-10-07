import { useMutation } from '@apollo/client';
import {
  Box,
  Checkbox,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ReactComponent as ArrowForwardIcon } from 'assets/svgs/arrow-forward-icon.svg';
import logoSvg from 'assets/svgs/dslmsLogo.jpeg';
import { LOGIN_USER } from 'graphql/mutations/auth';
import { LOGGED_IN_USER_QUERY } from 'graphql/queries/auth';
import useSubdomain from 'hooks/useSubDomain';
import AuthLayout from 'Layout/AuthLayout';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import LoadingButton from 'reusables/LoadingButton';
import useNotification from 'reusables/NotificationBanner/useNotification';
import { PublicPaths } from 'routes';
import { isAuthenticated, setAuthToken } from 'utils/Auth';
import { getFormError } from 'utils/formError';
import { getSelectedRole } from 'utils/UserUtils';
import { navigateToDefaultRoute } from 'utils/RouteUtils';
import { colors, fontFamily, fontSizes, fontWeight, spaces } from '../../../Css';
import PrivateRoute from 'routes/PrivateRoute';
import { getlastVisitedURL } from 'utils/Auth';

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

      navigateToDefaultRoute({
        ...user,
        selectedRole: getSelectedRole(user?.selectedRole || user?.roles[0] || null),
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  const renderSecondaryContent = () => {
    return (
      <Link to={`${PublicPaths.EXISTING_USER_VALIDATION}`} className={classes.existingUsersLink}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography style={{ fontWeight: fontWeight.bold, marginBottom: 4 }}>
              Existing Users
            </Typography>
            <Typography>For existing users, click here to setup your account</Typography>
          </Box>
          <ArrowForwardIcon />
        </Box>
      </Link>
    );
  };
  const [lastVisitedUrl, setLastVisitedUrl] = useState('');

  useEffect(() => {
    try {
      const lastUrl = getlastVisitedURL();
      setLastVisitedUrl(lastUrl);
    } catch (error) {
      // Handle the error if storage is not available
      console.log('Error: ' + error);
    }
  }, [lastVisitedUrl]);
  return isAuthenticated() ? (
    <PrivateRoute path={lastVisitedUrl} shouldRedirect={false} />
  ) : (
    <AuthLayout
      imageSrc={logoSvg}
      // title="Login to DSLMS"
      description="Enter your login details to proceed"
      renderSecondaryContent={renderSecondaryContent()}
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
          label="Username"
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
          color="primary"
        >
          Login
        </LoadingButton>
      </form>
    </AuthLayout>
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
    fontSize: fontSizes.medium,
    fontFamily: fontFamily.nunito,
    fontWeight: fontWeight.regular,
    color: colors.primary,
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
}));
