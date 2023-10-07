import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { TextField, makeStyles, MenuItem } from '@material-ui/core';
import { useForm, Controller } from 'react-hook-form';

import Drawer from 'reusables/Drawer';
import { EMAIL_REGEX, UserRoles, WorksheetUploadFormats } from 'utils/constants';
import { getFormError } from 'utils/formError';
import UpsertWrapper from './UpsertWrapper';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import { useNotification } from 'reusables/NotificationBanner';
import { GET_FACULTIES_QUERY } from 'graphql/queries/institution';
import { useQuery } from '@apollo/client';
import LoadingView from 'reusables/LoadingView';
import FileUpload from 'reusables/FileUpload';
import AdminCSVSample from 'assets/csv/admin-csv-sample.csv';

const UpsertAdministratorDrawer = ({ open, onClose, onOkSuccess, administrator }) => {
  const classes = useStyles();
  const isEditing = Boolean(administrator);
  const { userDetails } = useAuthenticatedUser();
  const notification = useNotification();
  const { handleSubmit, control, errors, reset } = useForm();

  const { data: facultiesData, loading: isLoadingFaculties } = useQuery(GET_FACULTIES_QUERY, {
    variables: { institutionId: userDetails?.institution.id, active: true, asFilter: true },
    skip: !open,
    onError: function onError(error) {
      notification.error({
        message: error?.message,
      });
    },
  });

  useEffect(() => {
    if (open && administrator) {
      reset({
        email: administrator?.email || null,
        firstname: administrator?.firstname || null,
        lastname: administrator?.lastname || null,
        faculty: administrator?.faculty || null,
      });
    } else {
      reset({});
    }
    // eslint-disable-next-line
  }, [administrator, open]);

  const renderInstitutionList = () =>
    facultiesData?.faculties?.results?.map((faculty) => (
      <MenuItem key={faculty.id} value={faculty.id}>
        {faculty.name}
      </MenuItem>
    ));

  const renderInstitutionLinkedInputs = () => {
    return (
      <>
        <Controller
          name="faculty"
          control={control}
          rules={{ required: true }}
          render={({ ref, ...rest }) => {
            return (
              <TextField
                {...rest}
                label="Faculty"
                variant="outlined"
                required
                select
                fullWidth
                inputRef={ref}
                error={getFormError('faculty', errors).hasError}
                helperText={getFormError('faculty', errors).message}>
                <LoadingView isLoading={isLoadingFaculties} />
                {renderInstitutionList()}
              </TextField>
            );
          }}
        />
      </>
    );
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
          rules={{ required: 'First name is required' }}
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
          rules={{ required: 'Last name is required', maxLength: 250 }}
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
        {renderInstitutionLinkedInputs()}
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
            fileSample={AdminCSVSample}
            file={value}
            {...rest}
          />
        )}
      />
    );
  };

  return (
    <UpsertWrapper
      onOkSuccess={onOkSuccess}
      updateId={administrator?.id}
      roles={[UserRoles.SCHOOL_ADMIN]}
      renderComponent={({ onSubmit, isLoading, onOkSuccess, ...props }) => (
        <Drawer
          {...props}
          open={open}
          onClose={onClose}
          title={isEditing ? 'Edit Administrator' : 'Add New Administrator'}
          tabList={
            !isEditing
              ? [
                  { label: 'Manual Invite', panel: renderManualInvite() },
                  { label: 'Bulk Upload', panel: renderBulkUpload() },
                ]
              : null
          }
          okText={isEditing ? 'Update' : 'Send Invite'}
          okButtonProps={{
            isLoading,
          }}
          onOk={handleSubmit(onSubmit)}>
          {isEditing && renderManualInvite()}
        </Drawer>
      )}
    />
  );
};

const useStyles = makeStyles((theme) => ({
  form: {
    '& > *': {
      marginBottom: theme.spacing(5),
    },
  },
}));

UpsertAdministratorDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onOkSuccess: PropTypes.func,
  administrator: PropTypes.shape({
    id: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    firstname: PropTypes.string.isRequired,
    lastname: PropTypes.string.isRequired,
    faculty: PropTypes.string.isRequired,
  }),
};

export default React.memo(UpsertAdministratorDrawer);
