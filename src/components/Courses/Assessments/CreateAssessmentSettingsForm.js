import { memo } from 'react';
import PropTypes from 'prop-types';
import { Box, Paper, TextField, Typography, Divider } from '@material-ui/core';
import { Controller } from 'react-hook-form';

import { colors, fontWeight } from '../../../Css';
import { getFormError } from 'utils/formError';

const CreateAssessmentSettingsForm = ({ control, errors, watch }) => {
  const { startDate } = watch();
  const renderDatesAndTime = () => {
    return (
      <>
        <Box mt={8}>
          <Controller
            name="startDate"
            control={control}
            rules={{
              required: true,
            }}
            render={({ ref, ...rest }) => (
              <TextField
                {...rest}
                type="date"
                inputRef={ref}
                fullWidth
                variant="outlined"
                label="Start date"
                error={getFormError('startDate', errors).hasError}
                helperText={getFormError('startDate', errors).message}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        </Box>
        <Box mt={8}>
          <Controller
            name="startTime"
            control={control}
            rules={{
              required: true,
            }}
            render={({ ref, ...rest }) => (
              <TextField
                {...rest}
                type="time"
                inputRef={ref}
                fullWidth
                variant="outlined"
                label="Start time"
                error={getFormError('startTime', errors).hasError}
                helperText={getFormError('startTime', errors).message}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        </Box>
        <Box mt={8}>
          <Controller
            name="dueDate"
            control={control}
            rules={{
              required: true,
              min: { value: startDate, message: 'Due date cannot be less than start date' },
            }}
            render={({ ref, ...rest }) => (
              <TextField
                {...rest}
                type="date"
                inputRef={ref}
                fullWidth
                variant="outlined"
                label="Due date"
                error={getFormError('dueDate', errors).hasError}
                helperText={getFormError('dueDate', errors).message}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        </Box>
        <Box mt={8}>
          <Controller
            name="dueTime"
            control={control}
            rules={{
              required: true,
            }}
            render={({ ref, ...rest }) => (
              <TextField
                {...rest}
                type="time"
                inputRef={ref}
                fullWidth
                variant="outlined"
                label="Due time"
                error={getFormError('dueTime', errors).hasError}
                helperText={getFormError('dueTime', errors).message}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        </Box>
      </>
    );
  };

  return (
    <Box
      elevation={0}
      component={Paper}
      p={8}
      bgcolor={'#fafafa'}
      style={{ border: `1px solid ${colors.secondaryLightGrey}` }}
    >
      <Typography variant="body1" color="textPrimary" style={{ fontWeight: fontWeight.bold }}>
        Duration
      </Typography>
      <Box mt={8}>
        <Controller
          name="duration"
          control={control}
          rules={{
            required: true,
            min: { value: 0, message: 'Value cannot be less than 0' },
          }}
          render={({ ref, ...rest }) => (
            <TextField
              {...rest}
              type="number"
              inputRef={ref}
              fullWidth
              variant="outlined"
              label="Duration (in minutes)"
              error={getFormError('duration', errors).hasError}
              helperText={getFormError('duration', errors).message}
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}
        />
      </Box>
      <Box mt={8}>
        <Divider style={{ width: '100%' }} />
      </Box>
      {renderDatesAndTime()}
    </Box>
  );
};

CreateAssessmentSettingsForm.propTypes = {
  control: PropTypes.object.isRequired,
  errors: PropTypes.any,
};

export default memo(CreateAssessmentSettingsForm);
