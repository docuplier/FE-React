import { format } from 'date-fns';
import { LiveSessionRepeatMode } from './constants';

export const resetLiveEventField = (liveEvent, defaultValues = {}) => {
  const { title, startDatetime, endDatetime, description, attendeeTypes } = liveEvent;

  const value = {
    ...defaultValues,
    title,
    description,
    startDate: format(new Date(startDatetime), 'yyyy-LL-dd'),
    startTime: format(new Date(startDatetime), 'HH:mm'),
    endDate: format(new Date(endDatetime), 'yyyy-LL-dd'),
    endTime: format(new Date(endDatetime), 'HH:mm'),
    attendees: attendeeTypes?.map((attendee) => ({
      id: attendee.typeId,
      name: attendee.typeTitle,
      type: attendee.type,
    })),
  };
  return value;
};

export const getNewEventValues = (variables) => {
  const { startDate, startTime, endDate, endTime, title, repeatMode, attendees, description } =
    variables;
  const isEventRepeatable = repeatMode === LiveSessionRepeatMode.REPEAT.value;
  return {
    title,
    description,
    startDatetime: `${startDate}T${startTime}`,
    endDatetime: `${endDate}T${endTime}`,
    repeatMode: isEventRepeatable,
    attendeeTypes: attendees.map((attendee) => ({
      typeId: attendee.id,
      type: attendee.type,
    })),
  };
};
