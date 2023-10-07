import React, { useState } from 'react';
import { Typography, Grid, Select } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { fontSizes, fontWeight, colors, fontFamily, spaces } from '../../../Css.js';
import { useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';

import FileUpload from 'reusables/FileUpload.js';
import LoadingButton from 'reusables/LoadingButton.jsx';
import { ReactComponent as ChevronRight } from 'assets/svgs/chevron-right.svg';
import UploadedDocumentChecker from './UploadedDocumentChecker';
import { convertToSentenceCase } from 'utils/TransformationUtils';
import { CREATE_USER_DOCUMENT } from 'graphql/mutations/instrustorsRegistration';
import { useNotification } from 'reusables/NotificationBanner';
import { PublicPaths } from 'routes';

const Documents = ({ documents, handleDocumentChange }) => {
  const documentFieldNames = Object.keys(documents);
  const [selectedDocument, setSelectedDocument] = useState(documentFieldNames[0]);
  const classes = useStyles();
  const notification = useNotification();
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    createUserDocument({
      variables: {
        newDocument: { type: documents.birthCertificate || documents.certificateOfOrigin },
        file: documents.birthCertificate?.name || documents.certificateOfOrigin?.name,
      },
    });
  };

  const [createUserDocument, { loading: isLoading }] = useMutation(CREATE_USER_DOCUMENT, {
    onCompleted: () => {
      if (documentFieldNames.length !== 2) {
        notification.error({
          message: 'Upload the required amount of documents',
        });
        return;
      } else {
        notification.success({
          message: 'Document created successfully',
        });
        history.push(PublicPaths.LOGIN);
      }
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  return (
    <div className={classes.wrapper}>
      <form onSubmit={handleSubmit} className={classes.form}>
        <Typography className={classes.title}>Documents</Typography>
        <Grid container spacing={10}>
          <Grid item xs={7}>
            <Select
              native
              variant="outlined"
              name="document type"
              label="Document Type"
              className="select"
              value={selectedDocument}
              onChange={(e) => setSelectedDocument(e.target.value)}>
              {documentFieldNames.map((document) => (
                <option value={document}>{convertToSentenceCase(document, 'camel')}</option>
              ))}
            </Select>

            {Object.entries(documents).map(
              ([key, value]) =>
                key === selectedDocument && (
                  <FileUpload file={value} onChange={handleDocumentChange(key)} />
                ),
            )}
          </Grid>
          <Grid item xs={5}>
            <UploadedDocumentChecker
              documents={documents}
              onRemove={(documentName) => handleDocumentChange(documentName)(null)}
            />
          </Grid>
        </Grid>
        <div className={classes.foot}>
          <LoadingButton
            endIcon={<ChevronRight />}
            className="btn"
            type="submit"
            color="primary"
            isLoading={isLoading}>
            Complete Registration
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  wrapper: {
    maxWidth: 800,
    margin: 'auto',
    padding: spaces.medium,
  },
  title: {
    fontWeight: fontWeight.medium,
    fontSize: fontSizes.title,
    fontFamilly: fontFamily.primary,
    color: colors.dark,
    marginBottom: theme.spacing(10),
  },

  foot: {
    display: 'flex',
    marginTop: theme.spacing(25),
    '& .btn': {
      marginLeft: 'auto',
      width: 233,
      height: 44,
    },
  },

  form: {
    '& .select': {
      width: '100%',
      marginBottom: theme.spacing(12),
    },
  },
}));

export default Documents;
