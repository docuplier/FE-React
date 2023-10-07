import { useMutation } from '@apollo/client';
import { IconButton, InputAdornment, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { RESET_PASSWORD } from 'graphql/mutations/auth';
import AuthLayout from 'Layout/AuthLayout';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useLocation } from 'react-router-dom';
import LoadingButton from 'reusables/LoadingButton';
import { useNotification } from 'reusables/NotificationBanner';
import PasswordCriteria from 'reusables/PasswordCriteria';
import { PublicPaths } from 'routes';
import { getFormError } from 'utils/formError';
import { fontSizes, spaces } from '../../Css';

const ResetPassword = () => {
  const classes = useStyles();
  const [hidePassword, setHidePassword] = useState(false);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const password = useRef({});
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const notification = useNotification();
  const history = useHistory();
  const token = params.get('token');
  password.current = watch('password', '');

  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD, {
    onCompleted: () => {
      notification.success({
        message: 'Password reset successful',
      });
      history.push(PublicPaths.LOGIN);
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const onSubmit = (values) => {
    resetPassword({
      variables: {
        newPassword: values.password,
        token,
      },
    });
  };

  const comparePassword = (confirmPassword) => {
    return password.current === confirmPassword;
  };

  return (
    <>
      <AuthLayout title="Reset Your Password">
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
          <TextField
            name="password"
            label="Password"
            inputRef={register({ required: true })}
            className="text-field"
            variant="outlined"
            fullWidth
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
            inputRef={register({ required: true, validate: comparePassword })}
            name="confirmPassword"
            label="Confirm new password"
            variant="outlined"
            type={hideConfirmPassword ? 'text' : 'password'}
            fullWidth
            required
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
          {errors.confirmPassword && errors.confirmPassword.type === 'validate' && (
            <div className="error">Passwords do not match</div>
          )}
          <PasswordCriteria password={password.current} />
          <LoadingButton type="submit" fullWidth isLoading={loading} color="primary">
            Reset password
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
  },
  iconBtn: {
    padding: 5,
    fontSize: fontSizes.medium,
  },
}));

export default React.memo(ResetPassword);
