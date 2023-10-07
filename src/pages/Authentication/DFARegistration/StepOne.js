import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@material-ui/core';
import { Controller } from 'react-hook-form';
import React, { useState } from 'react';
import { getFormError } from 'utils/formError';
import { EMAIL_REGEX, PHONE_REGEX } from 'utils/constants.js';
import useStateAndLGA from 'hooks/useStateAndLGA';
import { maritalStatusOptions } from './variables';

const StepOne = (props) => {
  const { control, register, errors, getValues } = props;
  const [value, setValue] = useState('');
  // const [status, setStatus] = useState('');
  // const [isResidence, setIsResidence] = useState('');
  const { states } = useStateAndLGA(getValues('stateOfOrigin)'));

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  // const handleStatusChange = (event) => {
  //   setStatus(event.target.value);
  // };

  // const handleResidenceChange = (event) => {
  //   setIsResidence(event.target.value);
  // };

  return (
    <Grid container>
      <Typography style={{ fontSize: '16px', fontWeight: 400 }}>
        The information you provide in this section will help us to know you.
      </Typography>
      <Grid item xs={12} style={{ marginTop: '20px' }}>
        <Grid container spacing={10}>
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <Typography>
              First Name <span style={{ color: 'red' }}>*</span>
            </Typography>
            <Controller
              name="firstname"
              control={control}
              rules={{ required: true }}
              render={({ ref, ...rest }) => (
                <TextField
                  {...rest}
                  label="First name"
                  variant="outlined"
                  required
                  fullWidth
                  inputRef={register({ required: true })}
                  error={getFormError('firstname', errors).hasError}
                  helperText={getFormError('firstname', errors).message}
                  size="medium"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <Typography>
              Middle Name<span style={{ color: 'red' }}>*</span>
            </Typography>
            <Controller
              name="middlename"
              control={control}
              rules={{ required: true }}
              render={({ ref, ...rest }) => (
                <TextField
                  {...rest}
                  label="Middle name"
                  variant="outlined"
                  required
                  fullWidth
                  inputRef={register({ required: true })}
                  error={getFormError('middlename', errors).hasError}
                  helperText={getFormError('middlename', errors).message}
                  size="medium"
                />
              )}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} style={{ marginTop: '20px' }}>
        <Grid container spacing={10}>
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <Typography>
              Last Name <span style={{ color: 'red' }}>*</span>
            </Typography>
            <Controller
              name="lastname"
              control={control}
              rules={{ required: true }}
              render={({ ref, ...rest }) => (
                <TextField
                  {...rest}
                  label="Last name"
                  variant="outlined"
                  required
                  fullWidth
                  inputRef={register({ required: true })}
                  error={getFormError('lastname', errors).hasError}
                  helperText={getFormError('lastname', errors).message}
                  size="medium"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <Typography>
              Phone Number (i.e +234xxxxxxxx) <span style={{ color: 'red' }}>*</span>
            </Typography>
            <Controller
              name="phone"
              control={control}
              rules={{
                required: true,
                pattern: { value: PHONE_REGEX, message: 'Please enter a valid format' },
              }}
              render={({ ref, ...rest }) => (
                <TextField
                  {...rest}
                  label="Phone number"
                  variant="outlined"
                  required
                  fullWidth
                  inputRef={register({ required: true })}
                  error={getFormError('phone', errors).hasError}
                  helperText={getFormError('phone', errors).message}
                  size="medium"
                />
              )}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <FormLabel component="legend" style={{ marginRight: '10px' }}>
              Gender:
              <span style={{ color: 'red' }}>*</span>
            </FormLabel>
            <Controller
              name="gender"
              control={control}
              defaultValue=""
              render={({ ref, ...rest }) => (
                <FormControl component="fieldset">
                  <RadioGroup
                    {...rest}
                    aria-label="gender"
                    name="gender"
                    value={value}
                    onChange={handleChange}
                    style={{ flexDirection: 'row' }}
                  >
                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                  </RadioGroup>
                </FormControl>
              )}
            />
          </div>
        </Grid>
        <Grid item xs={12} style={{ marginTop: '20px' }}>
          <Grid container spacing={10}>
            <Grid item xs={12} sm={6} md={6} lg={6}>
              <Typography>
                Email <span style={{ color: 'red' }}>*</span>
              </Typography>
              <Controller
                name="email"
                control={control}
                rules={{ required: true }}
                render={({ ref, ...rest }) => (
                  <TextField
                    {...rest}
                    label="Email"
                    variant="outlined"
                    required
                    fullWidth
                    inputRef={register({
                      required: true,
                      pattern: { value: EMAIL_REGEX, message: 'Please enter a valid format' },
                    })}
                    error={getFormError('email', errors).hasError}
                    helperText={getFormError('email', errors).message}
                    size="medium"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6}>
              <Typography>
                Age (i.e 30) <span style={{ color: 'red' }}>*</span>
              </Typography>
              <Controller
                name="age"
                control={control}
                rules={{ required: true }}
                render={({ ref, ...rest }) => (
                  <TextField
                    {...rest}
                    label="Age"
                    variant="outlined"
                    required
                    fullWidth
                    inputRef={register({
                      required: true,
                    })}
                    error={getFormError('age', errors).hasError}
                    helperText={getFormError('age', errors).message}
                    size="medium"
                  />
                )}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} style={{ marginTop: '20px' }}>
            <FormControl component="fieldset">
              <FormLabel component="legend">
                Marital Status <span style={{ color: 'red' }}>*</span>
              </FormLabel>
              <Controller
                name="maritalStatus"
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field} aria-label="marital status" name="maritalStatus">
                    {maritalStatusOptions.map((option) => (
                      <FormControlLabel
                        key={option.value}
                        value={option.value}
                        control={<Radio inputRef={register({ required: true })} />}
                        label={option.label}
                      />
                    ))}
                  </RadioGroup>
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} style={{ marginTop: '20px' }}>
            <Grid container spacing={10}>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <Typography>
                  State of Origin <span style={{ color: 'red' }}>*</span>
                </Typography>
                <Controller
                  control={control}
                  name="stateOfOrigin"
                  rules={{ required: true }}
                  render={() => (
                    <TextField
                      select
                      fullWidth
                      className="input"
                      variant="outlined"
                      label="State Of Origin"
                      size="medium"
                      // value={fieldInputs.state}
                      SelectProps={{
                        native: true,
                      }}
                      // onChange={(e) => handleInputChange({ state: e.target.value })}
                    >
                      <option defaultChecked>Select state</option>
                      {states.map((state, i) => (
                        <option value={state}>{state}</option>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <Typography>
                  Current State of Residence <span style={{ color: 'red' }}>*</span>
                </Typography>
                <Controller
                  control={control}
                  name="currentState"
                  rules={{ required: true }}
                  render={() => (
                    <TextField
                      select
                      fullWidth
                      className="input"
                      variant="outlined"
                      label="State Of Residence"
                      size="medium"
                      helperText={getFormError('currentState', errors).message}
                      SelectProps={{
                        native: true,
                      }}
                      // onChange={(e) => handleInputChange({ state: e.target.value })}
                    >
                      <option defaultChecked>Select state</option>
                      {states.map((state, i) => (
                        <option value={state}>{state}</option>
                      ))}
                    </TextField>
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} style={{ marginTop: '20px' }}>
            <FormControl component="fieldset">
              <FormLabel component="legend">
                Types of residential area <span style={{ color: 'red' }}>*</span>
              </FormLabel>
              <Controller
                name="residentialArea"
                control={control}
                render={({ ref, ...rest }) => (
                  <RadioGroup
                    aria-label="residentialArea"
                    name="residentialArea"
                    // value={isResidence}
                    // onChange={handleResidenceChange}
                  >
                    <FormControlLabel
                      value="URBAN"
                      control={<Radio />}
                      label="Urban (an area with moderate to high basic amenities such as good road network, good electricity supply, hospitals, schools etc.) "
                    />
                    <FormControlLabel
                      value="SEMI_URBAN"
                      control={<Radio />}
                      label="Semi-Urban (an area with some level or presence of basic amenities - electricity, road network, hospitals, schools, etc.) "
                    />
                    <FormControlLabel
                      value="RURAL"
                      control={<Radio />}
                      label="Rural (an area with little or no presence of basic amenities - electricity, road network, hospitals, schools, etc.)"
                    />
                  </RadioGroup>
                )}
              />
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default StepOne;
