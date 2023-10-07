import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/styles';
import { Box, Button } from '@material-ui/core';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CancelIcon from '@material-ui/icons/Cancel';
import { colors, fontWeight } from '../../../Css';
import { convertToSentenceCase } from 'utils/TransformationUtils';

const UploadedDocumentChecker = (props) => {
  const { documents = {}, onRemove } = props;
  const documentsArray = Object.entries(documents);
  const uploadedDocumentCount = Object.values(documents).filter((value) => !!value === true)
    ?.length;
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className="title">Uploaded document</div>
      <div className="caption">
        {uploadedDocumentCount} of {documentsArray?.length}
      </div>
      <Box>
        {documentsArray.map(([key, value]) => {
          const name = convertToSentenceCase(key, 'camel');
          const isUploaded = !!value;
          return (
            <Button
              startIcon={<CheckCircleOutlineIcon />}
              endIcon={<CancelIcon onClick={() => onRemove(key)} />}
              className={classnames(classes.button, {
                [classes.inactive]: isUploaded !== true,
              })}
              variant={isUploaded ? 'contained' : 'outlined'}
              color={'primary'}>
              {name}
            </Button>
          );
        })}
      </Box>
    </div>
  );
};

UploadedDocumentChecker.propTypes = {
  documents: PropTypes.object,
  onRemove: PropTypes.func,
};

const useStyles = makeStyles((theme) => ({
  container: {
    width: 264,
    padding: theme.spacing(8),
    background: '#F1F2F6',
    '& .caption': {
      padding: '5px 0px 16px',
      color: colors.lightGrey,
    },
    '& .title': {
      color: colors.dark,
      fontWeight: fontWeight.medium,
      marginRight: 10,
    },
  },
  button: {
    marginBottom: theme.spacing(8),
    width: '100%',
    borderRadius: 4,
    justifyContent: 'space-between',
  },
  inactive: {
    justifyContent: 'space-between',
    color: '#393A4A',
    '& .MuiButton-startIcon': {
      color: colors.secondaryLightGrey,
    },
    '& .MuiButton-endIcon': {
      visibility: 'hidden',
      pointerEvents: 'none',
    },
  },
}));
export default UploadedDocumentChecker;
