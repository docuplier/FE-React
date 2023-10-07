import { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { IconButton, Typography, makeStyles, Box } from '@material-ui/core';
import NoteOutlinedIcon from '@material-ui/icons/NoteOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import { format } from 'date-fns';

import { colors, fontSizes, fontWeight } from '../../../Css';
import UpsertNote from './UpsertNote';

const LectureNote = ({
  section,
  lecture,
  content,
  datePublished,
  id,
  courseId,
  onRequestDelete,
  refetchQueries,
}) => {
  const classes = useStyles();
  const [isUpsertNoteVisible, setIsUpsertNoteVisible] = useState(false);

  const renderHeader = () => {
    let { name: sectionName, position: sectionPosition } = section;
    let { name: lectureName, position: lecturePosition } = lecture;

    return (
      <Box display="flex" justifyContent="space-between" mb={4}>
        <Box display="flex" alignItems="center">
          <Typography component="span" color="primary" style={{ lineHeight: 0 }}>
            <NoteOutlinedIcon />
          </Typography>
          <Box ml={2}>
            <Typography
              component="span"
              color="textPrimary"
              variant="body1"
              style={{ fontWeight: fontWeight.bold }}>
              {sectionPosition}. {sectionName}
            </Typography>
          </Box>
          <Box ml={3}>
            <Typography component="span" color="textSecondary" variant="body2">
              {`${sectionPosition}.${lecturePosition}`}. {lectureName}
            </Typography>
          </Box>
        </Box>
        <Box display="flex">
          <IconButton className={classes.iconButton} onClick={() => setIsUpsertNoteVisible(true)}>
            <EditOutlinedIcon className="icon" />
          </IconButton>
          <IconButton className={classes.iconButton} onClick={onRequestDelete}>
            <DeleteOutlineOutlinedIcon className="icon" />
          </IconButton>
        </Box>
      </Box>
    );
  };

  const renderContent = () => {
    return (
      !isUpsertNoteVisible && (
        <Box p={8} className={classes.content}>
          <Typography
            color="textSecondary"
            variant="body2"
            dangerouslySetInnerHTML={{ __html: content }}
          />
          <Box mt={4}>
            <Typography variant="body2" color="primary">
              {format(new Date(datePublished), 'LLL dd, yyyy')} •{' '}
              {format(new Date(datePublished), 'hh:mm aaa')}
            </Typography>
          </Box>
        </Box>
      )
    );
  };

  return (
    <Box>
      {renderHeader()}
      {renderContent()}
      <UpsertNote
        open={isUpsertNoteVisible}
        onClose={() => setIsUpsertNoteVisible(false)}
        note={{
          id,
          content,
        }}
        courseId={courseId}
        lectureId={lecture.id}
        onCompletedCallback={refetchQueries}
      />
    </Box>
  );
};

const useStyles = makeStyles({
  iconButton: {
    '& .icon': {
      color: colors.text,
      fontSize: fontSizes.xlarge,
    },
  },
  content: {
    background: colors.seperator,
  },
});

LectureNote.propTypes = {
  section: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    position: PropTypes.number.isRequired,
  }),
  lecture: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
  }),
  courseId: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  datePublished: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  onRequestDelete: PropTypes.func.isRequired,
  refetchQueries: PropTypes.func.isRequired,
};

export default memo(LectureNote);
