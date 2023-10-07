import { memo } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useMutation } from '@apollo/client';
import { useForm, Controller } from 'react-hook-form';

import Modal from 'reusables/Modal';
import Wysiwyg from 'reusables/Wysiwyg';
import { CREATE_ANNOUNCEMENT } from 'graphql/mutations/announcement';
import { useNotification } from 'reusables/NotificationBanner';
import { getFormError } from 'utils/formError';
import { ReceiversType } from 'utils/constants';

const CreateAnnouncementModal = ({ visible, onClose, courseId, onCompletedCallback }) => {
  const classes = useStyles();
  const notification = useNotification();
  const { register, handleSubmit, control, errors, reset } = useForm();

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

  const onSubmit = (values) => {
    createAnnouncement({
      variables: {
        newAnnouncement: {
          title: values.title,
          body: values.body?.html,
          announcementReceivers: [
            {
              type: ReceiversType.COURSE,
              typeId: courseId,
            },
          ],
        },
      },
    });
  };

  const handleClose = () => {
    onClose();
    reset({});
  };

  return (
    <Modal
      title="Create announcent (General)"
      okText="Post"
      okButtonProps={{
        isLoading: loading,
        onClick: handleSubmit(onSubmit),
      }}
      open={visible}
      onClose={handleClose}>
      <TextField
        inputRef={register({ required: true })}
        label="Title or Summary"
        name="title"
        variant="outlined"
        fullWidth
        className={classes.input}
        error={getFormError('title', errors).hasError}
        helperText={getFormError('title', errors).message}
      />
      <Controller
        name="body"
        control={control}
        rules={{ required: true }}
        render={({ value, onChange }) => <Wysiwyg onChange={onChange} value={value} />}
      />
    </Modal>
  );
};

const useStyles = makeStyles(() => ({
  input: {
    marginBottom: 30,
    marginTop: 20,
  },
  character: {
    backgroundColor: '#FAFAFA',
    display: 'flex',
    justifyContent: 'flex-end',
    padding: 10,
    borderRadius: 8,
  },
}));

CreateAnnouncementModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  courseId: PropTypes.string.isRequired,
  onCompletedCallback: PropTypes.func,
};

export default memo(CreateAnnouncementModal);
