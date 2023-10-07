import { memo, useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import {
  Grid,
  TextField,
  MenuItem,
  Box,
  IconButton,
  Button,
  InputAdornment,
} from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import { useQuery } from '@apollo/client';

import Drawer from 'reusables/Drawer';
import { getFormError } from 'utils/formError';
import { GET_DEPARTMENTS_QUERY, GET_LEVELS_QUERY } from 'graphql/queries/institution';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import { DEFAULT_PAGE_OFFSET } from 'utils/constants';
import { useNotification } from 'reusables/NotificationBanner';
import LoadingView from 'reusables/LoadingView';

const AddOtherDepartmentsModal = ({ data, open, onClose, onUpdate }) => {
  const [rowIds, setRowIds] = useState([]);
  const notification = useNotification();
  const { handleSubmit, control, errors, reset } = useForm();
  const { userDetails } = useAuthenticatedUser();
  const institutionId = userDetails?.institution?.id;
  const [currentSelection, setCurrentSelection] = useState({
    rowIds: [],
    departmentId: null,
  });

  const { data: departmentsData } = useQuery(GET_DEPARTMENTS_QUERY, {
    variables: {
      institutionId,
      active: true,
      limit: 100,
      offset: DEFAULT_PAGE_OFFSET,
    },
    skip: !institutionId,
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });
  const departments = departmentsData?.departments?.results || [];

  const { data: levelsData, loading: isLoadingLevels } = useQuery(GET_LEVELS_QUERY, {
    variables: {
      active: true,
      departmentId: currentSelection.departmentId,
      limit: 100,
      offset: DEFAULT_PAGE_OFFSET,
    },
    skip: !currentSelection.departmentId,
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });
  const levels = levelsData?.levels?.results || [];

  useEffect(() => {
    if (open && data?.length > 0) {
      const { newRowIds, formValues } = data?.reduce(
        (acc, item) => {
          const id = `${item.department?.id || item.department}-${item.level?.id || item?.level}`;

          acc.newRowIds.push(id);
          acc.formValues = {
            ...acc.formValues,
            [`${id}-departmentId`]: item?.department?.id || item.department,
            [`${id}-levelId`]: item?.level?.id || item?.level,
          };

          setCurrentSelection((prev) => ({
            rowIds: [...prev.rowIds, id],
            departmentId: item?.department?.id || item.department,
          }));
          return acc;
        },
        { newRowIds: [], formValues: {} },
      );

      setRowIds(newRowIds);
      reset(formValues);
    } else if (open && data?.length === 0) {
      setRowIds([`${Date.now()}`]);
    }
    // eslint-disable-next-line
  }, [open, data]);

  const getLevelHelperText = (errorMessage, disabled) => {
    if (errorMessage) {
      return errorMessage;
    } else if (disabled) {
      return 'Select a department to make this active';
    }
  };

  const handleRemoveRow = (rowId) => () => {
    setRowIds((prevState) => prevState.filter((id) => id !== rowId));
  };

  const handleAddRow = () => {
    setRowIds((prevState) => [...prevState, `${Date.now()}`]);
  };

  const onSubmit = (values) => {
    const parsedValues = rowIds.map((rowId) => ({
      department: values[`${rowId}-departmentId`],
      level: values[`${rowId}-levelId`],
    }));

    onUpdate(parsedValues);
    onClose();
  };

  const renderRow = (rowId) => {
    return (
      <>
        <Grid item xs={6}>
          <Controller
            name={`${rowId}-departmentId`}
            control={control}
            rules={{ required: { value: true, message: 'Department is required' } }}
            render={({ ref, onChange, ...rest }) => {
              return (
                <TextField
                  {...rest}
                  onChange={(evt) => {
                    const departmentId = evt.target.value;

                    onChange(departmentId);

                    setCurrentSelection((prev) => ({
                      rowIds: [...prev.rowIds, rowId],
                      departmentId,
                    }));
                  }}
                  label="Select Department"
                  variant="outlined"
                  required
                  select
                  fullWidth
                  inputRef={ref}
                  error={getFormError(`${rowId}-departmentId`, errors).hasError}
                  helperText={getFormError(`${rowId}-departmentId`, errors).message}>
                  {departments?.map((department) => (
                    <MenuItem key={department.id} value={department.id}>
                      {department.name}
                    </MenuItem>
                  ))}
                </TextField>
              );
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <Box
            display="flex"
            position="relative"
            alignItems="center"
            justifyContent="space-between">
            <Controller
              name={`${rowId}-levelId`}
              control={control}
              rules={{ required: { value: true, message: 'Level is required' } }}
              render={({ ref, ...rest }) => {
                return (
                  <TextField
                    {...rest}
                    label="Select Level"
                    variant="outlined"
                    disabled={!currentSelection?.rowIds?.includes(rowId)}
                    required
                    select
                    InputProps={
                      isLoadingLevels && {
                        endAdornment: (
                          <InputAdornment position="end">
                            <LoadingView isLoading={isLoadingLevels} size={10} />
                          </InputAdornment>
                        ),
                      }
                    }
                    style={{ width: '80%' }}
                    inputRef={ref}
                    error={getFormError(`${rowId}-levelId`, errors).hasError}
                    helperText={getLevelHelperText(
                      getFormError(`${rowId}-levelId`, errors).message,
                      !currentSelection.rowIds?.includes(rowId),
                    )}>
                    {levels?.map((level) => (
                      <MenuItem key={level.id} value={level.id}>
                        {level.name}
                      </MenuItem>
                    ))}
                  </TextField>
                );
              }}
            />
            <Box position="absolute" top={0} right={0}>
              <IconButton aria-label="delete" onClick={handleRemoveRow(rowId)}>
                <ClearIcon />
              </IconButton>
            </Box>
          </Box>
        </Grid>
      </>
    );
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Add Other Department"
      okText="Continue"
      onOk={handleSubmit(onSubmit)}>
      <Grid container spacing={6}>
        {rowIds.map((rowId) => (
          <Fragment key={rowId}>{renderRow(rowId)}</Fragment>
        ))}
      </Grid>
      <Box mt={4}>
        <Button size="small" color="primary" onClick={handleAddRow}>
          Add New
        </Button>
      </Box>
    </Drawer>
  );
};

AddOtherDepartmentsModal.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      department: PropTypes.string.isRequired,
      level: PropTypes.string.isRequired,
    }),
  ),
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func,
};

export default memo(AddOtherDepartmentsModal);
