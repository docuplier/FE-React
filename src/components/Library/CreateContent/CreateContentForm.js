import { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Typography,
  Box,
  TextField,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Button,
  FormHelperText,
  FormControl,
  Checkbox,
  InputAdornment,
  CircularProgress,
  makeStyles,
} from '@material-ui/core';
import { Controller } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

import RegistrationLayout from 'Layout/RegistrationLayout';
import { getFormError } from 'utils/formError';
import { ImageUploadFormats, LibraryContentType, URL_REGEX } from 'utils/constants';
import FileUpload from 'reusables/FileUpload';
import { convertToSentenceCase } from 'utils/TransformationUtils';
import { AutocompleteWithTag, TextFieldWithTag } from 'reusables/TaggerFields';
import { colors, fontWeight } from '../../../Css';
import ContentTypeInputField, { ContentFormats } from 'reusables/ContentTypeInputField';
import LoadingButton from 'reusables/LoadingButton';
import Wysiwyg from 'reusables/Wysiwyg';

const CreateContentForm = ({
  formProps: { control, errors },
  onChangeContentFormat,
  onChangeResource,
  loading,
  fieldOfInterests,
  loadingFieldOfInterest,
  contentFormat,
  onSubmit,
  selectedInterests: selectedInterestsFromProps,
}) => {
  const history = useHistory();
  const classes = useStyles();
  const [selectedInterests, setSelectedInterests] = useState();

  const validateContentTypeInputFieldValue = (contentFormat, value) => {
    switch (contentFormat) {
      case LibraryContentType.HTML:
        return value || { html: '', editorState: null };
      default:
        return value;
    }
  };

  useEffect(() => {
    if (selectedInterestsFromProps.length > 0) {
      return setSelectedInterests(selectedInterestsFromProps);
    }
    //eslint-disable-next-line
  }, [fieldOfInterests]);

  const renderNameAndDescription = () => {
    return (
      <>
        <Box mb={12}>
          <Controller
            name="name"
            control={control}
            rules={{
              required: true,
            }}
            render={({ ref, ...rest }) => (
              <TextField
                {...rest}
                inputRef={ref}
                fullWidth
                variant="outlined"
                label="Name"
                placeholder="Enter the content name"
                error={getFormError(`name`, errors).hasError}
                helperText={getFormError(`name`, errors).message}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        </Box>
        <Box mb={12}>
          <Controller
            name="description"
            control={control}
            rules={{
              validate: {
                hasValue: (value) =>
                  value.editorState.getCurrentContent().getPlainText('').length > 0 ||
                  'Description is required',
              },
            }}
            render={({ onChange, value }) => <Wysiwyg onChange={onChange} value={value} />}
          />
          <FormHelperText error={getFormError(`description`, errors).hasError}>
            {getFormError(`description`, errors).message}
          </FormHelperText>
        </Box>
      </>
    );
  };

  const renderThumbnailAndSource = () => {
    return (
      <>
        <Box mb={12}>
          <Box display="flex" alignItems="center" mb={5}>
            <Typography variant="body1" color="textSecondary">
              Content Thumbnail
            </Typography>{' '}
            <Divider style={{ flex: 1 }} />
          </Box>
          <Controller
            name="thumbnail"
            control={control}
            render={({ ref, value, onChange, ...rest }) => (
              <FileUpload
                accept={ImageUploadFormats}
                onChange={(file) => onChange(file)}
                file={value}
                id="thumbnail"
                {...rest}
              />
            )}
          />
        </Box>
        <Box mb={12}>
          <Controller
            name="source"
            control={control}
            rules={{
              pattern: {
                value: URL_REGEX,
                message: 'Please enter a valid url',
              },
            }}
            render={({ ref, ...rest }) => (
              <TextField
                {...rest}
                inputRef={ref}
                fullWidth
                variant="outlined"
                label="Source"
                placeholder="Enter the content source"
                error={getFormError(`source`, errors).hasError}
                helperText={getFormError(`source`, errors).message}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        </Box>
        <Box mb={12}>
          <Controller
            name="author"
            control={control}
            rules={{
              required: true,
            }}
            render={({ ref, ...rest }) => (
              <TextField
                {...rest}
                inputRef={ref}
                fullWidth
                variant="outlined"
                label="Author"
                placeholder="Enter the content author"
                error={getFormError(`author`, errors).hasError}
                helperText={getFormError(`author`, errors).message}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        </Box>
      </>
    );
  };

  const handleAddFieldOfInterest = (newValue) => {
    const newlyAddedOption = newValue[newValue.length - 1];
    const filteredInterests = newValue.filter((option) => option.id !== newlyAddedOption.id);
    if (filteredInterests.length < newValue.length - 1) {
      setSelectedInterests(filteredInterests);
      return filteredInterests;
    }
    setSelectedInterests(newValue);
    return newValue;
  };

  const renderTagsAndFieldOfInterest = () => {
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;
    return (
      <>
        <Box mb={12}>
          <Controller
            name="tags"
            control={control}
            render={({ ref, onChange, ...rest }) => (
              <TextFieldWithTag
                placeholder="Add Tags"
                label="Tags"
                onChange={(value) => onChange(value)}
                {...rest}
              />
            )}
          />
        </Box>
        <Box mb={12}>
          <Controller
            name="categoryId"
            control={control}
            rules={{
              required: true,
            }}
            render={({ ref, onChange, ...rest }) => (
              <FormControl variant="outlined" fullWidth>
                <AutocompleteWithTag
                  onChange={(newValue) => {
                    onChange(handleAddFieldOfInterest(newValue)?.map((item) => item.id));
                  }}
                  value={selectedInterests}
                  getTagLabel={(option) => option.name}
                  disabled={loadingFieldOfInterest}
                  textFieldProps={{
                    label: 'category',
                    endAdornment: !!loadingFieldOfInterest && (
                      <InputAdornment position="end" className={classes.selectAdornment}>
                        <CircularProgress color="primary" size={25} />
                      </InputAdornment>
                    ),
                    ...rest,
                  }}
                  id="checkboxes-tags-demo"
                  options={fieldOfInterests}
                  getOptionLabel={(option) => option?.name}
                  renderOption={(option, { selected }) => {
                    return (
                      <>
                        <Checkbox
                          icon={icon}
                          color="primary"
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={
                            selected ||
                            selectedInterests
                              ?.map((interest) => interest?.id === option?.id)
                              ?.includes(true)
                          }
                        />
                        <Typography> {option?.name} </Typography>
                      </>
                    );
                  }}
                />
              </FormControl>
            )}
          />
        </Box>
      </>
    );
  };

  const renderContentFormat = () => {
    return (
      <>
        <Box mb={12}>
          <Grid container>
            <Grid item xs={12} sm={4}>
              <Controller
                name="contentFormat"
                control={control}
                rules={{
                  required: true,
                }}
                render={({ ref, onChange, ...rest }) => (
                  <TextField
                    {...rest}
                    onChange={onChangeContentFormat}
                    inputRef={ref}
                    fullWidth
                    select
                    variant="outlined"
                    label="Content format"
                    placeholder="Select a content format"
                    error={getFormError(`contentFormat`, errors).hasError}
                    helperText={getFormError(`contentFormat`, errors).message}
                    InputLabelProps={{
                      shrink: true,
                    }}>
                    {Object.values(LibraryContentType).map((contentType) => (
                      <MenuItem key={contentType} value={contentType}>
                        {convertToSentenceCase(contentType)}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
          </Grid>
        </Box>
        <Box
          component={Paper}
          p={8}
          elevation={0}
          style={{ border: `1px solid ${colors.secondaryLightGrey}` }}
          mb={12}>
          <Controller
            name="resource"
            control={control}
            rules={{
              required: true,
            }}
            render={({ ref, value, ...rest }) => (
              <ContentTypeInputField
                {...rest}
                value={validateContentTypeInputFieldValue(contentFormat, value)}
                format={
                  contentFormat === LibraryContentType.HTML ? ContentFormats.WYSIWYG : contentFormat
                }
                onChange={onChangeResource}
                error={getFormError(`resource`, errors).hasError}
                helperText={getFormError(`resource`, errors).message}
              />
            )}
          />
        </Box>
      </>
    );
  };

  const renderActionButtons = () => {
    return (
      <Box display="flex" justifyContent="space-between">
        <Button variant="outlined" onClick={() => history.goBack()}>
          Back
        </Button>
        <LoadingButton color="primary" onClick={onSubmit} isLoading={loading}>
          Save
        </LoadingButton>
      </Box>
    );
  };

  return (
    <RegistrationLayout
      onClose={() => history.goBack()}
      title="New Content"
      hasHeaderButton={false}>
      <Box display="flex" justifyContent="center">
        <Box width="100%" maxWidth={750}>
          <Box mb={12}>
            <Typography color="textPrimary" variant="h5" style={{ fontWeight: fontWeight.medium }}>
              Content Details
            </Typography>
          </Box>
          {renderNameAndDescription()}
          {renderThumbnailAndSource()}
          {renderTagsAndFieldOfInterest()}
          {renderContentFormat()}
          {renderActionButtons()}
        </Box>
      </Box>
    </RegistrationLayout>
  );
};

const useStyles = makeStyles((theme) => ({
  selectAdornment: {
    marginRight: theme.spacing(-4),
  },
}));

CreateContentForm.propTypes = {
  formProps: PropTypes.shape({
    control: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
  }).isRequired,
  onChangeContentFormat: PropTypes.func.isRequired,
  onChangeResource: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  fieldOfInterests: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    }),
  ).isRequired,
  contentFormat: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default memo(CreateContentForm);
