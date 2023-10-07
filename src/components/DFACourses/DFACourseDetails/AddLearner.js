import React from 'react';
import Drawer from 'reusables/Drawer';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Grid, makeStyles } from '@material-ui/core';
import FileUpload from 'reusables/FileUpload';
import CourseCSVSample from 'assets/csv/course-csv-sample.csv';
import { WorksheetUploadFormats } from 'utils/constants';
import { getFormError } from 'utils/formError';
import { fontSizes } from '../../../Css';

const defaultValues = {
  firstName: '',
  middleName: '',
  lastName: '',
  class: '',
  age: '',
};

const AddLearner = ({ open, onClose }) => {
  const classes = useStyles();
  const { control, errors, handleSubmit, reset, watch } = useForm({
    defaultValues,
  });

  const handleCloseDrawer = () => {
    onClose();
    reset();
  };

  const renderSingleCreation = () => {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Controller
            name="firstName"
            control={control}
            rules={{
              required: 'First Name is required',
            }}
            render={({ ...rest }) => (
              <TextField
                {...rest}
                fullWidth
                required
                variant="outlined"
                label="First Name"
                error={getFormError('firstName', errors).hasError}
                helperText={getFormError('firstName', errors).message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="middleName"
            control={control}
            render={({ ...rest }) => (
              <TextField
                {...rest}
                fullWidth
                required
                variant="outlined"
                label="Middle Name(optional)"
                error={getFormError('middleName', errors).hasError}
                helperText={getFormError('middleName', errors).message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="lastName"
            control={control}
            rules={{
              required: 'Last Name is required',
            }}
            render={({ ...rest }) => (
              <TextField
                {...rest}
                fullWidth
                required
                variant="outlined"
                label="Last Name"
                error={getFormError('lastName', errors).hasError}
                helperText={getFormError('lastName', errors).message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="class"
            control={control}
            rules={{
              required: 'Class is required',
            }}
            render={({ ...rest }) => (
              <TextField
                {...rest}
                fullWidth
                required
                variant="outlined"
                label="Class"
                error={getFormError('class', errors).hasError}
                helperText={getFormError('class', errors).message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="age"
            rules={{
              required: 'Age is required',
            }}
            control={control}
            render={({ ...rest }) => (
              <TextField
                {...rest}
                required
                type="number"
                fullWidth
                variant="outlined"
                label="Age"
                error={getFormError('age', errors).hasError}
                helperText={getFormError('age', errors).message}
              />
            )}
          />
        </Grid>
      </Grid>
    );
  };

  const renderBulkUpload = () => {
    return (
      <Grid container style={{ width: '100%' }} spacing={6}>
        <Grid item xs={12}>
          <Controller
            name="file"
            control={control}
            rules={{ required: true }}
            render={({ onChange, value, ...rest }) => (
              <FileUpload
                {...rest}
                fileSample={CourseCSVSample}
                accept={WorksheetUploadFormats}
                onChange={(file) => onChange(file)}
                file={value}
                captionProps={{ className: classes.caption }}
              />
            )}
          />
        </Grid>
      </Grid>
    );
  };

  const tabList = [
    { panel: renderSingleCreation(), label: 'Manual Invite' },
    { panel: renderBulkUpload(), label: 'Bulk Upload' },
  ];

  return (
    <div>
      <Drawer
        open={open}
        onClose={handleCloseDrawer}
        title={'Add Learners'}
        tabList={tabList}
        okText="Create"
        okButtonProps={{ className: classes.okButton }}
        cancelButtonProps={{ className: classes.cancelButton }}
        tabColor="#3CAE5C"
        tabTextColor="#3CAE5C"
      />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  okButton: {
    background: '#3CAE5C',
    '&:hover': {
      background: '#3CAE5C',
    },
  },
  cancelButton: {
    color: '#267939',
    background: '#EBFFF0',
    marginRight: 5,
  },
  caption: {
    color: '#3CAE5C',
    fontSize: fontSizes.small,
    textDecoration: 'none',
    zIndex: 100,
  },
}));

export default AddLearner;
