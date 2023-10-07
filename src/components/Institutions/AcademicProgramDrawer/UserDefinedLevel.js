import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, TextField, Checkbox, Typography } from '@material-ui/core';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@apollo/client';

import { getFormError } from 'utils/formError';
import LoadingButton from 'reusables/LoadingButton';
import { CREATE_LEVEL, UPDATE_LEVEL } from 'graphql/mutations/institution';
import { useNotification } from 'reusables/NotificationBanner';

const Mode = {
  CREATE: `create`,
  EDIT: `edit`,
  DEFAULT: `default`,
};

const UserDefinedLevel = ({ onSelect, data, onChange, refetchLevels, institutionId }) => {
  const [mode, setMode] = useState(null);
  const { handleSubmit, errors, control, reset } = useForm();
  const notification = useNotification();

  useEffect(() => {
    if (data?.name) {
      setMode(Mode.DEFAULT);
      return;
    }
    setMode(Mode.CREATE);
  }, [data]);

  const [createLevel, { loading: isCreatingLevel }] = useMutation(CREATE_LEVEL, {
    onCompleted(data) {
      if (data?.createLevel?.ok) {
        notification.success({
          message: 'Level created successfully',
        });
        onChange({
          name: data?.createLevel?.level?.name,
          id: data?.createLevel?.level?.id,
        });
        refetchLevels?.();
      }
    },
    onError(error) {
      notification.error({
        message: 'Error!',
        description: error?.message,
      });
    },
  });

  const [updateLevel, { loading: isUpdatingLevel }] = useMutation(UPDATE_LEVEL, {
    onCompleted(data) {
      if (data?.updateLevel?.ok) {
        notification.success({
          message: 'Level updated successfully',
        });
        onChange({
          name: data?.updateLevel?.level?.name,
        });
      }
    },
    onError(error) {
      notification.error({
        message: 'Error!',
        description: error?.message,
      });
    },
  });

  const onSubmit = (values) => {
    if (mode === Mode.CREATE) {
      createLevel({
        variables: {
          newLevel: {
            ...values,
            institution: institutionId,
            default: false,
          },
        },
      });
      return;
    }

    updateLevel({
      variables: {
        newLevel: {
          ...values,
          institution: institutionId,
          default: false,
        },
        id: data?.id,
      },
    });
  };

  const handleShowEditLevelTextField = () => {
    reset({
      name: data?.name,
    });
    setMode(Mode.EDIT);
  };

  const renderUpsertMode = () => {
    return (
      <form>
        <Box display="flex">
          <Controller
            name="name"
            control={control}
            rules={{ required: true }}
            render={({ ref, ...rest }) => (
              <TextField
                {...rest}
                label="Level name"
                variant="outlined"
                required
                fullWidth
                inputRef={ref}
                error={getFormError('name', errors).hasError}
                helperText={getFormError('name', errors).message}
              />
            )}
          />
          <Box ml={4}>
            <LoadingButton
              color="primary"
              isLoading={isCreatingLevel || isUpdatingLevel}
              onClick={handleSubmit(onSubmit)}>
              {mode === Mode.CREATE ? 'Save' : 'Update'}
            </LoadingButton>
          </Box>
        </Box>
      </form>
    );
  };

  const renderDefaultMode = () => {
    return (
      <>
        <Checkbox
          checked={data?.checked}
          onChange={() => onSelect(!data?.checked)}
          color="primary"
        />
        <Box ml={4}>
          <Typography color="textPrimary" variant="body1">
            {data.name}
          </Typography>
        </Box>
        <Box ml={8}>
          <Button variant="text" color="primary" onClick={handleShowEditLevelTextField}>
            Edit
          </Button>
        </Box>
      </>
    );
  };

  return (
    <Box display="flex" alignItems="center">
      {mode === Mode.DEFAULT ? renderDefaultMode() : renderUpsertMode()}
    </Box>
  );
};

UserDefinedLevel.propTypes = {
  onSelect: PropTypes.func,
  data: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string,
    checked: PropTypes.bool,
  }),
  onChange: PropTypes.func,
  institutionId: PropTypes.string,
};

export default React.memo(UserDefinedLevel);
