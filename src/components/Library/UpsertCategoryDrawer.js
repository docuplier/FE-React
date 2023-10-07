import { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Box } from '@material-ui/core';
import { useLazyQuery, useMutation } from '@apollo/client';

import Drawer from 'reusables/Drawer';
import LoadingView from 'reusables/LoadingView';
import { getFormError } from 'utils/formError';
import FileUpload from 'reusables/FileUpload';
import { ImageUploadFormats } from 'utils/constants';
import { GET_FIELD_OF_INTEREST } from 'graphql/queries/library';
import { useNotification } from 'reusables/NotificationBanner';
import { CREATE_FIELD_OF_INTEREST, UPDATE_FIELD_OF_INTEREST } from 'graphql/mutations/library';

const UpsertCategoryDrawer = ({ open, onClose, categoryId, onCompletedCallback }) => {
  const isEditing = Boolean(categoryId);
  const { handleSubmit, control, errors, reset } = useForm();
  const notification = useNotification();

  const [getFieldOfInterest, { loading, data }] = useLazyQuery(GET_FIELD_OF_INTEREST, {
    skip: !categoryId,
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
    onCompleted: ({ fieldOfInterest: { name, description, thumbnail } }) => {
      reset({
        name,
        description,
        file: thumbnail ? { name: thumbnail } : null,
      });
    },
  });

  const [createCategory, { loading: isLoadingCreateCategory }] = useMutation(
    CREATE_FIELD_OF_INTEREST,
    {
      onCompleted: ({ createFieldOfInterest: { ok, errors } }) => {
        if (ok) {
          notification.success({
            message: 'Category created successfully',
          });
          onCompletedCallback?.(data);
          onClose();
          return;
        }

        notification.error({
          message: errors.map((error) => error.messages).join('. '),
        });
      },
      onError: (error) => {
        notification.error({
          message: error?.message,
        });
      },
    },
  );

  const [updateCategory, { loading: isLoadingUpdateCategory }] = useMutation(
    UPDATE_FIELD_OF_INTEREST,
    {
      onCompleted: ({ updateFieldOfInterest: { ok, errors } }) => {
        if (ok) {
          notification.success({
            message: 'Category updated successfully',
          });
          onCompletedCallback?.(data);
          onClose();
          return;
        }

        notification.error({
          message: errors.map((error) => error.messages).join('. '),
        });
      },
      onError: (error) => {
        notification.error({
          message: error?.message,
        });
      },
    },
  );

  useEffect(() => {
    //This should probably be refactored. We shouldn't use lazyQuery here
    //but due to the current refresh bug of Apollo, we need to use this as an hack to persist the
    //new value on the UI
    if (open && categoryId) {
      getFieldOfInterest({
        variables: {
          interestId: categoryId,
        },
      });
    } else if (!open) {
      reset({});
    }
    // eslint-disable-next-line
  }, [open, categoryId]);

  const onSubmit = (values) => {
    const upsertMutation = categoryId ? updateCategory : createCategory;
    const thumbnail = values.thumbnail instanceof File ? values.thumbnail : undefined;

    upsertMutation({
      variables: {
        newFieldofinterest: {
          name: values.name,
          description: values.description,
        },
        thumbnail,
        id: categoryId,
      },
    });
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={!isEditing ? 'New Category' : 'Edit Category'}
      okText={!isEditing ? 'Create' : 'Edit'}
      onOk={handleSubmit(onSubmit)}
      okButtonProps={{
        isLoading: isLoadingCreateCategory || isLoadingUpdateCategory,
      }}>
      <LoadingView isLoading={loading}>
        <Box mb={12}>
          <Controller
            name="name"
            control={control}
            rules={{ required: true }}
            render={({ ref, ...rest }) => (
              <TextField
                {...rest}
                label="Name"
                variant="outlined"
                required
                fullWidth
                inputRef={ref}
                error={getFormError('name', errors).hasError}
                helperText={getFormError('name', errors).message}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        </Box>
        <Box mb={12}>
          <Controller
            name="description"
            control={control}
            rules={{ required: true }}
            render={({ ref, ...rest }) => (
              <TextField
                {...rest}
                label="Description"
                variant="outlined"
                required
                multiline
                rows={5}
                fullWidth
                inputRef={ref}
                error={getFormError('description', errors).hasError}
                helperText={getFormError('description', errors).message}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        </Box>
        <Box mb={12}>
          <Controller
            name="thumbnail"
            control={control}
            render={({ onChange, value, ...rest }) => (
              <FileUpload
                accept={ImageUploadFormats}
                onChange={(file) => onChange(file)}
                file={value}
                {...rest}
              />
            )}
          />
        </Box>
      </LoadingView>
    </Drawer>
  );
};

UpsertCategoryDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  categoryId: PropTypes.string,
  onCompletedCallback: PropTypes.func,
};

export default memo(UpsertCategoryDrawer);
