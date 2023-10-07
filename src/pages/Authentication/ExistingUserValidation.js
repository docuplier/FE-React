import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useLazyQuery } from '@apollo/client';

import logoSvg from 'assets/svgs/dslmsLogo.jpeg';
import { PublicPaths } from 'routes';
import AuthLayout from 'Layout/AuthLayout';
import LoadingButton from 'reusables/LoadingButton';
import { getFormError } from 'utils/formError';
import { useNotification } from 'reusables/NotificationBanner';
import { GET_EXISTING_USER } from 'graphql/queries/auth';
import { colors, fontFamily, fontSizes, fontWeight, spaces } from '../../Css';
import useSubdomain from 'hooks/useSubDomain';

const ExistingUserValidation = () => {
  const classes = useStyles();
  const { register, handleSubmit, errors } = useForm();
  const history = useHistory();
  const { domainObject } = useSubdomain();
  const institutionId = domainObject?.id;
  const notification = useNotification();

  const [existingUser, { loading: verifyingExistingUser }] = useLazyQuery(GET_EXISTING_USER, {
    onCompleted: ({ existingUser }) => {
      if (existingUser) {
        history.push(
          `${PublicPaths.EXISTING_USER_DATA_PAGE}/?identifier=${existingUser?.matricNumber}&exiting=true`,
        );
        return;
      }

      notification.error({
        message: 'User not found',
      });
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const submitFormValue = (value) => {
    existingUser({
      variables: {
        accountType: 'MIGRATION',
        identifier: value.matricNumber,
        institutionId,
      },
    });
  };

  return (
    <AuthLayout
      imageSrc={logoSvg}
      title="Setup your account"
      description="Enter your Matric number or ID to proceed">
      <form className={classes.form} onSubmit={handleSubmit(submitFormValue)} noValidate>
        <TextField
          style={{ marginBottom: 32 }}
          error={getFormError('matricNumber', errors).hasError}
          size="medium"
          name="matricNumber"
          inputRef={register({
            required: true,
          })}
          placeholder={'Matric number'}
          fullWidth={true}
          variant="outlined"
          label="Matric number"
          helperText={getFormError('matricNumber', errors).message}
        />
        <LoadingButton
          fullWidth
          type="submit"
          color="primary"
          isLoading={verifyingExistingUser}
          disable={verifyingExistingUser}>
          Check Matric Number
        </LoadingButton>
      </form>
    </AuthLayout>
  );
};

export default ExistingUserValidation;

const useStyles = makeStyles((theme) => ({
  footerText: {
    fontFamily: fontFamily.nunito,
    fontWeight: fontWeight.regular,
    fontSize: fontSizes.medium,
    color: colors.textLight,
  },
  form: {
    '& > *': {
      marginBottom: spaces.medium,
    },
  },
}));
