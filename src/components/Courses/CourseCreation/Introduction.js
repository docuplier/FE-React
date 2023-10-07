import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Controller } from 'react-hook-form';
import { Box, TextField, Typography, Grid, Paper } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

import { fontWeight, fontSizes, fontFamily, colors, spaces } from '../../../Css';
import LoadingButton from 'reusables/LoadingButton';

function Introduction(props) {
  const { handleNextTab, control } = props;
  const classes = useStyles();

  const inputProps = {
    fullWidth: true,
    disabled: true,
    InputLabelProps: {
      shrink: true,
    },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleNextTab(1);
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
              <Controller
                control={control}
                name="title"
                rules={{ required: true }}
                render={({ ref, ...rest }) => (
                  <TextField
                    {...rest}
                    {...inputProps}
                    inputRef={ref}
                    variant="outlined"
                    label="Course title"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="code"
                rules={{ required: true }}
                render={({ ref, ...rest }) => (
                  <TextField
                    {...rest}
                    {...inputProps}
                    inputRef={ref}
                    name="code"
                    variant="outlined"
                    label="Course code"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="leadInstructor"
                control={control}
                rules={{ required: true }}
                render={({ ref, ...rest }) => (
                  <TextField
                    {...rest}
                    {...inputProps}
                    inputRef={ref}
                    name="leadInstructor"
                    variant="outlined"
                    label="Lead instructor"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="categories"
                control={control}
                rules={{ required: true }}
                render={({ ref, value }) => (
                  <Paper elevation={1} style={{ border: '1px solid #CDCED9' }}>
                    <Box padding={6}>
                      <Typography variant="body1" style={{ color: colors.disabled }}>
                        Categories
                      </Typography>
                      <Box pt={4}>
                        <Typography variant="body1" style={{ color: colors.disabled }}>
                          {value.map((category) => category.title).join(', ')}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
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
                  endIcon={<ArrowForwardIosIcon />}>
                  Start
                </LoadingButton>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    </React.Fragment>
  );
}

Introduction.propTypes = {};

const useStyles = makeStyles({
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
      marginBottom: spaces.small,
    },
  },
});

export default Introduction;
