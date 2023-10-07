import React, { Fragment } from 'react';
import { Typography, TextField, Grid, Divider, Box, Select } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useForm } from 'react-hook-form';

import { fontSizes, fontWeight, colors, fontFamily, spaces } from '../../../Css.js';
import LoadingButton from 'reusables/LoadingButton';
import { ReactComponent as ChevronRight } from 'assets/svgs/chevron-right.svg';
import useStateAndLGA from 'hooks/useStateAndLGA.js';
import { getFormError } from 'utils/formError';
import { EMAIL_REGEX } from 'utils/constants.js';

const NextOfKin = ({ handleNextTab, activeTab }) => {
  const classes = useStyles();
  const { register, handleSubmit, errors } = useForm();
  const { states } = useStateAndLGA();

  const onSubmit = (data) => {
    console.log(data);
    handleNextTab(activeTab + 1);
  };

  return (
    <Fragment>
      <Box className={classes.wrapper}>
        <Typography className={classes.title}>Next of Kin</Typography>
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
          <Box className={classes.fieldWrapper}>
            <Grid container>
              <Grid item md={6} sm={12}>
                <TextField
                  className="field"
                  size="medium"
                  name="firstName"
                  variant="outlined"
                  label="First name"
                  inputRef={register({ required: true })}
                  error={getFormError('firstName', errors).hasError}
                  helperText={getFormError('firstName', errors).message}
                />
              </Grid>
              <Grid item md={6} sm={12}>
                <TextField
                  className="field"
                  size="medium"
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
                  name="relationship"
                  variant="outlined"
                  label="Relationship"
                  inputRef={register({ required: true })}
                  error={getFormError('relationship', errors).hasError}
                  helperText={getFormError('relationship', errors).message}
                />
              </Grid>

              <Grid item md={6} sm={12}>
                <TextField
                  className="field"
                  size="medium"
                  name="phone"
                  variant="outlined"
                  label="Phone number"
                  inputRef={register({ required: true })}
                  error={getFormError('phone', errors).hasError}
                  helperText={getFormError('phone', errors).message}
                />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item lg={6} sm={12}>
                <TextField
                  className="field"
                  size="medium"
                  name="email"
                  variant="outlined"
                  label="Email Address"
                  inputRef={register({
                    required: true,
                    pattern: { value: EMAIL_REGEX, message: 'Please enter a valid format' },
                  })}
                  error={getFormError('email', errors).hasError}
                  helperText={getFormError('email', errors).message}
                />
              </Grid>
            </Grid>
            <Box className={classes.divider}>
              <Typography variant="body2" color="textSecondary">
                Home address
              </Typography>
              <Divider classes={{ root: classes.line }} />
            </Box>
            <Grid container>
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
            </Grid>
            <Grid container>
              <Grid item lg={4} xs={12}>
                <TextField
                  className="field"
                  size="medium"
                  name="city"
                  variant="outlined"
                  label="City"
                  inputRef={register({ required: true })}
                  error={getFormError('city', errors).hasError}
                  helperText={getFormError('city', errors).message}
                />
              </Grid>
              <Grid item lg={4} xs={12}>
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
                  className="field"
                  size="medium"
                  name="state"
                  variant="outlined"
                  label="State"
                  inputRef={register({ required: true })}>
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
              isLoading={false}>
              Next
            </LoadingButton>
          </div>
        </form>
      </Box>
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
  divider: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: spaces.medium,
    marginTop: spaces.small,
  },
  line: {
    margin: 'auto',
    width: '75%',
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

export default NextOfKin;
