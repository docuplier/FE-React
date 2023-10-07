import { Box, Button, Grid, TextField, Typography } from '@material-ui/core';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { memo, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';

import { colors, fontSizes, fontWeight, spaces } from '../../../Css';
import LoadingButton from 'reusables/LoadingButton';

const CategoriesAccordion = ({
  category,
  expanded,
  onExpansion,
  setIsAddingNewSubCategory,
  handleOpenCategoryDrawer,
  isAddingNewSubCategory,
  onCreateCategory,
  onUpdateCategory,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [newSubCategoryTitle, setNewSubCategoryTitle] = useState('');
  const [subCategoryToEdit, setSubCategoryToEdit] = useState(null);
  const classes = useStyles();
  const { pathname } = useLocation();
  const history = useHistory();
  const { title, description, child, id: categoryId } = category;

  const handleUpdateSubCategory = () => {
    setIsLoading(true);
    onUpdateCategory({ ...subCategoryToEdit, categoryId: subCategoryToEdit.id }).then(() => {
      setIsLoading(false);
      setSubCategoryToEdit(null);
    });
  };

  const handleCreatSubCategory = () => {
    setIsLoading(true);
    onCreateCategory({ title: newSubCategoryTitle, parent: category.id }).then(() => {
      setIsLoading(false);
      setIsAddingNewSubCategory(false);
      setNewSubCategoryTitle('');
    });
  };

  return (
    <Accordion
      expanded={expanded === categoryId}
      onChange={onExpansion(categoryId)}
      className={classes.accordionItem}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={categoryId} id={categoryId}>
        <Link
          style={{ textDecoration: 'none' }}
          className={classes.heading}
          to={`${pathname}/all?categoryId=${categoryId}`}>
          {title}
        </Link>
        <Typography className={classes.subHeading}>{description}</Typography>
      </AccordionSummary>
      <AccordionDetails className={classes.detailSection}>
        <Grid container>
          <Grid item xs={12} sm={10}>
            {!Boolean(child.length) && (
              <Typography>No sub categories for this category.</Typography>
            )}
            {child?.map((subCategory, index) => {
              const { id, title, courseCount: categoryCount } = subCategory;

              return subCategoryToEdit?.id === id ? (
                <Box className={classes.editSubCategoryContainer}>
                  <TextField
                    value={subCategoryToEdit?.title}
                    onChange={(event) => {
                      setSubCategoryToEdit((prevState) => ({
                        ...prevState,
                        title: event.target.value,
                      }));
                    }}
                    id="outlined-basic"
                    label="Edit"
                    variant="outlined"
                  />
                  <LoadingButton
                    variant="contained"
                    color="primary"
                    onClick={handleUpdateSubCategory}
                    isLoading={isLoading}
                    disabled={subCategoryToEdit?.title === title}
                    className="action-button">
                    Edit
                  </LoadingButton>
                  <Button
                    variant="outlined"
                    className="cancel-button"
                    onClick={() => setSubCategoryToEdit(null)}>
                    X
                  </Button>
                </Box>
              ) : (
                <Box display="flex" alignItems="center" key={index}>
                  <Typography
                    style={{ marginRight: spaces.medium, cursor: 'pointer' }}
                    onClick={() =>
                      history.push(`${pathname}/all?categoryId=${categoryId}&subCategoryId=${id}`)
                    }>
                    {title} {categoryCount && `(${categoryCount})`}
                  </Typography>
                  <Button
                    color="primary"
                    style={{ background: 'transparent', display: 'content' }}
                    onClick={() => setSubCategoryToEdit(subCategory)}>
                    Edit
                  </Button>
                </Box>
              );
            })}
          </Grid>
          <Grid
            item
            xs={12}
            sm={2}
            style={{ textAlign: 'left' }}
            className={classes.editButtonContainer}>
            <Button
              color="primary"
              onClick={() => handleOpenCategoryDrawer(category)}
              className="edit-button">
              Edit Category
            </Button>
          </Grid>
        </Grid>
        <Box>
          {isAddingNewSubCategory ? (
            <Box className={classes.editSubCategoryContainer}>
              <TextField
                name="subCategoryTitle"
                id="outlined-basic"
                label="Add New"
                variant="outlined"
                onChange={(event) => setNewSubCategoryTitle(event.target.value)}
              />
              <LoadingButton
                variant="contained"
                color="primary"
                onClick={handleCreatSubCategory}
                disabled={!newSubCategoryTitle}
                isLoading={isLoading}
                className="action-button">
                Add New
              </LoadingButton>
              <Button
                variant="outlined"
                className="cancel-button"
                onClick={() => {
                  setIsAddingNewSubCategory(false);
                  setNewSubCategoryTitle('');
                }}>
                X
              </Button>
            </Box>
          ) : (
            <Button
              color="primary"
              style={{ padding: 0 }}
              onClick={() => setIsAddingNewSubCategory(true)}>
              Add New
            </Button>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

const AccordionSummary = withStyles({
  root: {
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    display: 'block',
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const useStyles = makeStyles((theme) => ({
  heading: {
    paddingLeft: theme.spacing(4),
    fontWeight: fontWeight.bold,
    color: colors.black,
    fontSize: fontSizes.xlarge,
  },
  accordionItem: {
    marginBottom: theme.spacing(4),
    '&:last-child()': {
      marginBottom: 0,
    },
  },
  detailSection: {
    padding: '8px 12px',
    display: 'block',
    paddingTop: 20,
  },
  subHeading: {
    color: colors.grey,
    fontSize: fontSizes.medium,
    fontWeight: fontWeight.regular,
    paddingLeft: theme.spacing(4),
  },
  editSubCategoryContainer: {
    display: 'flex',
    margin: '5px 0px',
    '& .action-button': {
      margin: '0px 10px',
    },
    '& .cancel-button': {
      minWidth: 44,
    },
  },
  editButtonContainer: {
    textAlign: 'right',
    [theme.breakpoints.down('xs')]: {
      textAlign: 'left',
    },
    '& .edit-button': {
      paddingLeft: '0px !important',
    },
  },
}));

export default memo(CategoriesAccordion);
