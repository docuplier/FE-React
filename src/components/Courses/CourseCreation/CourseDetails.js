import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Controller } from 'react-hook-form';
import { Box, TextField, Typography, Grid, MenuItem, Divider, Paper } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { Autocomplete } from '@material-ui/lab';
import { useQuery } from '@apollo/client';

import { fontWeight, fontSizes, fontFamily, colors, spaces } from '../../../Css';
import { useQueryPagination } from 'hooks/useQueryPagination';
import { getFormError } from 'utils/formError';
import LoadingButton from 'reusables/LoadingButton';
import { GET_DEPARTMENTS_QUERY } from 'graphql/queries/institution';
import Wysiwyg from 'reusables/Wysiwyg';
import FileUpload from 'reusables/FileUpload';
import { ImageUploadFormats, DEFAULT_PAGE_LIMIT, UserRoles } from 'utils/constants';
import { useNotification } from 'reusables/NotificationBanner';
import { GET_USERS } from 'graphql/queries/users';
import AddOtherDepartmentsModal from './AddOtherDepartmentsModal';

function CourseDetails(props) {
  const { control, errors, watch, onHandleSubmit, courseData, setFormValue } = props;
  const [lecturerName, setLecturerName] = useState('');
  const [isAddOtherDepartmentsModalVisible, setIsAddOtherDepartmentsModalVisible] = useState(false);
  const classes = useStyles();
  const notification = useNotification();
  const otherDepartments = watch('secondaryDepartments', []);

  const { data: departmentsData } = useQuery(GET_DEPARTMENTS_QUERY, {
    onError,
  });

  const { loading: lecturersListLoading, data: lecturersListData } = useQueryPagination(GET_USERS, {
    variables: {
      search: lecturerName,
      limit: DEFAULT_PAGE_LIMIT,
      ordering: null,
      role: UserRoles.LECTURER,
    },
  });

  function onError(error) {
    notification.error({
      message: 'Error!',
      description: error?.message,
    });
  }

  const getInstructorOptions = (addedInstructors) => {
    const idsOfAddedInstructors = addedInstructors?.map((instructor) => instructor.id);
    idsOfAddedInstructors.push(courseData?.leadInstructor?.id);

    return (
      lecturersListData?.users?.results?.filter(
        (instructor) => idsOfAddedInstructors.indexOf(instructor.id) === -1,
      ) || []
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onHandleSubmit();
  };

  const handleOpenAddOtherDepartmentsModal = (evt) => {
    evt.preventDefault();
    setIsAddOtherDepartmentsModalVisible(true);
  };

  const renderSectionTitle = (title) => {
    return (
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="body2">{title}</Typography>{' '}
        <Divider style={{ flex: 1, marginLeft: 20 }} />
      </Box>
    );
  };

  const renderDepartments = () =>
    departmentsData?.departments?.results.map((department) => (
      <MenuItem key={department.id} value={department.id}>
        {department.name}
      </MenuItem>
    ));

  const renderOtherDepartments = () => {
    return (
      <Controller
        name="secondaryDepartments"
        control={control}
        render={({ value }) => {
          const wording =
            value?.length === 1
              ? `1 other department has`
              : `${value?.length} other departments have`;

          return (
            <Box
              component={Paper}
              p={8}
              elevation={0}
              className={classes.otherDepartments}
              display="flex"
              justifyContent="center"
            >
              <Box maxWidth={310} textAlign="center">
                {value?.length > 0 && (
                  <Typography variant="body1" color="textPrimary" className="boldText">
                    {wording} direct access to this course
                  </Typography>
                )}
                <Box display="flex" mt={2}>
                  <Typography
                    component="a"
                    onClick={handleOpenAddOtherDepartmentsModal}
                    color="primary"
                    href="#"
                    variant="body2"
                    className="clickHereButton boldText"
                  >
                    Click here
                  </Typography>
                  <Typography color="textSecondary" variant="body2" style={{ marginLeft: 4 }}>
                    to add other departments with levels
                  </Typography>
                </Box>
              </Box>
            </Box>
          );
        }}
      />
    );
  };

  return (
    <React.Fragment>
      <Box className={classes.container} mb={10}>
        <Typography className="header">Course Details</Typography>
      </Box>
      <Box>
        <form onSubmit={handleSubmit} className={classes.form}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              {renderSectionTitle('Course description')}
              <Controller
                name="description"
                control={control}
                render={({ onChange, value }) => {
                  return <Wysiwyg value={value} onChange={(value) => onChange(value)} />;
                }}
              />
            </Grid>
            <Grid item xs={12}>
              {renderSectionTitle('Course Thumbnail')}
              <Controller
                name="banner"
                control={control}
                render={({ onChange, value, ...rest }) => (
                  <FileUpload
                    accept={ImageUploadFormats}
                    onChange={(file) => onChange(file)}
                    file={value}
                    {...rest}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="department"
                control={control}
                render={({ ref, ...rest }) => (
                  <TextField
                    {...rest}
                    label="Primary Department"
                    variant="outlined"
                    select
                    fullWidth
                    inputRef={ref}
                    error={getFormError('department', errors).hasError}
                    helperText={getFormError('department', errors).message}
                  >
                    {departmentsData?.departments?.results === 0 && (
                      <MenuItem value="">No Level</MenuItem>
                    )}
                    {renderDepartments()}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="unit"
                control={control}
                rules={{
                  required: true,
                  min: { value: 0, message: 'Value cannot be less than 0' },
                }}
                render={({ ref, ...rest }) => (
                  <TextField
                    {...rest}
                    label="Course unit"
                    variant="outlined"
                    type="number"
                    fullWidth
                    inputRef={ref}
                    error={getFormError('unit', errors).hasError}
                    helperText={getFormError('unit', errors).message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              {renderOtherDepartments()}
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="instructors"
                control={control}
                render={({ ref, value, onChange, ...rest }) => (
                  <Autocomplete
                    multiple
                    id="assistant-lecturers"
                    inputValue={lecturerName}
                    value={value}
                    onChange={(event, newValue) => {
                      onChange(newValue);
                    }}
                    onInputChange={(event, newInputValue) => {
                      setLecturerName(newInputValue);
                    }}
                    options={getInstructorOptions(value)}
                    getOptionLabel={(user) => user?.firstname + ' ' + user?.lastname}
                    renderOption={(user) => (
                      <>
                        {user?.firstname} {user?.lastname}
                      </>
                    )}
                    loading={lecturersListLoading}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField {...params} variant="outlined" label="Instructors" />
                    )}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              {renderSectionTitle('What you will learn')}
              <Controller
                name="objectives"
                control={control}
                render={({ onChange, value }) => (
                  <Wysiwyg value={value} onChange={(value) => onChange(value)} />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mt={25}>
                <span></span>
                <LoadingButton
                  variant="contained"
                  type="submit"
                  color="primary"
                  endIcon={<ArrowForwardIosIcon />}
                >
                  Save & Next
                </LoadingButton>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
      <AddOtherDepartmentsModal
        open={isAddOtherDepartmentsModalVisible}
        onClose={() => setIsAddOtherDepartmentsModalVisible(false)}
        data={otherDepartments}
        onUpdate={(otherDepartments) => setFormValue('secondaryDepartments', otherDepartments)}
      />
    </React.Fragment>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    maxWidth: 800,
    '& .header': {
      fontWeight: fontWeight.medium,
      fontSize: fontSizes.title,
      color: colors.black,
      fontFamily: fontFamily.primary,
      padding: 0,
    },
  },
  form: {
    '& > * > *': {
      marginBottom: spaces.medium,
    },
  },
  otherDepartments: {
    background: '#F6F7F7',
    border: `1px solid #E5E5EA`,
    '& .boldText': {
      fontWeight: fontWeight.bold,
    },
    '& .clickHereButton': {
      textDecoration: 'none',
    },
  },
}));

export default CourseDetails;
