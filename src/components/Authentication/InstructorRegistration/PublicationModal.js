import { makeStyles } from '@material-ui/styles';
import { useForm } from 'react-hook-form';
import { Dialog, Box, Typography, TextField, Select, Button } from '@material-ui/core';
import React from 'react';
import { useMutation } from '@apollo/client';

import { getFormError } from 'utils/formError';
import { borderRadius, fontSizes, fontWeight, spaces, colors } from '../../../Css';
import { ADD_PUBLICATION } from 'graphql/mutations/instrustorsRegistration';
import { useNotification } from 'reusables/NotificationBanner';
import LoadingButton from 'reusables/LoadingButton';

const PublicationModal = ({ openModal, setOpenModal }) => {
  const classes = useStyles();
  const { register, handleSubmit, errors } = useForm();
  const notification = useNotification();
  const handleClose = () => {
    setOpenModal(false);
  };

  const onSubmit = (data) => {
    const { publication, journal, year, url } = data;
    createPublication({
      variables: {
        journalName: journal,
        name: publication,
        year,
        url,
      },
    });
  };

  const [createPublication, { loading: isLoading }] = useMutation(ADD_PUBLICATION, {
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
        <Typography className="nav-text">Add Journal</Typography>
      </Box>
      <Box>
        <form className={classes.dialog} onSubmit={handleSubmit(onSubmit)}>
          <Box className={classes.form}>
            <TextField
              error={getFormError('publication', errors).hasError}
              size="medium"
              name="publication"
              inputRef={register({ required: true })}
              fullWidth={true}
              variant="outlined"
              label="Name of publication"
              helperText={getFormError('publication', errors).message}
            />
            <TextField
              variant="outlined"
              type="text"
              size="medium"
              name="journal"
              inputRef={register({ required: true })}
              fullWidth={true}
              label="Journal name"
              error={getFormError('journal', errors).hasError}
              helperText={getFormError('journal', errors).message}
            />
            <Select
              native
              fullWidth
              variant="outlined"
              name="year"
              label="Year of publication"
              inputRef={register({ required: true })}
              error={getFormError('year', errors).hasError}
              helperText={getFormError('year', errors).message}>
              <option value="">Year of publication</option>
              {years?.map((year) => {
                return (
                  <option key={year.currentYear} value={year.currentYear}>
                    {year.currentYear}
                  </option>
                );
              })}
            </Select>
            <TextField
              variant="outlined"
              type="text"
              size="medium"
              name="url"
              inputRef={register({ required: true })}
              fullWidth={true}
              label="url"
              error={getFormError('url', errors).hasError}
              helperText={getFormError('url', errors).message}
            />
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
export default PublicationModal;
