import { IconButton, InputAdornment, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useMutation, useQuery } from '@apollo/client';
import { EXISTING_USER_CREATE_PASSWORD } from 'graphql/mutations/auth';
import { GET_EXISTING_USER } from 'graphql/queries/auth';
import AuthLayout from 'Layout/AuthLayout';
import { EMAIL_REGEX } from 'utils/constants';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNotification } from 'reusables/NotificationBanner';
import LoadingButton from 'reusables/LoadingButton';
import PasswordCriteria from 'reusables/PasswordCriteria';
import { getFormError } from 'utils/formError';
import { useHistory, useLocation } from 'react-router-dom';
import { PublicPaths } from 'routes';
import { fontSizes, spaces } from '../../Css';
import useSubdomain from 'hooks/useSubDomain';

const ExistingUserPasswordCreation = () => {
  const classes = useStyles();
  const history = useHistory();
  const notification = useNotification();
  const urlParams = new URLSearchParams(useLocation().search);
  const identifier = urlParams.get('identifier');
  const token = urlParams.get('token');
  const email = urlParams.get('email');
  const existing = urlParams.get('existing');
  const isEmailAvailable = Boolean(email);
  const [hidePassword, setHidePassword] = useState(false);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(false);
  const { domainObject } = useSubdomain();
  const institutionId = domainObject?.id;
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const password = watch('password', '');

  const { data } = useQuery(GET_EXISTING_USER, {
    variables: {
      accountType: existing ? 'MIGRATION' : 'USER',
      identifier,
      institutionId,
    },
  });

  const [existingUserCreatePassword, { loading }] = useMutation(EXISTING_USER_CREATE_PASSWORD, {
    onCompleted: ({ existingUserCreatePassword: { ok, errors } }) => {
      if (ok) {
        notification.success({
          message: 'Password created successfully!',
        });
        history.push(PublicPaths.LOGIN);
        return;
      }

      notification.error({
        message: errors?.map((error) => error.messages).join('. '),
      });
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const submitFormValues = (values) => {
    existingUserCreatePassword({
      variables: {
        newPassword: values.password,
        token,
        email: email || values.email,
        existingUserId: data?.existingUser?.id,
        phone: data?.existingUser?.phone,
      },
    });
  };

  const comparePassword = (confirmPassword) => {
    return password === confirmPassword;
  };

  return (
    <>
      <AuthLayout title="Create Your Password">
        <form className={classes.form} noValidate onSubmit={handleSubmit(submitFormValues)}>
          {!isEmailAvailable && (
            <Typography>
              Please provide the email address you used when you signed up for your DSLMS account.
            </Typography>
          )}
          <TextField
            disabled={isEmailAvailable}
            className={isEmailAvailable && 'text-field'}
            inputRef={register({
              required: true,
              pattern: { value: EMAIL_REGEX, message: 'Please enter a valid format' },
            })}
            name="email"
            label={!isEmailAvailable && 'Email'}
            variant="outlined"
            fullWidth
            type="email"
            value={email || ''}
          />
          <TextField
            name="password"
            label="Password"
            variant="outlined"
            fullWidth
            inputRef={register({ required: true })}
            error={getFormError('password', errors).hasError}
            type={hidePassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    className={classes.iconBtn}
                    onClick={() => setHidePassword(!hidePassword)}>
                    {hidePassword ? 'Hide' : 'Show'}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            helperText={getFormError('password', errors).message}
          />
          <TextField
            name="confirmPassword"
            label="Confirm new password"
            variant="outlined"
            type={hideConfirmPassword ? 'text' : 'password'}
            fullWidth
            inputRef={register({ required: true, validate: comparePassword })}
            error={getFormError('confirmPassword', errors).hasError}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    className={classes.iconBtn}
                    onClick={() => setHideConfirmPassword(!hideConfirmPassword)}>
                    {hideConfirmPassword ? 'Hide' : 'Show'}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            helperText={getFormError('confirmPassword', errors).message}
          />
          <PasswordCriteria password={password} />
          <LoadingButton type="submit" fullWidth color="primary" isLoading={loading}>
            Create password
          </LoadingButton>
        </form>
      </AuthLayout>
    </>
  );
};

const useStyles = makeStyles(() => ({
  form: {
    position: 'relative',
    '& > *': {
      marginBottom: spaces.medium,
    },
    '& .text-field': {
      background: '#E7E7ED',
      borderRadius: 4,
      marginTop: spaces.large,
    },
  },
  iconBtn: {
    padding: 5,
    fontSize: fontSizes.medium,
  },
}));

export default React.memo(ExistingUserPasswordCreation);
