import { memo, useState } from 'react';
import { Box, Paper, makeStyles, Grid, TextField, Button } from '@material-ui/core';
import NoteAddOutlinedIcon from '@material-ui/icons/NoteAddOutlined';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from '@apollo/client';

import { colors } from '../../../Css';
import LectureNote from './LectureNote';
import UpsertNote from './UpsertNote';
import { OffsetLimitBasedPagination } from 'reusables/Pagination';
import LoadingView from 'reusables/LoadingView';
import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET } from 'utils/constants';
import { useQueryPagination } from 'hooks/useQueryPagination';
import { GET_COURSE_NOTES, GET_COURSE_SECTIONS } from 'graphql/queries/courses';
import { useNotification } from 'reusables/NotificationBanner';
import ConfirmationDialog from 'reusables/ConfirmationDialog';
import { DELETE_NOTE } from 'graphql/mutations/courses';
import Empty from 'reusables/Empty';

const NoteTab = ({ currentLectureId, courseId }) => {
  const classes = useStyles();
  const [isUpsertNoteVisible, setIsUpsertNoteVisible] = useState(false);
  const [noteIdToDelete, setNoteIdToDelete] = useState(null);
  const notification = useNotification();
  const defaultQueryParams = {
    offset: DEFAULT_PAGE_OFFSET,
    limit: DEFAULT_PAGE_LIMIT,
    datePublished: null,
    courseId,
    lectureId: currentLectureId,
  };
  const [queryParams, setQueryParams] = useState(defaultQueryParams);

  const { data: sectionData } = useQuery(GET_COURSE_SECTIONS, {
    variables: {
      courseId,
      limit: 100,
      offset: 0,
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const { data, loading, refetch } = useQueryPagination(GET_COURSE_NOTES, {
    variables: queryParams,
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });
  const notes = data?.notes?.results || [];

  const [deleteNote, { loading: isLoadingDeleteNote }] = useMutation(DELETE_NOTE, {
    onCompleted: () => {
      notification.success({
        message: 'Note deleted successfully',
      });
      setNoteIdToDelete(null);
      refetchQueries();
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const getSectionPosition = (sectionId) => {
    let index = 0;
    sectionData?.sections?.results?.forEach((section, i) => {
      if (section.id === sectionId) {
        index = i;
      }
    });

    return index + 1;
  };

  const refetchQueries = () => {
    handleChangeQueryParams(defaultQueryParams);
    if (queryParams.offset === DEFAULT_PAGE_OFFSET) refetch();
  };

  const handleChangeQueryParams = (changeset) => {
    setQueryParams((prevState) => ({
      ...prevState,
      ...changeset,
    }));
  };

  const handleDeleteNote = () => {
    deleteNote({
      variables: {
        id: noteIdToDelete,
      },
    });
  };

  const renderEmptyState = () => {
    return <Empty title="No Notes Found" description="No Notes taken yet." />;
  };

  const renderCreateNote = () => {
    return (
      <>
        {!isUpsertNoteVisible && (
          <Box component={Paper} mb={20} py={8} px={12}>
            <Button variant="outlined" className={classes.createNoteButton}>
              <Box
                display="flex"
                width="100%"
                alignItems="center"
                justifyContent="space-between"
                onClick={() => setIsUpsertNoteVisible(true)}>
                Create a new note
                <NoteAddOutlinedIcon className="icon" />
              </Box>
            </Button>
          </Box>
        )}
        <UpsertNote
          open={isUpsertNoteVisible}
          onClose={() => setIsUpsertNoteVisible(false)}
          courseId={courseId}
          lectureId={currentLectureId}
          onCompletedCallback={refetchQueries}
        />
      </>
    );
  };

  const renderFilters = () => {
    return (
      <Grid container spacing={8}>
        <Grid item xs={3}>
          <TextField
            defaultValue=""
            placeholder="Filter by date"
            type="date"
            fullWidth
            variant="outlined"
            onChange={(evt) =>
              handleChangeQueryParams({
                datePublished: evt.target.value,
                offset: DEFAULT_PAGE_OFFSET,
              })
            }
          />
        </Grid>
      </Grid>
    );
  };

  const renderLectureNotes = () => {
    return (
      <>
        {notes.map((lectureNote) => (
          <Box mt={12} key={lectureNote.id}>
            <LectureNote
              id={lectureNote.id}
              section={{
                id: lectureNote.lecture.section.id,
                name: lectureNote.lecture.section.title,
                position: getSectionPosition(lectureNote.lecture.section.id),
              }}
              lecture={{
                id: lectureNote.lecture.id,
                name: lectureNote.lecture.title,
                position: lectureNote.lecture.position || 0,
              }}
              content={lectureNote.body}
              datePublished={lectureNote.createdAt}
              courseId={lectureNote.course.id}
              onRequestDelete={() => setNoteIdToDelete(lectureNote.id)}
              refetchQueries={refetchQueries}
            />
          </Box>
        ))}
        <Box mt={4}>
          <OffsetLimitBasedPagination
            total={data?.notes?.totalCount}
            onChangeLimit={(_offset, limit) =>
              handleChangeQueryParams({
                offset: DEFAULT_PAGE_OFFSET,
                limit,
              })
            }
            onChangeOffset={(offset) => handleChangeQueryParams({ offset })}
            offset={queryParams.offset}
            limit={queryParams.limit}
          />
        </Box>
      </>
    );
  };

  return (
    <div>
      <LoadingView isLoading={loading}>
        {renderCreateNote()}
        {renderFilters()}
        {Boolean(notes.length) ? renderLectureNotes() : renderEmptyState()}
      </LoadingView>
      <ConfirmationDialog
        open={Boolean(noteIdToDelete)}
        onClose={() => setNoteIdToDelete(null)}
        title={`Are you sure you want to delete this note?`}
        description="Deleting this note is an irreversible action"
        okText="Delete Note"
        onOk={handleDeleteNote}
        okButtonProps={{
          isLoading: isLoadingDeleteNote,
          danger: true,
        }}
      />
    </div>
  );
};

const useStyles = makeStyles({
  filterInput: {
    '& .MuiOutlinedInput-root': {
      background: '#F1F2F6',
    },
  },
  createNoteButton: {
    width: '100%',
    color: colors.secondaryTextLight,
    '& .MuiButton-label': {
      justifyContent: 'unset',
    },
    '& .icon': {
      color: colors.secondaryTextLight,
    },
  },
});

NoteTab.propTypes = {
  currentLectureId: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
};

export default memo(NoteTab);
