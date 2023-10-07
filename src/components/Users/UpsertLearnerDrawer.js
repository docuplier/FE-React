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
import { formatProgramType } from 'utils/program';
import { useNotification } from 'reusables/NotificationBanner';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import {
  GET_FACULTIES_QUERY,
  GET_DEPARTMENTS_QUERY,
  GET_PROGRAMS_QUERY,
  GET_LEVELS_QUERY,
} from 'graphql/queries/institution';
import LoadingView from 'reusables/LoadingView';
import UpsertWrapper from './UpsertWrapper';
import { convertToSentenceCase } from 'utils/TransformationUtils';
import LearnerCSVSample from 'assets/csv/student-csv-sample.csv';
import FileUpload from 'reusables/FileUpload';

const UpsertLearnerDrawer = ({
  open,
  onClose,
  learner,
  hideFaculty,
  hideDepartment,
  onOkSuccess,
}) => {
  const classes = useStyles();
  const isEditing = Boolean(learner);
  const { userDetails } = useAuthenticatedUser();
  const notification = useNotification();
  const { handleSubmit, control, errors, reset, watch, setValue } = useForm();
  const { faculty, program, title, programType } = watch();

  useEffect(() => {
    if (open && learner) {
      reset({
        title: learner?.title || null,
        email: learner?.email || null,
        firstname: learner?.firstname || null,
        lastname: learner?.lastname || null,
        middlename: learner?.middlename || null,
        phone: learner?.phone || null,
        gender: learner?.gender || null,
        faculty: learner?.faculty || null,
        department: learner?.department || null,
        matricNumber: learner?.matricNumber || null,
        program: learner?.program || null,
        programType: learner?.programType || null,
        level: learner?.level || null,
      });
    } else {
      reset({});
    }
    // eslint-disable-next-line
  }, [learner, open]);

  useEffect(() => {
    if (title === UserTitleType.MR) {
      setValue('gender', GenderType.MALE);
    } else {
      setValue('gender', GenderType.FEMALE);
    }
    // eslint-disable-next-line
  }, [title]);

  const { data: facultiesData, loading: isLoadingFaculties } = useQuery(GET_FACULTIES_QUERY, {
    variables: { institutionId: userDetails?.institution.id, active: true, asFilter: true },
    skip: !open,
    onError,
  });

  const { data: programsData, loading: isLoadingPrograms } = useQuery(GET_PROGRAMS_QUERY, {
    variables: { institutionId: userDetails?.institution?.id },
    skip: !open,
    onError,
  });

  const programsDataResults = programsData?.programs?.results || [];

  const { data: departmentsData, loading: isLoadingDepartments } = useQuery(GET_DEPARTMENTS_QUERY, {
    variables: { facultyId: faculty, active: true },
    skip: !faculty,
    onError,
  });

  const { data: levelsData, loading: isLoadingLevel } = useQuery(GET_LEVELS_QUERY, {
    variables: { facultyId: faculty, active: true, program: program, programType: programType },
    skip: !program,
    onError,
  });

  function onError(error) {
    notification.error({
      message: error?.message,
    });
  }

  const renderProgramMenuItem = () =>
    programsDataResults?.map((program) => (
      <MenuItem key={program.id} value={program.id}>
        {program.name}
      </MenuItem>
    ));

  const renderProgramTypeMenuItem = () =>
    formatProgramType(programsDataResults, program).map((program) => (
      <MenuItem key={program.value} value={program.value}>
        {convertToSentenceCase(program.name)}
      </MenuItem>
    ));

  const renderProgramLevels = () =>
    levelsData?.levels?.results?.map((level) => (
      <MenuItem key={level.id} value={level.id}>
        {level.name}
      </MenuItem>
    ));

  const { totalCount = 0, results = [] } = departmentsData?.departments || {};
  const activeDepartments = results.filter((department) => department.isActive);

  const renderDepartmentLists = () => {
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
          name="program"
          control={control}
          rules={{ required: true, maxLength: 250 }}
          render={({ ref, ...rest }) => (
            <TextField
              {...rest}
              label="Academic Program"
              variant="outlined"
              required
              select
              fullWidth
              inputRef={ref}
              error={getFormError('program', errors).hasError}
              helperText={getFormError('program', errors).message}>
              <LoadingView isLoading={isLoadingPrograms} />
              {renderProgramMenuItem()}
            </TextField>
          )}
        />
        <Controller
          name="programType"
          control={control}
          rules={{ required: 'Program type is required', maxLength: 250 }}
          render={({ ref, value, ...rest }) => (
            <TextField
              {...rest}
              label="Program Type"
              variant="outlined"
              required
              select
              fullWidth
              defaultValue={value}
              disabled={!program}
              inputRef={ref}
              error={getFormError('programType', errors).hasError}
              helperText={
                getFormError('programType', errors).message ||
                (!program ? 'Select an academic program to enable this field' : '')
              }>
              {!!program && renderProgramTypeMenuItem()}
            </TextField>
          )}
        />
        {!hideFaculty && (
          <Controller
            name="faculty"
            control={control}
            rules={{ required: true }}
            render={({ ref, value, ...rest }) => {
              return (
                <TextField
                  {...rest}
                  label="Faculty"
                  variant="outlined"
                  required
                  select
                  fullWidth
                  defaultValue={value}
                  inputRef={ref}
                  error={getFormError('faculty', errors).hasError}
                  helperText={getFormError('faculty', errors).message}>
                  <LoadingView isLoading={isLoadingFaculties} />
                  {Array.isArray(facultiesData?.faculties?.results) &&
                    facultiesData?.faculties?.results.map((faculty) => (
                      <MenuItem key={faculty.id} value={faculty.id}>
                        {faculty.name}
                      </MenuItem>
                    ))}
                </TextField>
              );
            }}
          />
        )}
        <Controller
          name="level"
          control={control}
          render={({ ref, value, ...rest }) => (
            <TextField
              {...rest}
              label="Level"
              variant="outlined"
              defaultValue={value}
              select
              fullWidth
              disabled={!program}
              inputRef={ref}
              error={getFormError('level', errors).hasError}
              helperText={
                getFormError('level', errors).message ||
                (!program ? 'Select an academic program to enable this field' : '')
              }>
              <LoadingView isLoading={isLoadingLevel} />
              {levelsData?.levels?.results.length === 0 && <MenuItem value="">No Level</MenuItem>}
              {!!program && renderProgramLevels()}
            </TextField>
          )}
        />
        {!hideDepartment && (
          <Controller
            name="department"
            control={control}
            rules={{ required: activeDepartments?.length > 0 ? true : false }}
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
        )}
      </>
    );
  };

  const renderManualInvite = () => {
    return (
      <form noValidate autoComplete="off" className={classes.form}>
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
                select
                fullWidth
                InputLabelProps={{ shrink: true }}
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
            {...rest}
            accept={WorksheetUploadFormats}
            onChange={(file) => onChange(file)}
            fileSample={LearnerCSVSample}
            file={value}
          />
        )}
      />
    );
  };

  return (
    <UpsertWrapper
      onOkSuccess={onOkSuccess}
      updateId={learner?.id}
      roles={[UserRoles.STUDENT]}
      renderComponent={({ onSubmit, isLoading, onOkSuccess, ...props }) => (
        <Drawer
          {...props}
          open={open}
          onClose={onClose}
          title={isEditing ? 'Edit Student' : 'Add New Student'}
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

UpsertLearnerDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  hideFaculty: PropTypes.bool,
  hideDepartment: PropTypes.bool,
  onOkSuccess: PropTypes.func,
  learner: PropTypes.shape({
    title: PropTypes.string,
    email: PropTypes.string,
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    middlename: PropTypes.string,
    phone: PropTypes.string,
    gender: PropTypes.string,
    faculty: PropTypes.string,
    department: PropTypes.string,
    matricNumber: PropTypes.string,
    program: PropTypes.string,
    programType: PropTypes.string,
    level: PropTypes.string,
    id: PropTypes.string,
  }),
};

export default React.memo(UpsertLearnerDrawer);
