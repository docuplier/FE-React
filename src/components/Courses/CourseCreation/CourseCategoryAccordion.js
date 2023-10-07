import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Box,
  Typography,
  AccordionDetails,
  Accordion as MuiAccordion,
  AccordionSummary as MuiAccordionSummary,
  FormControl,
  FormControlLabel,
  Checkbox,
  FormGroup,
} from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';

export default function CourseCategoryAccordion({
  expanded,
  category,
  onSelectCategory,
  onExpandChange,
}) {
  const classes = useStyles();

  const handleSelectCategory = (event) => {
    const newCatergory = { ...category };
    newCatergory.child = {
      ...category.child,
      [event.target.name]: {
        ...category.child[event.target.name],
        selected: event.target.checked,
      },
    };
    onSelectCategory(newCatergory);
  };

  const renderAccordionSummary = () => (
    <AccordionSummary expandIcon={<AddIcon />} aria-controls="panel1d-content" id="panel1d-header">
      <Box pl={5}>
        <Typography color="textPrimary">
          {category.title}{' '}
          <Typography component="span" color="inherit">
            - {Object.values(category.child).length} Sub categories
          </Typography>
        </Typography>
      </Box>
    </AccordionSummary>
  );

  return (
    <MuiAccordion square expanded={expanded === category.id} onChange={onExpandChange}>
      {renderAccordionSummary()}
      <AccordionDetails classes={{ root: classes.accordionDetails }}>
        <Box style={{ width: '100%' }}>
          <Box padding={8}>
            <FormControl component="fieldset" className={classes.formControl}>
              <FormGroup>
                {Object.values(category.child).map((category) => (
                  <FormControlLabel
                    key={category.id}
                    control={
                      <Checkbox
                        color="primary"
                        checked={!!category.selected}
                        onChange={handleSelectCategory}
                        name={category.id}
                      />
                    }
                    label={category.title}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Box>
        </Box>
      </AccordionDetails>
    </MuiAccordion>
  );
}

const AccordionSummary = withStyles({
  root: {
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
    borderRadius: '4px 4px 0px 0px',
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
})(MuiAccordionSummary);

const useStyles = makeStyles({
  accordionDetails: {
    padding: 0,
  },
  accordionTitleInput: {
    background: '#FAFAFA',
    border: '1px solid #CDCED9',
    borderRadius: '0 0 3px 3px',
  },
  lectureStatus: {
    marginLeft: 5,
    fontSize: 10,
    color: '#1D2733',
    background: '#A7A9BC',
  },
});
