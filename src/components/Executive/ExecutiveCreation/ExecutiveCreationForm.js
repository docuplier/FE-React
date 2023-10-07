import React from 'react';
import { Controller } from 'react-hook-form';
import { TextField, Grid, makeStyles } from '@material-ui/core';
import SchoolsAutocompleteFields from './SchoolsAutocompleteFields';
import VisualizationAutoCompleteFields from './VisualizationsAutoCompleteFields';
import { getFormError } from 'utils/formError';
import { EMAIL_REGEX, PHONE_REGEX } from 'utils/constants';
import { spaces } from '../../../Css';

const ExecutiveCreationForm = ({ useFormUtils }) => {
  const { control, errors } = useFormUtils;
  const classes = useStyles();

  return (
    <form className={classes.form}>
      <Grid container spacing={6}>
        <Grid item xs={6}>
          <Controller
            name="firstName"
            control={control}
            rules={{
              required: true,
            }}
            render={({ ...rest }) => (
              <TextField
                {...rest}
                fullWidth
                required
                variant="outlined"
                label="First name"
                error={getFormError('firstName', errors).hasError}
                helperText={getFormError('firstName', errors).message}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            name="lastName"
            control={control}
            rules={{
              required: true,
            }}
            render={({ ...rest }) => (
              <TextField
                {...rest}
                fullWidth
                required
                variant="outlined"
                label="Last name"
                error={getFormError('lastName', errors).hasError}
                helperText={getFormError('lastName', errors).message}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="phoneNumber"
            control={control}
            rules={{
              pattern: { value: PHONE_REGEX, message: 'Please enter a valid format' },
            }}
            render={({ ...rest }) => (
              <TextField
                {...rest}
                fullWidth
                type="number"
                variant="outlined"
                label="Phone Number"
                error={getFormError('phoneNumber', errors).hasError}
                helperText={getFormError('phoneNumber', errors).message}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="emailAddress"
            control={control}
            rules={{
              required: true,
              pattern: { value: EMAIL_REGEX, message: 'Please enter a valid format' },
            }}
            render={({ ...rest }) => (
              <TextField
                {...rest}
                fullWidth
                required
                variant="outlined"
                label="Email address"
                error={getFormError('emailAddress', errors).hasError}
                helperText={getFormError('emailAddress', errors).message}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <SchoolsAutocompleteFields useFormUtils={useFormUtils} />
        </Grid>
        <Grid item xs={12}>
          <VisualizationAutoCompleteFields useFormUtils={useFormUtils} />
        </Grid>
      </Grid>
    </form>
  );
};

ExecutiveCreationForm.propTypes = {};

const useStyles = makeStyles({
  form: {
    marginTop: spaces.medium,
    '& > * > *': {
      marginBottom: spaces.medium,
    },
  },
});

export default ExecutiveCreationForm;
