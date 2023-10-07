import { makeStyles, TextField, Typography } from '@material-ui/core';
import AuthLayout from 'Layout/AuthLayout';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import LoadingButton from 'reusables/LoadingButton';
import { useNotification } from 'reusables/NotificationBanner';
import { PublicPaths } from 'routes';
import { EMAIL_REGEX } from 'utils/constants';
import logoSvg from 'assets/svgs/dslmsLogo.jpeg';
import { colors, fontFamily, fontSizes, fontWeight, spaces } from '../../Css';
import { useLazyQuery } from '@apollo/client';
import { GET_EXISTING_USER } from 'graphql/queries/auth';
import useSubdomain from 'hooks/useSubDomain';

const ForgotPassword = () => {
  const classes = useStyles();
  const { register, handleSubmit } = useForm();
  const notification = useNotification();
  const history = useHistory();
  const { domainObject } = useSubdomain();
  const institutionId = domainObject?.id;

  const [existingUser, { loading }] = useLazyQuery(GET_EXISTING_USER, {
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
    onCompleted: ({ existingUser }) => {
      console.log('helb', existingUser);
      history.push(
        `${PublicPaths.EXISTING_USER_OTP_VERIFICATION}/?identifier=${
          existingUser?.matricNumber || existingUser?.staffId || existingUser?.email
        }&&resetPassword=true`,
      );
    },
  });
  const submit = (values) => {
    existingUser({
      variables: {
        accountType: 'USER',
        identifier: values.email,
        institutionId,
      },
    });
  };

  return (
    <AuthLayout
      imageSrc={logoSvg}
      title="Forgot Your Password?"
      description="Please provide the email address you used when you signed up for your DSLMS account.">
      <form className={classes.form} onSubmit={handleSubmit(submit)}>
        <TextField
          label="Email"
          name="email"
          type="email"
          inputRef={register({
            required: true,
            pattern: { value: EMAIL_REGEX, message: 'Please enter a valid format' },
          })}
          variant="outlined"
          fullWidth
        />
        <LoadingButton type="submit" fullWidth isLoading={loading} color="primary">
          Proceed
        </LoadingButton>
      </form>
      <Typography className={classes.link}>
        <Link to={PublicPaths.LOGIN} style={{ color: colors.primary, textDecoration: 'none' }}>
          Back to Login
        </Link>
      </Typography>
    </AuthLayout>
  );
};

const useStyles = makeStyles(() => ({
  form: {
    '& > *': {
      marginBottom: spaces.medium,
    },
  },
  link: {
    fontSize: fontSizes.large,
    fontFamily: fontFamily.nunito,
    fontWeight: fontWeight.regular,
    textAlign: 'center',
  },
}));

export default React.memo(ForgotPassword);
