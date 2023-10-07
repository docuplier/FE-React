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
import React, { useState } from 'react';

const StepFour = () => {
  const [value, setValue] = useState('');
  const [isSkill, setIsSkill] = useState('');
  const [isPlatform, setIsPlatform] = useState('');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleSkillChange = (event) => {
    setIsSkill(event.target.value);
  };

  const handlePlatformChange = (event) => {
    setIsPlatform(event.target.value);
  };

  const renderPreparationOptions = (label, value, handleChange) => (
    <Grid
      container
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flexWrap: 'nowrap',
        spacing: 6,
      }}
    >
      <Grid item xs={7} sm={8} md={8} lg={8} style={{ marginRight: '10px', marginBottom: '10px' }}>
        <FormLabel component="legend">{label}</FormLabel>
      </Grid>
      <Grid item xs={4} sm={4} md={4} lg={4} style={{ flexWrap: 'nowrap' }}>
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="options"
            name="options"
            value={value}
            onChange={handleChange}
            style={{ flexDirection: 'row', flexWrap: 'nowrap' }}
          >
            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
      </Grid>
    </Grid>
  );

  return (
    <Grid container>
      <Typography style={{ fontSize: '16px', fontWeight: 400 }}>
        The information you provide in this section will help us guide you on the appropriate
        program of learning that is best suited for you. 
      </Typography>
      <Grid item xs={12} style={{ marginTop: '20px' }}>
        <FormControl component="fieldset">
          <FormLabel component="legend">
            If you are to learn a digital skill, which of these skills interest you the most?
            <span style={{ color: 'red' }}>*</span>
          </FormLabel>
          <RadioGroup
            aria-label="digital-skills"
            name="skills"
            value={isSkill}
            onChange={handleSkillChange}
          >
            <FormControlLabel value="marketing" control={<Radio />} label="Digital Marketing" />
            <FormControlLabel value="software" control={<Radio />} label="Software Development" />
            <FormControlLabel value="graphics" control={<Radio />} label="Graphics Design" />
            <FormControlLabel value="design" control={<Radio />} label="Product Design" />
            <FormControlLabel value="managament" control={<Radio />} label="Product Mangement" />
            <FormControlLabel value="data-science" control={<Radio />} label="Data Science" />
            <FormControlLabel value="cyber" control={<Radio />} label="Cyber Security" />
            <FormControlLabel value="animation" control={<Radio />} label="3D Animation" />
            <FormControlLabel
              value="blockchain"
              control={<Radio />}
              label="Blockchain Technology"
            />
            <FormControlLabel value="other" control={<Radio />} label="Other" />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} style={{ marginTop: '20px' }}>
        <Typography>
          What is your reason for choosing the above skill of interest?
          <span style={{ color: 'red' }}>*</span>
        </Typography>
        <TextField
          required
          size="medium"
          name="skill-of-interest"
          fullWidth={true}
          variant="outlined"
          placeholder="Enter the reason for choosing the above skill of interest"
        />
      </Grid>
      <Grid item xs={12} style={{ marginTop: '20px' }}>
        <FormLabel component="legend">
          Please tick the option that best describe your preparation for the program.
        </FormLabel>
        <Typography style={{ fontSize: '12px', fontStyle: 'italic', marginBottom: '10px' }}>
          Select as many as apply to you
        </Typography>
        {renderPreparationOptions(
          'I have a functional laptop (Has audio & can connect to the internet)',
          value,
          handleChange,
        )}
        {renderPreparationOptions(
          'I have a smartphone that can fill-in for a laptop/desktop.',
          value,
          handleChange,
        )}
        {renderPreparationOptions('I have good internet connectivity.', value, handleChange)}
        {renderPreparationOptions(
          'I have 40 hours a week to dedicate to this program ',
          value,
          handleChange,
        )}
      </Grid>
      <Grid item xs={12} style={{ marginTop: '20px' }}>
        <FormControl component="fieldset">
          <FormLabel component="legend">
            On what platform did you hear about the DFA Challenge?
            <span style={{ color: 'red' }}>*</span>
          </FormLabel>
          <RadioGroup
            aria-label="platform"
            name="platform"
            value={isPlatform}
            onChange={handlePlatformChange}
          >
            <FormControlLabel value="facebook" control={<Radio />} label="Facebook" />
            <FormControlLabel value="instagram" control={<Radio />} label="Instagram" />
            <FormControlLabel value="twitter" control={<Radio />} label="Twitter" />
            <FormControlLabel value="whatsapp" control={<Radio />} label="WhatsApp" />
            <FormControlLabel value="linkedin" control={<Radio />} label="LinkedIn" />
            <FormControlLabel value="web" control={<Radio />} label="Website" />
            <FormControlLabel value="other" control={<Radio />} label="Other Internet Platform" />
            <FormControlLabel value="word" control={<Radio />} label="Word of Mouth" />
          </RadioGroup>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default StepFour;
