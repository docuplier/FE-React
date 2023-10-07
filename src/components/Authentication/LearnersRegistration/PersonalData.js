import React, { Fragment, useState } from 'react';
import { Typography, TextField, Grid, Box, Select, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import csc from 'country-state-city';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@apollo/client';

import useStateAndLGA from 'hooks/useStateAndLGA.js';
import { fontSizes, fontWeight, colors, fontFamily, spaces } from '../../../Css.js';
import LoadingButton from 'reusables/LoadingButton';
import { ReactComponent as ChevronRight } from 'assets/svgs/chevron-right.svg';
import { getFormError } from 'utils/formError';
import { REGISTER_INSTRUCTOR } from 'graphql/mutations/instrustorsRegistration';
import { useNotification } from 'reusables/NotificationBanner';
import { LOGGED_IN_USER } from 'graphql/queries/instructorsReg';
import LoadingView from 'reusables/LoadingView.js';

const PersonalData = ({ handleNextTab, activeTab }) => {
  const classes = useStyles();
  const [selectedState, setSelectedState] = useState('Abia');
  const { states, LGAs } = useStateAndLGA(selectedState);
  const { handleSubmit, register, errors } = useForm();
  const notification = useNotification();

  const onSubmit = (data) => {
    const { dateOfBirth, gender, nationality, state, lga } = data;
    createPersonalData({
      variables: {
        dateOfBirth,
        gender,
        nationality,
        lgaOfOrigin: lga,
        stateOfOrigin: state,
      },
    });
  };

  const [createPersonalData, { loading: isLoading }] = useMutation(REGISTER_INSTRUCTOR, {
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
  console.log(loggedInUser);

  return (
    <Fragment>
      {isLoadingUserData && <LoadingView />}
      {!isLoadingUserData && (
        <Box className={classes.wrapper}>
          <Typography className={classes.title}>Personal Data</Typography>
          <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
            <Box container spacing={6} className={classes.fieldWrapper}>
              <Grid container>
                <Grid item md={6} sm={12}>
                  <TextField
                    className="field"
                    size="medium"
                    name="firstName"
                    defaultValue={loggedInUser?.loggedInUser?.firstname}
                    error={getFormError('firstName', errors).hasError}
                    inputRef={register({ required: true })}
                    helperText={getFormError('firstName', errors).message}
                    variant="outlined"
                    label="First name"
                  />
                </Grid>
                <Grid item md={6} sm={12}>
                  <TextField
                    className="field"
                    size="medium"
                    defaultValue={loggedInUser?.loggedInUser?.middlename}
                    name="middleName"
                    variant="outlined"
                    label="Middle name"
                    inputRef={register({ required: false })}
                  />
                </Grid>
              </Grid>
              <Grid container>
                <Grid item md={6} sm={12}>
                  <TextField
                    className="field"
                    size="medium"
                    name="lastName"
                    defaultValue={loggedInUser?.loggedInUser?.lastname}
                    variant="outlined"
                    label="Last name"
                    error={getFormError('lastName', errors).hasError}
                    inputRef={register({ required: true })}
                    helperText={getFormError('lastName', errors).message}
                  />
                </Grid>
                <Grid item md={6} sm={12}>
                  <TextField
                    type="date"
                    className="field"
                    size="medium"
                    name="dateOfBirth"
                    defaultValue="1990-01-01"
                    variant="outlined"
                    label="Date of Birth"
                    error={getFormError('dateOfBirth', errors).hasError}
                    inputRef={register({ required: true })}
                    helperText={getFormError('dateOfBirth', errors).message}
                  />
                </Grid>
              </Grid>
              <Grid container>
                <Grid item md={6} sm={12}>
                  <Select
                    native
                    className="field"
                    size="medium"
                    name="gender"
                    variant="outlined"
                    label="Gender"
                    error={getFormError('gender', errors).hasError}
                    inputRef={register({ required: true })}
                    helperText={getFormError('gender', errors).message}>
                    <option value="">Gender</option>
                    {['MALE', 'FEMALE'].map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                </Grid>
                <Grid item md={6} sm={12}>
                  <Select
                    className="field"
                    native
                    size="medium"
                    name="nationality"
                    variant="outlined"
                    label="Nationality"
                    error={getFormError('nationality', errors).hasError}
                    inputRef={register({ required: true })}
                    helperText={getFormError('nationality', errors).message}>
                    <option value="">Nationalty</option>
                    {csc?.getAllCountries().map((country, index) => (
                      <option key={index} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </Select>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item md={6} sm={12}>
                  <Select
                    native
                    className="field"
                    size="medium"
                    name="state"
                    variant="outlined"
                    label="State of origin"
                    error={getFormError('state', errors).hasError}
                    inputRef={register({ required: true })}
                    helperText={getFormError('state', errors).message}
                    onChange={(event) => setSelectedState(event.target.value)}>
                    <option value="">State</option>
                    {states?.map((state, index) => {
                      return (
                        <option key={index} value={state}>
                          {state}
                        </option>
                      );
                    })}
                  </Select>
                </Grid>
                <Grid item md={6} sm={12}>
                  <Select
                    native
                    className="field"
                    select
                    size="medium"
                    name="lga"
                    variant="outlined"
                    label="LGA of origin"
                    error={getFormError('lga', errors).hasError}
                    inputRef={register({ required: true })}
                    helperText={getFormError('lga', errors).message}>
                    <option value="">LGA of origin</option>
                    {LGAs?.map((LGA, index) => (
                      <option key={index} value={LGA}>
                        {LGA}
                      </option>
                    ))}
                  </Select>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={12}>
                  <Box className={classes.divider}>
                    <Typography variant="body2" color="textSecondary">
                      Academic Level
                    </Typography>
                    <Divider classes={{ root: classes.line }} />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Select
                    native
                    className="full-field"
                    select
                    size="medium"
                    name="academicLevel"
                    variant="outlined"
                    label="Academic Level"
                    error={getFormError('academicLevel', errors).hasError}
                    inputRef={register({ required: true })}
                    helperText={getFormError('academicLevel', errors).message}>
                    <option value="">Select level</option>
                    <option value={loggedInUser?.loggedInUser?.level?.name}>
                      {loggedInUser?.loggedInUser?.level?.name}
                    </option>
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
    },
    '& .full-field': {
      width: '98%',
      marginBottom: theme.spacing(5),
    },
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
}));

export default PersonalData;
