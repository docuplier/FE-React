import PropTypes from 'prop-types';
import React from 'react';
import { useQuery } from '@apollo/client';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  makeStyles,
  MenuItem,
  TextField,
  Typography,
} from '@material-ui/core';

import { ReactComponent as ExpandMoreIcon } from 'assets/svgs/expand_icon.svg';
import { ReactComponent as NoteIcon } from 'assets/svgs/note_icon.svg';
import { GET_COURSE_CATEGORIES_QUERY, GET_COURSE_CATEGORY_BY_ID } from 'graphql/queries/courses';
import { boxShadows, colors, fontSizes, fontWeight } from '../../Css';

const CourseFilterSidebar = ({ filters, onChangeFilter }) => {
  const classes = useStyles();

  const { data: categoriesData } = useQuery(GET_COURSE_CATEGORIES_QUERY, {
    variables: {
      limit: 1000,
      asFilter: true,
    },
  });
  const categories = categoriesData?.categories?.results;

  const { data: subCategoryData } = useQuery(GET_COURSE_CATEGORY_BY_ID, {
    variables: {
      categoryId: filters.categoryId,
      asFilter: true,
    },
    skip: !filters.categoryId,
  });
  const childCategory = subCategoryData?.category?.child;

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
        <Button
          className="clear-button"
          onClick={() => onChangeFilter({ categoryId: null, subCategoryId: null })}>
          CLEAR
        </Button>
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
            <Typography color="textSecondary">Category</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box display="flex" flexDirection="column" width="100%">
            <TextField
              select
              label="Category"
              name="categoryId"
              value={filters.categoryId}
              onChange={(evt) =>
                onChangeFilter({ categoryId: evt.target.value, subCategoryId: undefined })
              }
              variant="outlined"
              fullWidth>
              {categories?.map((category) => (
                <MenuItem value={category?.id}>{category?.title}</MenuItem>
              ))}
            </TextField>
          </Box>
        </AccordionDetails>
      </Accordion>
      <Accordion className={classes.accordion}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} id="accordion">
          <NoteIcon />
          <Box ml={8}>
            <Typography color="textSecondary">Sub Category</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box display="flex" flexDirection="column" width="100%">
            <TextField
              select
              label="Sub Category"
              name="subCategoryId"
              value={filters.subCategoryId}
              onChange={(evt) => onChangeFilter({ subCategoryId: evt.target.value })}
              variant="outlined"
              fullWidth>
              {childCategory?.map((childCategory) => (
                <MenuItem value={childCategory?.id}>{childCategory?.title}</MenuItem>
              ))}
            </TextField>
          </Box>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

CourseFilterSidebar.propTypes = {
  onChangeFilter: PropTypes.func.isRequired,
  filters: PropTypes.shape({
    categoryId: PropTypes.string,
    subCategoryId: PropTypes.string,
  }).isRequired,
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

export default React.memo(CourseFilterSidebar);
