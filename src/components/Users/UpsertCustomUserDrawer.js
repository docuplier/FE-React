import React from 'react';
import PropTypes from 'prop-types';
import { TextField, makeStyles } from '@material-ui/core';
import { useForm, Controller } from 'react-hook-form';

import Drawer from 'reusables/Drawer';
import FileUpload from 'reusables/FileUpload';
import { EMAIL_REGEX, WorksheetUploadFormats } from 'utils/constants';
import { getFormError } from 'utils/formError';

const UpsertCustomUserDrawer = ({ open, onClose, knownFormFields = {}, onOkSuccess }) => {
  const classes = useStyles();
  const isEditing = Boolean(knownFormFields.faculty);
  const { handleSubmit, control, errors } = useForm({
    defaultValues: {
      email: null,
      firstname: null,
      lastname: null,
      faculty: null,
      department: null,
    },
  });

  const onSubmit = (values) => {
    console.log(values);
    //@todo: Run this after mutation success
    onOkSuccess?.();
  };

  const renderManualInvite = () => {
    return (
      <form noValidate autoComplete="off" className={classes.form}>
        <Controller
          name="email"
          control={control}
          rules={{
            required: true,
            pattern: { value: EMAIL_REGEX, message: 'Please enter a valid format' },
          }}
          render={({ ref, ...rest }) => (
            <TextField
              {...rest}
              label="Email"
              variant="outlined"
              required
              fullWidth
              inputRef={ref}
              error={getFormError('email', errors).hasError}
              helperText={getFormError('email', errors).message}
            />
          )}
        />
        <Controller
          name="firstname"
          control={control}
          rules={{ required: true }}
          render={({ ref, ...rest }) => (
            <TextField
              {...rest}
              label="First Name"
              variant="outlined"
              required
              fullWidth
              inputRef={ref}
              error={getFormError('firstname', errors).hasError}
              helperText={getFormError('firstname', errors).message}
            />
          )}
        />
        <Controller
          name="lastname"
          control={control}
          rules={{ required: true, maxLength: 250 }}
          render={({ ref, ...rest }) => (
            <TextField
              {...rest}
              label="Last Name"
              variant="outlined"
              required
              fullWidth
              inputRef={ref}
              error={getFormError('lastname', errors).hasError}
              helperText={getFormError('lastname', errors).message}
            />
          )}
        />
      </form>
    );
  };

  const renderBulkUpload = () => {
    return (
      <Controller
        name="file"
        control={control}
        rules={{ required: true }}
        render={({ onChange, value, ...rest }) => (
          <FileUpload
            accept={WorksheetUploadFormats}
            onChange={(file) => onChange(file)}
            file={value}
            {...rest}
          />
        )}
      />
    );
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={isEditing ? 'Edit User' : 'Add New User'}
      tabList={
        !isEditing
          ? [
              { label: 'Manual Invite', panel: renderManualInvite() },
              { label: 'Bulk Upload', panel: renderBulkUpload() },
            ]
          : null
      }
      okText={isEditing ? 'Update' : 'Send Invite'}
      onOk={handleSubmit(onSubmit)}>
      {isEditing && renderManualInvite()}
    </Drawer>
  );
};

const useStyles = makeStyles((theme) => ({
  form: {
    '& > *': {
      marginBottom: theme.spacing(5),
    },
  },
}));

UpsertCustomUserDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onOkSuccess: PropTypes.func,
};

export default React.memo(UpsertCustomUserDrawer);
