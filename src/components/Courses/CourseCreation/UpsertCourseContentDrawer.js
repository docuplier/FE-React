import { useMutation, useQuery } from '@apollo/client';
import { Box, Button, CircularProgress, Grid, Paper, Typography } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';
import audioSvg from 'assets/svgs/audio-media.svg';
import linkSvg from 'assets/svgs/link.svg';
import textSvg from 'assets/svgs/textSvg.svg';
import pdfSvg from 'assets/svgs/pdf.svg';
import videoComponentSvg from 'assets/svgs/video-component.svg';
import videoSvg from 'assets/svgs/video-media.svg';
import { CREATE_LECTURE, CREATE_RESOURCE, UPDATE_LECTURE } from 'graphql/mutations/course';
import { GET_COURSE_BY_ID, GET_LECTURE_BY_ID } from 'graphql/queries/courses';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import RegistrationLayout from 'Layout/RegistrationLayout';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import LoadingView from 'reusables/LoadingView';
import NavigationBar from 'reusables/NavigationBar';
import { useNotification } from 'reusables/NotificationBanner';
import {
  AudioUploadFormats,
  LectureResourceType,
  LectureStatus,
  TextUploadFormats,
  VideoUploadFormats,
} from 'utils/constants';
import { convertToSentenceCase } from 'utils/TransformationUtils';
import { colors, fontSizes, fontWeight, spaces } from '../../../Css';
import AddMediaContent from './AddMediaContent';

export default function UpsertCourseContent({
  open,
  onClose,
  sectionId,
  refetchSection,
  lectureToEdit,
  clearLectureId,
}) {
  const classes = useStyles();
  const [contentMediaType, setContentMediaType] = useState('');
  const [openDrawer, setOpenDrawer] = useState(open);
  const { control, errors, handleSubmit, watch, reset, setValue } = useForm({
    defaultValues: {
      duration: null,
    },
  });
  const urlParams = new URLSearchParams(useLocation().search);
  const [buttonAction, setButtonAction] = useState(null);
  const notification = useNotification();
  const { userDetails } = useAuthenticatedUser();
  const courseId = urlParams.get('courseId');
  const lectureId = urlParams.get('lectureId');
  const { resource } = watch();
  let lectureToEditId = lectureToEdit || lectureId;

  const { data: courseData } = useQuery(GET_COURSE_BY_ID, {
    variables: {
      courseId,
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });
  const course = courseData?.course || {};

  useEffect(() => {
    if (open) {
      setOpenDrawer(true);
    }
  }, [open]);

  useEffect(() => {
    if (lectureId) setOpenDrawer(true);
  }, [lectureId]);

  const { loading: lectureLoading, data: lectureData } = useQuery(GET_LECTURE_BY_ID, {
    variables: {
      lectureId: lectureToEditId,
    },
    skip: !lectureToEditId,
    onCompleted: (response) => {
      const { lecture } = response;
      if (lecture) {
        reset(getResetFields(lecture));
        setContentMediaType(lecture.type);
      }
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });
  const lecture = lectureData?.lecture || {};

  const [updateLecture, { loading: updateLectureLoading }] = useMutation(UPDATE_LECTURE, {
    onCompleted: (response) => {
      const { ok, errors, lecture } = response.updateLecture;
      const status = ok === false ? 'error' : 'success';
      const message = errors
        ? errors?.map((error) => error.messages).join('. ')
        : `Lecture has been updated successfully`;

      notification[status]({
        message: `${convertToSentenceCase(status)}!`,
        description: message,
      });
      onCreateResources(lecture, resource);
    },
    onError,
  });

  const [createResource, { loading: newResourceLoading }] = useMutation(CREATE_RESOURCE, {
    onCompleted: (response) => {
      const { ok, errors, resource } = response.createResource;
      const status = ok === false ? 'error' : 'success';
      const message = errors
        ? errors?.map((error) => error.messages).join('. ')
        : `Resources has been uploaded successfully`;

      notification[status]({
        message: `${convertToSentenceCase(status)}!`,
        description: message,
      });
      if (resource) handleCloseContentCreationDrawer();
    },
    onError,
  });

  const [createLecture, { loading: newLectureLoading }] = useMutation(CREATE_LECTURE, {
    onCompleted: (response) => {
      const { ok, errors, lecture } = response.createLecture;
      const status = ok === false ? 'error' : 'success';
      const message = errors
        ? errors?.map((error) => error.messages).join('. ')
        : `Lecture has been created successfully`;

      notification[status]({
        message: `${convertToSentenceCase(status)}!`,
        description: message,
      });
      if (Boolean(lecture)) onCreateResources(lecture, resource);
    },
    onError,
  });

  const loadingState =
    newLectureLoading || newResourceLoading || lectureLoading || updateLectureLoading;

  function onError(error) {
    notification.error({
      message: 'Error!',
      description: error?.message,
    });
  }

  const onCreateResources = (lecture, resource) => {
    if (!resource) {
      handleCloseContentCreationDrawer();
      return;
    }

    const values = {
      file: resource,
      lecture: lecture.id,
      course: courseId,
    };
    createResource({
      variables: values,
    });
  };

  const onClickUpsertBtn = (status) => (event) => {
    setButtonAction(status);
    handleSubmit((variables) => onSubmit(variables, status))(event);
  };

  const getAssistantLecturerButtonProps = () => {
    return [
      {
        text: 'Save as draft',
        variant: 'outlined',
        isLoading: buttonAction === LectureStatus.DRAFT && loadingState,
        disabled: lecture?.status === LectureStatus.UNDER_REVIEW,
        onClick: onClickUpsertBtn(LectureStatus.DRAFT),
      },
      {
        text: 'Send for Review',
        variant: 'contained',
        isLoading: buttonAction === LectureStatus.UNDER_REVIEW && loadingState,
        color: 'primary',
        disabled: lecture?.status === LectureStatus.UNDER_REVIEW,
        onClick: onClickUpsertBtn(LectureStatus.UNDER_REVIEW),
      },
    ];
  };

  const getLeadLecturerButtonProps = () => {
    const status =
      lecture?.status === LectureStatus.UNDER_REVIEW
        ? LectureStatus.AMENDMENT
        : LectureStatus.DRAFT;

    return [
      {
        text: lecture?.status === LectureStatus.UNDER_REVIEW ? 'Need Amendment' : 'Save as draft',
        variant: 'outlined',
        isLoading: buttonAction === status && loadingState,
        onClick: onClickUpsertBtn(status),
      },
      {
        text: lectureToEdit ? 'Update Content' : 'Publish Content',
        variant: 'contained',
        isLoading: buttonAction === LectureStatus.PUBLISHED && loadingState,
        color: 'primary',
        onClick: onClickUpsertBtn(LectureStatus.PUBLISHED),
      },
    ];
  };

  const getHeaderButtonProps = () => {
    const isLeadInstructor = userDetails.id === course?.leadInstructor?.id;

    if (!Boolean(contentMediaType)) return [];
    if (!isLeadInstructor) {
      return getAssistantLecturerButtonProps();
    }

    return getLeadLecturerButtonProps();
  };

  const onSubmit = (variables, courseStatus) => {
    const { hours, minutes, seconds } = variables;
    const secondsFormat = 3600 * +hours || 0 + 60 * +minutes || 0 + +seconds || 0;

    if (+secondsFormat === 0) {
      notification.error({
        message: 'Error!',
        description: 'Lecture duration is required',
      });
      return;
    } else {
      delete variables.hours;
      delete variables.minutes;
      delete variables.seconds;
      const values = {
        ...variables,
        duration: secondsFormat,
        body: variables.body?.html,
        course: courseId,
        description: contentMediaType === 'TEXT' ? variables?.description?.html : null,
        section: sectionId,
        type: contentMediaType,
        status: courseStatus,
      };
      delete values.resource;
      delete values.file;

      if (!!lectureToEdit) {
        let file = variables.file instanceof File ? variables.file : undefined;
        updateLecture({
          variables: { newLecture: { ...values }, lectureId: lectureToEdit, file },
        });
        return;
      }
      createLecture({ variables: { file: variables.file, newLecture: values } });
    }
  };

  const handleCloseContentCreationDrawer = () => {
    onClose();
    setOpenDrawer(false);
    clearLectureId();
    setContentMediaType('');
    reset({});
    refetchSection();
  };

  const renderSelectMediaContent = () => {
    if (lectureLoading) {
      return (
        <Box display="flex" justifyContent="center" p={20}>
          <CircularProgress size={60} color="primary" />
        </Box>
      );
    }
    return (
      <Box>
        <Box className={classes.container} mb={20}>
          <Typography className="header">Lecture format</Typography>
          <Typography variant="body1" color="textPrimary">
            Select the preferred format for the lecture content to be uploaded
          </Typography>
        </Box>
        <Grid spacing={10} container>
          <Grid item xs={12} sm={6}>
            {Object.values(contentMediaTypes).map((content, index) => {
              const svgSrc = content.icon;
              return (
                <Box mb={5} component={Paper} elavation={1} key={index}>
                  <Box
                    component={Button}
                    onClick={() => setContentMediaType(content.type)}
                    style={{ textAlign: 'left' }}>
                    <Box display="flex" padding={5} alignItems="center">
                      <Box src={svgSrc} mr={10} component="img" />
                      <Box>
                        <Typography
                          color="textSecondary"
                          variant="body1"
                          style={{ fontWeight: fontWeight.bold }}>
                          {content.title}
                        </Typography>
                        <Typography variant="body1" color="textPrimary">
                          {content.description}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Grid>
          <Grid item xs={12} sm={6}>
            <img src={videoComponentSvg} alt="media svg" />
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <Drawer anchor="bottom" open={openDrawer}>
      <NavigationBar />
      <LoadingView isLoading={false} size={60}>
        <RegistrationLayout
          onClose={handleCloseContentCreationDrawer}
          title="Content Creation"
          hasHeaderButton
          headerButtons={getHeaderButtonProps()}>
          {Boolean(contentMediaType) ? (
            <LoadingView isLoading={loadingState} size={60}>
              <AddMediaContent
                control={control}
                errors={errors}
                mediaInfo={contentMediaTypes[contentMediaType]}
                watch={watch}
                setValue={setValue}
              />
            </LoadingView>
          ) : (
            renderSelectMediaContent()
          )}
        </RegistrationLayout>
      </LoadingView>
    </Drawer>
  );
}

const wysiwygDefault = {
  editorState: null,
  html: null,
};

function getHoursMinSec(secs) {
  let totalSeconds = secs;
  const hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds };
}

const getResetFields = (lecture) => {
  const fileArray = lecture.file?.split('/');
  const { hours, minutes, seconds } = getHoursMinSec(lecture?.duration);
  let newLectures = {
    ...lecture,
    body: {
      ...wysiwygDefault,
      html: lecture.body,
    },
    hours,
    minutes,
    seconds,
    file: lecture.file
      ? {
          name: fileArray[fileArray.length - 1],
          size: lecture.fileSize,
        }
      : null,
  };
  return newLectures;
};

const useStyles = makeStyles({
  container: {
    maxWidth: 800,
    '& .header': {
      fontWeight: fontWeight.medium,
      fontSize: fontSizes.title,
      color: colors.black,
      padding: 0,
      marginBottom: spaces.small,
    },
  },
});

const contentMediaTypes = {
  [LectureResourceType.VIDEO]: {
    title: 'Video',
    description: 'Click here to proceed the creation of lecture content in video format only.',
    type: LectureResourceType.VIDEO,
    icon: videoSvg,
    fileTypes: VideoUploadFormats,
  },
  [LectureResourceType.PDF]: {
    title: 'PDF',
    description: 'Click here to proceed the creation of lecture content in pdf format only.',
    type: LectureResourceType.PDF,
    icon: pdfSvg,
    fileTypes: TextUploadFormats,
  },
  [LectureResourceType.AUDIO]: {
    title: 'Audio',
    description: 'Click here to proceed the creation of lecture content in audio format only.',
    type: LectureResourceType.AUDIO,
    icon: audioSvg,
    fileTypes: AudioUploadFormats,
  },
  [LectureResourceType.LINK]: {
    title: 'Link',
    description:
      'Click here to proceed the creation of lecture content by embedding links to the lecture content.',
    type: LectureResourceType.LINK,
    icon: linkSvg,
  },
  [LectureResourceType.TEXT]: {
    title: 'Text',
    description:
      'Click here to proceed the creation of lecture content by writting some text/note.',
    type: LectureResourceType.TEXT,
    icon: textSvg,
  },
};
