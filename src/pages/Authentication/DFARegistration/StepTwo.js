import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core';
import { Controller } from 'react-hook-form';
import React, { useState, useEffect } from 'react';
import {
  employmentOptions,
  employmentStatusOptions,
  educationLevelOptions,
  booleanOptions,
} from './variables';
import { Watch } from '@material-ui/icons';
const StepTwo = (props) => {
  const { control, register, errors, handleInputChange, getValues, watch } = props;
  const [value, setValue] = useState('');
  // const [status, setStatus] = useState('');
  // const [isEmployed, setIsEmployed] = useState('');
  // const [isEducated, setIsEducated] = useState('');
  const [isIncome, setIsIncome] = useState('');
  // const [isDisabled, setIsDisabled] = useState('');
  const [showSecondGrid, setShowSecondGrid] = useState(false);
  // Watch for changes in the control value
  useEffect(() => {
    // Watch for changes in the control value
    watch('isDisabled', (value) => {
      setShowSecondGrid(value === 'true');
    });
  }, [watch]);

  // const handleChange = (event) => {
  //   const selectedValue = event.target.value;
  //   setValue(selectedValue);
  //   setShowSecondGrid(selectedValue === 'yes');
  // };

  // const handleDisabilityChange = (event) => {
  //   setIsDisabled(event.target.value);
  // };

  // const handleStatusChange = (event) => {
  //   setStatus(event.target.value);
  // };

  // const handleEmploymentChange = (event) => {
  //   setIsEmployed(event.target.value);
  // };

  // const handleEducationChange = (event) => {
  //   setIsEducated(event.target.value);
  // };

  const handleIncomeChange = (event) => {
    setIsIncome(event.target.value);
  };

  const renderDisabilityOption = (label, name, control) => (
    <Grid
      container
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexWrap: 'nowrap',
      }}
    >
      <Grid item xs={7} sm={8} md={8} lg={4} style={{ marginRight: '10px' }}>
        <FormLabel component="legend">{label}</FormLabel>
      </Grid>
      <Grid item xs={4} sm={4} md={4} lg={8} style={{ flexWrap: 'nowrap' }}>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <RadioGroup {...field} aria-label={name} style={{ flexDirection: 'row' }}>
              {booleanOptions.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
          )}
        />
      </Grid>
    </Grid>
  );

  return (
    <Grid container>
      <Typography style={{ fontSize: '16px', fontWeight: 400 }}>
        The information you provide in this section will help us to know you.
      </Typography>
      <Grid item xs={12} style={{ marginTop: '20px' }}>
        <FormControl component="fieldset">
          <FormLabel component="legend">
            What do you currently do<span style={{ color: 'red' }}>*</span>? I am
          </FormLabel>
          <Controller
            name="currentlyDoing"
            control={control}
            render={({ field }) => (
              <RadioGroup {...field} aria-label="currentlyDoing">
                {employmentStatusOptions.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio />}
                    label={option.label}
                  />
                ))}
              </RadioGroup>
            )}
          />
        </FormControl>
      </Grid>
      <Grid item xs={12} style={{ marginTop: '20px' }}>
        <FormControl component="fieldset">
          <FormLabel component="legend">
            Which of the following best describes your employment?{' '}
            <span style={{ color: 'red' }}>*</span>
          </FormLabel>
          <Controller
            name="employment"
            control={control}
            render={({ field }) => (
              <RadioGroup {...field} aria-label="employment">
                {employmentOptions.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio />}
                    label={option.label}
                  />
                ))}
              </RadioGroup>
            )}
          />
        </FormControl>
      </Grid>
      <Grid item xs={12} style={{ marginTop: '20px' }}>
        <FormControl component="fieldset">
          <FormLabel component="legend">
            What is the highest level of education you have received?{' '}
            <span style={{ color: 'red' }}>*</span>
          </FormLabel>
          <Controller
            name="education"
            control={control}
            render={({ field }) => (
              <RadioGroup {...field} aria-label="education">
                {educationLevelOptions.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio />}
                    label={option.label}
                  />
                ))}
              </RadioGroup>
            )}
          />
        </FormControl>
      </Grid>
      <Grid item xs={12} style={{ marginTop: '20px' }}>
        <FormControl component="fieldset">
          <FormLabel component="legend">
            Are you a person with disability?<span style={{ color: 'red' }}>*</span>
          </FormLabel>
          <Controller
            name="isDisabled"
            control={control}
            render={({ field }) => (
              <RadioGroup {...field} aria-label="isDisabled" style={{ flexDirection: 'row' }}>
                {booleanOptions.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio />}
                    label={option.label}
                  />
                ))}
              </RadioGroup>
            )}
          />
        </FormControl>
      </Grid>
      {showSecondGrid && (
        <Grid item xs={12} style={{ marginTop: '20px' }}>
          <FormLabel component="legend">
            You said you are a Person with Disability. Which of the disability do you have?
            <span style={{ color: 'red' }}>*</span>
          </FormLabel>
          <Typography style={{ fontSize: '12px', fontStyle: 'italic' }}>
            Select as many as apply to you
          </Typography>
          {renderDisabilityOption('Hearing Impairment', 'isGearingImpaired', control)}
          {renderDisabilityOption('Seeing impairment', 'isVisionImpaired', control)}
          {renderDisabilityOption('Movement impairment', 'isMovementImpaired', control)}
          {renderDisabilityOption('Albinism', 'hasAlbinism', control)}
          {renderDisabilityOption('Others', 'hasOthers', control)}
        </Grid>
      )}
      <Grid item xs={12} style={{ marginTop: '20px' }}>
        <FormLabel component="legend">
          On average, how much is your monthly Income?<span style={{ color: 'red' }}>*</span>
        </FormLabel>
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="income"
            name="income"
            value={isIncome}
            onChange={handleIncomeChange}
          >
            <FormControlLabel value="0" control={<Radio />} label="No income" />
            <FormControlLabel value="1" control={<Radio />} label="Less than 50,000" />
            <FormControlLabel value="2" control={<Radio />} label="50,000-99,999" />
            <FormControlLabel value="3" control={<Radio />} label="100,000 - 299,999" />
            <FormControlLabel value="4" control={<Radio />} label="300,000-499,999" />
            <FormControlLabel value="5" control={<Radio />} label="500.000 - 1,000,000" />
            <FormControlLabel value="6" control={<Radio />} label="Above 1,000,000" />
          </RadioGroup>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default StepTwo;
