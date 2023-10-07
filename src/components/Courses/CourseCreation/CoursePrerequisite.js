import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Controller } from 'react-hook-form';
import { Box, TextField, Typography, IconButton, Button } from '@material-ui/core';
import {
  ArrowForward as ArrowForwardIosIcon,
  Close as CloseIcon,
  Add as AddIcon,
} from '@material-ui/icons';

import { fontWeight, fontSizes, colors, spaces } from '../../../Css';
import LoadingButton from 'reusables/LoadingButton';

function CoursePrerequisite(props) {
  const { control, onHandleSubmit } = props;
  const classes = useStyles();

  const handleSubmit = (e) => {
    e.preventDefault();
    onHandleSubmit();
  };

  return (
    <React.Fragment>
      <Box className={classes.container} mb={20}>
        <Typography className="header">Course prerequisites</Typography>
        <Typography variant="body1" color="textPrimary">
          The Prunedge Smart Toolbar groups all actions by scope into 4 categories. It's an
          intuitive toolbar where every feature is easy to find and your most used ones are there
          for you.
        </Typography>
      </Box>
      <Box>
        <form onSubmit={handleSubmit} className={classes.form}>
          <Controller
            name="prerequisites"
            control={control}
            render={({ value, onChange }) => {
              const handleChange = (event) => {
                let newValues = [...value];
                newValues[event.target.name] = event.target.value;
                onChange(newValues);
              };

              const handleRemovePrerequisite = (id) => () => {
                let newValues = [...value];
                newValues.splice(id, 1);
                onChange(newValues);
              };

              const handleAddPrerequisite = () => {
                let newValues = [...value, ''];
                onChange(newValues);
              };

              return (
                <>
                  {value?.map((prerequisite, index) => (
                    <Box
                      key={index}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between">
                      <TextField
                        name={`${index}`}
                        fullWidth
                        value={prerequisite}
                        onChange={handleChange}
                        autoFocus={value.length - 1 === index}
                        variant="outlined"
                        label="Prerequisite"
                      />
                      <IconButton
                        style={{
                          marginLeft: spaces.medium,
                          border: '1px solid #CDCED9',
                          borderRadius: 8,
                          padding: spaces.small,
                        }}
                        onClick={handleRemovePrerequisite(`${index}`)}>
                        <CloseIcon />
                      </IconButton>
                    </Box>
                  ))}
                  <Box>
                    <Button color="primary" onClick={handleAddPrerequisite}>
                      <AddIcon style={{ marginRight: spaces.medium }} /> Add New
                    </Button>
                  </Box>
                </>
              );
            }}
          />

          <Box display="flex" alignItems="center" justifyContent="space-between" mt={25}>
            <span></span>
            <LoadingButton
              variant="contained"
              type="submit"
              color="primary"
              endIcon={<ArrowForwardIosIcon />}>
              Save & Next
            </LoadingButton>
          </Box>
        </form>
      </Box>
    </React.Fragment>
  );
}

CoursePrerequisite.propTypes = {};

const useStyles = makeStyles((theme) => ({
  container: {
    maxWidth: 800,
    '& .header': {
      fontWeight: fontWeight.medium,
      fontSize: fontSizes.title,
      color: colors.black,
      padding: 0,
      marginBottom: spaces.small,
    },
  },
  form: {
    '& > * > *': {
      marginBottom: spaces.medium,
    },
  },
}));

export default CoursePrerequisite;
