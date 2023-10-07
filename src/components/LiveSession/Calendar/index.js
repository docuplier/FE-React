import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Box, Typography } from '@material-ui/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import rrulePlugin from '@fullcalendar/rrule';
import TruncateText from 'reusables/TruncateText';
import { fontSizes, fontWeight } from '../../../Css';
import calendarStyles from './styles';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import { UserRoles } from 'utils/constants';

/**
 * @component
 * This renders a calendar/event-scheduling component. It makes use of FullCalendar.io's react calendar component.
 * @see https://fullcalendar.io/docs/react
 */

const Calendar = (props) => {
  const { events, onEventClick, onDateChange } = props;
  const classes = calendarStyles();
  const calendarRef = useRef(null);
  const { userDetails } = useAuthenticatedUser();

  const handleDateClick = (info) => {
    // Changes the view to daily view when a specific day is clicked.
    calendarRef.current.getApi().changeView('timeGridDay', info.dateStr);
  };

  const handleEventClick = (info) => {
    let event = {
      id: info?.event?._def?.publicId,
      title: info?.event?._def?.title,
      ...info?.event?._def?.extendedProps,
    };
    onEventClick(event);
  };

  function renderEventContent(eventInfo) {
    return (
      <Box className={classes.eventContainer}>
        <Box>
          <Typography className="time-text" variant="caption">
            {eventInfo?.timeText}
          </Typography>
        </Box>
        <Typography className="title-text" variant="caption">
          <TruncateText text={eventInfo?.event?.title} lines={1} />
        </Typography>
      </Box>
    );
  }

  function renderDayHeader(headerInfo) {
    if (headerInfo?.view?.type !== 'dayGridMonth') {
      return (
        <Box p={4} fontWeight={fontWeight.regular} className={classes.headerContainer}>
          <Box>
            <Typography className="date-text" variant="body2">
              {format(new Date(headerInfo?.date), 'd')}
            </Typography>
          </Box>
          <Typography className="day-text" variant="body2">
            {format(new Date(headerInfo?.date), 'iiii')}
          </Typography>
        </Box>
      );
    } else {
      return (
        <Box p={10} fontWeight={fontWeight.regular} fontSize={fontSizes.medium}>
          {format(new Date(headerInfo?.date), 'iiii')}
        </Box>
      );
    }
  }

  return (
    <Box className={classes.calendar}>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, rrulePlugin]}
        initialView={
          userDetails?.selectedRole === UserRoles.SCHOOL_ADMIN ? 'dayGridMonth' : 'timeGridWeek'
        }
        headerToolbar={{
          left: 'title',
          center: 'timeGridDay,timeGridWeek,dayGridMonth',
          right: 'prev,today,next',
        }}
        dayHeaderContent={renderDayHeader} // Formats the way the top header is displayed
        slotLabelClassNames={'timeSlot'}
        allDaySlot={false}
        displayEventEnd={true}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        eventContent={renderEventContent} // Formats the way the events are displayed
        events={events}
        datesSet={(dateInfo) => onDateChange(dateInfo?.startStr, dateInfo?.endStr)}
        eventTimeFormat={{
          hour: 'numeric',
          minute: '2-digit',
          meridiem: 'short',
        }}
      />
    </Box>
  );
};

Calendar.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOf([PropTypes.string, PropTypes.number]),
      title: PropTypes.string,
      start: PropTypes.string, // This follows the structure of the event object at https://fullcalendar.io/docs/event-object for non-recurring events
      end: PropTypes.string,
      // Some of the fields below are usually only specified for simple recurring events. See https://fullcalendar.io/docs/recurring-events for more info on reoccuring events.
      startRecur: PropTypes.string,
      endRecur: PropTypes.string,
      startTime: PropTypes.string,
      endTime: PropTypes.string,
    }),
  ),
  onEventClick: PropTypes.func,
};

export default Calendar;
