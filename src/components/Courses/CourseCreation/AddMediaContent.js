import {
  Box,
  Divider,
  Grid,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
  FormHelperText,
} from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/styles';
import React, { useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import FileUpload from 'reusables/FileUpload';
import Wysiwyg from 'reusables/Wysiwyg';
import { LectureResourceType } from 'utils/constants';
import { getFormError } from 'utils/formError';
import { colors, fontFamily, fontSizes, fontWeight, spaces } from '../../../Css';
import AddMediaLink from './AddMediaLink';
import { loadFileHtml } from 'utils/fileUtils';

function AddMediaContent(props) {
  const { control, errors, mediaInfo, watch, setValue } = props;
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);
  const { file } = watch();

  useEffect(() => {
    setLectureDuration();
    // eslint-disable-next-line
  }, [file]);

  async function setLectureDuration() {
    const mediaType = mediaInfo.type.toLowerCase();
    if (file && file.type?.split('/').includes(mediaType)) {
      const loadedFile = await loadFileHtml(file, mediaType);
      if (loadedFile.duration) setValue('duration', loadedFile.duration);
    }
  }

  const handleMediaTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const renderSectionTitle = (title) => {
    return (
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="body2">{title}</Typography>{' '}
        <Divider style={{ flex: 1, marginLeft: 20 }} />
      </Box>
    );
  };

  const renderMediaInputTabs = () => {
    return (
      [LectureResourceType.AUDIO, LectureResourceType.VIDEO].includes(mediaInfo.type) && (
        <Box mb={10}>
          <StyledTabs
            indicatorColor="primary"
            textColor="primary"
            value={tabValue}
            onChange={handleMediaTabChange}
            aria-label="media tab">
            <StyledTab label="Upload file" />
            <StyledTab label="Embedded link" />
          </StyledTabs>
        </Box>
      )
    );
  };

  const renderFileUpload = (name, isRequired = false) => (
    <>
      <Controller
        name={name}
        control={control}
        rules={{ required: { message: 'File content is required', value: isRequired } }}
        render={({ onChange, value, ...rest }) => (
          <FileUpload
            accept={mediaInfo.fileTypes}
            onChange={(file) => onChange(file)}
            file={value}
            id={name}
            {...rest}
          />
        )}
      />
      {getFormError(name, errors).hasError && (
        <FormHelperText error={getFormError(name, errors).hasError}>
          {getFormError(name, errors).message}
        </FormHelperText>
      )}
    </>
  );

  const renderMediaTypeSpecificInput = () => {
    return (
      <Paper elevation={1}>
        <Box padding={10} bgcolor={colors.white}>
          {mediaInfo.type === LectureResourceType.LINK ? (
            <AddMediaLink watch={watch} control={control} errors={errors} mediaInfo={mediaInfo} />
          ) : (
            mediaInfo.type !== LectureResourceType.TEXT && (
              <>
                {renderMediaInputTabs()}
                {tabValue === 0 && renderFileUpload('file', true)}
                {tabValue === 1 && (
                  <AddMediaLink
                    watch={watch}
                    control={control}
                    errors={errors}
                    mediaInfo={mediaInfo}
                  />
                )}
              </>
            )
          )}
          {mediaInfo.type === LectureResourceType.TEXT && (
            <>
              <Box>{renderSectionTitle('Lecture content')}</Box>
              <Controller
                name="body"
                control={control}
                rules={{
                  validate: {
                    hasValue: (value) =>
                      value.editorState.getCurrentContent().getPlainText('').length > 0 ||
                      'Text description is required',
                  },
                }}
                render={({ onChange, value }) => (
                  <>
                    <Wysiwyg value={value} onChange={(value) => onChange(value)} />
                    {!!errors.body?.message && (
                      <FormHelperText error={!!errors.body?.message}>
                        {errors.body?.message}
                      </FormHelperText>
                    )}
                  </>
                )}
              />
            </>
          )}
        </Box>
      </Paper>
    );
  };

  return (
    <Box display="flex" justifyContent="center">
      <Box maxWidth={750}>
        <Box className={classes.container} mb={10}>
          <Typography className="header">{mediaInfo.title} Lecture</Typography>
          <Typography variant="body1" color="textPrimary">
            {mediaInfo.description}
          </Typography>
        </Box>
        <Box>
          <form className={classes.form}>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <Controller
                  name="title"
                  control={control}
                  rules={{
                    required: 'This lecture needs a title',
                  }}
                  render={({ ref, ...rest }) => (
                    <TextField
                      {...rest}
                      inputRef={ref}
                      fullWidth
                      variant="outlined"
                      label="Lecture title"
                      error={getFormError('title', errors).hasError}
                      helperText={getFormError('title', errors).message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                {renderSectionTitle('Content description')}
                <Controller
                  name={mediaInfo.type === LectureResourceType.TEXT ? 'description' : 'body'} //"body"
                  control={control}
                  rules={{
                    validate: {
                      hasValue: (value) =>
                        value.editorState.getCurrentContent().getPlainText('').length > 0 ||
                        'Course description is required',
                    },
                  }}
                  render={({ onChange, value }) => (
                    <>
                      <Wysiwyg value={value} onChange={(value) => onChange(value)} />
                      {!!errors.body?.message && (
                        <FormHelperText error={!!errors.body?.message}>
                          {errors.body?.message}
                        </FormHelperText>
                      )}
                    </>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                {renderMediaTypeSpecificInput()}
                <Box mt={12}>{renderSectionTitle('Duration')}</Box>
              </Grid>
              <Grid item md={8} sm={12}>
                <Box display="flex" justifyContent="space-between" className={classes.duration}>
                  <Controller
                    name="hours"
                    control={control}
                    render={({ ref, ...rest }) => (
                      <TextField
                        {...rest}
                        inputRef={ref}
                        type="number"
                        variant="outlined"
                        label="Hours"
                        error={getFormError('hours', errors).hasError}
                        helperText={getFormError('hours', errors).message}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    )}
                  />
                  <Controller
                    name="minutes"
                    control={control}
                    rules={{
                      max: {
                        value: 60,
                        message: 'minutes is require and number must not exceed 60',
                      },
                    }}
                    render={({ ref, ...rest }) => (
                      <TextField
                        {...rest}
                        inputRef={ref}
                        type="number"
                        variant="outlined"
                        label="Minutes"
                        error={getFormError('minutes', errors).hasError}
                        helperText={getFormError('minutes', errors).message}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    )}
                  />
                  <Controller
                    name="seconds"
                    control={control}
                    rules={{
                      max: {
                        value: 60,
                        message: 'seconds is require and number must not exceed 60',
                      },
                    }}
                    render={({ ref, ...rest }) => (
                      <TextField
                        {...rest}
                        inputRef={ref}
                        type="number"
                        variant="outlined"
                        label="Seconds"
                        error={getFormError('seconds', errors).hasError}
                        helperText={getFormError('seconds', errors).message}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    )}
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                {renderSectionTitle('Resources')}
                {renderFileUpload('resource')}
              </Grid>
            </Grid>
          </form>
        </Box>
      </Box>
    </Box>
  );
}

const StyledTabs = withStyles({
  root: {
    height: '100%',
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const StyledTab = withStyles((theme) => ({
  root: {
    fontSize: theme.typography.pxToRem(15),
  },
}))((props) => <Tab disableRipple {...props} />);

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
      marginBottom: spaces.medium,
    },
  },
  duration: {
    '& > *': {
      marginRight: spaces.medium,
    },
  },
});

export default AddMediaContent;
