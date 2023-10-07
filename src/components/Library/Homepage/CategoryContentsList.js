import { memo } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, makeStyles, Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';

import { LibraryContentType } from 'utils/constants';
import { fontSizes, colors, fontWeight } from '../../../Css';
import CourseProgressCard from 'reusables/CourseProgressCard';
import { convertToSentenceCase } from 'utils/TransformationUtils';
import { getContentImage } from 'utils/LibraryUtils';

const CategoryContentsList = ({
  title,
  libraryInterests,
  showMorePath,
  onClickContent,
  emptyNode,
}) => {
  const classes = useStyles();

  const renderEmpty = () => {
    return emptyNode || 'No Contents Available';
  };

  const renderHeader = () => {
    return (
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="body1" color="textPrimary" style={{ fontWeight: fontWeight.bold }}>
          {title}
        </Typography>
        {libraryInterests?.length > 0 && (
          <Link to={showMorePath} className={classes.link}>
            Show more
          </Link>
        )}
      </Box>
    );
  };

  const renderContents = () => {
    const _libraryInterests = libraryInterests?.slice(0, 4);

    return (
      <Box mt={8}>
        {_libraryInterests?.length > 0 ? (
          <Grid container spacing={8}>
            {_libraryInterests?.map((content) => (
              <Grid item xs={12} sm={6} md={3} key={content.id}>
                <CourseProgressCard
                  courseCode={content?.code}
                  title={content.title}
                  description={content.description}
                  imageSrc={getContentImage(content.thumbnail, content.type)}
                  footerText={null}
                  onClick={() =>
                    onClickContent({ categoryId: content.categoryId, contentId: content.id })
                  }
                  chipProp={{
                    label: convertToSentenceCase(content.type),
                    color: 'warning',
                  }}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          renderEmpty()
        )}
      </Box>
    );
  };

  return (
    <Box width="100%">
      {renderHeader()}
      {renderContents()}
    </Box>
  );
};

const useStyles = makeStyles(() => ({
  link: {
    fontSize: fontSizes.medium,
    color: colors.primary,
    textDecoration: 'none',
  },
}));

CategoryContentsList.propTypes = {
  title: PropTypes.string.isRequired,
  showMorePath: PropTypes.string.isRequired,
  onClickContent: PropTypes.func.isRequired,
  libraryInterests: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      thumbnail: PropTypes.string,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      type: PropTypes.oneOf(Object.values(LibraryContentType)),
      categoryId: PropTypes.string.isRequired,
    }),
  ),
  emptyNode: PropTypes.node,
};

export default memo(CategoryContentsList);
