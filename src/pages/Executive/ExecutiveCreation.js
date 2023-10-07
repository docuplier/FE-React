import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Box } from '@material-ui/core';
import { useQuery, useMutation } from '@apollo/client';

import RegistrationLayout from 'Layout/RegistrationLayout';
import LoadingView from 'reusables/LoadingView';
import ExecutiveCreationForm from 'components/Executive/ExecutiveCreation/ExecutiveCreationForm';
import { useNotification } from 'reusables/NotificationBanner';
import { ADD_USER, UPDATE_USER } from 'graphql/mutations/users';
import { GET_USER_DETAIL } from 'graphql/queries/users';
import { UserRoles } from 'utils/constants';

const ExecutiveCreation = () => {
  const useFormUtils = useForm();
  const notification = useNotification();
  const { handleSubmit, reset } = useFormUtils;
  const history = useHistory();
  const params = new URLSearchParams(useLocation().search);
  const executiveId = params.get('id');

  const { loading: isLoadingGetExecutiveDetails } = useQuery(GET_USER_DETAIL, {
    skip: !executiveId,
    variables: {
      userId: executiveId,
    },
    onCompleted: ({ user }) => {
      reset({
        firstName: user.firstname,
        lastName: user.lastname,
        phoneNumber: user.phone,
        emailAddress: user.email,
        schools: user.institutions || [],
        visualizations: user.visualizations,
      });
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const [createExecutive, { loading: isLoadingCreateExecutive }] = useMutation(ADD_USER, {
    onCompleted: ({ registerUser: { ok, errors } }) => {
      if (ok) {
        notification.success({
          message: 'Executive created successfully',
        });
        handleClose();
        return;
      }

      notification.error({
        message: errors?.messages,
      });
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const [updateExecutive, { loading: isLoadingUpdateExecutive }] = useMutation(UPDATE_USER, {
    onCompleted: ({ updateUser: { ok, errors } }) => {
      if (ok) {
        notification.success({
          message: 'Executive updated successfully',
        });
        handleClose();
        return;
      }

      notification.error({
        message: errors?.map((error) => error.messages).join('.'),
      });
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const onSubmit = (variables) => {
    const upsertMutation = executiveId ? updateExecutive : createExecutive;
    const values = {
      firstname: variables.firstName,
      lastname: variables.lastName,
      phone: variables.phoneNumber,
      email: variables.emailAddress,
      institutions: variables.schools?.map((school) => school.id),
      visualizations: variables.visualizations,
      roles: [UserRoles.EXECUTIVE],
    };

    upsertMutation({
      variables: executiveId
        ? {
            newUser: values,
            id: executiveId,
          }
        : {
            ...values,
          },
    });
  };

  const getHeaderButtonProps = () => {
    return [
      {
        text: 'Save',
        variant: 'contained',
        color: 'primary',
        onClick: handleSubmit(onSubmit),
        disabled: isLoadingCreateExecutive || isLoadingUpdateExecutive,
        isLoading: isLoadingCreateExecutive || isLoadingUpdateExecutive,
      },
    ];
  };

  const handleClose = () => {
    history.goBack();
  };

  return (
    <LoadingView isLoading={isLoadingGetExecutiveDetails} size={60}>
      <RegistrationLayout
        onClose={handleClose}
        title="New Executive"
        hasHeaderButton
        headerButtons={getHeaderButtonProps()}>
        <Box display="flex" justifyContent="center">
          <Box width="100%" maxWidth={750}>
            <ExecutiveCreationForm useFormUtils={useFormUtils} />
          </Box>
        </Box>
      </RegistrationLayout>
    </LoadingView>
  );
};

export default ExecutiveCreation;
