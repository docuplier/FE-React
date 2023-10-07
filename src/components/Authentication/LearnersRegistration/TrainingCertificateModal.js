import React from 'react';
import { TextField, Grid, Select } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useForm } from 'react-hook-form';

import Modal from 'reusables/Drawer/index.js';
import { getFormError } from 'utils/formError';

const TraingCertificateModal = ({ visibility, setVisibility }) => {
  const classes = useStyles();
  const { register, handleSubmit, errors } = useForm();
  const arrayOfYears = () => {
    var currYear = new Date().getFullYear();
    var max = currYear + 49;
    var min = currYear - 49;
    var years = [];

    for (var i = max; i >= min; i--) {
      years.push(i);
    }
    return years;
  };
  const onSubmit = (data) => {
    console.log(data);
  };
  return (
    <Modal
      disableAutoFocus={true}
      centered
      width={532}
      open={visibility}
      onClose={() => setVisibility(false)}
      title="Add certificate"
      okText="Save"
      onOk={handleSubmit(onSubmit)}
      cancelText="Cancel">
      <form className={classes.form}>
        <TextField
          className="field"
          size="medium"
          fullWidth={true}
          name="name"
          placeholder="Ex. Prunedge Product Design Certificate"
          variant="outlined"
          label="Name"
          inputRef={register({ required: true })}
          error={getFormError('name', errors).hasError}
          helperText={getFormError('name', errors).message}
        />
        <TextField
          className="field"
          size="medium"
          fullWidth={true}
          name="organization"
          variant="outlined"
          label="Issuing organization"
          inputRef={register({ required: true })}
          error={getFormError('organization', errors).hasError}
          helperText={getFormError('organization', errors).message}
        />
        <TextField
          className="field"
          size="medium"
          fullWidth={true}
          name="credentialID"
          variant="outlined"
          label="Credential ID"
          inputRef={register({ required: true })}
          error={getFormError('credentialID', errors).hasError}
          helperText={getFormError('credentialID', errors).message}
        />
        <TextField
          className="field"
          size="medium"
          fullWidth={true}
          name="credentialURL"
          variant="outlined"
          label="Credential URL"
          inputRef={register({ required: true })}
          error={getFormError('credentialURL', errors).hasError}
          helperText={getFormError('credentialURL', errors).message}
        />
        <Grid className="field-row" container spacing={6}>
          <Grid item lg={6}>
            <TextField
              className="half-field"
              type="month"
              size="medium"
              name="issueMonth"
              variant="outlined"
              label="Issue month"
              inputRef={register({ required: true })}
              error={getFormError('issueMonth', errors).hasError}
              helperText={getFormError('issueMonth', errors).message}
            />
          </Grid>
          <Grid item lg={6}>
            <Select
              className="half-field"
              native
              size="medium"
              name="issueYear"
              variant="outlined"
              inputRef={register({ required: true })}
              label="Issue year">
              <option value="">Issue year</option>
              {arrayOfYears().map((year, index) => (
                <option key={index} value={year}>
                  {year}
                </option>
              ))}
            </Select>
          </Grid>
          <Grid item lg={6}>
            <TextField
              className="half-field"
              type="month"
              size="medium"
              name="expirationMonth"
              variant="outlined"
              label="Expiration month"
              inputRef={register({ required: true })}
              error={getFormError('expirationMonth', errors).hasError}
              helperText={getFormError('expirationMonth', errors).message}
            />
          </Grid>
          <Grid item lg={6}>
            <Select
              className="half-field"
              native
              size="medium"
              name="expirationYear"
              variant="outlined"
              inputRef={register({ required: true })}
              label="Expiration year">
              <option value="">Expiration Year</option>
              {arrayOfYears().map((year, index) => (
                <option key={index} value={year}>
                  {year}
                </option>
              ))}
            </Select>
          </Grid>
        </Grid>
      </form>
    </Modal>
  );
};

const useStyles = makeStyles((theme) => ({
  form: {
    '& .field': {
      marginBottom: theme.spacing(10),
    },
    '& .half-field': {
      width: '100%',
    },
    '& .field-row': {
      marginBottom: theme.spacing(30),
    },
  },
}));
export default TraingCertificateModal;
