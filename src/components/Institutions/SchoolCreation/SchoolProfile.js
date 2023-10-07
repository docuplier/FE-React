import { Box, Button, Grid, InputAdornment, TextField, Typography } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { makeStyles } from '@material-ui/styles';
import { ReactComponent as Info } from 'assets/svgs/info.svg';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Banner from 'reusables/Banner';
import LoadingButton from 'reusables/LoadingButton';
import { InstitutionStatus } from 'utils/constants';
import { getFormError } from 'utils/formError';
import { getBaseDomain, parseUrl } from 'utils/TransformationUtils';
import { borderRadius, colors, fontFamily, fontSizes, fontWeight, spaces } from '../../../Css';

function SchoolProfile(props) {
  const { fieldInputs, handleInputChange, handleUpsert, isEditMode } = props;
  const classes = useStyles();
  const { control, errors, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (fieldInputs) {
      reset({
        name: fieldInputs.name,
        abbreviation: fieldInputs.abbreviation,
        description: fieldInputs.description,
        url: fieldInputs.subDomain,
        isActive: fieldInputs.status,
      });
    }
  }, [fieldInputs, reset]);

  const onSubmit = () => {
    handleUpsert();
  };

  const renderBanner = () => {
    return (
      isEditMode && (
        <Controller
          control={control}
          name="isActive"
          render={() => {
            const isActive = fieldInputs.status === InstitutionStatus.ACTIVE;

            return (
              <Banner
                showSwitch={true}
                title={isActive ? 'Active' : 'Inactive'}
                message="When a user deactivates a school, all the learners and instructors attached to the school should be notified of the action (by email and In-app notification)"
                checked={isActive}
                severity={isActive ? 'success' : 'error'}
                onToggleSwitch={(checked) => {
                  handleInputChange({
                    status: checked ? InstitutionStatus.ACTIVE : InstitutionStatus.IN_ACTIVE,
                  });
                }}
              />
            );
          }}
        />
      )
    );
  };

  return (
    <React.Fragment>
      <div className={classes.container}>
        <Typography className="header">School Profile</Typography>
      </div>
      <Box>
        <form noValidate onSubmit={handleSubmit(onSubmit)} className={classes.form}>
          {renderBanner()}
          <Grid container spacing={6}>
            <Grid item xs={9} className={classes.grid}>
              <Controller
                control={control}
                name="name"
                rules={{ required: true }}
                render={() => (
                  <TextField
                    name="name"
                    fullWidth
                    value={fieldInputs.name}
                    onChange={(e) => {
                      handleInputChange({ name: e.target.value });
                    }}
                    required
                    variant="outlined"
                    label="School name"
                    error={getFormError('name', errors).hasError}
                    helperText={getFormError('name', errors).message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={3} className={classes.grid}>
              <Controller
                control={control}
                name="abbreviation"
                rules={{ required: true }}
                render={() => (
                  <TextField
                    name="abbreviation"
                    className="input"
                    fullWidth
                    value={fieldInputs.abbreviation}
                    onChange={(e) => {
                      handleInputChange({ abbreviation: e.target.value });
                    }}
                    required
                    variant="outlined"
                    label="Name abbreviation"
                    error={getFormError('abbreviation', errors).hasError}
                    helperText={getFormError('abbreviation', errors).message}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Controller
            control={control}
            name="description"
            rules={{ required: true, maxLength: 250 }}
            render={() => (
              <TextField
                name="description"
                label="School description"
                multiline
                variant="outlined"
                fullWidth
                rows={5}
                value={fieldInputs.description}
                className={'description'}
                onChange={(e) => {
                  handleInputChange({ description: e.target.value });
                }}
                required
                error={getFormError('description', errors).hasError}
                helperText={getFormError('description', errors).message}
              />
            )}
          />

          <span className="character">
            Character {fieldInputs?.description?.length} / 250 words
          </span>
          <Controller
            control={control}
            name="url"
            rules={{ required: true }}
            render={() => (
              <TextField
                label="School url"
                variant="outlined"
                name="url"
                required
                value={fieldInputs.subDomain}
                onChange={(e) => {
                  handleInputChange({ subDomain: e.target.value });
                }}
                error={getFormError('url', errors).hasError}
                helperText={getFormError('url', errors).message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography>{getBaseDomain()}</Typography>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          <Box className={classes.info}>
            <Info />
            <Typography className="info-text">
              {fieldInputs?.subDomain && parseUrl(fieldInputs.subDomain)}
            </Typography>
          </Box>
          <Box className={classes.btn}>
            <Button variant="outlined" disabled>
              Back
            </Button>
            {!isEditMode && (
              <LoadingButton
                variant="contained"
                type="submit"
                color="primary"
                endIcon={<ArrowForwardIosIcon />}>
                Save & Next
              </LoadingButton>
            )}
          </Box>
        </form>
      </Box>
    </React.Fragment>
  );
}

SchoolProfile.propTypes = {};

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
  info: {
    width: '97% !important',
    border: `solid ${colors.primary} 1px`,
    background: colors.primaryLight,
    borderRadius: borderRadius.small,
    display: 'flex',
    alignItems: 'center',
    color: colors.primary,
    height: 55,
    paddingLeft: spaces.medium,
    marginRight: spaces.medium,

    '& .info-text': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: spaces.medium,
      [theme.breakpoints.down('sm')]: {
        fontSize: fontSizes.small,
      },
    },
  },
  form: {
    '& .section-title': {
      fontSize: fontSizes.xlarge,
      paddingTop: theme.spacing(6),
    },
    marginTop: spaces.large,
    '& > *': {
      width: '100%',
      marginBottom: spaces.medium,
    },
    '& > :first-child': {
      marginBottom: theme.spacing(12),
    },

    '& > :last-child': {
      marginBottom: 50,
    },
    '& .description': {
      marginBottom: 0,
    },
    '& .character': {
      display: 'flex',
      justifyContent: 'flex-end',
      fontSize: fontSizes.small,
      paddingBottom: spaces.small,
      paddingTop: theme.spacing(5),
      fontFamily: fontFamily.primary,
    },
  },
  grid: {
    '& .input': {
      [theme.breakpoints.down('sm')]: {
        width: '100%',
        marginBottom: spaces.medium,
      },
    },
    '& .input-right': {
      width: '100%',
      marginRight: spaces.medium,
    },
  },
  btn: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 50,
  },
}));

export default SchoolProfile;
