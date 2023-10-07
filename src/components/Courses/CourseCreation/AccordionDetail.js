import React, { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import { TextField, Box, Paper, IconButton, Button, CircularProgress } from '@material-ui/core';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useMutation, useQuery } from '@apollo/client';
import {
  DragIndicator as DragIndicatorIcon,
  ExpandMore as ExpandMoreIcon,
  EditOutlined as EditOutlinedIcon,
  Add as AddIcon,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames';

import { fontWeight, fontSizes, spaces, colors, boxShadows, borderRadius } from '../../../Css';
import Chip from 'reusables/Chip';
import { LectureSectionStatus, LectureStatus } from 'utils/constants';
import UpsertCourseContent from './UpsertCourseContentDrawer';
import { useNotification } from 'reusables/NotificationBanner';
import {
  CREATE_COURSE_SECTION,
  UPDATE_COURSE_SECTION,
  UPDATE_LECTURE_POSITION,
} from 'graphql/mutations/course';
import { convertToSentenceCase } from 'utils/TransformationUtils';
import Banner from 'reusables/Banner';
import { GET_SECTION_BY_ID } from 'graphql/queries/courses';

export default function AccordionDetail({ index, expanded, section, onExpandChange, courseId }) {
  const [accordionTitle, setAccordionTitle] = useState(section.title);
  const [sectionDetails, setSectionDetails] = useState(section);
  const [lectureToEdit, setLectureToEdit] = useState(null);
  const notification = useNotification();
  const [lectureArray, setLectureArray] = useState(section.sectionLectures);
  const [isUpsertContentDrawerVisible, setIsUpsertContentDrawerVisible] = useState(false);
  const classes = useStyles();

  const [createCourseSection, { loading: newSectionLoading }] = useMutation(CREATE_COURSE_SECTION, {
    onCompleted: (response) => {
      onCompleted(response, 'createSection');
    },
    onError,
  });

  const [updateCourseSection, { loading: updateSectionLoading }] = useMutation(
    UPDATE_COURSE_SECTION,
    {
      onCompleted: (response) => {
        onCompleted(response, 'updateSection');
      },
      onError,
    },
  );

  const [updateLecturePosition, { loading: updateLecturePositionLoading }] = useMutation(
    UPDATE_LECTURE_POSITION,
    {
      onCompleted: (response) => {
        onCompleted(response, 'lecturePosition');
      },
      onError,
    },
  );

  const {
    loading: courseSectionLoading,
    data: sectionData,
    refetch: refetchSection,
  } = useQuery(GET_SECTION_BY_ID, {
    variables: {
      sectionId: sectionDetails.id,
    },
  });

  useEffect(() => {
    const section = sectionData?.section;

    if (section) {
      setSectionDetails(section);
      setLectureArray(section.sectionLectures);
    }
  }, [sectionData]);

  function onCompleted(response, key) {
    const { ok, errors, section } = response[key];
    const status = ok === false ? 'error' : 'success';
    const message = errors
      ? errors?.map((error) => error.messages).join('. ')
      : `Section has been updated successfully`;

    if (section) {
      setSectionDetails(section);
      onExpandChange(section.id);
    }

    notification[status]({
      message: `${convertToSentenceCase(status)}!`,
      description: message,
    });
  }

  function onError(error) {
    notification.error({
      message: 'Error!',
      description: error?.message,
    });
  }

  const getSectionStatus = () => {
    let status = LectureSectionStatus.PUBLISHED;

    sectionDetails?.sectionLectures?.forEach((lecture) => {
      if (lecture.status !== LectureStatus.PUBLISHED) {
        status = LectureSectionStatus.DRAFT;
      }
    });
    return status;
  };

  const handleTitleChange = (event) => {
    setAccordionTitle(event.target.value);
  };

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const dataList = Array.from(lectureArray);
    const [removed] = dataList.splice(result.source.index, 1);

    dataList.splice(result.destination.index, 0, removed);
    setLectureArray(dataList);
    updateLecturePosition({
      variables: {
        lecturePosition: {
          sectionId: sectionDetails.id,
          lectureOrder: dataList.map((lecture, index) => ({
            lectureId: lecture.id,
            position: index + 1,
          })),
        },
      },
    });
  };

  const handleSaveTitle = (event) => {
    if (!accordionTitle) {
      setAccordionTitle(sectionDetails.title);
      return;
    }
    if (accordionTitle === sectionDetails.title) return;
    if (sectionDetails.persistedToBackend === false) {
      createCourseSection({
        variables: {
          course: courseId,
          title: accordionTitle,
        },
      });
      return;
    }
    updateCourseSection({
      variables: {
        sectionId: sectionDetails.id,
        title: accordionTitle,
      },
    });
  };

  const renderAccordionSummary = () => {
    const color =
      getSectionStatus() === LectureSectionStatus.PUBLISHED ? colors.successBg : '#A7A9BC';

    return (
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1d-content"
        id="panel1d-header"
        style={{
          borderLeft: `4px solid ${color}`,
        }}>
        <Box
          pl={5}
          style={{ width: '100%' }}
          display="flex"
          alignItems="center"
          justifyContent="space-between">
          <Typography color="textPrimary" className={classes.sectionTitle}>
            {index + 1}. {accordionTitle}
          </Typography>

          <Box>
            {(newSectionLoading ||
              updateSectionLoading ||
              updateLecturePositionLoading ||
              courseSectionLoading) && <CircularProgress size="1.4rem" />}
          </Box>
        </Box>
      </AccordionSummary>
    );
  };

  const renderLectures = (lecture, idx) => (
    <Draggable key={lecture.id} draggableId={lecture.id} index={idx}>
      {(provided, snapshot) => (
        <Paper
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}>
          <Box p={8} mb={3} display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <DragIndicatorIcon style={{ fontSize: fontSizes.xlarge }} />
              <Typography color="textSecondary" style={{ marginLeft: 10 }}>
                {lecture.title} By{' '}
                <Typography color="inherit" component="span">
                  {lecture.createdBy?.designation}{' '}
                  {convertToSentenceCase(lecture.createdBy?.firstname)}{' '}
                  {convertToSentenceCase(lecture.createdBy?.lastname)}
                </Typography>
              </Typography>
              <Chip
                label={convertToSentenceCase(lecture.status?.toUpperCase())}
                size="sm"
                className={classNames(classes.chip, {
                  [classes.publishedChip]: lecture.status === LectureStatus.PUBLISHED,
                  [classes.draftChip]: lecture.status === LectureStatus.DRAFT,
                  [classes.underReviewChip]: lecture.status === LectureStatus.UNDER_REVIEW,
                  [classes.amendmentChip]: lecture.status === LectureStatus.AMENDMENT,
                })}
              />
            </Box>
            <IconButton
              style={{ margin: '-12px' }}
              onClick={() => {
                setLectureToEdit(lecture.id);
                setIsUpsertContentDrawerVisible(true);
              }}>
              <EditOutlinedIcon style={{ padding: 0 }} />
            </IconButton>
          </Box>
        </Paper>
      )}
    </Draggable>
  );

  const renderDraggableSection = () => {
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}>
              {lectureArray.map(renderLectures)}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  };

  return (
    <>
      <MuiAccordion
        square
        elevation
        style={{
          borderRadius: 4,
          border: '1px solid #CDCED9',
        }}
        expanded={expanded === sectionDetails.id}
        onChange={() => onExpandChange(sectionDetails.id)}>
        {renderAccordionSummary()}
        <AccordionDetails classes={{ root: classes.accordionDetails }}>
          <Box style={{ width: '100%' }}>
            <Box padding={8} className={classes.accordionTitleInput}>
              <TextField
                name="title"
                fullWidth
                required
                onChange={handleTitleChange}
                value={accordionTitle}
                variant="outlined"
                label="Course title"
                InputProps={{
                  endAdornment: (
                    <Button color="primary" onClick={handleSaveTitle}>
                      Save
                    </Button>
                  ),
                }}
              />
            </Box>
            <Box padding={8}>
              {renderDraggableSection()}

              {sectionDetails.persistedToBackend === false && (
                <Box mb={2} maxWidth={600}>
                  <Banner
                    showSwitch={false}
                    severity="info"
                    title="Edit and save title"
                    message="Add title to section to save this section, then create a lecture"
                  />
                </Box>
              )}

              <Box>
                <Button
                  color="primary"
                  disabled={sectionDetails.persistedToBackend === false}
                  onClick={() => setIsUpsertContentDrawerVisible(true)}
                  style={{ fontWeight: fontWeight.regular }}>
                  <AddIcon style={{ marginRight: spaces.medium }} /> Add New Lecture
                </Button>
              </Box>
            </Box>
          </Box>
        </AccordionDetails>
      </MuiAccordion>
      <UpsertCourseContent
        open={isUpsertContentDrawerVisible}
        onClose={() => setIsUpsertContentDrawerVisible(false)}
        courseId={courseId}
        sectionId={sectionDetails.id}
        refetchSection={refetchSection}
        lectureToEdit={lectureToEdit}
        clearLectureId={() => setLectureToEdit(null)}
      />
    </>
  );
}

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  margin: `0 0 8px 0`,

  // change background colour if dragging
  background: isDragging ? '#FAFAFA' : '#fff',
  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  marginBottom: isDraggingOver && 80,
});

const AccordionSummary = withStyles({
  root: {
    boxShadow: boxShadows.md,
    borderRadius: `${borderRadius.md} ${borderRadius.md} 0px 0px`,
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
    border: `1px solid ${colors.secondaryLightGrey}`,
    borderRadius: '0 0 3px 3px',
  },
  publishedChip: {
    backgroundColor: '#5ACA75',
  },
  draftChip: {
    backgroundColor: '#A7A9BC',
  },
  underReviewChip: {
    backgroundColor: '#F2994A',
  },
  amendmentChip: {
    backgroundColor: '#FFF3DB',
    color: '#F2994A',
  },
  chip: {
    marginLeft: 5,
    fontSize: fontSizes.xsmall,
  },
  sectionTitle: { fontWeight: fontWeight.bold, fontSize: fontSizes.xlarge },
});
