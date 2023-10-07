import React, { useState } from 'react';
import { Typography, TextField, IconButton, InputAdornment, Grid } from '@material-ui/core';
import { getFormError } from 'utils/formError';
import { useForm } from 'react-hook-form';
import LoadingButton from 'reusables/LoadingButton';
import { makeStyles } from '@material-ui/styles';
import { fontWeight, spaces, fontSizes } from '../../Css';
import { PASSWORD_REGEX } from 'utils/constants';
import useNotification from 'reusables/NotificationBanner/useNotification';
import { useMutation } from '@apollo/client';
import { CHANGE_PASSWORD } from 'graphql/mutations/auth';

const Security = () => {
  const classes = useStyles();
  const notification = useNotification();
  const [hidePassword, setHidePassword] = useState(false);
  const { register, handleSubmit, errors: formError } = useForm();

  const [resetPassword, { loading }] = useMutation(CHANGE_PASSWORD, {
    onCompleted: (data) => {
      if (data?.changePassword?.ok) {
        notification.success({
          message: data?.changePassword?.success?.messages,
        });
        return;
      }
      notification.error({
        message: data?.changePassword?.errors?.messages,
      });
    },
    onError: (error) => {
      notification.error({
        message: error?.messages,
      });
    },
  });

  const onSubmit = (data) => {
    if (data.Newpassword !== data.Confirmpassword) {
      return notification.error({
        message: 'Password does not match',
      });
    } else if (data.Newpassword === data.currentpassword) {
      return notification.error({
        message: "You can't use this password ",
      });
    }
    resetPassword({
      variables: { newPassword: data.Newpassword, currentPassword: data.currentpassword },
    });
  };

  return (
    <div style={{ marginBottom: 50 }}>
      <Grid container>
        <Grid item xs={12} md={6}>
          <Typography className={classes.header} color="textPrimary">
            Password reset
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
            <TextField
              inputRef={register({ required: true })}
              label="Current password"
              type={hidePassword ? 'text' : 'password'}
              name="currentpassword"
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      className={classes.icon}
                      onClick={() => setHidePassword(!hidePassword)}>
                      {hidePassword ? 'hide' : 'show'}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={getFormError('currentpassword', formError).hasError}
              helperText={getFormError('currentpassword', formError).message}
            />
            <TextField
              inputRef={register({
                required: true,
                pattern: {
                  value: PASSWORD_REGEX,
                  message:
                    'Password must have at least 1 number, 1 uppercase 1 special charcter and be minimum of 8',
                },
              })}
              label="New password"
              type="password"
              name="Newpassword"
              variant="outlined"
              error={getFormError('Newpassword', formError).hasError}
              helperText={getFormError('Newpassword', formError).message}
            />
            <TextField
              inputRef={register({
                required: true,
                pattern: {
                  value: PASSWORD_REGEX,
                  message:
                    'Password must have at least 1 number, 1 uppercase 1 special charcter and be minimum of 8',
                },
              })}
              label="Confirm password"
              type="password"
              name="Confirmpassword"
              variant="outlined"
              error={getFormError('Confirmpassword', formError).hasError}
              helperText={getFormError('Confirmpassword', formError).message}
            />
            <LoadingButton
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              isLoading={loading}>
              Reset Password
            </LoadingButton>
          </form>
        </Grid>
      </Grid>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  header: {
    fontSize: fontSizes.xlarge,
    fontWeight: fontWeight.bold,
    paddingTop: 40,
  },
  form: {
    marginTop: spaces.large,
    '& > *': {
      width: '80%',
      marginBottom: spaces.medium,
      [theme.breakpoints.down('sm')]: {
        width: '100%',
      },
    },
    '& > :nth-child(3)': {
      marginBottom: 50,
    },
  },
  icon: {
    padding: 5,
    fontSize: fontSizes.medium,
  },
}));
export default Security;
