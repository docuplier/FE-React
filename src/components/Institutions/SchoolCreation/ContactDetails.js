import { Box, Button, Grid, makeStyles, TextField, Typography } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import useStateAndLGA from 'hooks/useStateAndLGA';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import LoadingButton from 'reusables/LoadingButton';
import { getFormError } from 'utils/formError';
import { colors, fontFamily, fontSizes, fontWeight, spaces } from '../../../Css';
import { EMAIL_REGEX } from 'utils/constants';

const ContactDetails = ({
  handleNextTab,
  activeTab,
  fieldInputs,
  handleInputChange,
  handleUpsert,
  isEditMode,
}) => {
  const classes = useStyles();
  const { control, errors, handleSubmit, reset } = useForm();
  const { states, LGAs } = useStateAndLGA(fieldInputs.state);

  useEffect(() => {
    reset({
      address: fieldInputs.address,
      address2: fieldInputs.address2,
      city: fieldInputs.city,
      zipCode: fieldInputs.zipCode,
      state: fieldInputs.state,
      lga: fieldInputs.lga,
      email: fieldInputs.email,
      phone: fieldInputs.phone,
    });
  }, [fieldInputs, reset]);

  const onSubmit = (values) => {
    handleUpsert();
  };

  const onBack = () => {
    handleNextTab(activeTab - 1);
  };

  return (
    <>
      <div className={classes.container}>
        <Typography className="header">Contact Detail</Typography>
      </div>
      <form noValidate className={classes.form} onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="address"
          rules={{ required: true }}
          render={() => (
            <TextField
              required
              value={fieldInputs.address}
              onChange={(e) => handleInputChange({ address: e.target.value })}
              variant="outlined"
              label="Address line 1"
              error={getFormError('address', errors).hasError}
              helperText={getFormError('address', errors).message}
            />
          )}
        />
        <Controller
          control={control}
          name="address2"
          render={() => (
            <TextField
              value={fieldInputs.address2}
              onChange={(e) => handleInputChange({ address2: e.target.value })}
              variant="outlined"
              label="Address line 2 (optional)"
            />
          )}
        />
        <Grid container>
          <Grid item xs={12} md={6} className={classes.grid}>
            <Controller
              control={control}
              name="city"
              rules={{ required: true }}
              render={() => (
                <TextField
                  className="input"
                  value={fieldInputs.city}
                  onChange={(e) => handleInputChange({ city: e.target.value })}
                  required
                  variant="outlined"
                  label="City"
                  error={getFormError('city', errors).hasError}
                  helperText={getFormError('city', errors).message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6} className={classes.grid}>
            <Controller
              control={control}
              name="zipCode"
              rules={{ required: true }}
              render={() => (
                <TextField
                  required
                  className="input-right"
                  value={fieldInputs.zipCode}
                  onChange={(e) => handleInputChange({ zipCode: e.target.value })}
                  variant="outlined"
                  label="Zip code"
                  error={getFormError('zipCode', errors).hasError}
                  helperText={getFormError('zipCode', errors).message}
                />
              )}
            />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12} md={6} className={classes.grid}>
            <Controller
              control={control}
              name="state"
              rules={{ required: true }}
              render={() => (
                <TextField
                  select
                  fullWidth
                  className="input"
                  variant="outlined"
                  label="State"
                  value={fieldInputs.state}
                  SelectProps={{
                    native: true,
                  }}
                  onChange={(e) => handleInputChange({ state: e.target.value })}>
                  <option defaultChecked>Select state</option>
                  {states.map((state, i) => (
                    <option value={state}>{state}</option>
                  ))}
                </TextField>
              )}
            />
          </Grid>
          <Grid item xs={12} md={6} className={classes.grid}>
            <Controller
              control={control}
              name="lga"
              rules={{ required: true }}
              render={() => (
                <TextField
                  select
                  fullWidth
                  className="input-right"
                  variant="outlined"
                  name="lga"
                  label="LGA"
                  value={fieldInputs.lga}
                  SelectProps={{
                    native: true,
                  }}
                  onChange={(e) => handleInputChange({ lga: e.target.value })}>
                  <option defaultChecked>Select LGA</option>
                  {LGAs.map((lga, i) => (
                    <option value={lga}>{lga}</option>
                  ))}
                </TextField>
              )}
            />
          </Grid>
        </Grid>
        <Controller
          control={control}
          name="email"
          rules={{
            required: true,
            pattern: { value: EMAIL_REGEX, message: 'Please enter a valid format' },
          }}
          render={() => (
            <TextField
              required
              value={fieldInputs.email}
              onChange={(e) => handleInputChange({ email: e.target.value })}
              variant="outlined"
              label="Email address"
              error={getFormError('email', errors).hasError}
              helperText={getFormError('email', errors).message}
            />
          )}
        />
        <Controller
          control={control}
          name="phone"
          rules={{ required: true, pattern: /^(\+\d{1,3}[- ]?)?(\d{1}?)?(\d{10})$/ }}
          render={() => (
            <TextField
              required
              type="number"
              value={fieldInputs.phone}
              onChange={(e) => handleInputChange({ phone: e.target.value })}
              variant="outlined"
              label="Phone number"
              error={getFormError('phone', errors).hasError}
              helperText={getFormError('phone', errors).message}
            />
          )}
        />
        <Box className={classes.btn}>
          <Button variant="outlined" onClick={onBack}>
            Back
          </Button>
          {!isEditMode && (
            <LoadingButton
              type="submit"
              variant="contained"
              color="primary"
              endIcon={<ArrowForwardIosIcon />}>
              Save & Next
            </LoadingButton>
          )}
        </Box>
      </form>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    maxWidth: 800,
    '& .header': {
      fontWeight: fontWeight.medium,
      fontSize: fontSizes.title,
      color: colors.black,
      fontFamily: fontFamily.primary,
    },
  },
  form: {
    marginTop: spaces.large,
    '& > *': {
      width: '100%',
      marginBottom: spaces.medium,
    },
    '& > :last-child': {
      marginBottom: 50,
    },
  },
  grid: {
    '& .input': {
      width: '98%',
      [theme.breakpoints.down('sm')]: {
        width: '100%',
        marginBottom: spaces.medium,
      },
    },
    '& .input-right': {
      width: '100%',
      marginRight: spaces.medium,
    },
  },
  btn: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));
export default ContactDetails;
