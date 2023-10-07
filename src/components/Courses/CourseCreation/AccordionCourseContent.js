import { useState } from 'react';
import { Box, Button, CircularProgress } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import { useLocation } from 'react-router-dom';

import { fontWeight, spaces } from '../../../Css';
import AccordionDetail from './AccordionDetail';
import { LectureSectionStatus } from 'utils/constants';
import { GET_COURSE_SECTIONS } from 'graphql/queries/courses';
import { useQueryPagination } from 'hooks/useQueryPagination';
import Banner from 'reusables/Banner';

export default function AccordionCourseContent() {
  const [expanded, setExpanded] = useState(null);
  const [newSections, setNewSections] = useState({});
  const [sectionsData, setSectionData] = useState([]);
  const urlParams = new URLSearchParams(useLocation().search);
  const courseId = urlParams.get('courseId');

  const sections = [...sectionsData, ...Object.values(newSections)];

  const handleExpand = (sectionId) => {
    setExpanded(sectionId);
  };

  const { loading: courseSectionLoading, refetch } = useQueryPagination(GET_COURSE_SECTIONS, {
    variables: {
      courseId,
    },
    onCompleted: (response) => {
      const { sections } = response;
      if (sections) {
        setSectionData(sections?.results);
        setExpanded(sections?.results[0]?.id);
      }
    },
  });

  const handleCreateSection = () => {
    const newId = new Date();
    setNewSections((state) => {
      setExpanded(newId);
      return {
        ...state,
        [newId]: {
          id: newId,
          status: LectureSectionStatus.UNPUBLISHED,
          title: 'Add a title',
          sectionLectures: [],
          persistedToBackend: false,
        },
      };
    });
  };

  if (courseSectionLoading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <>
      {sections.length === 0 && (
        <Box maxWidth={600}>
          <Banner
            showSwitch={false}
            severity="info"
            title="No sections yet"
            message="Start by creating sections for this course"
          />
        </Box>
      )}
      {sections.map((section, index) => (
        <AccordionDetail
          index={index}
          expanded={expanded}
          onExpandChange={handleExpand}
          key={section.id}
          section={section}
          courseId={courseId}
          refetchSection={refetch}
        />
      ))}
      <Box mt={10}>
        <Button
          variant="outlined"
          onClick={handleCreateSection}
          style={{ fontWeight: fontWeight.regular }}>
          <AddIcon style={{ marginRight: spaces.small }} /> Add Section
        </Button>
      </Box>
    </>
  );
}
