import { memo } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Paper, Typography, makeStyles } from '@material-ui/core';
import BookmarkBorderOutlinedIcon from '@material-ui/icons/BookmarkBorderOutlined';
import BookmarkOutlinedIcon from '@material-ui/icons/BookmarkOutlined';
import { Link } from 'react-router-dom';

import { colors } from '../../../Css';

const RelatedCard = ({ title, saved, id, onClickSave, to }) => {
  const classes = useStyles();
  const SaveIcon = saved ? BookmarkOutlinedIcon : BookmarkBorderOutlinedIcon;

  const handleSave = (evt) => {
    evt.preventDefault();
    onClickSave(id);
  };

  return (
    <Link to={to} className={classes.link}>
      <Box component={Paper} elevation={0} p={8} className="container">
        <Typography color="textPrimary" variant="body2">
          {title}
        </Typography>
        <Box display="flex" mt={4}>
          <Button
            size="small"
            color={saved ? 'primary' : 'inherit'}
            startIcon={<SaveIcon />}
            onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Box>
    </Link>
  );
};

const useStyles = makeStyles({
  link: {
    textDecoration: 'none',
    display: 'block',
    '& .container': {
      border: `1px solid ${colors.secondaryLightGrey}`,
    },
  },
});

RelatedCard.propTypes = {
  title: PropTypes.string.isRequired,
  viewsCount: PropTypes.number,
  saved: PropTypes.bool,
  id: PropTypes.string,
  onClickSave: PropTypes.func,
  to: PropTypes.string.isRequired,
};

export default memo(RelatedCard);
