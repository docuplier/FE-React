import { makeStyles } from '@material-ui/styles';
import { useForm } from 'react-hook-form';
import { Dialog, Box, Typography, TextField, Select, Button } from '@material-ui/core';
import React from 'react';
import { useMutation, useQuery } from '@apollo/client';

import { getFormError } from 'utils/formError';
import { borderRadius, fontSizes, fontWeight, spaces, colors } from '../../../Css';
import { ADD_EDUCATION } from 'graphql/mutations/instrustorsRegistration';
import { useNotification } from 'reusables/NotificationBanner';
import LoadingButton from 'reusables/LoadingButton';
import { GET_COURSE_LIST } from 'graphql/queries/instructorsReg';

const EducationModal = ({ openModal, setOpenModal }) => {
  const classes = useStyles();
  const { register, handleSubmit, errors } = useForm();
  const notification = useNotification();

  const handleClose = () => {
    setOpenModal(false);
  };

  const { data: courses, loading: _isLoadingCourses } = useQuery(GET_COURSE_LIST, {
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const onSubmit = (data) => {
    const { institution, degree, startYear, endYear, field } = data;
    createEducation({
      variables: {
        school: institution,
        degree,
        startYear,
        endYear,
        fieldOfStudy: field,
      },
    });
  };

  const [createEducation, { loading: isLoading }] = useMutation(ADD_EDUCATION, {
    onCompleted: () => {
      notification.success({
        message: 'Publication created successfully',
      });
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  let currentYear = new Date().getFullYear();
  let earliestYear = 1950;
  let years = [];
  while (currentYear >= earliestYear) {
    years.push({ currentYear });
    currentYear -= 1;
  }

  return (
    <Dialog open={openModal} onClose={handleClose}>
      <Box className={classes.navbar}>
        <Typography className="nav-text">Educational history</Typography>
      </Box>
      <Box>
        <form className={classes.dialog} onSubmit={handleSubmit(onSubmit)}>
          <Box className={classes.form}>
            <TextField
              error={getFormError('institution', errors).hasError}
              size="medium"
              name="institution"
              inputRef={register({ required: true })}
              fullWidth={true}
              variant="outlined"
              label="Institution"
              helperText={getFormError('institution', errors).message}
            />
            <Select
              native
              fullWidth
              variant="outlined"
              name="degree"
              label="Degree"
              inputRef={register({ required: true })}
              error={getFormError('degree', errors).hasError}
              helperText={getFormError('degree', errors).message}>
              <option value="">Course</option>
              {courses?.courses?.results.map((course) => {
                return (
                  <option value={course?.title} key={course?.title}>
                    {course?.title}
                  </option>
                );
              })}
            </Select>
            <TextField
              variant="outlined"
              type="text"
              size="medium"
              name="field"
              inputRef={register({ required: true })}
              fullWidth={true}
              label="Field of study"
              error={getFormError('field', errors).hasError}
              helperText={getFormError('field', errors).message}
            />
            <Box className={classes.year}>
              <Select
                native
                variant="outlined"
                name="startYear"
                label="Start year"
                inputRef={register({ required: true })}
                error={getFormError('startYear', errors).hasError}
                helperText={getFormError('startYear', errors).message}>
                <option value="">Start year</option>
                {years?.map((year) => {
                  return (
                    <option key={year.currentYear} value={year.currentYear}>
                      {year.currentYear}
                    </option>
                  );
                })}
              </Select>
              <Select
                native
                variant="outlined"
                name="endYear"
                label="End year"
                inputRef={register({ required: true })}
                error={getFormError('startYear', errors).hasError}
                helperText={getFormError('startYear', errors).message}>
                <option value="">End year</option>
                {years?.map((year) => {
                  return (
                    <option key={year.currentYear} value={year.currentYear}>
                      {year.currentYear}
                    </option>
                  );
                })}
              </Select>
            </Box>
          </Box>
          <Box className={classes.footer}>
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <LoadingButton type="submit" isLoading={isLoading} variant="contained" color="primary">
              Save
            </LoadingButton>
          </Box>
        </form>
      </Box>
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  navbar: {
    width: '100%',
    height: 73,
    background: colors.white,
    boxShadow: `inset 0px -1px 0px #E7E7ED`,
    '& .nav-text': {
      fontWeight: fontWeight.bold,
      fontSize: fontSizes.xlarge,
      padding: spaces.medium,
    },
  },
  dialog: {
    background: '#F6F7F7',
  },
  form: {
    padding: '50px 20px',
    '& > *': {
      marginBottom: spaces.medium,
    },
  },
  year: {
    '& > *': {
      width: '47.5%',
    },
    '& > :first-child': {
      marginRight: 22,
    },
    [theme.breakpoints.down('sm')]: {
      '& > *': {
        width: '100%',
        marginBottom: spaces.medium,
      },
    },
  },
  footer: {
    width: '100%',
    height: 73,
    marginBottom: 0,
    boxShadow: `inset 0px 1px 0px #E7E7ED`,
    display: 'flex',
    background: colors.white,
    justifyContent: 'flex-end',
    '& > *': {
      marginRight: spaces.medium,
      marginBottom: spaces.small,
      marginTop: spaces.small,
      width: 85,
      borderRadius: borderRadius.default,
    },
  },
}));
export default EducationModal;
