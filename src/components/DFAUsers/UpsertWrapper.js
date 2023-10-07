import React from 'react';
import { useMutation } from '@apollo/client';

import { ADD_USER, UPDATE_USER, UPLOAD_USERS } from 'graphql/mutations/DFA/users';
import { useNotification } from 'reusables/NotificationBanner';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';

const UpsertWrapper = ({ renderComponent, updateId, onOkSuccess, roles }) => {
  const notification = useNotification();
  const { userDetails } = useAuthenticatedUser();

  const [addUserMutation, addUserFeedback] = useMutation(ADD_USER, {
    onCompleted: (response) => onCompleted(response, 'createDfaUser'),
    onError,
  });

  const [updateUserMutation, updateUserFeedback] = useMutation(UPDATE_USER, {
    onCompleted: (response) => onCompleted(response, 'updateUser'),
    onError,
  });

  const [uploadUserMutation, uploadUserFeedback] = useMutation(UPLOAD_USERS, {
    onCompleted: (response) => onCompleted(response, 'uploadUser'),
    onError,
  });

  function onError(error) {
    notification.error({
      message: error?.message,
    });
  }

  function onCompleted(response, key) {
    const { ok, errors } = response[key];
    const status = ok === false ? 'error' : 'success';
    const message = errors
      ? errors.messages ||
        (Array.isArray(errors) && errors.map((error) => error.messages).join('. '))
      : 'User was added successfully';
    notification[status]({
      message,
    });
    !!ok && onOkSuccess?.();
  }

  const onSubmit = (values) => {
    try {
      if (!!updateId) {
        updateUserMutation({
          variables: {
            newUser: {
              ...values,
              institution: userDetails?.institution.id,
            },
            id: updateId,
          },
        });
        return;
      }
      if (!!values.file) {
        uploadUserMutation({
          variables: {
            roles,
            file: values.file,
          },
        });
        return;
      }
      addUserMutation({
        variables: {
          ...values,
          institution: userDetails?.institution.id,
          roles,
        },
      });
    } catch (error) {
      notification.error({
        message: error.message,
      });
    }
  };

  return renderComponent({
    onSubmit,
    isLoading: addUserFeedback.loading || updateUserFeedback.loading || uploadUserFeedback.loading,
  });
};

UpsertWrapper.propTypes = {};

export default React.memo(UpsertWrapper);
