import React, { useState } from 'react';
import { Box, TextField, Typography, InputAdornment, IconButton, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useForm } from 'react-hook-form';
import PasswordCriteria from 'reusables/PasswordCriteria';
import { useMutation } from '@apollo/client';

//components
import { fontWeight, fontSizes, fontFamily, colors, spaces, borderRadius } from '../../../Css';
import { ReactComponent as Info } from 'assets/svgs/info.svg';
import { ReactComponent as AngleRight } from 'assets/svgs/angle-right.svg';
import LoadingButton from 'reusables/LoadingButton';
import { getFormError } from 'utils/formError';
import { RESET_PASSWORD } from 'graphql/mutations/auth';
import { useNotification } from 'reusables/NotificationBanner';

const PasswordSetup = ({ handleNextTab, activeTab }) => {
  const classes = useStyles();
  const [hidePassword, setHidePassword] = useState(false);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(false);
  const { register, handleSubmit, errors, watch } = useForm();
  const notification = useNotification();
  const { password } = watch();

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
          token: 'gdgghdhhdhdhdh',
        },
      });
    }
  };

  const [createPassword, { loading: isLoading }] = useMutation(RESET_PASSWORD, {
    onCompleted: () => {
      notification.success({
        message: 'Password created successfully',
      });
      handleNextTab(activeTab + 1);
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  return (
    <React.Fragment>
      <div className={classes.container}>
        <div className={classes.header}>
          <Typography className="header-text">Password setup </Typography>
        </div>
        <Box className={classes.info}>
          <Info />
          <Typography className="info-text">
            <Typography className="info-style">Info: </Typography>You have been invited to join
            Delta State University as an instructor.
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
            <Grid item xs={4}>
              <PasswordCriteria password={password || ''} />
            </Grid>
          </Grid>
          <LoadingButton
            endIcon={<AngleRight />}
            className={classes.btn}
            type="submit"
            color="primary"
            isLoading={isLoading}>
            Save & next
          </LoadingButton>
        </form>
      </div>
    </React.Fragment>
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
      paddingBottom: spaces.large,
    },
  },
  info: {
    width: '97%',
    border: `solid ${colors.primary} 1px`,
    background: colors.primaryLight,
    borderRadius: borderRadius.small,
    display: 'flex',
    alignItems: 'center',
    color: colors.primary,
    height: 55,
    paddingLeft: spaces.medium,
    marginRight: spaces.medium,

    '& .info-text': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      [theme.breakpoints.down('sm')]: {
        fontSize: fontSizes.small,
      },
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

export default PasswordSetup;
