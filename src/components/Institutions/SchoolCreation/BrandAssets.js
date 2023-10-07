import React from 'react';
import { Box, makeStyles, Typography, Button, Divider } from '@material-ui/core';
import { useForm, Controller } from 'react-hook-form';
import classnames from 'classnames';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

import FileUpload from 'reusables/FileUpload';
import LoadingButton from 'reusables/LoadingButton';
import { fontWeight, fontSizes, colors, fontFamily, spaces } from '../../../Css';
import { extractFileNameFromUrl, getFileExtension } from 'utils/TransformationUtils';

const BrandAssets = ({
  handleNextTab,
  isEditMode,
  fieldInputs,
  activeTab,
  handleInputChange,
  handleUpsert,
}) => {
  const classes = useStyles();
  const { control } = useForm();

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpsert();
  };

  const onBack = () => {
    handleNextTab(activeTab - 1);
  };

  const formatFile = (file, previewUrl) => {
    if (typeof file === 'string' && file?.length > 0) {
      return {
        name: decodeURI(extractFileNameFromUrl(file)),
        size: '',
        type: getFileExtension(file),
        url: previewUrl,
      };
    }

    return file;
  };

  return (
    <React.Fragment>
      <div className={classes.container}>
        <Typography className="header">Brand Assets</Typography>
      </div>
      <Box>
        <form onSubmit={handleSubmit} className={classes.form}>
          <Box className={classes.line}>
            <Typography className="labels">School logo</Typography>
            <Divider />
          </Box>
          <Controller
            control={control}
            name="logo"
            rules={{ required: true }}
            render={() => (
              <FileUpload
                onChange={(logo) => handleInputChange({ logo })}
                file={formatFile(fieldInputs.logo, fieldInputs.logo)}
                showPreview={isEditMode && typeof fieldInputs?.logo === 'string' ? true : false}
                required
              />
            )}
          />
          <Box className={classes.line}>
            <Typography className={classnames('favicon', 'labels')}>Favicon</Typography>
            <Divider />
          </Box>
          <Controller
            control={control}
            name="favicon"
            rules={{ required: true }}
            render={() => (
              <FileUpload
                onChange={(favicon) => handleInputChange({ favicon })}
                file={formatFile(fieldInputs.favicon, fieldInputs.favicon)}
                showPreview={isEditMode && typeof fieldInputs?.favicon === 'string' ? true : false}
                required
              />
            )}
          />
          <Box display="flex" justifyContent="space-between">
            <Button variant="outlined" onClick={onBack}>
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
};

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
    marginTop: spaces.large,
    '& .labels': {
      fontSize: fontSizes.small,
      color: colors.grey,
      paddingRight: 5,
    },
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
  },
  line: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    '& > :last-child': {
      flexGrow: 1,
    },
  },
}));

export default React.memo(BrandAssets);
