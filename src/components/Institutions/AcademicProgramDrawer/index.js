import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { TextField, Typography, Box, Button, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Controller, useForm } from 'react-hook-form';
import { Add } from '@material-ui/icons';
import { useMutation, useQuery } from '@apollo/client';

import Drawer from 'reusables/Drawer';
import { getFormError } from 'utils/formError';
import LearnerType from './LearnerType';
import { fontWeight, spaces } from '../../../Css';
import {
  CREATE_INSTITUTION_PROGRAM,
  UPDATE_INSTITUTION_PROGRAM,
} from 'graphql/mutations/institution';
import { useNotification } from 'reusables/NotificationBanner';
import { GET_LEVELS, GET_PROGRAM_BY_ID_QUERY } from 'graphql/queries/institution';
import LoadingView from 'reusables/LoadingView';
import { DEFAULT_PAGE_OFFSET, ProgramType } from 'utils/constants';
import UserDefinedLevel from './UserDefinedLevel';
import DefaultLevel from './DefaultLevel';

const LevelType = {
  DEFAULT: `default`,
  USER_DEFINED: `user_defined`,
};

const AcademicProgramDrawer = ({ open, onClose, programId, institutionId, onOKSuccess }) => {
  const classes = useStyles();
  const { handleSubmit, errors, control, reset } = useForm();
  const [levelList, setLevelList] = useState([]);
  const notification = useNotification();
  const isEditMode = Boolean(programId);

  const { data, loading } = useQuery(GET_PROGRAM_BY_ID_QUERY, {
    variables: { programId },
    skip: !Boolean(programId),
  });

  const { data: levelsData, refetch: refetchLevels } = useQuery(GET_LEVELS, {
    variables: { offset: DEFAULT_PAGE_OFFSET, limit: 100 },
  });

  const [createInstititutionProgram, { loading: createInstititutionProgramLoading }] = useMutation(
    CREATE_INSTITUTION_PROGRAM,
    {
      onCompleted(data) {
        if (!data?.createProgram?.ok) {
          notification.error({
            message: data?.createProgram?.errors?.map((error) => error.messages).join('. '),
          });
        } else {
          notification.success({
            message: 'Academic program created successfully',
          });
          onOKSuccess();
          onClose();
        }
      },
      onError(error) {
        notification.error({
          message: 'Error!',
          description: error?.message,
        });
      },
    },
  );

  const [updateInstititutionProgram, { loading: updateInstititutionProgramLoading }] = useMutation(
    UPDATE_INSTITUTION_PROGRAM,
    {
      onCompleted(data) {
        if (data?.updateProgram?.ok) {
          notification.success({
            message: 'Academic program updated successfully',
          });
          onClose();
        }
      },
      onError(error) {
        notification.error({
          message: 'Error!',
          description: error?.message,
        });
      },
    },
  );

  useEffect(() => {
    if (!open) {
      reset({
        name: '',
        abbreviation: '',
        programType: null,
        selectedLevelIds: [],
      });
    }
    // eslint-disable-next-line
  }, [open]);

  useEffect(() => {
    if (data && open) {
      let { programType, name, abbreviation, levels } = data?.program || {};

      reset({
        name,
        abbreviation: abbreviation,
        programType: programType?.length > 1 ? ProgramType.BOTH : programType?.[0],
        selectedLevelIds: levels?.map((level) => level.id),
      });
    }
    // eslint-disable-next-line
  }, [data, open]);

  useEffect(() => {
    if (levelsData) {
      initLevels(levelsData?.levels?.results || []);
    }
    // eslint-disable-next-line
  }, [levelsData]);

  const initLevels = (levels) => {
    const newList = levels.map((level) => {
      return {
        name: level.name,
        id: level.id,
        type: level.default ? LevelType.DEFAULT : LevelType.USER_DEFINED,
      };
    });

    setLevelList(newList);
  };

  const onSubmit = (values) => {
    let variables = {
      institution: institutionId,
      abbreviation: values.abbreviation,
      name: values.name,
      programType:
        values.programType === ProgramType.BOTH
          ? [ProgramType.FULL_TIME, ProgramType.PART_TIME]
          : [values.programType],
      levels: values.selectedLevelIds,
    };

    if (!isEditMode) {
      createInstititutionProgram({
        variables: {
          newProgram: variables,
        },
      });
      return;
    }

    updateInstititutionProgram({
      variables: {
        newProgram: variables,
        id: programId,
      },
    });
  };

  const handleAddLevel = () => {
    const newLevel = {
      name: null,
      id: new Date().getMilliseconds(),
      type: LevelType.USER_DEFINED,
    };

    setLevelList((prevState) => [...prevState, newLevel]);
  };

  const handleChangeLevel = (id) => (changeset) => {
    setLevelList((prevState) =>
      prevState.map((level) => {
        if (level.id === id) {
          return {
            ...level,
            ...changeset,
          };
        }
        return level;
      }),
    );
  };

  const handleSelectLevel = (id, selectedLevelIds) => () => {
    if (selectedLevelIds.indexOf(id) === -1) {
      reset({
        selectedLevelIds: [...selectedLevelIds, id],
      });
      return;
    }

    reset({
      selectedLevelIds: selectedLevelIds.filter((levelId) => levelId !== id),
    });
  };

  const renderDefaultLevel = (level, selectedLevelIds) => {
    return (
      <DefaultLevel
        checked={selectedLevelIds.indexOf(level.id) !== -1}
        onSelect={handleSelectLevel(level.id, selectedLevelIds)}
        name={level.name}
      />
    );
  };

  const renderUserDefinedLevel = (level, selectedLevelIds) => {
    return (
      <UserDefinedLevel
        onSelect={handleSelectLevel(level.id, selectedLevelIds)}
        onChange={handleChangeLevel(level.id)}
        institutionId={institutionId}
        data={{
          ...level,
          checked: selectedLevelIds.indexOf(level.id) !== -1,
        }}
        refetchLevels={refetchLevels}
      />
    );
  };

  const renderLevels = () => {
    return (
      <Box mt={12} mb={12}>
        <Controller
          name="selectedLevelIds"
          control={control}
          rules={{ required: true, validate: (value) => value?.length > 0 }}
          render={({ value: selectedLevelIds }) =>
            levelList.map((level) => (
              <Box mb={4} key={level.id}>
                {level.type === LevelType.DEFAULT
                  ? renderDefaultLevel(level, selectedLevelIds)
                  : renderUserDefinedLevel(level, selectedLevelIds)}
              </Box>
            ))
          }
        />
      </Box>
    );
  };

  return (
    <React.Fragment>
      <Drawer
        title="Academic program"
        centered
        okText="Save"
        onOk={handleSubmit(onSubmit)}
        okButtonProps={{
          isLoading: createInstititutionProgramLoading || updateInstititutionProgramLoading,
        }}
        onClose={onClose}
        cancelText="Cancel"
        open={open}
        disableAutoFocus={true}>
        <LoadingView isLoading={loading}>
          <form className={classes.form}>
            <Controller
              name="name"
              control={control}
              rules={{ required: true }}
              render={({ ref, ...rest }) => (
                <TextField
                  {...rest}
                  label="Program name"
                  fullWidth
                  variant="outlined"
                  inputRef={ref}
                  error={getFormError('name', errors).hasError}
                  helperText={getFormError('name', errors).message}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              )}
            />
            <Controller
              name="abbreviation"
              control={control}
              rules={{ required: true }}
              render={({ ref, ...rest }) => (
                <TextField
                  {...rest}
                  label="Abbreviation"
                  fullWidth
                  inputRef={ref}
                  variant="outlined"
                  error={getFormError('abbreviation', errors).hasError}
                  helperText={getFormError('abbreviation', errors).message}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              )}
            />
            <Controller
              name="programType"
              control={control}
              rules={{ required: true }}
              render={({ onChange, value }) => <LearnerType value={value} onChange={onChange} />}
            />
            {getFormError('programType', errors).hasError && (
              <Typography variant="body2" color="error">
                {getFormError('programType', errors).message}
              </Typography>
            )}
            <Paper className={classes.level} square>
              <Typography component="span" color="textPrimary" className="boldText">
                Levels
                {getFormError('selectedLevelIds', errors).hasError && (
                  <Typography
                    component="span"
                    color="error"
                    variant="body2"
                    style={{ marginLeft: 4 }}>
                    {getFormError('selectedLevelIds', errors).message}
                  </Typography>
                )}
              </Typography>
              {renderLevels()}
              <Button variant="text" color="primary" onClick={handleAddLevel} startIcon={<Add />}>
                New level
              </Button>
            </Paper>
          </form>
        </LoadingView>
      </Drawer>
    </React.Fragment>
  );
};

const useStyles = makeStyles((theme) => ({
  form: {
    '& > *': {
      marginBottom: spaces.medium,
    },
  },
  level: {
    width: '100%',
    marginLeft: theme.spacing(-12),
    padding: theme.spacing(12),
    marginBottom: 150,
    '& .boldText': {
      fontWeight: fontWeight.bold,
    },
  },
}));

AcademicProgramDrawer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  programId: PropTypes.string,
  onOKSuccess: PropTypes.func,
  refetchLevels: PropTypes.func,
};

export default AcademicProgramDrawer;
