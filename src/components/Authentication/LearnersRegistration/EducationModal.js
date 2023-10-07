import React from 'react';
import { TextField, Grid, Select } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useForm } from 'react-hook-form';

import Modal from 'reusables/Drawer/index.js';
import { getFormError } from 'utils/formError';

const EducationModal = ({ visibility, setVisibility }) => {
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
      title="Add education"
      okText="Save"
      onOk={handleSubmit(onSubmit)}
      cancelText="Cancel">
      <form className={classes.form}>
        <TextField
          className="field"
          size="medium"
          fullWidth={true}
          name="school"
          variant="outlined"
          label="School"
          inputRef={register({ required: true })}
          error={getFormError('school', errors).hasError}
          helperText={getFormError('school', errors).message}
        />
        <TextField
          className="field"
          size="medium"
          fullWidth={true}
          name="degree"
          variant="outlined"
          label="Degree"
          inputRef={register({ required: true })}
          error={getFormError('degree', errors).hasError}
          helperText={getFormError('degree', errors).message}
        />
        <TextField
          className="field"
          size="medium"
          fullWidth={true}
          name="fieldOfStudy"
          variant="outlined"
          label="Field of study"
          inputRef={register({ required: true })}
          error={getFormError('fieldOfStudy', errors).hasError}
          helperText={getFormError('fieldOfStudy', errors).message}
        />
        <Grid className="field-row" container spacing={6}>
          <Grid item lg={6}>
            <Select
              className="half-field"
              native
              size="medium"
              name="startYear"
              variant="outlined"
              required
              inputRef={register({ required: true })}
              label="Start year">
              <option value="">Start year</option>
              {arrayOfYears().map((year, index) => (
                <option key={index} value={year}>
                  {year}
                </option>
              ))}
            </Select>
          </Grid>
          <Grid item lg={6}>
            <Select
              className="half-field"
              native
              size="medium"
              name="endYear"
              variant="outlined"
              required
              inputRef={register({ required: true })}
              label="End year(or expected)">
              <option value="">End year(or expected)</option>
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
      marginBottom: theme.spacing(80),
    },
  },
}));
export default EducationModal;
