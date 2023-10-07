import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { fontSizes, fontWeight, colors, fontFamily, spaces } from '../../../Css.js';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@apollo/client';

import { Typography, TextField, Grid, Divider, Box, Select } from '@material-ui/core';
import useStateAndLGA from 'hooks/useStateAndLGA.js';
import LoadingButton from 'reusables/LoadingButton.jsx';
import { ReactComponent as ChevronRight } from 'assets/svgs/chevron-right.svg';
import { getFormError } from 'utils/formError';
import { UPDATE_USER_INFORMATION } from 'graphql/mutations/instrustorsRegistration';
import { useNotification } from 'reusables/NotificationBanner';
import { LOGGED_IN_USER } from 'graphql/queries/instructorsReg';
import LoadingView from 'reusables/LoadingView.js';
import { EMAIL_REGEX } from 'utils/constants.js';

const ContactData = ({ handleNextTab, activeTab }) => {
  const classes = useStyles();
  const { register, handleSubmit, errors } = useForm();
  const { states } = useStateAndLGA();
  const notification = useNotification();

  const onSubmit = (data) => {
    const { phone, city, postalCode, state, nin, address } = data;
    createConatactData({
      variables: {
        newUserInformation: { phone, city, postalCode, state, nin, address },
        id: loggedInUser?.loggedInUser?.userinformation?.id,
      },
    });
  };

  const [createConatactData, { loading: isLoading }] = useMutation(UPDATE_USER_INFORMATION, {
    onCompleted: () => {
      notification.success({
        message: 'Contact data created successfully',
      });
      handleNextTab(activeTab + 1);
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const { data: loggedInUser, loading: isLoadingUserData } = useQuery(LOGGED_IN_USER);
  console.log(loggedInUser?.loggedInUser?.userinformation?.id);
  return (
    <Fragment>
      {isLoadingUserData && <LoadingView />}
      {loggedInUser && (
        <Box className={classes.wrapper}>
          <Typography className={classes.title}>Contact Data</Typography>
          <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
            <Box className={classes.fieldWrapper}>
              <Grid container>
                <Grid item md={6} xs={12}>
                  <TextField
                    className="field"
                    size="medium"
                    name="phone"
                    variant="outlined"
                    label="Phone Number"
                    inputRef={register({ required: true })}
                    error={getFormError('phone', errors).hasError}
                    helperText={getFormError('phone', errors).message}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    className="field"
                    size="medium"
                    name="email"
                    defaultValue={loggedInUser?.loggedInUser?.email}
                    variant="outlined"
                    label="Email Address"
                    inputRef={register({
                      required: false,
                      pattern: { value: EMAIL_REGEX, message: 'Please enter a valid format' },
                    })}
                    error={getFormError('email', errors).hasError}
                    helperText={getFormError('email', errors).message}
                  />
                </Grid>
              </Grid>
              <Grid item lg={12}>
                <TextField
                  className="full-field"
                  size="medium"
                  name="nin"
                  variant="outlined"
                  label="National Identity Number"
                  inputRef={register({ required: true })}
                  error={getFormError('nin', errors).hasError}
                  helperText={getFormError('nin', errors).message}
                />
              </Grid>
              <Box className={classes.divider}>
                <Typography variant="body2" color="textSecondary">
                  Residential address
                </Typography>
                <Divider classes={{ root: classes.line }} />
              </Box>
              <Grid item lg={12}>
                <TextField
                  className="full-field"
                  size="medium"
                  name="address"
                  variant="outlined"
                  label="Address"
                  inputRef={register({ required: true })}
                  error={getFormError('address', errors).hasError}
                  helperText={getFormError('address', errors).message}
                />
              </Grid>
              <Grid container>
                <Grid item lg={4} xs={6}>
                  <TextField
                    className="field"
                    size="medium"
                    name="city"
                    variant="outlined"
                    label="City"
                    inputRef={register({ required: true })}
                    error={getFormError('city', errors).hasError}
                    helperText={getFormError('city', errors).message}
                    city
                  />
                </Grid>
                <Grid item lg={4} xs={6}>
                  <TextField
                    className="field"
                    size="medium"
                    name="postalCode"
                    variant="outlined"
                    label="Postal code"
                    inputRef={register({ required: true })}
                    error={getFormError('postalCode', errors).hasError}
                    helperText={getFormError('postalCode', errors).message}
                  />
                </Grid>
                <Grid item lg={4} xs={12}>
                  <Select
                    native
                    className="field extra-filed"
                    size="medium"
                    name="state"
                    variant="outlined"
                    label="State"
                    inputRef={register({ required: true })}
                    error={getFormError('sstate', errors).hasError}
                    helperText={getFormError('sstate', errors).message}>
                    <option value="">State</option>
                    {states?.map((state, index) => (
                      <option key={index} value={state}>
                        {state}
                      </option>
                    ))}
                  </Select>
                </Grid>
              </Grid>
            </Box>
            <div className={classes.foot}>
              <LoadingButton
                endIcon={<ChevronRight />}
                className="btn"
                type="submit"
                color="primary"
                isLoading={isLoading}>
                Next
              </LoadingButton>
            </div>
          </form>
        </Box>
      )}
    </Fragment>
  );
};

const useStyles = makeStyles((theme) => ({
  wrapper: {
    maxWidth: 800,
    margin: 'auto',
    padding: spaces.medium,
  },
  fieldWrapper: {
    '& > *': {
      marginBottom: spaces.small,
    },
  },
  title: {
    fontWeight: fontWeight.medium,
    fontSize: fontSizes.title,
    fontFamilly: fontFamily.primary,
    color: colors.dark,
  },
  form: {
    marginTop: theme.spacing(10),
    '& .field': {
      width: '95%',
      marginBottom: theme.spacing(5),
      [theme.breakpoints.down('sm')]: {
        width: '98%',
      },
    },
    '& .full-field': {
      width: '98%',
      marginBottom: theme.spacing(5),
    },
    '& .extra-filed': {
      [theme.breakpoints.down('md')]: {
        width: '98%',
      },
    },
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '97%',
    marginBottom: spaces.medium,
    marginTop: spaces.small,
  },
  line: {
    flexGrow: 1,
    marginLeft: 5,
  },
  foot: {
    display: 'flex',
    marginTop: theme.spacing(25),
    '& .btn': {
      marginLeft: 'auto',
      marginRight: '2%',
      width: 100,
      height: 44,
    },
  },
}));

export default ContactData;
