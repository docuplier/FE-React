import { makeStyles } from '@material-ui/core';
import { colors, fontSizes, fontWeight } from '../../../Css';

// Overides default styles of FullCalendar.io's calendar component
const calendarStyles = makeStyles((theme) => ({
  calendar: {
    '& colgroup': {
      backgroundColor: '#F1F2F6',
    },
    '& .timeSlot': {
      paddingLeft: 10,
      paddingRight: 10,
      textAlign: 'center',
      fontSize: fontSizes.small,
      color: colors.grey,
    },
    // Style overides for header and header-buttons
    '& .fc .fc-toolbar.fc-header-toolbar': {
      marginBottom: 0,
      backgroundColor: '#F1F2F6',
      padding: 20,
    },
    '& .fc .fc-button, .fc .fc-button-primary, .fc .fc-button-primary:hover, .fc .fc-button-primary:focus, .fc .fc-button-primary:disabled, .fc .fc-button-primary:not(:disabled):active,':
      {
        border: 0,
        backgroundColor: 'transparent',
        color: colors.textAlternative,
        margin: `0px ${theme.spacing(6)}`,
        boxShadow: 'none !important',
      },
    '& .fc .fc-button-group': {
      backgroundColor: '#E7E7ED',
      borderRadius: 8,
    },
    '& .fc .fc-button-primary:not(:disabled).fc-button-active': {
      background: colors.white,
      border: '1px solid #CDCED9',
      boxSizing: 'border-box',
      borderRadius: 8,
      color: colors.primary,
    },
    // Styles overides for event container
    '& .fc-h-event': {
      backgroundColor: 'transparent',
      border: 0,
    },
    '& .fc-h-event .fc-event-main': {
      color: colors.text,
    },
    '& .fc-daygrid-event-harness, .fc-v-event': {
      paddingLeft: 5,
      background: '#F0F5FF',
      boxShadow: 'inset 2px 0px 0px #0050C8',
      color: colors.text,
    },
    '& .fc-daygrid-dot-event:hover, .fc-daygrid-dot-event.fc-event-mirror': {
      background: 'rgb(0 137 255 / 10%)',
      marginLeft: '-2px !important',
      marginRight: '-0.5px !important',
      paddingLeft: 4,
      borderRadius: 0,
    },
    '& .fc-v-event': {
      border: 0,
    },
    ' & .fc-timegrid-event, .fc-timegrid-more-link': {
      borderRadius: 0,
    },
    '& .fc-timegrid-event-harness-inset .fc-timegrid-event, .fc-timegrid-event.fc-event-mirror, .fc-timegrid-more-link':
      {
        boxShadow: 'inset 2px 0px 0px #0050C8',
      },
    '& .fc-timegrid-event-harness > .fc-timegrid-event': {
      position: 'relative',
    },
    // Style past events
    '& .fc-day-past .fc-daygrid-event-harness, .fc-day-past .fc-v-event': {
      background: '#FEEFEF',
      boxShadow: 'inset 2px 0px 0px #FA141B',
    },
    // Allows TruncateText reusable to work properly
    '& .fc-daygrid-event': {
      whiteSpace: 'normal',
    },
    // Remove scrollbars
    '& .fc .fc-scroller-liquid-absolute': {
      position: 'relative',
    },
    '& .fc .fc-scrollgrid-section-body table, .fc .fc-scrollgrid-section-footer table': {
      height: '100% !important',
      minHeight: 771,
    },
    '& .fc .fc-view-harness-active > .fc-view': {
      position: 'relative',
    },
    '& .fc .fc-view-harness': {
      minHeight: 835.556,
      height: '100% !important',
    },
  },
  eventContainer: {
    color: colors.text,
    background: 'transparent',
    maxWidth: '100%',
    cursor: 'pointer',
    '& .time-text': {
      color: colors.grey,
    },
    '& .title-text': {
      color: colors.textAlternative,
    },
  },
  headerContainer: {
    color: colors.textAlternative,
    '& .date-text': {
      fontWeight: fontWeight.bold,
    },
  },
}));

export default calendarStyles;
