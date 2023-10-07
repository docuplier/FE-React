import React, { useState, useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/styles';
import { useForm, Controller } from 'react-hook-form';
import { useHistory, useLocation } from 'react-router-dom';
import {
  Box,
  TextField,
  Typography,
  Grid,
  Tabs,
  Tab,
  Button,
  Paper,
  MenuItem,
} from '@material-ui/core';
import { useQuery, useMutation } from '@apollo/client';
import { Autocomplete } from '@material-ui/lab';

import { useNotification } from 'reusables/NotificationBanner';
import FileUpload from 'reusables/FileUpload';
import { GET_LEVELS_QUERY } from 'graphql/queries/institution';
import { GET_COURSE_BY_ID } from 'graphql/queries/courses';
import { CREATE_COURSE, UPDATE_COURSE } from 'graphql/mutations/course';
import CourseCSVSample from 'assets/csv/course-csv-sample.csv';
import {
  WorksheetUploadFormats,
  DEFAULT_PAGE_LIMIT,
  UserRoles,
  CourseStatus,
  ImageUploadFormats,
} from 'utils/constants';
import { getFormError } from 'utils/formError';
import { convertToSentenceCase } from 'utils/TransformationUtils';
import { GET_USERS } from 'graphql/queries/users';
import { useQueryPagination } from 'hooks/useQueryPagination';
import RegistrationLayout from 'Layout/RegistrationLayout';
import LoadingView from 'reusables/LoadingView';
import { fontWeight, fontSizes, fontFamily, colors, spaces } from '../../Css';
import CourseCreationCategoryDrawer from '../../components/Courses/CourseCreation/CourseCreationCategoryDrawer';
import { BULK_UPLOAD_RESOURCE } from 'graphql/mutations/courses';
import { PrivatePaths } from 'routes';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import { GET_DEPARTMENTS_QUERY } from 'graphql/queries/institution';
import { GET_FACULTIES_QUERY } from 'graphql/queries/institution';

const defaultValues = {
  title: '',
  code: '',
  unit: '',
  level: '',
  faculty: '',
  department: '',
  banner: null,
  leadInstructor: null,
};

function SchoolAdminCourseRegistration() {
  const classes = useStyles();
  const history = useHistory();
  const [tabValue, setTabValue] = useState(0);
  const { search } = useLocation();
  const courseId = new URLSearchParams(search).get('courseId');
  const isEditMode = Boolean(courseId);
  const { control, errors, handleSubmit, reset, watch } = useForm({
    defaultValues,
  });

  const [lecturerName, setLecturerName] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const notification = useNotification();
  const [courseCategoryDrawer, setcourseCategoryDrawer] = useState(false);
  const { userDetails } = useAuthenticatedUser();
  const institutionId = userDetails?.institution.id;
  const facultyId = watch('faculty');

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const { data: courseData, loading: fetchCourseLoading } = useQuery(GET_COURSE_BY_ID, {
    variables: {
      courseId,
    },
    skip: !courseId,
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });
  let course = courseData?.course;

  const { loading: usersLoading, data: usersData } = useQueryPagination(GET_USERS, {
    variables: {
      search: lecturerName,
      limit: DEFAULT_PAGE_LIMIT,
      ordering: null,
      role: UserRoles.LECTURER,
    },
  });

  const { data: levelsData } = useQuery(GET_LEVELS_QUERY, {
    variables: {},
    onError,
  });

  const [createCourse, { loading: newCourseLoading }] = useMutation(CREATE_COURSE, {
    onCompleted: (response) => onCompleted(response, 'createCourse'),
    onError,
  });

  const [updateCourse, { loading: courseUpdateLoading }] = useMutation(UPDATE_COURSE, {
    onCompleted: (response) => onCompleted(response, 'updateCourse'),
    onError,
  });

  const { data: facultiesData, loading: isLoadingFaculties } = useQuery(GET_FACULTIES_QUERY, {
    skip: !institutionId,
    variables: { institutionId, active: true, asFilter: true },
    onError: function onError(error) {
      notification.error({
        message: error?.message,
      });
    },
  });

  const { data: departmentsData, loading: isLoadingDepartments } = useQuery(GET_DEPARTMENTS_QUERY, {
    skip: !facultyId,
    variables: {
      facultyId,
    },
    onError,
  });

  const [uploadResourceMutation, { loading: uploadCourseLoading }] = useMutation(
    BULK_UPLOAD_RESOURCE,
    {
      onCompleted: (response) => {
        const { success, errors } = response.bulkUpload;
        if (success) {
          notification.success({
            message: 'Courses uploaded successfully',
          });
          handleClose();
          reset({ ...defaultValues });
        }
        if (errors) {
          notification.error({
            message: errors.messages,
          });
        }
      },
    },
  );

  function onCompleted(response, key) {
    const { ok, errors, course } = response[key];
    const status = ok === false ? 'error' : 'success';
    const message = errors
      ? errors?.map((error) => error.messages).join('. ')
      : `${course?.title} course has been ${
          course?.status === CourseStatus.DRAFT ? 'saved as draft' : 'published successfully'
        }`;

    notification[status]({
      message: `${convertToSentenceCase(status)}!`,
      description: message,
    });
    handleClose();
    reset({ ...defaultValues });
  }

  function onError(error) {
    notification.error({
      message: 'Error!',
      description: error?.message,
    });
  }

  const onSubmit = (variables, status) => {
    if (!!variables.file) {
      uploadResourceMutation({
        variables: {
          uploadDetails: {
            resourceName: 'course',
            file: variables.file,
          },
        },
      });
      return;
    }

    if (Boolean(variables?.level) === false) {
      delete variables?.level;
    }

    if (isEditMode) {
      let updateVariables = {
        id: courseId,
        newCourse: {
          ...variables,
          leadInstructor: variables?.leadInstructor?.id,
          status,
          categories: selectedCategories,
        },
      };

      delete updateVariables?.newCourse?.banner;
      delete updateVariables?.newCourse?.faculty;
      if (variables?.banner !== null && Boolean(variables?.banner?.previewUrl) === false) {
        updateVariables.banner = variables?.banner;
      }
      updateCourse({
        variables: updateVariables,
      });
    } else {
      let createVariables = {
        newCourse: {
          ...variables,
          leadInstructor: variables?.leadInstructor?.id,
          status,
          categories: selectedCategories,
          instructors: [],
        },
      };

      delete createVariables?.newCourse?.faculty;
      createCourse({
        variables: createVariables,
      });
    }
  };

  useEffect(() => {
    if (course) {
      reset({
        title: course?.title,
        code: course?.code,
        unit: course?.unit,
        level: course?.level?.id,
        faculty: course?.department?.faculty?.id,
        department: course?.department?.id,
        banner: !!course?.banner ? { name: course?.banner, previewUrl: course?.banner } : null,
        leadInstructor: course?.leadInstructor,
      });
    }
    const courseCategories = course?.categories?.map((category) => category?.id);
    setSelectedCategories(courseCategories);
    // eslint-disable-next-line
  }, [course]);

  const getHeaderButtonProps = () => {
    return [
      {
        text: 'Save as draft',
        variant: 'outlined',
        onClick: handleSubmit((variables) => onSubmit(variables, CourseStatus.DRAFT)),
      },
      {
        text: 'Publish course',
        variant: 'contained',
        color: 'primary',
        onClick: handleSubmit((variables) => onSubmit(variables, CourseStatus.PUBLISHED)),
      },
    ];
  };

  const handleClose = () => {
    if (isEditMode) {
      history.push(`${PrivatePaths.COURSES}/${courseId}`);
    } else {
      history.push(`${PrivatePaths.COURSES}/all`);
    }
  };

  const renderTabs = () => {
    return (
      <Box mb={10}>
        <StyledTabs value={tabValue} onChange={handleChange} aria-label="styled tabs example">
          <StyledTab label="Single course" />
          <StyledTab label="Bulk course" disabled={isEditMode} />
        </StyledTabs>
      </Box>
    );
  };

  const renderFileUpload = () => (
    <Controller
      name="banner"
      control={control}
      render={({ onChange, value, ...rest }) => (
        <FileUpload
          accept={ImageUploadFormats}
          onChange={(file) => onChange(file)}
          file={value}
          id="upload-course-banner"
          {...rest}
        />
      )}
    />
  );

  const renderDepartmentLevels = () =>
    levelsData?.levels?.results.map((level) => (
      <MenuItem key={level.id} value={level.id}>
        {level.name}
      </MenuItem>
    ));

  const renderFacultyList = () =>
    facultiesData?.faculties?.results?.map((faculty) => (
      <MenuItem key={faculty.id} value={faculty.id}>
        {faculty.name}
      </MenuItem>
    ));

  const renderDepartments = () =>
    departmentsData?.departments?.results?.map((department) => (
      <MenuItem key={department.id} value={department.id}>
        {department.name}
      </MenuItem>
    ));

  const renderSingleCreation = () => {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Controller
            name="title"
            control={control}
            rules={{
              required: 'Course title is required',
            }}
            render={({ ...rest }) => (
              <TextField
                {...rest}
                fullWidth
                required
                variant="outlined"
                label="Course title"
                error={getFormError('title', errors).hasError}
                helperText={getFormError('title', errors).message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="code"
            rules={{
              required: 'Course code is required',
            }}
            control={control}
            render={({ ...rest }) => (
              <TextField
                {...rest}
                fullWidth
                required
                variant="outlined"
                label="Course code"
                error={getFormError('code', errors).hasError}
                helperText={getFormError('code', errors).message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="unit"
            rules={{
              required: 'Course unit is required',
            }}
            control={control}
            render={({ ...rest }) => (
              <TextField
                {...rest}
                required
                type="number"
                fullWidth
                variant="outlined"
                label="Course unit"
                error={getFormError('unit', errors).hasError}
                helperText={getFormError('unit', errors).message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="faculty"
            control={control}
            rules={{ required: true }}
            render={({ ref, ...rest }) => {
              return (
                <TextField
                  {...rest}
                  label="Select Faculty"
                  variant="outlined"
                  required
                  select
                  fullWidth
                  inputRef={ref}
                  error={getFormError('faculty', errors).hasError}
                  helperText={getFormError('faculty', errors).message}>
                  <LoadingView isLoading={isLoadingFaculties} />
                  {renderFacultyList()}
                </TextField>
              );
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="department"
            control={control}
            render={({ ref, ...rest }) => {
              return (
                <TextField
                  {...rest}
                  label="Select Department"
                  variant="outlined"
                  select
                  fullWidth
                  inputRef={ref}
                  error={getFormError('department', errors).hasError}
                  helperText={getFormError('department', errors).message}>
                  {departmentsData?.departments?.results?.length === 0 && (
                    <MenuItem value="">No Department</MenuItem>
                  )}
                  <LoadingView isLoading={isLoadingDepartments} />
                  {renderDepartments()}
                </TextField>
              );
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="level"
            control={control}
            render={({ value, ...rest }) => (
              <TextField
                {...rest}
                fullWidth
                value={value}
                select
                variant="outlined"
                label="Course level (optional)"
                error={getFormError('level', errors).hasError}
                helperText={getFormError('level', errors).message}>
                {levelsData?.levels?.results?.length === 0 && (
                  <MenuItem value="">No Level</MenuItem>
                )}
                {renderDepartmentLevels()}
              </TextField>
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="leadInstructor"
            control={control}
            rules={{
              required: 'Lead instructor is required',
            }}
            render={({ onChange, value, ...rest }) => (
              <Autocomplete
                {...rest}
                value={value}
                onChange={(event, newValue) => {
                  onChange(newValue);
                }}
                inputValue={lecturerName}
                onInputChange={(event, newInputValue) => {
                  setLecturerName(newInputValue);
                }}
                id="lecturers-autocomplete"
                loading={usersLoading}
                options={usersData?.users?.results || []}
                fullWidth
                getOptionLabel={(user) => user?.firstname + ' ' + user?.lastname}
                renderOption={(user) => (
                  <>
                    {user?.firstname} {user?.lastname}
                  </>
                )}
                renderInput={(params) => (
                  <TextField
                    {...rest}
                    {...params}
                    required
                    fullWidth
                    label="Lead instructor"
                    variant="outlined"
                    error={getFormError('leadInstructor', errors).hasError}
                    helperText={getFormError('leadInstructor', errors).message}
                  />
                )}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          {renderFileUpload()}
        </Grid>
        <Grid item xs={12}>
          <Box
            mb={5}
            component={Paper}
            elavation={1}
            style={{ border: '1px dashed #CDCED9', background: '#fff' }}>
            <Box
              component={Button}
              onClick={() => setcourseCategoryDrawer(true)}
              style={{ textAlign: 'center', width: '100%' }}>
              <Typography
                color="textSecondary"
                variant="body1"
                style={{ padding: 20, color: colors.primary }}>
                Click here to add Course categories
              </Typography>
            </Box>
          </Box>
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
              />
            )}
          />
        </Grid>
      </Grid>
    );
  };

  return (
    <LoadingView
      isLoading={
        newCourseLoading || uploadCourseLoading || fetchCourseLoading || courseUpdateLoading
      }
      size={60}>
      <RegistrationLayout
        onClose={handleClose}
        title="Course creation"
        hasHeaderButton
        headerButtons={getHeaderButtonProps()}>
        <Box display="flex" justifyContent="center">
          <Box width="100%" maxWidth={750}>
            <Box className={classes.container} mb={10}>
              <Typography className="header">Course Details</Typography>
            </Box>
            <Box component="div">
              <Grid item xs={12}>
                {renderTabs()}
              </Grid>
              <form className={classes.form}>
                {tabValue === 0 && renderSingleCreation()}
                {tabValue === 1 && renderBulkUpload()}
              </form>
            </Box>
          </Box>
          <CourseCreationCategoryDrawer
            open={courseCategoryDrawer}
            onClose={() => setcourseCategoryDrawer(false)}
            setSelectedCategories={(categories) => setSelectedCategories(categories)}
          />
        </Box>
      </RegistrationLayout>
    </LoadingView>
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
  option: {
    fontSize: 15,
    '& > span': {
      marginRight: 10,
      fontSize: 18,
    },
  },
  form: {
    '& > * > *': {
      marginBottom: spaces.medium,
    },
  },
}));

const StyledTabs = withStyles({
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    '& > span': {
      width: '100%',
      backgroundColor: colors.primary,
      borderRadius: '5px 5px 0 0',
    },
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(15),
    opacity: 1,
  },
  selected: {
    color: colors.primary,
  },
}))((props) => <Tab disableRipple {...props} />);

export default SchoolAdminCourseRegistration;
