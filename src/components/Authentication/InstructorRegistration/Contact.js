import { makeStyles } from '@material-ui/styles';
import { Box, TextField, Typography, Select } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import React from 'react';
import { useMutation } from '@apollo/client';

import LoadingButton from 'reusables/LoadingButton';
import { fontWeight, fontSizes, fontFamily, colors, spaces, borderRadius } from '../../../Css';
import { ReactComponent as AngleRight } from 'assets/svgs/angle-right.svg';
import { getFormError } from 'utils/formError';
import { REGISTER_INSTRUCTOR } from 'graphql/mutations/instrustorsRegistration';
import { useNotification } from 'reusables/NotificationBanner';

const Contact = ({ handleNextTab, activeTab }) => {
  const classes = useStyles();
  const { register, handleSubmit, errors } = useForm();
  const notification = useNotification();

  const onSubmit = (data) => {
    createConatact({
      variables: {
        gender: data.gender,
        phone: data.phoneNumber,
      },
    });
  };

  const [createConatact, { loading: isLoading }] = useMutation(REGISTER_INSTRUCTOR, {
    onCompleted: () => {
      notification.success({
        message: 'Contact created successfully',
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
      <Box className={classes.container}>
        <div className={classes.header}>
          <Typography className="header-text">Contact details</Typography>
        </div>
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
          <TextField
            error={getFormError('phoneNumber', errors).hasError}
            name="phoneNumber"
            type="text"
            label="Phone number"
            inputRef={register({ required: true })}
            className="text-field"
            variant="outlined"
            helperText={getFormError('phoneNumber', errors).message}
          />
          <Select
            native
            fullWidth
            variant="outlined"
            name="gender"
            label="Gender"
            inputRef={register}>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </Select>

          <LoadingButton
            endIcon={<AngleRight />}
            className={classes.btn}
            type="submit"
            color="primary"
            isLoading={isLoading}>
            Save & next
          </LoadingButton>
        </form>
      </Box>
    </React.Fragment>
  );
};

export default Contact;

const useStyles = makeStyles(() => ({
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
    },
  },
  form: {
    margin: '50px 0',
    '& .text-field': {
      width: '100%',
      marginBottom: spaces.medium,
    },
  },
  btn: {
    width: 156,
    height: 44,
    borderRadius: borderRadius.default,
    float: 'right',
    marginTop: 30,
  },
}));
