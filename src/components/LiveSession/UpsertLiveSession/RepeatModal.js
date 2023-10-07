import React from 'react';
import {
  TextField,
  MenuItem,
  Modal,
  Card,
  CardContent,
  Typography,
  CardActions,
  CardHeader,
  FormHelperText,
  Box,
} from '@material-ui/core';
import { Controller } from 'react-hook-form';
import { makeStyles, useTheme } from '@material-ui/styles';

import { getFormError } from 'utils/formError';
import LoadingButton from 'reusables/LoadingButton';
import { LiveSessionInterval } from 'utils/constants';
import RenderWeeklyInterval from './RenderWeeklyInterval';
import RenderMonthlyInterval from './RenderMonthlyInterval';
import RenderAnnualInterval from './RenderAnnualInterval';

const RepeatModal = ({ open, useFormUtils, onClose }) => {
  const classes = useStyles();
  const theme = useTheme();
  const { control, errors, watch } = useFormUtils;
  const { interval } = watch();
  const intervalsOption = getIntervalsOption({ interval, useFormUtils });

  const renderRepeatSelect = () => (
    <Box className="field-row" display="flex">
      <Box mr={10}>
        <Controller
          name="number"
          control={control}
          rules={{
            required: 'Number is required',
          }}
          render={({ ...rest }) => (
            <TextField
              {...rest}
              required
              variant="outlined"
              id="date"
              label="Number"
              type="number"
              error={getFormError('number', errors).hasError}
              helperText={getFormError('number', errors).message}
            />
          )}
        />
      </Box>
      <Box>
        <Controller
          name="interval"
          control={control}
          render={({ ref, ...rest }) => {
            return (
              <TextField {...rest} label="Interval" variant="outlined" select inputRef={ref}>
                {Object.values(intervalsOption).map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            );
          }}
        />
      </Box>
    </Box>
  );

  return (
    <Modal open={open} onClose={onClose}>
      <Card style={getModalStyle()} className={classes.paper}>
        <CardHeader title={<Typography variant="h6">Custom recurrence</Typography>} />
        <CardContent>
          <form className={classes.form}>
            <Controller
              name="startDate"
              control={control}
              rules={{
                required: 'Start date is required',
              }}
              render={({ ...rest }) => (
                <TextField
                  {...rest}
                  fullWidth
                  required
                  variant="outlined"
                  id="date"
                  label="Start date"
                  type="date"
                  error={getFormError('startDate', errors).hasError}
                  helperText={getFormError('startDate', errors).message}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              )}
            />
            <Box mt={10}>
              <FormHelperText style={{ marginBottom: theme.spacing(5) }}>
                Repeat every
              </FormHelperText>
              {renderRepeatSelect()}
            </Box>

            {intervalsOption[interval]?.component && (
              <Box mt={10} mb={10}>
                {intervalsOption[interval]?.component}
              </Box>
            )}

            <Controller
              name="endDate"
              control={control}
              rules={{
                required: 'Start date is required',
              }}
              render={({ ...rest }) => (
                <TextField
                  {...rest}
                  fullWidth
                  required
                  variant="outlined"
                  id="date"
                  label="End date"
                  type="date"
                  error={getFormError('endDate', errors).hasError}
                  helperText={getFormError('endDate', errors).message}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              )}
            />
          </form>
        </CardContent>
        <CardActions style={{ padding: theme.spacing(10) }}>
          <LoadingButton
            variant="outlined"
            onClick={onClose}
            style={{ marginLeft: 'auto', marginRight: theme.spacing(5) }}>
            Cancel
          </LoadingButton>
          <LoadingButton variant="contained" color="primary">
            Save
          </LoadingButton>
        </CardActions>
      </Card>
    </Modal>
  );
};

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  form: {
    '& .field': {
      marginBottom: theme.spacing(10),
    },
    '& .half-field': {
      width: '100%',
    },
    '& .field-row': {
      marginBottom: theme.spacing(10),
    },
  },
  paper: {
    position: 'absolute',
    width: '100%',
    maxWidth: 500,
  },
}));

const getIntervalsOption = ({ useFormUtils, interval }) => ({
  [LiveSessionInterval.DAILY]: {
    value: LiveSessionInterval.DAILY,
    component: null,
    name: 'Daily',
  },
  [LiveSessionInterval.WEEKLY]: {
    value: LiveSessionInterval.WEEKLY,
    component: (
      <RenderWeeklyInterval
        useFormUtils={useFormUtils}
        isSelectedInterval={interval === LiveSessionInterval.WEEKLY}
      />
    ),
    name: 'Weekly',
  },
  [LiveSessionInterval.MONTHLY]: {
    value: LiveSessionInterval.MONTHLY,
    component: (
      <RenderMonthlyInterval
        useFormUtils={useFormUtils}
        isSelectedInterval={interval === LiveSessionInterval.MONTHLY}
      />
    ),
    name: 'Monthly',
  },
  [LiveSessionInterval.ANNUALLY]: {
    value: LiveSessionInterval.ANNUALLY,
    component: (
      <RenderAnnualInterval
        useFormUtils={useFormUtils}
        isSelectedInterval={interval === LiveSessionInterval.MONTHLY}
      />
    ),
    name: 'Annually',
  },
});

export default RepeatModal;
