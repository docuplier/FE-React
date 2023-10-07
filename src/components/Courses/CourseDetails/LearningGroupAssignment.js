import React from 'react';
import { makeStyles, Box, Typography, Paper, Grid, TextField } from '@material-ui/core';
import { useForm, Controller } from 'react-hook-form';
import { TextUploadFormats } from 'utils/constants';
import Drawer from 'reusables/Drawer';
import { ReactComponent as DocumentIcon } from 'assets/svgs/document.svg';
import FileUpload from 'reusables/FileUpload.js';
import { getFormError } from 'utils/formError';

const LearningGroupUpAssignment = ({ open, onClose, submittingTask, submitTask }) => {
  const { control, handleSubmit, watch, errors } = useForm();
  const classes = useStyles();

  const { files } = watch();

  const onSubmit = (values) => {
    const submissions = [values]
      ?.map((val, i) => {
        return val.files?.map((file, i) => {
          const docTitle = `file${i}`;
          return { file: val.files[i], documentTitle: val[docTitle], size: file.size }; // [{ file: "",size: "",documentTitle}]
        });
      })
      .flat();

    submitTask({
      variables: {
        groupId: open,
        submissions,
      },
    });
  };

  return (
    <Box>
      <Drawer
        open={Boolean(open)}
        okText="Submit"
        title="Upload assignment"
        onClose={onClose}
        okButtonProps={{ isLoading: submittingTask }}
        onOk={handleSubmit(onSubmit)}>
        <Box className={classes.wrapper}>
          <Box component={Paper} elevation={0}>
            <Controller
              name="files"
              control={control}
              rules={{
                required: true,
              }}
              render={({ onChange, value, ...rest }) => (
                <FileUpload
                  accept={TextUploadFormats}
                  multiple
                  onChange={(files) => onChange(files)}
                  files={value}
                  id="files"
                  {...rest}
                  error={getFormError(`files`, errors).hasError}
                  helperText={getFormError(`files`, errors).message}
                  subTitle="Format (jpg, png, xls, pdf, csv, ppt). Maximum of 5MB"
                />
              )}
            />
          </Box>
        </Box>

        <Box className={classes.container}>
          <Typography style={{ fontSize: '16px', color: '#393A4A', marginBottom: '5px' }}>
            {` ${files?.length || 0} of ${files?.length || 0} uploaded`}
          </Typography>
          <Grid container spacing={8} sx={{ marginTop: '56px' }}>
            {(files || [])?.map((file, i) => {
              return (
                <Grid item xs={12} sm={12}>
                  <Controller
                    name={`file${i}`}
                    control={control}
                    rules={{
                      required: true,
                    }}
                    render={({ onChange, value, ...rest }) => (
                      <Box component={Paper} elevation={0} className={classes.paper}>
                        <TextField
                          variant="outlined"
                          fullWidth={true}
                          value={value}
                          onChange={(values) => onChange(values)}
                          label="Document Title"
                          multiline
                          {...rest}
                          error={getFormError(`file${i}`, errors).hasError}
                          helperText={getFormError(`file${i}`, errors).message}
                        />

                        <Box className="sampleDocument" fullWidth={true}>
                          <DocumentIcon /> <Typography className="text">{file?.name}</Typography>
                        </Box>
                      </Box>
                    )}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Drawer>
    </Box>
  );
};

const useStyles = makeStyles(() => ({
  wrapper: {
    width: '100%',
    '& .box': {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '0',
      fontSize: '16px',
      border: '1px dashed #E5E5EA',
      '& .title': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        fontweight: 500,
        marginBottom: 0,
      },
      '& .caption': {
        fontSize: '14px',
        marginTop: 0,
      },
    },
  },

  paper: {
    padding: 14,
    border: '1px solid #CDCED9',
  },

  container: {
    marginTop: '30px',
    '& .sampleDocument': {
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#F0F5FF',
      height: '40px',
      borderRadius: '8px',
      marginTop: '17px',
      border: '1px solid #B3CDFF',
      color: '#393A4A',
      paddingLeft: 6,
    },
    '& .text': {
      marginLeft: 6,
      fontSize: '14px',
      color: '#393A4A',
    },
  },
}));

export default LearningGroupUpAssignment;
