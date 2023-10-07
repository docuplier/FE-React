import React from 'react';
import { Box, makeStyles, Typography } from '@material-ui/core';
import classnames from 'classnames';
import { format } from 'date-fns';
import Calendar from './Calendar';
import { colors } from '../../../Css';
import LoadingView from 'reusables/LoadingView';
import { useActivityData } from 'components/Dashboard/LearnersDashboard/StudenActivityContext';

const CalendarView = () => {
  const classes = useStyles();
  const {
    startDate,
    endDate,
    setEndDate,
    setStartDate,
    studentActivitiesData,
    loading,
    selectedDay,
    setSelectedDay,
  } = useActivityData();

  function parseDate(date) {
    const { year, month, day } = date;
    return new Date(year, month - 1, day);
  }

  const formatCalendarEvents = (data) => {
    return data?.map((event) => {
      const { assessments, assignments, liveSessions, date } = event;
      let year = parseInt(format(new Date(date), 'yyyy'));
      let month = parseInt(format(new Date(date), 'M'));
      let day = parseInt(format(new Date(date), 'dd'));

      if (!!assessments.length || !!assignments.length || !!liveSessions.length) {
        return { year, month, day, className: 'eventDay' };
      } else {
        return {};
      }
    });
  };

  const formatCardsEvents = (data) => {
    // When you navigate to a month, it lists all the events within the startDate && endDate of a month;
    // When you select a day in the month, it lists all the events within the selectedDay && endDate of a month;
    if (startDate && endDate) {
      let cardListStartDate = startDate;
      // start listing events from the selectedDay, only if its within the current month being displayed
      if (selectedDay && selectedDay.month === endDate.month && selectedDay.year === endDate.year) {
        cardListStartDate = selectedDay;
      }
      return data?.filter(
        (event) =>
          new Date(event.date) >= parseDate(cardListStartDate) &&
          new Date(`${event.date} 00:00:00`) <= parseDate(endDate),
      );
    }
    return [];
  };

  const isToday = (date) => {
    if (format(new Date(date), 'd LLL yyyy') === format(new Date(), 'd LLL yyyy')) return true;
    return false;
  };

  function renderCard(event) {
    const { assessments, assignments, liveSessions, date } = event;
    if (!!assessments.length || !!assignments.length || !!liveSessions.length) {
      return (
        <Box className={classes.eventCard}>
          <Box
            pl={12}
            py={5}
            className={classnames('card-header', {
              [classes.isToday]: isToday(date),
            })}>
            {isToday(date) && 'Today | '}
            {format(new Date(date), 'iii d MMM')}
          </Box>
          {assignments?.length ? (
            assignments?.map((item) => (
              <Box px={12} py={7} className="event">
                <Box display="flex" justifyContent="space-between" className="event-title">
                  <Typography variant="body2">Assignment</Typography>
                  <Typography variant="body2">
                    {item?.startDatetime && format(new Date(item?.startDatetime), 'hh:mmaaa')}
                  </Typography>
                </Box>
                <Typography variant="body2">
                  An assignment on "{item?.title}" is due for submission
                </Typography>
              </Box>
            ))
          ) : (
            <div />
          )}
          {assessments?.length ? (
            assessments?.map((item) => (
              <Box px={12} py={7} className="event">
                <Box display="flex" justifyContent="space-between" className="event-title">
                  <Typography variant="body2">Assessment</Typography>
                  <Typography variant="body2">
                    {item?.startDatetime && format(new Date(item?.startDatetime), 'hh:mmaaa')}
                  </Typography>
                </Box>
                <Typography variant="body2">
                  An assessment on "{item?.title}" is due for submission
                </Typography>
              </Box>
            ))
          ) : (
            <div />
          )}
          {liveSessions?.length ? (
            liveSessions?.map((item) => (
              <Box px={12} py={7} className="event">
                <Box display="flex" justifyContent="space-between" className="event-title">
                  <Typography variant="body2">Live Session</Typography>
                  <Typography variant="body2">
                    {item?.startDatetime && format(new Date(item?.startDatetime), 'hh:mmaaa')}
                  </Typography>
                </Box>
                <Typography variant="body2">Upcoming live session on {item?.title}</Typography>
              </Box>
            ))
          ) : (
            <div />
          )}
        </Box>
      );
    }
  }
  return (
    <Box width={'auto'} mb={16} className={classes.calenderView}>
      <Calendar
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
        getMonthStart={setStartDate}
        getMonthEnd={setEndDate}
        events={formatCalendarEvents(studentActivitiesData)}
      />
      <Box className="container" height="auto" maxHeight="480px" mt={6}>
        <LoadingView isLoading={loading}>
          {formatCardsEvents(studentActivitiesData)?.map((event, i) => renderCard(event))}
        </LoadingView>
      </Box>
    </Box>
  );
};
const useStyles = makeStyles({
  calenderView: {
    '& .container': {
      overflowY: 'auto',
      scrollbarWidth: 'thin',
      scrollbarColor: '#757575',
    },
    '& .container::-webkit-scrollbar-track': {
      background: 'white',
    },
    '& .container::-webkit-scrollbar-thumb ': {
      backgroundColor: '#757575',
      borderRadius: 8,
    },
    '& .container::-webkit-scrollbar': {
      width: 7,
    },
  },
  eventCard: {
    backgroundColor: colors.white,
    fontSize: '14px',
    width: '100%',
    '& .card-header': {
      backgroundColor: '#F1F2F6',
      color: colors.grey,
    },
    '& .event': {
      boxShadow: 'inset 0px -1px 0px #E0E0E0',
    },
    '& .event-title': {
      color: colors.grey,
    },
  },
  isToday: {
    backgroundColor: '#F0F5FF !important',
    color: `${colors.primary} !important`,
  },
});

export default CalendarView;
