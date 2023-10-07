import { Box, Button, Grid, makeStyles, TextField, Typography } from '@material-ui/core';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import LoadingButton from 'reusables/LoadingButton';
import { getFormError } from 'utils/formError';
import { colors, fontFamily, fontSizes, fontWeight, spaces } from '../../../Css';
import { EMAIL_REGEX } from 'utils/constants';

const Administrator = ({
  handleNextTab,
  activeTab,
  fieldInputs,
  handleInputChange,
  handleUpsert,
  isEditMode,
}) => {
  const classes = useStyles();
  const { handleSubmit, errors, control, reset } = useForm();

  useEffect(() => {
    reset({
      firstName: fieldInputs.firstName,
      lastName: fieldInputs.lastName,
      adminEmail: fieldInputs.adminEmail,
    });
  }, [fieldInputs, reset]);

  const onSubmit = (values) => {
    handleUpsert(true);
  };

  const onBack = () => {
    handleNextTab(activeTab - 1);
  };

  const isDisabled = isEditMode;

  return (
    <>
      <div className={classes.container}>
        <Typography className="header">Administrator</Typography>
      </div>
      <form noValidate onSubmit={handleSubmit(onSubmit)} className={classes.form}>
        <Grid container>
          <Grid item xs={12} md={6} className={classes.grid}>
            <Controller
              control={control}
              name="firstName"
              rules={{ required: true }}
              render={() => (
                <TextField
                  fullWidth
                  className="input"
                  required
                  value={fieldInputs.firstName}
                  onChange={(e) => handleInputChange({ firstName: e.target.value })}
                  variant="outlined"
                  label="First name"
                  error={getFormError('firstName', errors).hasError}
                  helperText={getFormError('firstName', errors).message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              control={control}
              name="lastName"
              rules={{ required: true }}
              render={() => (
                <TextField
                  fullWidth
                  className="input-right"
                  value={fieldInputs.lastName}
                  onChange={(e) => handleInputChange({ lastName: e.target.value })}
                  required
                  variant="outlined"
                  label="LastName"
                  error={getFormError('lastName', errors).hasError}
                  helperText={getFormError('lastName', errors).message}
                />
              )}
            />
          </Grid>
        </Grid>
        <Controller
          control={control}
          name="adminEmail"
          rules={{
            required: true,
            pattern: { value: EMAIL_REGEX, message: 'Please enter a valid format' },
          }}
          render={() => (
            <TextField
              required
              type="email"
              value={fieldInputs.adminEmail}
              onChange={(e) => handleInputChange({ adminEmail: e.target.value })}
              variant="outlined"
              label="Email address"
              error={getFormError('adminEmail', errors).hasError}
              helperText={getFormError('adminEmail', errors).message}
              disabled={isDisabled}
            />
          )}
        />
        <Box className={classes.btn}>
          <Button variant="outlined" onClick={onBack}>
            Back
          </Button>
          {!isEditMode && (
            <LoadingButton type="submit" variant="contained" color="primary">
              Create
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
export default Administrator;
