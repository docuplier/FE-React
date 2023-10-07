import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { TextField, makeStyles, MenuItem } from '@material-ui/core';
import { useForm, Controller } from 'react-hook-form';
import { useQuery } from '@apollo/client';

import Drawer from 'reusables/Drawer';
import {
  UserRoles,
  GenderType,
  UserTitleType,
  WorksheetUploadFormats,
  EMAIL_REGEX,
} from 'utils/constants';
import { getFormError } from 'utils/formError';
import { useNotification } from 'reusables/NotificationBanner';
import { GET_FACULTIES_QUERY, GET_DEPARTMENTS_QUERY } from 'graphql/queries/institution';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import LoadingView from 'reusables/LoadingView';
import UpsertWrapper from './UpsertWrapper';
import { convertToSentenceCase } from 'utils/TransformationUtils';
import FileUpload from 'reusables/FileUpload';
import LecturersCSVSample from 'assets/csv/lecturers-csv-sample-original.csv';

const UpsertInstructorDrawer = ({ open, onClose, instructor, onOkSuccess }) => {
  const classes = useStyles();
  const notification = useNotification();
  const { userDetails } = useAuthenticatedUser();
  const isEditing = Boolean(instructor);
  const { handleSubmit, control, errors, reset, watch } = useForm();
  const { faculty } = watch();

  const { data: facultiesData, loading: isLoadingFaculties } = useQuery(GET_FACULTIES_QUERY, {
    variables: { institutionId: userDetails?.institution.id, active: true, asFilter: true },
    skip: !open,
    onError,
  });

  const { data: departmentsData, loading: isLoadingDepartments } = useQuery(GET_DEPARTMENTS_QUERY, {
    variables: { facultyId: faculty, active: true },
    skip: !faculty,
    onError,
  });

  useEffect(() => {
    if (open && instructor) {
      reset({
        staffId: instructor?.staffId || null,
        title: instructor?.title || null,
        email: instructor?.email || null,
        firstname: instructor?.firstname || null,
        lastname: instructor?.lastname || null,
        middlename: instructor?.middlename || null,
        phone: instructor?.phone || null,
        gender: instructor?.gender || null,
        designation: instructor?.designation || null,
        faculty: instructor?.faculty || null,
        department: instructor?.department || null,
      });
    } else {
      reset({});
    }
    // eslint-disable-next-line
  }, [instructor, open]);

  function onError(error) {
    notification.error({
      message: error?.message,
    });
  }

  const renderInstitutionList = () =>
    facultiesData?.faculties?.results?.map((faculty) => (
      <MenuItem key={faculty.id} value={faculty.id}>
        {faculty.name}
      </MenuItem>
    ));

  const renderDepartmentLists = () => {
    const { totalCount = 0, results = [] } = departmentsData?.departments || {};
    const activeDepartments = results.filter((department) => department.isActive);

    if (totalCount === 0) {
      return <MenuItem value="">No department for selected faculty</MenuItem>;
    } else if (activeDepartments.length === 0) {
      return <MenuItem value="">No active department for selected faculty</MenuItem>;
    }

    return activeDepartments.map((department) => (
      <MenuItem key={department.id} value={department.id}>
        {department.name}
      </MenuItem>
    ));
  };

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
        <Controller
          name="department"
          control={control}
          rules={{ required: true }}
          render={({ ref, ...rest }) => (
            <TextField
              {...rest}
              label="Department"
              variant="outlined"
              required
              select
              fullWidth
              inputRef={ref}
              error={getFormError('department', errors).hasError}
              helperText={getFormError('department', errors).message}>
              <LoadingView isLoading={isLoadingDepartments} />
              {renderDepartmentLists()}
            </TextField>
          )}
        />
      </>
    );
  };

  const renderManualInvite = () => {
    return (
      <form noValidate autoComplete="off" className={classes.form}>
        <Controller
          name="staffId"
          control={control}
          rules={{ maxLength: 15 }}
          render={({ ref, ...rest }) => (
            <TextField
              {...rest}
              label="Staff ID (optional)"
              variant="outlined"
              fullWidth
              inputRef={ref}
              error={getFormError('staffId', errors).hasError}
              helperText={getFormError('staffId', errors).message}
            />
          )}
        />
        <Controller
          name="title"
          control={control}
          rules={{ required: true }}
          render={({ ref, ...rest }) => (
            <TextField
              {...rest}
              label="Title"
              variant="outlined"
              required
              select
              fullWidth
              inputRef={ref}
              error={getFormError('title', errors).hasError}
              helperText={getFormError('title', errors).message}>
              {Object.keys(UserTitleType).map((title) => (
                <MenuItem key={title} value={title}>
                  {convertToSentenceCase(title)}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
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
          name="middlename"
          control={control}
          render={({ ref, ...rest }) => (
            <TextField
              {...rest}
              label="Middle Name (optional)"
              variant="outlined"
              fullWidth
              inputRef={ref}
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
        <Controller
          name="phone"
          control={control}
          rules={{
            maxLength: { value: 11, message: 'Value is greater than 11 digit' },
            minLength: { value: 11, message: 'Value is lesser than 11 digit' },
          }}
          render={({ ref, ...rest }) => (
            <TextField
              {...rest}
              label="Phone Number (optional)"
              variant="outlined"
              fullWidth
              type="number"
              inputRef={ref}
              placeholder="e.g 08012345678"
              error={getFormError('phone', errors).hasError}
              helperText={getFormError('phone', errors).message}
            />
          )}
        />
        <Controller
          name="gender"
          control={control}
          rules={{ maxLength: 250 }}
          render={({ ref, ...rest }) => (
            <TextField
              {...rest}
              label="Gender (optional)"
              variant="outlined"
              select
              fullWidth
              inputRef={ref}>
              {Object.values(GenderType).map((gender) => (
                <MenuItem key={gender} value={gender}>
                  {convertToSentenceCase(gender)}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
        <Controller
          name="designation"
          control={control}
          rules={{ maxLength: 15 }}
          render={({ ref, ...rest }) => (
            <TextField
              {...rest}
              label="Designation (optional)"
              variant="outlined"
              fullWidth
              inputRef={ref}
              error={getFormError('designation', errors).hasError}
              helperText={getFormError('designation', errors).message}
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
            fileSample={LecturersCSVSample}
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
      updateId={instructor?.id}
      roles={[UserRoles.LECTURER]}
      renderComponent={({ onSubmit, isLoading, onOkSuccess, ...props }) => (
        <Drawer
          {...props}
          open={open}
          onClose={onClose}
          title={isEditing ? 'Edit Lecturer' : 'Add New Lecturer'}
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

UpsertInstructorDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onOkSuccess: PropTypes.func,
  instructor: PropTypes.shape({
    staffId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    firstname: PropTypes.string.isRequired,
    lastname: PropTypes.string.isRequired,
    middlename: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    gender: PropTypes.string.isRequired,
    designation: PropTypes.string.isRequired,
    faculty: PropTypes.string.isRequired,
    department: PropTypes.string.isRequired,
    id: PropTypes.string,
  }),
};

export default React.memo(UpsertInstructorDrawer);
