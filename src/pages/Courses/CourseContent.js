import React, { useEffect, useMemo, useState } from 'react';
import { Box, IconButton } from '@material-ui/core';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import VisibilityIcon from '@material-ui/icons/Visibility';

import CourseContentLayout from 'Layout/CourseContentLayout';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import { LectureResourceType, UserRoles } from 'utils/constants';
import MediaPlayer from 'reusables/MediaPlayer';
import Overview from 'components/Courses/CourseContent/Overview';
import AnnouncementsTab from 'components/Courses/CourseContent/AnnouncementsTab';
import NoteTab from 'components/Courses/CourseContent/NoteTab';
import Resources from 'components/Courses/CourseContent/Resources';
import InstructorsList from 'reusables/InstructorsList';
import QA from 'components/Courses/CourseContent/QA';
import FilePreview from 'reusables/FilePreview';
import { GET_COURSES, GET_COURSE_BY_ID, GET_COURSE_SECTIONS } from 'graphql/queries/courses';
import { useNotification } from 'reusables/NotificationBanner';
import LoadingView from 'reusables/LoadingView';
import { convertTimeSpentToDuration, extractFileNameFromUrl } from 'utils/TransformationUtils';
import LinkPreview from 'reusables/LinkPreview';
import MaxWidthContainer from 'reusables/MaxWidthContainer';
import InstructorStatsModal from 'components/Courses/InstructorStatsModal';
import { CREATE_UPDATE_PROGRESS } from 'graphql/mutations/course';
import { GET_LEARNER_ENROLMENTS } from 'graphql/queries/courses';
import TextContentDrawer from 'components/Courses/CourseContent/TextContentDrawer';
import PreviewTextContent from 'components/Courses/CourseContent/PreviewTextContent';

const Tabs = {
  OVERVIEW: 'Overview',
  QA: 'Q&A',
  NOTE: 'Note',
  RESOURCES: 'Resources',
  ANNOUNCEMENT: 'Announcement',
};

const CourseContent = () => {
  const { userDetails } = useAuthenticatedUser();
  const [currentTab, setCurrentTab] = useState(0);
  const history = useHistory();
  const { pathname, search } = useLocation();
  const { courseId } = useParams();
  const params = new URLSearchParams(search);
  const currentLectureId = params.get('lectureId');
  const notification = useNotification();
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [openTextContentToView, setOpenTextContentToView] = useState(null);

  const { data, loading } = useQuery(GET_COURSE_SECTIONS, {
    variables: {
      courseId,
      limit: 100,
      offset: 0,
    },
    skip: !courseId,
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const { data: courseData, loading: isLoadingCourseData } = useQuery(GET_COURSE_BY_ID, {
    variables: {
      courseId,
    },
    skip: !courseId,
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const { data: instructorCourses, loading: isLoadingInstructorCourses } = useQuery(GET_COURSES, {
    variables: { instructorId: selectedInstructor?.id, truncateResults: true },
    skip: !selectedInstructor?.id,
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const { data: learnerCourses, refetch } = useQuery(GET_LEARNER_ENROLMENTS, {
    variables: {
      userId: userDetails?.id,
    },
    fetchPolicy: 'cache-and-network',
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const [createUpdateProgress, { loading: markingCourseAsComplete }] = useMutation(
    CREATE_UPDATE_PROGRESS,
    {
      onCompleted: ({ createUpdateProgress: { ok, errors } }) => {
        if (ok) {
          notification.success({
            message: 'Course completed',
          });
        }
        if (errors?.messages) {
          notification.error({
            message: 'A problem occurred, please try again',
          });
        }
      },
      onError: (error) => {
        notification.error({
          message: 'A problem occurred, please try again',
        });
      },
    },
  );

  const enrolmentId = learnerCourses?.enrolments?.results.filter(
    (item) => item?.course?.id === courseId,
  )[0]?.id;

  const isCompleted = learnerCourses?.enrolments?.results
    .filter((item) => item?.course?.id === courseId)[0]
    ?.enrolmentProgress?.filter(({ lecture }) => lecture.id === currentLectureId)[0]?.isCompleted;

  const currentLectureDuration = courseData?.course?.crsLectures?.filter(
    (item) => item?.id === currentLectureId,
  )[0]?.duration;

  const markCourseAsCompleted = () => {
    refetch();
    createUpdateProgress({
      variables: {
        lectureProgress: {
          currentDuration: currentLectureDuration,
          enrolmentId,
          lectureId: currentLectureId,
        },
      },
    });
  };

  const courseSections = useMemo(() => {
    return data?.sections?.results || [];
  }, [data]);

  const formattedTabs = useMemo(() => {
    const tabs = Object.values(Tabs);

    return userDetails?.selectedRole !== UserRoles.STUDENT
      ? tabs.filter((tab) => tab !== Tabs.NOTE)
      : tabs;
  }, [userDetails]);

  const flattenedLectures = useMemo(() => {
    return courseSections?.reduce((acc, section) => {
      acc = acc.concat(section.sectionLectures);
      return acc;
    }, []);
  }, [courseSections]);

  const currentLecture = useMemo(() => {
    return flattenedLectures?.find((lecture) => lecture.id === currentLectureId) || {};
  }, [flattenedLectures, currentLectureId]);

  useEffect(() => {
    if (!currentLectureId) {
      //display the first lecture on mount and current lecture is not
      //communicated from the browser query params
      const lectureId = flattenedLectures?.[0]?.id;
      if (lectureId) {
        navigateToLecture(flattenedLectures?.[0]?.id);
      }
    }
    // eslint-disable-next-line
  }, [currentLectureId, flattenedLectures]);

  const textContent = {
    title: currentLecture?.title,
    content: currentLecture?.type === LectureResourceType.TEXT && currentLecture.body,
  };

  const lectureMedia = useMemo(() => {
    const lecture = flattenedLectures?.find((lecture) => lecture.id === currentLectureId);
    const link = lecture?.file || lecture?.embeddedLink;

    switch (lecture?.type) {
      case LectureResourceType.TEXT:
        return (
          <MaxWidthContainer>
            <Box py={20}>
              <PreviewTextContent
                content={textContent?.content}
                onClickReadMore={() => setOpenTextContentToView(textContent)}
              />
            </Box>
          </MaxWidthContainer>
        );
      case LectureResourceType.VIDEO:
      case LectureResourceType.AUDIO:
        return (
          <Box width="100%" height={lecture?.type === LectureResourceType.VIDEO ? 560 : 170}>
            <MediaPlayer url={link} />
          </Box>
        );
      case LectureResourceType.PDF:
      case LectureResourceType.LINK:
        const component =
          lecture?.type === LectureResourceType.PDF ? (
            <FilePreview
              file={{
                name: extractFileNameFromUrl(link),
                size: 0,
                type: lecture?.type?.toLowerCase(),
                url: link,
              }}
              limitInformationToSize={true}
              rightContent={
                <IconButton size="small" target="_blank" color="inherit" href={link}>
                  <VisibilityIcon />
                </IconButton>
              }
            />
          ) : (
            <LinkPreview url={link} />
          );

        return (
          <MaxWidthContainer>
            <Box
              py={20}
              height={120}
              width="100%"
              boxSizing="border-box"
              display="flex"
              alignItems="center"
              justifyContent="center">
              {component}
            </Box>
          </MaxWidthContainer>
        );
      default:
        return null;
    }
    //eslint-disable-next-line
  }, [currentLectureId, flattenedLectures]);

  const currentSection = useMemo(() => {
    const currentSectionId = flattenedLectures?.find((lecture) => lecture.id === currentLectureId)
      ?.section?.id;

    return courseSections?.find((section) => section.id === currentSectionId);
  }, [currentLectureId, flattenedLectures, courseSections]);

  const getCourseSyllabus = () => {
    return courseSections?.map((courseSection) => ({
      title: courseSection.title,
      sectionId: courseSection?.id,
      content:
        courseSection?.sectionLectures?.map((lecture) => ({
          id: lecture.id,
          topic: lecture.title,
          duration: convertTimeSpentToDuration(lecture.duration),
        })) || [],
    }));
  };

  const navigateToLecture = (lectureId) => {
    history.push(`${pathname}?lectureId=${lectureId}`);
  };

  const renderContent = () => {
    const course = courseData?.course || {};
    const fileCount = course?.aggregateFileCount?.reduce((acc, file) => {
      acc[file.type?.toLowerCase()] = file.total;
      return acc;
    }, {});

    switch (formattedTabs[currentTab]) {
      case Tabs.OVERVIEW:
        return (
          <Overview
            lectureDescriptionHtml={
              currentLecture.type === LectureResourceType.TEXT
                ? currentLecture?.description
                : currentLecture.body
            }
            aboutCourseProps={{
              viewCount: 0,
              descriptionHtml: course?.description,
              objectivesHtml: course?.objectives,
            }}
            courseIncludes={{
              courseDuration: course?.totalVideoDuration,
              pdfCount: fileCount?.pdf,
              audioCount: fileCount?.audio,
              resourceCount: course?.resourceDocumentCount,
              lifeTimeAccess: true,
              screens: true,
              certificate: false,
            }}
            markCourseAsCompleted={() => markCourseAsCompleted()}
            isLoading={markingCourseAsComplete}
            isCompleted={isCompleted}
          />
        );
      case Tabs.QA:
        return <QA currentLectureId={currentLectureId} courseId={courseId} />;
      case Tabs.NOTE:
        return <NoteTab currentLectureId={currentLectureId} courseId={courseId} />;
      case Tabs.RESOURCES:
        return <Resources currentLectureId={currentLectureId} courseId={courseId} />;
      case Tabs.ANNOUNCEMENT:
        return (
          <AnnouncementsTab
            currentLectureId={currentLectureId}
            courseId={courseId}
            classRepId={course?.classRep?.id}
          />
        );
      default:
        return null;
    }
  };

  const renderInstructorsList = () => {
    let { instructors = [], leadInstructor = {} } = courseData?.course || {};
    instructors = [leadInstructor, ...instructors];

    return (
      <Box mt={20}>
        <InstructorsList
          data={instructors.map((instructor) => ({
            firstName: instructor?.firstname,
            lastName: instructor?.lastname,
            department: instructor?.department?.name,
            imgSrc: instructor?.image,
            id: instructor?.id,
          }))}
          onViewMoreClick={(instructor) => setSelectedInstructor(instructor)}
          colSpan={{ xs: 12, sm: 6 }}
        />
      </Box>
    );
  };

  return (
    <>
      <CourseContentLayout
        tabs={formattedTabs}
        onTabChange={(tab) => setCurrentTab(tab)}
        syllabus={getCourseSyllabus()}
        onSelectLecture={(lectureId) => navigateToLecture(lectureId)}
        currentLectureId={currentLectureId}
        defaultSelectedSectionId={currentSection?.id}
        lecturePreviewItem={lectureMedia}>
        <LoadingView isLoading={loading || isLoadingCourseData}>
          {renderContent()}
          {renderInstructorsList()}
        </LoadingView>
      </CourseContentLayout>
      <InstructorStatsModal
        open={Boolean(selectedInstructor)}
        onClose={() => setSelectedInstructor(null)}
        courseData={instructorCourses?.courses?.results}
        profileInfo={{
          user: {
            imageSrc: selectedInstructor?.imgSrc,
            name: `${selectedInstructor?.firstName} ${selectedInstructor?.lastName}`,
            department: selectedInstructor?.department,
          },
        }}
        loading={isLoadingInstructorCourses}
      />
      <TextContentDrawer
        open={Boolean(openTextContentToView)}
        data={openTextContentToView}
        onClose={() => setOpenTextContentToView(null)}
      />
    </>
  );
};

export default React.memo(CourseContent);
