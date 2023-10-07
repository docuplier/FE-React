import { useForm, Controller } from 'react-hook-form';
import { Box, TextField } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';

import { getFormError } from 'utils/formError';
import Wysiwyg from 'reusables/Wysiwyg';
import Modal from 'reusables/Modal';
import { CREATE_ANNOUNCEMENT } from 'graphql/mutations/announcement';
import { useNotification } from 'reusables/NotificationBanner';
import RecipientAutocompleteField from './RecipientAutocompleteField';

const AnnouncementModal = ({ isVisible, onClose, onCompletedCallback }) => {
  const notification = useNotification();
  const { register, handleSubmit, control, errors } = useForm();

  const [createAnnouncement, { loading }] = useMutation(CREATE_ANNOUNCEMENT, {
    onCompleted: () => {
      notification.success({
        message: 'Announcement posted successfully',
      });
      onCompletedCallback?.();
      handleClose();
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const onSubmit = (formValues) => {
    const { title, recipients, body } = formValues;

    createAnnouncement({
      variables: {
        newAnnouncement: {
          title,
          body: body?.html,
          announcementReceivers: recipients?.map((recipient) => ({
            typeId: recipient.id,
            type: recipient.type,
          })),
        },
      },
    });
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      title="Create announcement (General)"
      okText="Post"
      okButtonProps={{
        isLoading: loading,
        onClick: handleSubmit((values) => onSubmit(values)),
      }}
      open={isVisible}
      onClose={handleClose}>
      <>
        <Box mt={6}>
          <TextField
            error={getFormError('title', errors).hasError}
            size="medium"
            name="title"
            inputRef={register({ required: true })}
            fullWidth={true}
            variant="outlined"
            label="Title"
            helperText={getFormError('title', errors).message}
          />
        </Box>
        <Box mt={12}>
          <RecipientAutocompleteField
            errors={errors}
            control={control}
            rules={{ required: 'Recipients are required' }}
            label="Recipients"
          />
        </Box>
        <Box mt={12}>
          <Controller
            name="body"
            control={control}
            rules={{ required: true }}
            render={({ value, onChange }) => <Wysiwyg onChange={onChange} value={value} />}
          />
        </Box>
      </>
    </Modal>
  );
};

AnnouncementModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCompletedCallback: PropTypes.func.isRequired,
};
export default AnnouncementModal;
