import React from 'react';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import { Box, TextField } from '@material-ui/core';

import Modal from 'reusables/Modal';
import Banner from 'reusables/Banner';
import { getFormError } from 'utils/formError';
import Wysiwyg from 'reusables/Wysiwyg';
import { spaces } from '../../../Css';
import { useMutation } from '@apollo/client';
import { CREATE_QUESTION } from 'graphql/mutations/courses';
import { useNotification } from 'reusables/NotificationBanner';

const CreateQuestionModal = ({ courseId, lectureId, open, onClose, onCompletedCallback }) => {
  const {
    register,
    handleSubmit,
    control,
    errors,
    formState: { isValid },
  } = useForm();
  const notification = useNotification();

  const [createQuestion, { loading }] = useMutation(CREATE_QUESTION, {
    onCompleted: () => {
      notification.success({
        message: 'Question posted successfully',
      });
      onCompletedCallback?.();
      onClose();
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const onSubmit = (values) => {
    createQuestion({
      variables: {
        newQuestion: {
          title: values.title,
          body: values.description?.html,
          course: courseId,
          lecture: lectureId,
        },
      },
    });
  };

  const renderBannerMessage = () => {
    return (
      <ul style={{ paddingLeft: spaces.medium }}>
        <li>Search to see if your question has been asked before</li>
        <li>
          Be detailed; provide screenshots, error messages, code, or other clues whenever possible
        </li>
        <li>Check grammar and spelling</li>
      </ul>
    );
  };

  return (
    <Modal
      title="Create Question"
      okText="Post"
      okButtonProps={{
        isLoading: loading,
        disabled: !isValid,
        onClick: handleSubmit(onSubmit),
      }}
      open={open}
      onClose={onClose}>
      <Box mb={8}>
        <Banner
          severity="info"
          title="Tips on getting your questions answered faster"
          message={renderBannerMessage()}
        />
      </Box>
      <TextField
        inputRef={register({ required: true })}
        variant="outlined"
        placeholder="Title  or summary"
        name="title"
        required
        fullWidth
        error={getFormError('title', errors).hasError}
        helperText={getFormError('title', errors).message}
      />
      <Box mt={8}>
        <Controller
          name="description"
          control={control}
          rules={{ required: true }}
          render={({ value, onChange }) => <Wysiwyg onChange={onChange} value={value} />}
        />
      </Box>
    </Modal>
  );
};

CreateQuestionModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  courseId: PropTypes.string.isRequired,
  lectureId: PropTypes.string.isRequired,
  onCompletedCallback: PropTypes.func,
};

export default React.memo(CreateQuestionModal);
