import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { format } from 'date-fns';
import { makeStyles } from '@material-ui/core/styles';
import { Add as AddIcon } from '@material-ui/icons';
import { Box, Button, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

import { GET_LIVE_EVENTS } from 'graphql/queries/liveSession';
import MaxWidthContainer from 'reusables/MaxWidthContainer';
import LoadingView from 'reusables/LoadingView';
import { useNotification } from 'reusables/NotificationBanner';
import AccessControl from 'reusables/AccessControl';
import Calendar from 'components/LiveSession/Calendar';
import MyCalendarModal from 'components/LiveSession/MyCalendarModal';
import BlueHeaderPageLayout from 'Layout/BlueHeaderPageLayout';
import { PrivatePaths } from 'routes';
import { UserRoles } from 'utils/constants';
import { colors } from '../../Css';

const CalendarView = () => {
  const classes = useStyles();
  const notification = useNotification();
  const history = useHistory();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const { data, loading } = useQuery(GET_LIVE_EVENTS, {
    variables: { startDatetime: startDate, endDatetime: endDate },
    // fetchPolicy: 'cache-and-network',
    onError: (error) => {
      notification.error({
        message: 'An error occured. Please try again later',
      });
    },
  });

  const liveEvents = data?.liveEvents?.map((event, i) => {
    return { start: event?.startDatetime, end: event?.endDatetime, ...event };
  });

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const renderOtherInformation = () => {
    return (
      <Box display="flex">
        <Typography className={classes.infoContent}>
          <strong>1</strong> total
        </Typography>
        <Typography className={classes.infoContent}>
          <strong>2</strong> upcoming
        </Typography>
        <Typography className={classes.infoContent}>
          <strong>3</strong> past
        </Typography>
      </Box>
    );
  };

  const renderBannerRightContent = () => {
    return (
      <AccessControl allowedRoles={[UserRoles.LECTURER, UserRoles.SCHOOL_ADMIN]}>
        <Button
          startIcon={<AddIcon />}
          style={{ background: '#fff' }}
          onClick={() => history.push(`${PrivatePaths.LIVE_SESSION}/create-live-session`)}
          variant="contained">
          New Session
        </Button>
      </AccessControl>
    );
  };

  return (
    <BlueHeaderPageLayout
      isTabBarHidden={true}
      title="Live Session"
      description="Join an online learning environment for live interaction between the Lecturers and Students on different course works, events and program in your institution"
      rightContent={renderBannerRightContent()}
      otherInformation={renderOtherInformation()}
      isPageLoaded={true}
      links={[{ title: 'Home', to: '/' }]}>
      <MaxWidthContainer spacing="lg">
        <LoadingView isLoading={loading}>
          <Calendar
            events={liveEvents}
            onEventClick={(event) => handleEventClick(event)}
            onDateChange={(startDate, endDate) => handleDateChange(startDate, endDate)}
          />
          <MyCalendarModal
            open={Boolean(selectedEvent)}
            eventId={selectedEvent?.id}
            onClose={() => setSelectedEvent(null)}
            attendeesCount={selectedEvent?.totalAttendees}
            sessionLink={selectedEvent?.meetingLink}
            organiser={`${selectedEvent?.createdBy?.firstname} ${selectedEvent?.createdBy?.lastname}`}
            sessionTitle={selectedEvent?.title}
            description={selectedEvent?.description}
            date={
              Boolean(selectedEvent?.startDatetime) &&
              format(new Date(selectedEvent?.startDatetime), 'LLL dd, yyyy')
            }
            time={
              Boolean(selectedEvent?.startDatetime) &&
              Boolean(selectedEvent?.endDatetime) &&
              `${format(new Date(selectedEvent?.startDatetime), 'p')} - ${format(
                new Date(selectedEvent?.endDatetime),
                'p',
              )}`
            }
          />
        </LoadingView>
      </MaxWidthContainer>
    </BlueHeaderPageLayout>
  );
};

const useStyles = makeStyles((theme) => ({
  infoContent: {
    display: 'inline',
    paddingRight: theme.spacing(8),
    paddingLeft: 16,
    '&:nth-child(2)': {
      borderLeft: `1px solid ${colors.white}`,
      borderRight: `1px solid ${colors.white}`,
    },
    '&:nth-child(1)': {
      borderRight: `1px solid ${colors.white}`,
      paddingLeft: 0,
    },
  },
}));

export default CalendarView;
