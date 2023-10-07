import {
  FormControlLabel,
  FormLabel,
  Grid,
  Link,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { useState } from 'react';

const StepFive = () => {
  const [value, setValue] = useState('');
  const [isCategory, setIsCategory] = useState('');
  const [isType, setIsType] = useState('');
  const [isSchool, setIsSchool] = useState('');
  const [isSubject, setIsSubject] = useState('');
  const [isK12Teacher, setIsK12Teacher] = useState(false);

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    setValue(selectedValue);
    setIsK12Teacher(selectedValue === 'teacher');
  };

  const handleCategoryChange = (event) => {
    setIsCategory(event.target.value);
  };

  const handleTypeChange = (event) => {
    setIsType(event.target.value);
  };

  const handleSchoolChange = (event) => {
    setIsSchool(event.target.value);
  };

  const handleSubjectChange = (event) => {
    setIsSubject(event.target.value);
  };

  return (
    <Grid container>
      <Grid item xs={12} style={{ marginTop: '20px' }}>
        <FormLabel component="legend">Category</FormLabel>
        <Typography style={{ fontSize: '14px', fontStyle: 'italic' }}>
          Select the category you want to participate in.
          <span style={{ color: 'red', marginRight: '4px' }}>*</span>
          <Link style={{ color: '#3CAE5C', fontWeight: 700 }}>Learn more</Link>
        </Typography>
        <RadioGroup aria-label="category" name="category" value={value} onChange={handleChange}>
          <FormControlLabel value="youth" control={<Radio />} label="Youth" />
          <FormControlLabel value="civil-servant" control={<Radio />} label="Civil Servant" />
          <FormControlLabel value="teacher" control={<Radio />} label="K12 Teacher" />
        </RadioGroup>
      </Grid>
      {isK12Teacher && (
        <>
          <Grid item xs={12} style={{ marginTop: '20px' }}>
            <Typography>
              What is the name of your school?<span style={{ color: 'red' }}>*</span>
            </Typography>
            <TextField
              required
              size="medium"
              name="school"
              fullWidth={true}
              variant="outlined"
              placeholder="Enter your school name"
            />
          </Grid>
          <Grid item xs={12} style={{ marginTop: '20px' }}>
            <FormLabel component="legend">
              {' '}
              Kindly select the category of your school<span style={{ color: 'red' }}>*</span>
            </FormLabel>
            <RadioGroup
              aria-label="category"
              name="school-category"
              value={isCategory}
              onChange={handleCategoryChange}
            >
              <FormControlLabel value="primary" control={<Radio />} label="Primary" />
              <FormControlLabel value="secondary" control={<Radio />} label="Secondary" />
            </RadioGroup>
          </Grid>
          <Grid item xs={12} style={{ marginTop: '20px' }}>
            <FormLabel component="legend">
              Indicate whether your school is a private or public school
              <span style={{ color: 'red' }}>*</span>
            </FormLabel>
            <RadioGroup
              aria-label="type"
              name="school-type"
              value={isType}
              onChange={handleTypeChange}
            >
              <FormControlLabel value="private" control={<Radio />} label="Private" />
              <FormControlLabel value="public" control={<Radio />} label="Public" />
            </RadioGroup>
          </Grid>
          <Grid item xs={12} style={{ marginTop: '20px' }}>
            <FormLabel component="legend">
              Indicate if your school is a gender-international school
              <span style={{ color: 'red' }}>*</span>
            </FormLabel>
            <RadioGroup
              aria-label="type"
              name="internation-school"
              value={isSchool}
              onChange={handleSchoolChange}
            >
              <FormControlLabel value="female" control={<Radio />} label="All-Female School" />
              <FormControlLabel value="male" control={<Radio />} label="All-Male School" />
              <FormControlLabel
                value="mixed"
                control={<Radio />}
                label="Mixed (Boys and Girls) School"
              />
              <FormControlLabel
                value="not-applicable"
                control={<Radio />}
                label="Not-Applicable (A Primary School)"
              />
            </RadioGroup>
          </Grid>
          <Grid item xs={12} style={{ marginTop: '20px' }}>
            <Typography>
              How many subjects do you teach in your current school?
              <span style={{ color: 'red' }}>*</span>
            </Typography>
            <TextField
              required
              size="medium"
              name="subjects"
              fullWidth={true}
              variant="outlined"
              placeholder="Enter the number of subjects you teach"
            />
          </Grid>
          <Grid item xs={12} style={{ marginTop: '20px' }}>
            <FormLabel component="legend">
              Which of the following categories does the main subject taught by you fall into?
              <span style={{ color: 'red' }}>*</span>
            </FormLabel>
            <RadioGroup
              aria-label="subject"
              name="subject"
              value={isSubject}
              onChange={handleSubjectChange}
            >
              <FormControlLabel value="science" control={<Radio />} label="Science" />
              <FormControlLabel value="tech" control={<Radio />} label="Technology" />
              <FormControlLabel value="maths" control={<Radio />} label="Mathematics" />
              <FormControlLabel value="engineering" control={<Radio />} label="Engineering" />
              <FormControlLabel value="arts" control={<Radio />} label="Arts" />
              <FormControlLabel value="social" control={<Radio />} label="Social Sciences" />
              <FormControlLabel value="other" control={<Radio />} label="Other" />
            </RadioGroup>
          </Grid>
          <Grid item xs={12} style={{ marginTop: '20px' }}>
            <Typography>
              Indicate the name of the main subject taught by you
              <span style={{ color: 'red' }}>*</span>
            </Typography>
            <TextField
              required
              size="medium"
              name="main-subject"
              fullWidth={true}
              variant="outlined"
              placeholder="Enter the name of the subject(s) you teach"
            />
          </Grid>
          <Grid item xs={12} style={{ marginTop: '20px' }}>
            <Typography>
              What certification have you received to enhance your teaching?
              <span style={{ color: 'red' }}>*</span> Please state
            </Typography>
            <TextField
              required
              multiline
              size="medium"
              name="subjects"
              fullWidth={true}
              variant="outlined"
              placeholder="Enter the certification you've received"
              style={{ minHeight: '40px' }}
            />
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default StepFive;
