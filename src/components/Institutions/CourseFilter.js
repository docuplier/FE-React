import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  makeStyles,
  Box,
  Button,
  Typography,
  TextField,
  MenuItem,
} from '@material-ui/core';
import PropTypes from 'prop-types';

import { boxShadows, colors, fontSizes, fontWeight } from '../../Css';
import { ReactComponent as ExpandMoreIcon } from 'assets/svgs/expand_icon.svg';
import { ReactComponent as NoteIcon } from 'assets/svgs/note_icon.svg';

const CourseFilter = ({ handleQueryChange, queryParams }) => {
  const classes = useStyles();

  const handleChange = (evt) => handleQueryChange({ [evt.target.name]: evt.target.value });

  const renderHeader = () => {
    return (
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        className={classes.header}>
        <Typography component="span" variant="h6" color="textPrimary" className="title">
          Filters
        </Typography>
        <Button className="clear-button">CLEAR</Button>
      </Box>
    );
  };

  return (
    <div>
      {renderHeader()}
      <Accordion className={classes.accordion}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} id="accordion">
          <NoteIcon />
          <Box ml={8}>
            <Typography color="textSecondary">Course Unit</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box display="flex" flexDirection="column" width="100%">
            <TextField
              select
              label="Status"
              name="unit"
              value={queryParams.unit}
              onChange={handleChange}
              variant="outlined"
              fullWidth>
              <MenuItem value="ongoing">1</MenuItem>
              <MenuItem value="ended">2</MenuItem>
            </TextField>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion className={classes.accordion}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} id="accordion">
          <NoteIcon />
          <Box ml={8}>
            <Typography color="textSecondary">Instructors</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box display="flex" flexDirection="column" width="100%">
            <TextField
              select
              label="Status"
              value={queryParams.instructor}
              name={queryParams.instructor}
              onChange={handleChange}
              variant="outlined"
              fullWidth>
              <MenuItem value="ongoing">Instructor 1</MenuItem>
              <MenuItem value="ended">Instructor 2</MenuItem>
            </TextField>
          </Box>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

CourseFilter.propTypes = {
  handleQueryChange: PropTypes.func.isRequired,
  queryParams: PropTypes.object.isRequired,
};

const useStyles = makeStyles((theme) => ({
  header: {
    '& .title': {
      fontWeight: fontWeight.bold,
      fontSize: fontSizes.xlarge,
    },
    '& .clear-button': {
      fontSize: fontSizes.medium,
      color: colors.secondaryTextLight,
      minWidth: 'max-content',
    },
  },
  accordion: {
    boxShadow: 'none',
    background: 'transparent',
    marginTop: theme.spacing(5),
    '& .MuiAccordionSummary-root': {
      borderTop: `1px solid ${colors.seperator}`,
    },
    '& .MuiAccordionDetails-root': {
      boxShadow: boxShadows.inset,
      padding: theme.spacing(8),
      '& .MuiOutlinedInput-root': {
        background: colors.white,
      },
      '& .MuiTextField-root': {
        marginBottom: theme.spacing(5),
      },
      '& .MuiTextField-root:last-child': {
        marginBottom: 0,
      },
    },
  },
}));

export default React.memo(CourseFilter);
