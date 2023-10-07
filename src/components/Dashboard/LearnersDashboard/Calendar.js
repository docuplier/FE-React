import React from 'react';
import PropTypes from 'prop-types';
import '@prunedge/react-modern-calendar-datepicker/lib/DatePicker.css';
import { Calendar as ReactCalendar } from '@prunedge/react-modern-calendar-datepicker';
import { Box, makeStyles, Typography } from '@material-ui/core';
import { colors, fontWeight } from '../../../Css';

/**
 * @component
 * This renders a calendar component. It makes use of react-modern-calendar-datepicker's calendar component.
 * @see https://kiarash-z.github.io/react-modern-calendar-datepicker/
 * The actual library in use is a fork of the react-modern-calendar-datepicker repo.
 * It includes some extra methods like getMonthStart and getMonthEnd, which are not included in the react-modern-calendar-datepicker docs.
 * These let you get the start and end date of the current month anytime a user navigates. This includes all forms of navigation. e.g by clicking on the arrow buttons, by selecting a month or year to view, etc.
 */
const Calendar = (props) => {
  const { selectedDay, onSelectDay, getMonthEnd, getMonthStart, events } = props;
  const classes = useStyles();

  return (
    <Box className={classes.containerr}>
      <Typography className="title">Activities </Typography>
      <ReactCalendar
        value={selectedDay}
        onChange={onSelectDay}
        getMonthStart={getMonthStart}
        getMonthEnd={getMonthEnd}
        colorPrimary="#0fbcf9"
        calendarClassName="custom-calendar"
        shouldHighlightWeekends
        customDaysClassName={events}
      />
    </Box>
  );
};

const useStyles = makeStyles({
  containerr: {
    backgroundColor: colors.white,
    fontSize: 14,
    width: '100%',
    '& .title': {
      fontWeight: fontWeight.bold,
      fontSize: 18,
      color: '#111C55',
      textAlign: 'left',
      padding: '24px 0px 0px 32px',
    },
    '& .custom-calendar': {
      boxShadow: 'none',
      minHeight: 0,
      paddingTop: 0,
      width: '100%',
      '&.Calendar > :not(.Calendar__footer) button': {
        color: '#1E0A3C',
        fontWeight: 'bold',
      },
    },
    '& .eventDay:not(.-selectedStart):not(.-selectedBetween):not(.-selectedEnd):not(.-selected)': {
      border: `2px solid #0fbcf9 !important`,
    },
  },
});

Calendar.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      year: PropTypes.number,
      month: PropTypes.number,
      day: PropTypes.number,
      className: PropTypes.string,
    }),
  ),
  selectedDay: PropTypes.func,
  onSelectDay: PropTypes.func,
  getMonthEnd: PropTypes.func,
  getMonthStart: PropTypes.func,
};

export default React.memo(Calendar);
