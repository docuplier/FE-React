import { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, makeStyles } from '@material-ui/core';
import { useMutation } from '@apollo/client';

import Wysiwyg from 'reusables/Wysiwyg';
import LoadingButton from 'reusables/LoadingButton';
import { colors } from '../../../Css';
import { CREATE_NOTE, UPDATE_NOTE } from 'graphql/mutations/courses';
import { useNotification } from 'reusables/NotificationBanner';

const UpsertNote = ({ open, onClose, note, courseId, lectureId, onCompletedCallback }) => {
  const classes = useStyles();
  const [value, setValue] = useState({
    editorState: null,
    html: null,
  });
  const isEditMode = Boolean(note);
  const notification = useNotification();

  useEffect(() => {
    if (open) {
      setValue({
        editorState: null,
        html: note?.content || '<p></p>',
      });
    }
    // eslint-disable-next-line
  }, [open]);

  const [createNote, { loading: isLoadingCreateNote }] = useMutation(CREATE_NOTE, {
    onCompleted: () => {
      notification.success({
        message: 'Note saved successfully',
      });
      onClose();
      onCompletedCallback?.();
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const [updateNote, { loading: isLoadingUpdateNote }] = useMutation(UPDATE_NOTE, {
    onCompleted: () => {
      notification.success({
        message: 'Note updated successfully',
      });
      onClose();
      onCompletedCallback?.();
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const handleUpsertNote = () => {
    const newNote = {
      body: value?.html,
      course: courseId,
      lecture: lectureId,
    };

    if (isEditMode) {
      return updateNote({
        variables: {
          id: note.id,
          newNote,
        },
      });
    }

    createNote({
      variables: {
        newNote,
      },
    });
  };

  return (
    open && (
      <Box>
        <Wysiwyg value={value} onChange={(value) => setValue(value)} />
        <Box mt={16} display="flex" justifyContent="flex-end">
          <Button variant="text" onClick={onClose}>
            Cancel
          </Button>
          <LoadingButton
            disableElevation
            className={classes.okButton}
            variant="contained"
            isLoading={isLoadingCreateNote || isLoadingUpdateNote}
            onClick={handleUpsertNote}>
            Save Note
          </LoadingButton>
        </Box>
      </Box>
    )
  );
};

const useStyles = makeStyles({
  okButton: {
    border: `1px solid ${colors.secondaryLightGrey}`,
  },
});

UpsertNote.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  note: PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  }),
  courseId: PropTypes.string.isRequired,
  lectureId: PropTypes.string.isRequired,
  onCompletedCallback: PropTypes.func,
};

export default memo(UpsertNote);
