import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core';
import React, { useState } from 'react';

const StepThree = () => {
  const [currentWork, setCurrentWork] = useState('');
  const [isAbility, setIsAbility] = useState('');
  const [isSkilled, setIsSkilled] = useState('');
  const [value, setValue] = useState('');
  const [isTrained, setIsTrained] = useState('');
  const [showSecondGrid, setShowSecondGrid] = useState(false);

  const handleWorkChange = (event) => {
    setCurrentWork(event.target.value);
  };

  const handleAbilityChange = (event) => {
    setIsAbility(event.target.value);
  };

  const handleSkillChange = (event) => {
    setIsSkilled(event.target.value);
  };

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    setValue(selectedValue);
    setShowSecondGrid(selectedValue === 'yes');
  };

  const handleTrackChange = (event) => {
    setIsTrained(event.target.value);
  };

  return (
    <Grid container>
      <Typography style={{ fontSize: '16px', fontWeight: 400 }}>
        The information you provide in this section will help us guide you on the appropriate
        program of learning that is best suited for you. 
      </Typography>
      <Grid item xs={12} style={{ marginTop: '20px' }}>
        <FormControl component="fieldset">
          <FormLabel component="legend">
            To what extent does your current work/studies involve the use of digital skills?
            <span style={{ color: 'red' }}>*</span>
          </FormLabel>
          <RadioGroup
            aria-label="experience"
            name="experience"
            value={currentWork}
            onChange={handleWorkChange}
          >
            <FormControlLabel value="no" control={<Radio />} label="No Tech" />
            <FormControlLabel value="little" control={<Radio />} label="A little Tech " />
            <FormControlLabel value="average" control={<Radio />} label="Average Tech" />
            <FormControlLabel value="lot" control={<Radio />} label="A lot of Tech" />
            <FormControlLabel value="extreme" control={<Radio />} label="Extremely Tech " />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} style={{ marginTop: '20px' }}>
        <FormControl component="fieldset">
          <FormLabel component="legend">
            Rate your ability on how to use a computer<span style={{ color: 'red' }}>*</span>
          </FormLabel>
          <RadioGroup
            aria-label="ability"
            name="ability"
            value={isAbility}
            onChange={handleAbilityChange}
          >
            <FormControlLabel
              value="no"
              control={<Radio />}
              label="I don’t have any prior knowledge on how to use a computer"
            />
            <FormControlLabel
              value="little"
              control={<Radio />}
              label="I have basic knowledge of MS word and other Office tools"
            />
            <FormControlLabel
              value="average"
              control={<Radio />}
              label="I can use spread sheets, databases, and even do some data modelling"
            />
            <FormControlLabel
              value="lot"
              control={<Radio />}
              label="I can do some amazing things with the computer (e.g. code, resolve network issues, configure systems, analyse complex data, etc)."
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} style={{ marginTop: '25px' }}>
        <FormControl component="fieldset">
          <FormLabel component="legend">
            Which of the following best describe your digital skills training journey in the past?
            <span style={{ color: 'red' }}>*</span>
          </FormLabel>
          <RadioGroup
            aria-label="digital-skills"
            name="skills"
            value={isSkilled}
            onChange={handleSkillChange}
          >
            <FormControlLabel
              value="no"
              control={<Radio />}
              label={
                <Typography>
                  I have <strong>never</strong> participated in a <strong>digital skills</strong>{' '}
                  training before.
                </Typography>
              }
            />
            <FormControlLabel
              value="little"
              control={<Radio />}
              label={
                <Typography>
                  The digital skills training(s) I have participated in was/were{' '}
                  <strong>physical</strong> training.
                </Typography>
              }
            />
            <FormControlLabel
              value="average"
              control={<Radio />}
              label={
                <Typography>
                  The digital training(s) that I have participated in was/were{' '}
                  <strong>online</strong> training.
                </Typography>
              }
            />
            <FormControlLabel
              value="lot"
              control={<Radio />}
              label={
                <Typography>
                  I have participated in <strong>both</strong> physical and online digital skills
                  training(s) before.
                </Typography>
              }
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} style={{ marginTop: '20px' }}>
        <FormLabel component="legend" style={{ marginRight: '10px' }}>
          Did you participate in the Digital For All Challenge 1.0?
          <span style={{ color: 'red' }}>*</span>
        </FormLabel>
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="challenge"
            name="challenge"
            value={value}
            onChange={handleChange}
            style={{ flexDirection: 'row' }}
          >
            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
      </Grid>
      {showSecondGrid && (
        <Grid item xs={12} style={{ marginTop: '20px' }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">
              What was the learning track for which you were trained?
              <span style={{ color: 'red' }}>*</span>
            </FormLabel>
            <RadioGroup
              aria-label="digital-skills"
              name="skills"
              value={isTrained}
              onChange={handleTrackChange}
            >
              <FormControlLabel
                value="bdl"
                control={<Radio />}
                label="Basic Digital Literacy (BDL)"
              />
              <FormControlLabel value="cyber" control={<Radio />} label="Cyber Security" />
              <FormControlLabel value="software" control={<Radio />} label="Software Development" />
              <FormControlLabel value="data" control={<Radio />} label="Data Science and AI" />
              <FormControlLabel value="design" control={<Radio />} label="Product Design" />
              <FormControlLabel value="management" control={<Radio />} label="Product Management" />
            </RadioGroup>
          </FormControl>
        </Grid>
      )}
    </Grid>
  );
};

export default StepThree;
