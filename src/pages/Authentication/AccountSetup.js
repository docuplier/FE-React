import { useMutation, useQuery } from '@apollo/client';
import { Grid, IconButton, InputAdornment, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import logoSvg from 'assets/svgs/dslmsLogo.jpeg';
import { InvitationMessageBox } from 'components/Authentication/AccountSetup/InvitationMessageBox';
import { RESET_PASSWORD } from 'graphql/mutations/auth';
import { VERIFY_USER_TOKEN } from 'graphql/queries/auth';
import AuthLayout from 'Layout/AuthLayout';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Redirect, useHistory, useLocation } from 'react-router-dom';
import LoadingButton from 'reusables/LoadingButton';
import { useNotification } from 'reusables/NotificationBanner';
import PasswordCriteria from 'reusables/PasswordCriteria';
import { PublicPaths } from 'routes';
import { PASSWORD_REGEX } from 'utils/constants';
import { getFormError } from 'utils/formError';
import { colors, fontFamily, fontSizes, fontWeight, spaces } from '../../Css';

const AccountSetup = () => {
  const classes = useStyles();
  const notification = useNotification();
  const history = useHistory();
  const [hidePassword, setHidePassword] = useState(false);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(false);
  const { register, handleSubmit, errors, watch } = useForm();
  const { password } = watch();
  const location = useLocation().search;
  const token = new URLSearchParams(location).get('token');

  const { data, loading: verifyingUserToken } = useQuery(VERIFY_USER_TOKEN, {
    variables: { token },
  });

  const { user } = data?.verifyRegisterToken || {};
  const { firstname, lastname, email, roles, institution, institutions } = user || {};

  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD, {
    onCompleted: (data) => {
      if (data?.resetPassword?.ok) {
        notification.success({
          message: 'Registration successful!',
        });
        history.push(PublicPaths.LOGIN);
      }
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const submitFormValues = (values) => {
    if (values.password !== values.confirmPassword) {
      notification.error({
        message: 'Passwords must match!',
      });
    } else {
      resetPassword({
        variables: { newPassword: values.password, token },
      });
    }
  };

  const renderFormFooterContent = () => {
    return (
      <>
        <Typography variant="h4" className={classes.footerText}>
          By clicking Register, you agree to our{' '}
          <Link to="/" className={classes.link}>
            Terms
          </Link>{' '}
          of Use and our
          <Link to="/" className={classes.link}>
            {' '}
            Privacy Policy
          </Link>
        </Typography>
      </>
    );
  };

  const renderFormContent = () => {
    return (
      <form className={classes.form} onSubmit={handleSubmit(submitFormValues)}>
        <Grid container spacing={10}>
          <Grid item xs={6}>
            <TextField
              disabled
              fullWidth
              size="medium"
              name="firstname"
              variant="outlined"
              label="First name"
              defaultValue={firstname}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              disabled
              fullWidth
              size="medium"
              name="lastname"
              variant="outlined"
              label="Last name"
              defaultValue={lastname}
            />
          </Grid>
        </Grid>
        <TextField
          disabled
          fullWidth
          name="email"
          variant="outlined"
          label="Email address"
          defaultValue={email}
        />
        <TextField
          fullWidth
          name="password"
          label="Password"
          variant="outlined"
          type={hidePassword ? 'text' : 'password'}
          inputRef={register({ required: true, pattern: PASSWORD_REGEX })}
          error={getFormError('password', errors).hasError}
          helperText={getFormError('password', errors).message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton className={classes.icon} onClick={() => setHidePassword(!hidePassword)}>
                  {hidePassword ? 'hide' : 'show'}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          fullWidth
          name="confirmPassword"
          label="Confirm password"
          variant="outlined"
          type={hideConfirmPassword ? 'text' : 'password'}
          error={getFormError('confirmPassword', errors).hasError}
          helperText={getFormError('confirmPassword', errors).message}
          inputRef={register({ required: true, pattern: PASSWORD_REGEX })}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  className={classes.icon}
                  onClick={() => setHideConfirmPassword(!hideConfirmPassword)}>
                  {hideConfirmPassword ? 'hide' : 'show'}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <PasswordCriteria password={password} />
        {renderFormFooterContent()}
        <LoadingButton fullWidth isLoading={loading} type="submit" color="primary">
          Register
        </LoadingButton>
      </form>
    );
  };

  if (verifyingUserToken) return null;
  else if (!verifyingUserToken && !user) return <Redirect to={PublicPaths.LOGIN} />;

  return (
    <AuthLayout imageSrc={logoSvg} title="Account Setup">
      <InvitationMessageBox
        schoolAbbreviation={institution?.abbreviation}
        schoolName={institution?.name}
        schools={institutions}
        userRole={roles[0]}
      />
      {renderFormContent()}
    </AuthLayout>
  );
};

export default AccountSetup;

const useStyles = makeStyles((theme) => ({
  link: {
    color: colors.primary,
  },
  form: {
    marginTop: spaces.large,
    '& > *': {
      marginBottom: spaces.medium,
    },
  },
  icon: {
    padding: 5,
    fontSize: fontSizes.medium,
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    textDecoration: 'none',
    fontFamily: fontFamily.nunito,
    fontWeight: fontWeight.regular,
    fontSize: fontSizes.medium,
    color: colors.textLight,
  },
}));
