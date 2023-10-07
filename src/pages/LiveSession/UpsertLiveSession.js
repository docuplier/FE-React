import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { useForm } from 'react-hook-form';
import { useHistory, useLocation } from 'react-router-dom';
import { Box } from '@material-ui/core';
import { format, addMinutes } from 'date-fns';
import { useMutation, useQuery } from '@apollo/client';

import { CourseStatus, LiveSessionRepeatMode, LiveSessionInterval } from 'utils/constants';
import RegistrationLayout from 'Layout/RegistrationLayout';
import LoadingView from 'reusables/LoadingView';
import RepeatModal from 'components/LiveSession/UpsertLiveSession/RepeatModal';
import UpsertLiveSessionInputFields from 'components/LiveSession/UpsertLiveSession/UpsertLiveSessionInputFields';
import { fontWeight, fontSizes, fontFamily, colors, spaces } from '../../Css';
import { CREATE_LIVE_SESSION, UPDATE_LIVE_SESSION } from 'graphql/mutations/liveSession';
import { useNotification } from 'reusables/NotificationBanner';
import { GET_LIVE_SESSION_BY_ID } from 'graphql/queries/liveSession';
import { resetLiveEventField, getNewEventValues } from 'utils/liveSessionUtils';

function UpsertLiveSession() {
  const classes = useStyles();
  const history = useHistory();
  const notification = useNotification();
  const urlParams = new URLSearchParams(useLocation().search);
  const sessionId = urlParams.get('sessionId');
  const [repeatModalVisible, setRepeatModalVisible] = useState(false);
  const useFormUtils = useForm({
    defaultValues,
  });
  const { handleSubmit, watch, reset } = useFormUtils;
  const { repeatMode } = watch();

  useEffect(() => {
    if (repeatMode === LiveSessionRepeatMode.REPEAT.value) {
      setRepeatModalVisible(true);
    }
  }, [repeatMode]);

  const { loading: liveSessionLoading } = useQuery(GET_LIVE_SESSION_BY_ID, {
    variables: {
      liveEventId: sessionId,
    },
    skip: !sessionId,
    onCompleted: (response) => {
      const { liveEvent } = response;
      if (liveEvent) {
        reset(resetLiveEventField(liveEvent, defaultValues));
      }
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const [createLiveSessionMutation, createLiveSessionFeedback] = useMutation(CREATE_LIVE_SESSION, {
    onCompleted: (response) => onCompleted(response, 'createLiveEvent'),
    onError,
  });

  const [updateLiveSessionMutation, updateLiveSessionFeedback] = useMutation(UPDATE_LIVE_SESSION, {
    onCompleted: (response) => onCompleted(response, 'updateLiveEvent'),
    onError,
  });

  function onError(error) {
    notification.error({
      message: error?.message,
    });
  }

  function onCompleted(response, key) {
    const { ok, errors } = response[key];
    const status = ok === false ? 'error' : 'success';
    const message = errors
      ? errors.messages ||
        (Array.isArray(errors) && errors.map((error) => error.messages).join('. '))
      : `Live event has been ${key === 'createLiveEvent' ? 'created' : 'updated'} successfully`;
    notification[status]({
      message,
    });
    if (!errors) {
      history.goBack();
      reset(defaultValues);
    }
  }

  const onSubmit = (variables) => {
    const newLiveevent = getNewEventValues(variables);

    if (sessionId) {
      updateLiveSessionMutation({
        variables: {
          newLiveevent,
          liveEventId: sessionId,
        },
      });
      return;
    }
    createLiveSessionMutation({
      variables: {
        newLiveevent,
      },
    });
  };

  const getHeaderButtonProps = () => {
    return [
      {
        text: 'Save',
        variant: 'contained',
        color: 'primary',
        disabled: createLiveSessionFeedback.loading || updateLiveSessionFeedback.loading,
        isLoading: createLiveSessionFeedback.loading || updateLiveSessionFeedback.loading,
        onClick: handleSubmit((variables) => onSubmit(variables, CourseStatus.PUBLISHED)),
      },
    ];
  };

  const handleClose = () => {
    history.goBack();
  };

  return (
    <>
      <RegistrationLayout
        onClose={handleClose}
        title={Boolean(sessionId) ? 'Edit Meeting' : 'New Session'}
        hasHeaderButton
        headerButtons={getHeaderButtonProps()}>
        <Box display="flex" justifyContent="center">
          <Box width="100%" maxWidth={750}>
            <LoadingView isLoading={liveSessionLoading} size={60}>
              <form className={classes.form}>
                <UpsertLiveSessionInputFields useFormUtils={useFormUtils} />
              </form>
            </LoadingView>
          </Box>
        </Box>
      </RegistrationLayout>
      <RepeatModal
        useFormUtils={useFormUtils}
        open={repeatModalVisible}
        onClose={() => setRepeatModalVisible((prevState) => !prevState)}
      />
    </>
  );
}

const defaultValues = {
  startDate: format(new Date(), 'yyyy-LL-dd'),
  startTime: format(addMinutes(new Date(), 30), 'HH:mm'),
  endDate: format(new Date(), 'yyyy-LL-dd'),
  endTime: format(addMinutes(new Date(), 60), 'HH:mm'),
  interval: LiveSessionInterval.DAILY,
  description: '',
  title: '',
  attendees: [],
  repeatMode: LiveSessionRepeatMode.NO_REPEAT.value,
};

const useStyles = makeStyles({
  container: {
    maxWidth: 800,
    '& .header': {
      fontWeight: fontWeight.medium,
      fontSize: fontSizes.title,
      color: colors.black,
      fontFamily: fontFamily.primary,
      padding: 0,
    },
  },
  option: {
    fontSize: 15,
    '& > span': {
      marginRight: 10,
      fontSize: 18,
    },
  },
  form: {
    '& > * > *': {
      marginBottom: spaces.medium,
    },
  },
});

export default UpsertLiveSession;
