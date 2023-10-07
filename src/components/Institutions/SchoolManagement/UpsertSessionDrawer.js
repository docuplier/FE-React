import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { TextField, Typography, Box, Button, Paper, makeStyles } from '@material-ui/core';
import { Controller, useForm } from 'react-hook-form';
import { Add } from '@material-ui/icons';
import { useQuery, useMutation } from '@apollo/client';
import { format } from 'date-fns';

import Drawer from 'reusables/Drawer';
import { getFormError } from 'utils/formError';
import { fontWeight, spaces } from '../../../Css';
import { useNotification } from 'reusables/NotificationBanner';
import { GET_SESSION_BY_ID_QUERY } from 'graphql/queries/institution';
import { CREATE_SESSION, UPDATE_SESSION } from 'graphql/mutations/institution';
import LoadingView from 'reusables/LoadingView';
import Banner from 'reusables/Banner';
import SemesterListInputField from './SemesterListInputField';

const UpsertSessionDrawer = ({
  open,
  onClose,
  sessionId,
  institutionId,
  programId,
  refetchAllSessions,
}) => {
  const classes = useStyles();
  const currentYear = new Date().getFullYear();
  const notification = useNotification();
  const isEditMode = Boolean(sessionId);

  const { errors, handleSubmit, control, reset, setValue, watch } = useForm({
    defaultValues: {
      name: `${currentYear}/${currentYear + 1}`,
      isActive: false,
    },
  });
  const semesters = watch('semesters') || [];

  const { data, loading } = useQuery(GET_SESSION_BY_ID_QUERY, {
    variables: { sessionId },
    skip: !isEditMode,
  });

  const [createSession, { loading: createSessionLoading }] = useMutation(CREATE_SESSION, {
    onCompleted({ createSession: { ok, errors } }) {
      if (ok) {
        notification.success({
          message: 'Session created successfully',
        });
        refetchAllSessions();
        onClose();
        return;
      }

      notification.error({
        message: errors?.map((error) => error.messages).join('. '),
      });
    },
    onError(error) {
      notification.error({
        message: 'Error!',
        description: error?.message,
      });
    },
  });

  const [updateSession, { loading: updateSessionLoading }] = useMutation(UPDATE_SESSION, {
    onCompleted(data) {
      if (data?.updateSession?.ok) {
        notification.success({
          message: 'Session updated successfully',
        });
        refetchAllSessions();
        onClose();
      }
    },
    onError(error) {
      notification.error({
        message: 'Error!',
        description: error?.message,
      });
    },
  });

  useEffect(() => {
    if (!open) {
      reset({
        name: '',
      });
    } else if (open && data) {
      reset({
        name: data?.session?.name,
        isActive: data?.session?.isActive,
        semesters: getInitialSemesters(data?.session?.institutionSessionSemester),
      });
    }
    // eslint-disable-next-line
  }, [open, data]);

  const getInitialSemesters = (semesters) => {
    return semesters.map((semester) => ({
      position: Number(semester.name),
      startDate: format(new Date(semester.startSemester), 'yyyy-MM-dd'),
      endDate: format(new Date(semester.endSemester), 'yyyy-MM-dd'),
    }));
  };

  const isEndDatesGreaterThanOrEqualToStartDates = (semesters) => {
    return semesters?.reduce(
      (acc, semester) => {
        let isEndDateGreaterThanOrEqualToStartDate =
          new Date(semester.endDate) >= new Date(semester.startDate);

        if (!isEndDateGreaterThanOrEqualToStartDate) {
          acc = {
            ...acc,
            errors: {
              ...acc.errors,
              [semester.position]: {
                startDate: undefined,
                endDate: 'Cannot be more than start date',
              },
            },
          };
        }

        acc = {
          ...acc,
          isValid: acc.isValid && isEndDateGreaterThanOrEqualToStartDate,
        };
        return acc;
      },
      { isValid: true, errors: {} },
    );
  };

  const onSubmit = (values) => {
    let variables = {
      id: isEditMode ? sessionId : undefined,
      newInstitutionsession: {
        institution: institutionId,
        name: values.name,
        isActive: values.isActive,
        program: programId,
        semesters: values.semesters.map((semester) => ({
          name: semester.position.toString(),
          startSemester: semester.startDate,
          endSemester: semester.endDate,
        })),
      },
    };
    let upsertSession = !isEditMode ? createSession : updateSession;

    upsertSession({
      variables,
    });
  };

  const handleAddSemester = () => {
    setValue('semesters', [
      {
        position: semesters.length + 1,
        startDate: format(new Date(), 'yyyy-MM-dd'),
        endDate: format(new Date(), 'yyyy-MM-dd'),
      },
      ...semesters,
    ]);
  };

  const renderAddSemesterHeader = () => {
    return (
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body1" color="textPrimary" className={classes.boldText}>
          Semester
        </Typography>
        <Button
          variant="text"
          color="primary"
          style={{ padding: 0, minHeight: 'auto' }}
          onClick={handleAddSemester}>
          <Add style={{ marginRight: spaces.small }} /> New semester
        </Button>
      </Box>
    );
  };

  const renderSemesters = () => {
    return (
      <Box mt={8}>
        <Controller
          name="semesters"
          control={control}
          rules={{
            required: true,
            validate: (semesters) => isEndDatesGreaterThanOrEqualToStartDates(semesters).isValid,
          }}
          render={({ value, onChange }) => (
            <SemesterListInputField
              value={value || []}
              onChange={onChange}
              errors={isEndDatesGreaterThanOrEqualToStartDates(semesters).errors}
            />
          )}
        />
      </Box>
    );
  };

  const renderBanner = () => {
    return (
      <Box mb={8}>
        <Controller
          name="isActive"
          control={control}
          render={({ value, onChange }) => (
            <Banner
              showSwitch={true}
              title={value ? 'Active' : 'Inactive'}
              message="Use the switch to toggle the active state of this session"
              checked={Boolean(value)}
              onToggleSwitch={(value) => onChange(value)}
              severity={value ? 'success' : 'error'}
            />
          )}
        />
      </Box>
    );
  };

  return (
    <Drawer
      title="Add new session"
      centered
      okText="Save"
      onOk={handleSubmit(onSubmit)}
      onClose={onClose}
      width={532}
      cancelText="Cancel"
      open={open}
      okButtonProps={{
        isLoading: createSessionLoading || updateSessionLoading,
      }}
      disableAutoFocus={true}>
      <LoadingView isLoadingg={loading}>
        <form className={classes.form}>
          {renderBanner()}
          <Controller
            name="name"
            control={control}
            rules={{ required: true }}
            render={({ ref, ...rest }) => (
              <TextField
                {...rest}
                label="Session name"
                fullWidth
                variant="outlined"
                name="name"
                inputRef={ref}
                error={getFormError('name', errors).hasError}
                helperText={getFormError('name', errors).message}
              />
            )}
          />
          <Paper square className={classes.semestersContainer}>
            {renderAddSemesterHeader()}
            {renderSemesters()}
          </Paper>
        </form>
      </LoadingView>
    </Drawer>
  );
};

const useStyles = makeStyles((theme) => ({
  boldText: {
    fontWeight: fontWeight.bold,
  },
  semestersContainer: {
    width: '100%',
    marginLeft: theme.spacing(-12),
    padding: theme.spacing(10, 12),
  },
}));

UpsertSessionDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  sessionId: PropTypes.string.isRequired,
  institutionId: PropTypes.string.isRequired,
  programId: PropTypes.string.isRequired,
  refetchAllSessions: PropTypes.func,
};

export default React.memo(UpsertSessionDrawer);
