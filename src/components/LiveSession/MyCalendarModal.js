import { Box, Card, CardContent, Modal, Typography } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/styles';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import calendarSvg from 'assets/svgs/calendar.svg';
import hyperlinkSvg from 'assets/svgs/hyperlink.svg';
import personSvg from 'assets/svgs/person.png';
import timeSvg from 'assets/svgs/time-clock.svg';
import networkSvg from 'assets/svgs/user-network.svg';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import AccessControl from 'reusables/AccessControl';
import LoadingButton from 'reusables/LoadingButton';
import TruncateText from 'reusables/TruncateText';
import { PrivatePaths } from 'routes';
import { UserRoles } from 'utils/constants';
import { navigateToURL } from 'utils/RouteUtils';

import { colors, fontSizes, fontWeight } from '../../Css';
import { useNotification } from 'reusables/NotificationBanner';

const MyCalendarModal = ({
  open,
  onClose,
  attendeesCount = 0,
  sessionLink,
  organiser,
  sessionTitle,
  date,
  time,
  eventId,
  description,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const notification = useNotification();

  const renderDateTime = ({ icon, text }) => (
    <Box
      bgcolor={colors.white}
      display="inline-flex"
      alignItems="center"
      py={2.5}
      px={5}
      border="1px solid #CDCED9"
      borderRadius={50}>
      <Box component="img" mr={theme.spacing(3)} src={icon} />
      <Typography variant="body2" color="textSecondary">
        {text}
      </Typography>
    </Box>
  );

  const renderAttendeesCount = () => (
    <Box display="flex" alignItems="center" mb={theme.spacing(3)}>
      <Box component="img" src={networkSvg} mr={theme.spacing(5)} />
      <Box>
        <Typography variant="body1" color="textPrimary">
          <b>{attendeesCount}</b>
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Attendees
        </Typography>
      </Box>
    </Box>
  );

  const renderMeetingLink = () => (
    <Box display="flex" alignItems="center" mb={theme.spacing(3)}>
      <Box component="img" src={hyperlinkSvg} mr={theme.spacing(5)} />
      <Box>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <TruncateText
            style={{ cursor: 'pointer' }}
            text={sessionLink}
            lines={1}
            onClick={() => navigateToURL(sessionLink)}
            color="primary.main"
            fontSize={fontSizes.large}
            fontWeight={fontWeight.medium}
            my={2}
          />
          <FileCopyIcon
            style={{ color: colors.primary, cursor: 'pointer' }}
            onClick={() => {
              navigator.clipboard.writeText(sessionLink);
              notification.success({
                message: `copied`,
              });
            }}
          />
        </Box>
        <Typography variant="body2" color="textSecondary">
          Meeting link
        </Typography>
      </Box>
    </Box>
  );

  const renderOrganizer = () => (
    <Box display="flex" alignItems="center">
      <Box component="img" src={personSvg} mr={theme.spacing(5)} />
      <Box>
        <Typography variant="body1" color="textPrimary">
          <b>{organiser}</b>
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Organiser
        </Typography>
      </Box>
    </Box>
  );

  const renderDescription = () => {
    return (
      <Box mt={4}>
        <Box pb={4}>
          <Typography>Description</Typography>
        </Box>
        <Typography variant="body2" color="textPrimary" style={{ fontWeight: fontWeight.bold }}>
          {description}
        </Typography>
      </Box>
    );
  };

  const renderActionBtns = () => (
    <Box>
      <LoadingButton
        size="medium"
        style={{ marginRight: theme.spacing(5) }}
        variant="contained"
        color="primary"
        onClick={() => navigateToURL(sessionLink)}>
        Join
      </LoadingButton>

      <AccessControl allowedRoles={[UserRoles.LECTURER, UserRoles.SCHOOL_ADMIN]}>
        <LoadingButton
          onClick={() =>
            history.push(`${PrivatePaths.LIVE_SESSION}/create-live-session?sessionId=${eventId}`)
          }
          variant="outlined"
          size="medium">
          Edit
        </LoadingButton>
      </AccessControl>
    </Box>
  );

  return (
    <Modal open={open} onClose={onClose}>
      <Card style={getModalStyle()} className={classes.card}>
        <CardContent style={{ background: '#F1F2F6' }}>
          <Typography
            style={{ marginBottom: theme.spacing(5) }}
            variant="body2"
            color="textSecondary">
            My calendar
          </Typography>
          <TruncateText
            text={sessionTitle}
            lines={1}
            color="text.primary"
            fontSize={fontSizes.xxlarge}
            fontWeight={fontWeight.bold}
            my={2}
          />
          <Box mt={4} mb={8}>
            <Box mr={8} display="inline-block">
              {renderDateTime({ text: date, icon: calendarSvg })}
            </Box>
            {renderDateTime({ text: time, icon: timeSvg })}
          </Box>
          {renderActionBtns()}
        </CardContent>
        <Box height="270px" className="scrollable-area">
          <CardContent>
            {renderAttendeesCount()}
            {renderMeetingLink()}
            {renderOrganizer()}
            {renderDescription()}
          </CardContent>
        </Box>
      </Card>
    </Modal>
  );
};

MyCalendarModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  attendeesCount: PropTypes.number.isRequired,
  sessionLink: PropTypes.string.isRequired,
  organiser: PropTypes.string.isRequired,
  sessionTitle: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
};

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  card: {
    position: 'absolute',
    width: '100%',
    maxWidth: 400,
    '& .scrollable-area': {
      overflowY: 'auto',
      scrollbarWidth: 'thin',
      scrollbarColor: '#757575',
    },
    '& .scrollable-area::-webkit-scrollbar-track': {
      background: 'white',
    },
    '& .scrollable-area::-webkit-scrollbar-thumb ': {
      backgroundColor: '#757575',
      borderRadius: 8,
    },
    '& .scrollable-area::-webkit-scrollbar': {
      width: 7,
    },
  },
}));

export default MyCalendarModal;
