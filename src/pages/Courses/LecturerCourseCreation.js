import { useMutation, useQuery } from '@apollo/client';
import { Box } from '@material-ui/core';
import AddLectures from 'components/Courses/CourseCreation/AddLectures';
import CourseDetails from 'components/Courses/CourseCreation/CourseDetails';
import CoursePrerequisite from 'components/Courses/CourseCreation/CoursePrerequisite';
import Introduction from 'components/Courses/CourseCreation/Introduction';
import { UPDATE_COURSE } from 'graphql/mutations/course';
import { GET_COURSE_BY_ID } from 'graphql/queries/courses';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import RegistrationLayout from 'Layout/RegistrationLayout';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useLocation } from 'react-router-dom';
import Banner from 'reusables/Banner';
import LoadingView from 'reusables/LoadingView';
import useNotification from 'reusables/NotificationBanner/useNotification';
import VerticalTabs from 'reusables/VerticalTabs';
import { LectureStatus } from 'utils/constants';
import { convertToSentenceCase } from 'utils/TransformationUtils';

const wysiwygDefault = {
  editorState: null,
  html: null,
};

const defaultInput = {
  categories: [],
  objectives: wysiwygDefault,
  description: wysiwygDefault,
  prerequisites: [''],
};

const LecturerCourseCreation = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [buttonAction, setButtonAction] = useState(null);
  const [courseData, setCourseData] = useState([]);
  const notification = useNotification();
  const urlParams = new URLSearchParams(useLocation().search);
  const courseId = urlParams.get('courseId');
  const history = useHistory();
  const { userDetails } = useAuthenticatedUser();
  const {
    control,
    errors,
    reset,
    handleSubmit,
    watch,
    setValue: setFormValue,
  } = useForm({ defaultValues: defaultInput });

  const { loading: courseLoading } = useQuery(GET_COURSE_BY_ID, {
    variables: {
      courseId,
    },
    onCompleted: (response) => {
      const { error, course } = response;
      if (!error) {
        setCourseData(course);
        reset({ ...defaultInput, ...getResetFields(course) });
      }
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const isLeadInstructor = userDetails.id === courseData?.leadInstructor?.id;
  const isInstructor = courseData?.instructors
    ?.map((instructor) => instructor.id)
    .includes(userDetails.id);
  const isAuthorized = isLeadInstructor || isInstructor;

  const [updateCourse, { loading: courseUpdateLoading }] = useMutation(UPDATE_COURSE, {
    refetchQueries: [{ query: GET_COURSE_BY_ID, variables: { courseId } }],
    onCompleted,
    onError,
  });

  function onCompleted(response, key) {
    const { ok, errors, course } = response.updateCourse;
    showCourseNotification({ ok, errors, course });
    if (course) {
      setCourseData(course);
      if (activeTab < 3) {
        handleNextTab(activeTab + 1);
      } else {
        history.goBack();
      }
      reset({ ...defaultInput, ...getResetFields(course) });
    }
  }

  function showCourseNotification({ ok, errors, course }) {
    const status = ok === false ? 'error' : 'success';
    const message = errors
      ? errors.map((error) => error.messages).join('. ')
      : `${course?.title} course has been updated successfully`;
    notification[status]({
      message: convertToSentenceCase(status),
      description: message,
    });
  }

  function onError(error) {
    notification.error({
      message: 'Error!',
      description: error?.message,
    });
  }

  const submitFormHandler = (status) => {
    return handleSubmit((variables) => {
      setButtonAction(status);
      onHandleSubmit(variables, status);
    });
  };

  const disableButton = () => {
    return !isAuthorized || courseUpdateLoading;
  };

  const isLoading = (status) => {
    return buttonAction === status && courseUpdateLoading;
  };

  const getHeaderButtonProps = () => {
    if (isLeadInstructor) {
      return [
        {
          text: 'Save as draft',
          variant: 'outlined',
          disabled: disableButton(),
          isLoading: isLoading(LectureStatus.DRAFT),
          onClick: submitFormHandler(LectureStatus.DRAFT),
        },
        {
          text: courseId ? 'Update course' : 'Publish course',
          variant: 'contained',
          color: 'primary',
          disabled: disableButton(),
          isLoading: isLoading(LectureStatus.PUBLISHED),
          onClick: submitFormHandler(LectureStatus.PUBLISHED),
        },
      ];
    }
    return [];
  };

  const fromatedData = (secondaryDept) => {
    return secondaryDept?.map((data) => {
      return {
        department: data?.department?.id || data?.department,
        level: data?.level?.id || data?.level,
      };
    });
  };

  const onHandleSubmit = (variables, status) => {
    const values = {
      banner: variables.banner,
      newCourse: {
        ...variables,
        secondaryDepartments: fromatedData(variables?.secondaryDepartments),
        leadInstructor: courseData?.leadInstructor?.id,
        department: variables.department || courseData?.department?.id,
        instructors: !!variables.instructors
          ? variables.instructors?.map((instructor) => instructor.id)
          : courseData?.instructors?.map((instructor) => instructor.id),
        description: variables?.description?.html || courseData?.description,
        objectives: variables?.objectives?.html || courseData?.objectives,
        categories: courseData?.categories?.map((category) => category.id),
      },
      id: courseId,
    };

    delete values?.newCourse?.banner;
    if (!values?.banner?.size) {
      delete values?.banner;
    }

    updateCourse({
      variables: {
        ...values,
        status,
      },
    });
  };

  const handleNextTab = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  const handleClose = () => {
    history.goBack();
  };

  return (
    <>
      <LoadingView isLoading={false} size={60}>
        <RegistrationLayout
          onClose={handleClose}
          title="Course creation"
          hasHeaderButton
          headerButtons={getHeaderButtonProps()}>
          {courseLoading ? (
            <LoadingView isLoading={courseLoading} size={60}>
              <Box height={60} />
            </LoadingView>
          ) : (
            <>
              {isAuthorized ? (
                <VerticalTabs
                  handleNextTab={handleNextTab}
                  activeTab={activeTab}
                  tabList={[
                    {
                      label: 'Intro',
                      component: (
                        <LoadingView isLoading={courseLoading} size={60}>
                          <Introduction
                            activeTab={activeTab}
                            control={control}
                            errors={errors}
                            handleNextTab={handleNextTab}
                          />
                        </LoadingView>
                      ),
                    },
                    {
                      label: 'Course data',
                      component: (
                        <LoadingView isLoading={courseUpdateLoading} size={60}>
                          <CourseDetails
                            control={control}
                            errors={errors}
                            watch={watch}
                            setFormValue={setFormValue}
                            onHandleSubmit={handleSubmit(onHandleSubmit)}
                            courseData={courseData}
                          />
                        </LoadingView>
                      ),
                    },
                    {
                      label: 'Course prerequisites',
                      component: (
                        <CoursePrerequisite
                          control={control}
                          errors={errors}
                          onHandleSubmit={handleSubmit(onHandleSubmit)}
                        />
                      ),
                    },
                    {
                      label: 'Course contents',
                      component: <AddLectures />,
                    },
                  ]}
                />
              ) : (
                <Box display="flex" justifyContent="center">
                  <Box maxWidth={600}>
                    <Banner
                      showSwitch={false}
                      severity="error"
                      title="Unauthorized"
                      message="You have not been registered as an instructor for this course"
                    />
                  </Box>
                </Box>
              )}
            </>
          )}
        </RegistrationLayout>
      </LoadingView>
    </>
  );
};

const getResetFields = (course) => {
  const bannerArray = course.banner?.split('/');
  let newCourses = {
    ...course,
    department: course?.department?.id,
    level: course?.level?.id,
    leadInstructor: course?.leadInstructor?.firstname + ' ' + course?.leadInstructor?.lastname,
    description: {
      ...wysiwygDefault,
      html: course.description,
    },
    objectives: {
      ...wysiwygDefault,
      html: course.objectives,
    },
    banner: course.banner
      ? {
          name: bannerArray[bannerArray.length - 1],
          size: undefined,
        }
      : null,
    prerequisites: course.prerequisites || defaultInput.prerequisites,
  };
  return newCourses;
};

export default React.memo(LecturerCourseCreation);
