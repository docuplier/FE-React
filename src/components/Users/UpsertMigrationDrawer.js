import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { TextField, makeStyles, MenuItem } from '@material-ui/core';
import { useForm, Controller } from 'react-hook-form';
import { useQuery, useMutation } from '@apollo/client';

import Drawer from 'reusables/Drawer';
import { UserRoles, GenderType, EMAIL_REGEX } from 'utils/constants';
import { getFormError } from 'utils/formError';
import { useNotification } from 'reusables/NotificationBanner';
import { GET_DEPARTMENTS_QUERY, GET_PROGRAM_LEVELS } from 'graphql/queries/institution';
import LoadingView from 'reusables/LoadingView';
import UpsertWrapper from './UpsertWrapper';
import { UPDATE_USER } from 'graphql/mutations/users';
import { convertToSentenceCase } from 'utils/TransformationUtils';

const UpsertMigrationDrawer = ({ open, onClose, existingUser, onOkSuccess }) => {
  const classes = useStyles();
  const notification = useNotification();
  const { handleSubmit, control, errors, reset } = useForm({
    defaultValues: {
      department: null,
      gender: null,
      level: null,
    },
  });

  const [updateExistingUser, { loading }] = useMutation(UPDATE_USER, {
    onCompleted: ({ updateUser: { ok, errors } }) => {
      if (ok) {
        notification.success({
          message: 'User updated successfully',
        });
        onOkSuccess?.();
        onClose?.();
        return;
      }

      notification.error({
        message: errors?.map((error) => error.messages).join('. '),
      });
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const { data: departmentsData, loading: isLoadingDepartments } = useQuery(GET_DEPARTMENTS_QUERY, {
    skip: !open,
    onError(error) {
      notification.error({
        message: error?.message,
      });
    },
  });

  const { data: levelsData, loading: isLoadingLevels } = useQuery(GET_PROGRAM_LEVELS, {
    skip: !open,
    onError(error) {
      notification.error({
        message: error?.message,
      });
    },
  });

  const allLevelsData = levelsData?.levels?.results || [];

  const onSubmit = (values) => {
    updateExistingUser({
      variables: {
        id: existingUser?.id,
        newUser: {
          email: values?.email,
          firstname: values?.firstname,
          lastname: values?.lastname,
          middlename: values?.middlename,
          phone: values?.phone,
          gender: values?.gender,
          department: values?.department,
          level: values?.level,
          matricNumber: values?.matricNumber,
        },
      },
    });
  };

  useEffect(() => {
    if (open && existingUser) {
      reset({
        email: existingUser?.email || null,
        firstname: existingUser?.firstname || null,
        lastname: existingUser?.lastname || null,
        middlename: existingUser?.middlename || null,
        phone: existingUser?.phone || null,
        gender: existingUser?.gender || null,
        department: existingUser?.department || null,
        matricNumber: existingUser?.matricNumber || null,
        level: existingUser?.level || null,
        school: existingUser?.school || null,
        id: existingUser?.id || null,
      });
    } else {
      reset({});
    }
    // eslint-disable-next-line
  }, [existingUser, open]);

  const renderDepartmentLists = () => {
    const { totalCount = 0, results = [] } = departmentsData?.departments || {};
    const activeDepartments = results?.filter((department) => department.isActive);

    if (totalCount === 0) {
      return <MenuItem value="">No department</MenuItem>;
    } else if (activeDepartments.length === 0) {
      return <MenuItem value="">No active department</MenuItem>;
    }

    return activeDepartments?.map((department) => (
      <MenuItem key={department.id} value={department.id}>
        {department.name}
      </MenuItem>
    ));
  };

  const renderProgramLevels = () =>
    allLevelsData?.map((level) => (
      <MenuItem key={level.id} value={level.id}>
        {level.name}
      </MenuItem>
    ));

  const renderUpdateExistingUserForm = () => {
    return (
      <form
        noValidate
        autoComplete="off"
        className={classes.form}
        onSubmit={handleSubmit(onSubmit)}>
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
          rules={{ required: 'Last name is required ', maxLength: 250 }}
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
          name="gender"
          control={control}
          render={({ ref, ...rest }) => {
            return (
              <TextField
                {...rest}
                label="Gender (optional)"
                variant="outlined"
                fullWidth
                select
                inputRef={ref}>
                {Object.keys(GenderType).map((gender) => (
                  <MenuItem key={gender} value={gender}>
                    {convertToSentenceCase(gender)}
                  </MenuItem>
                ))}
              </TextField>
            );
          }}
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
              label="Email address"
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
          name="matricNumber"
          control={control}
          rules={{ required: 'Matric number is required', maxLength: 25 }}
          render={({ ref, ...rest }) => (
            <TextField
              {...rest}
              label="Matric Number"
              variant="outlined"
              required
              fullWidth
              inputRef={ref}
              error={getFormError('matricNumber', errors).hasError}
              helperText={getFormError('matricNumber', errors).message}
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
        <Controller
          name="level"
          control={control}
          render={({ ref, ...rest }) => (
            <TextField
              {...rest}
              label="Level"
              variant="outlined"
              select
              fullWidth
              inputRef={ref}
              error={getFormError('level', errors).hasError}
              helperText={getFormError('level', errors).message}>
              <LoadingView isLoading={isLoadingLevels} />
              {renderProgramLevels()}
            </TextField>
          )}
        />
        <Controller
          name="school"
          control={control}
          render={({ ref, ...rest }) => (
            <TextField
              {...rest}
              label="School"
              variant="outlined"
              fullWidth
              disabled
              inputRef={ref}
              error={getFormError('school', errors).hasError}
              helperText={getFormError('school', errors).message}
            />
          )}
        />
      </form>
    );
  };

  return (
    <UpsertWrapper
      onOkSuccess={onOkSuccess}
      updateId={existingUser?.id}
      roles={[UserRoles.SCHOOL_ADMIN]}
      renderComponent={({ onOkSuccess, ...props }) => (
        <Drawer
          {...props}
          title={'Update User'}
          open={open}
          onClose={onClose}
          okText={'Update User'}
          okButtonProps={{
            isLoading: loading,
          }}
          onOk={handleSubmit(onSubmit)}>
          {renderUpdateExistingUserForm()}
        </Drawer>
      )}
    />
  );
};

const useStyles = makeStyles((theme) => ({
  form: {
    '& > *': {
      marginTop: theme.spacing(6.5),
      marginBottom: theme.spacing(5),
    },
  },
}));

UpsertMigrationDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onOkSuccess: PropTypes.func,
  existingUser: PropTypes.shape({
    email: PropTypes.string,
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    middlename: PropTypes.string,
    phone: PropTypes.string,
    gender: PropTypes.string,
    department: PropTypes.string,
    matricNumber: PropTypes.string,
    level: PropTypes.string,
    school: PropTypes.string,
    id: PropTypes.string,
  }),
};

export default React.memo(UpsertMigrationDrawer);
