import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import { Box, TextField } from '@material-ui/core';
import Drawer from 'reusables/Drawer';
import LoadingView from 'reusables/LoadingView';
import { getFormError } from 'utils/formError';

const UpsertCategory = ({
  handleSubmit,
  control,
  errors,
  reset,
  open,
  onClose,
  categoryField,
  newCategoryLoading,
  updateCategoryLoading,
  onCreateCategory,
  onUpdateCategory,
}) => {
  useEffect(() => {
    if (!!categoryField) reset(categoryField);
    // eslint-disable-next-line
  }, [categoryField]);

  const onSubmit = (values) => {
    if (!!categoryField.id) {
      onUpdateCategory({ ...values, categoryId: categoryField.id });
      return;
    }
    onCreateCategory(values);
  };

  const renderCourseCategoryForm = () => {
    return (
      <form noValidate autoComplete="off">
        <Controller
          name="title"
          control={control}
          rules={{ required: 'Category title is required' }}
          render={({ ref, ...fieldProps }) => (
            <TextField
              style={{ margin: '10px 0px' }}
              {...fieldProps}
              inputRef={ref}
              label="Category Title"
              variant="outlined"
              required
              fullWidth
              error={getFormError('title', errors).hasError}
              helperText={getFormError('title', errors).message}
            />
          )}
        />
        <Box mt={5}>
          <Controller
            name="description"
            control={control}
            rules={{ required: true, maxLength: 250 }}
            render={({ ref, ...fieldProps }) => (
              <TextField
                {...fieldProps}
                inputRef={ref}
                variant="outlined"
                label="Category Description"
                required
                fullWidth
                multiline
                rows={5}
                error={getFormError('description', errors).hasError}
                helperText={getFormError('description', errors).message}
              />
            )}
          />
        </Box>
      </form>
    );
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={!!categoryField?.id ? 'Edit Category' : 'Add New Category'}
      okText={!!categoryField?.id ? 'Update' : 'Create Category'}
      onOk={handleSubmit(onSubmit)}
      okButtonProps={{
        isLoading: newCategoryLoading || updateCategoryLoading,
      }}>
      <LoadingView>{renderCourseCategoryForm()}</LoadingView>
    </Drawer>
  );
};

UpsertCategory.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  categoryField: PropTypes.string,
  onCompletedCallback: PropTypes.func,
};

export default React.memo(UpsertCategory);
