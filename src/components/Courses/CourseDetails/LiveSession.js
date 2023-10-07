import { useQuery } from '@apollo/client';
import {
  Box,
  Grid,
  makeStyles,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { ReactComponent as RedDot } from 'assets/svgs/red-dot.svg';
import MyCalendarModal from 'components/LiveSession/MyCalendarModal';
import { format } from 'date-fns';
import { GET_LIVE_EVENTS } from 'graphql/queries/liveSession';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Empty from 'reusables/Empty';
import FilterControl from 'reusables/FilterControl';
import LoadingView from 'reusables/LoadingView';
import { useNotification } from 'reusables/NotificationBanner';
import { OffsetLimitBasedPagination } from 'reusables/Pagination';
import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET } from 'utils/constants';
import { colors, fontSizes, fontWeight } from '../../../Css';

const LiveSession = () => {
  const defaultQueryParams = {
    search: '',
    offset: DEFAULT_PAGE_OFFSET,
    limit: DEFAULT_PAGE_LIMIT,
    startDatetime: null,
    endDatetime: null,
    ordering: null,
  };
  const classes = useStyles();
  const { courseId } = useParams();
  const notification = useNotification();
  const [selectedSession, setSelectedSession] = useState(null);
  const [queryParams, setQueryParams] = useState(defaultQueryParams);
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const { data: liveSessionData, loading } = useQuery(GET_LIVE_EVENTS, {
    variables: {
      startDatetime:
        queryParams?.startDatetime && new Date(queryParams?.startDatetime).toISOString(),
      endDatetime: queryParams?.endDatetime && new Date(queryParams?.endDatetime).toISOString(),
      search: queryParams?.search,
      courseId,
    },
    // fetchPolicy: 'cache-and-network',
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const handleChangeQueryParams = (changeset) => {
    setQueryParams((prevState) => ({
      ...prevState,
      ...changeset,
    }));
  };

  const groupLiveSessionsDataByDate = (dataItem) => {
    const findDateItems = (calendarGroups, date) =>
      calendarGroups?.find((item) => {
        return item[0]?.startDatetime === date;
      });

    const handleItemsByDate = (data) => {
      return data?.reduce((accumulatedValue, currentValue) => {
        const { date } = currentValue;
        const groupedDateItems = findDateItems(accumulatedValue, date);

        if (!groupedDateItems) {
          return [...accumulatedValue, [currentValue]];
        }
        return accumulatedValue.map((group) => {
          return group[0]?.startDatetime === date ? [...group, currentValue] : group;
        });
      }, []);
    };
    return handleItemsByDate(dataItem);
  };

  const renderFilterControls = () => {
    return (
      <>
        <Grid item xs={12} sm={3}>
          <TextField
            type="date"
            variant="outlined"
            label="Start date"
            name="startDatetime"
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            defaultValue={queryParams?.startDatetime}
            onChange={(evt) => handleChangeQueryParams({ startDatetime: evt.target.value })}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            type="date"
            variant="outlined"
            label="End date"
            name="endDatetime"
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            defaultValue={queryParams?.endDatetime}
            onChange={(evt) => handleChangeQueryParams({ endDatetime: evt.target.value })}
          />
        </Grid>
      </>
    );
  };

  const renderLiveSessionList = () => {
    return (
      <LoadingView size={60} isLoading={loading}>
        <Box className="live-session-container">
          {liveSessionData?.liveEvents?.length ? (
            groupLiveSessionsDataByDate(liveSessionData?.liveEvents)?.map((item, i) => {
              return (
                <>
                  <Grid container key={i} className="live-session-list">
                    <Grid item xs={2}>
                      <Typography variant="h5" style={{ marginRight: 16, display: 'inline' }}>
                        {format(new Date(item[0]?.startDatetime), 'dd')}
                      </Typography>
                      <Typography variant="body3">
                        {format(new Date(item[0]?.startDatetime), 'MMM eee').split(' ').join(', ')}
                      </Typography>
                    </Grid>
                    <Grid item xs={10}>
                      {item?.map((session, i) => {
                        const {
                          id,
                          title,
                          startDatetime,
                          endDatetime,
                          createdBy: { firstname, lastname },
                        } = session;
                        return (
                          <Box
                            p={4}
                            display="flex"
                            key={id}
                            alignItems="center"
                            style={{ cursor: 'pointer' }}
                            onClick={() => setSelectedSession(session)}>
                            <Box pl={25} pr={50}>
                              {' '}
                              <Typography>
                                <RedDot /> {format(new Date(startDatetime), 'hh:mm')} -{' '}
                                {format(new Date(endDatetime), 'hh:mm aaa')}
                              </Typography>
                            </Box>
                            <Box>
                              {' '}
                              <Typography>
                                {title} - {firstname} {lastname}
                              </Typography>
                            </Box>
                          </Box>
                        );
                      })}
                    </Grid>
                  </Grid>
                </>
              );
            })
          ) : (
            <Empty
              title={'No Live Session'}
              description={'You have no live session for this course.'}
            />
          )}
        </Box>
        <OffsetLimitBasedPagination
          total={liveSessionData?.length}
          onChangeLimit={(_offset, limit) => handleChangeQueryParams({ limit, offset: 0 })}
          onChangeOffset={(offset, _limit) => handleChangeQueryParams({ limist: _limit, offset })}
          offset={queryParams.offset}
          limit={queryParams.limit}
        />
        {!!selectedSession && (
          <MyCalendarModal
            eventId={selectedSession?.id}
            open={Boolean(selectedSession)}
            onClose={() => setSelectedSession(null)}
            attendeesCount={selectedSession?.totalAttendees}
            sessionLink={selectedSession?.meetingLink}
            organiser={`${selectedSession?.createdBy?.firstname} ${selectedSession?.createdBy?.lastname}`}
            sessionTitle={selectedSession?.title}
            date={
              Boolean(selectedSession.startDatetime) &&
              format(new Date(selectedSession?.startDatetime), 'LLL dd, yyyy')
            }
            time={`${format(new Date(selectedSession?.startDatetime), 'hh:mm aaa')} - ${format(
              new Date(selectedSession?.endDatetime),
              'hh:mm aaa',
            )}`}
          />
        )}
      </LoadingView>
    );
  };

  const pendingEvents = liveSessionData?.liveEvents?.filter(
    (date) => date?.endDatetime >= new Date().toISOString(),
  )?.length;

  const completedEvents = liveSessionData?.liveEvents?.filter(
    (date) => date?.endDatetime < new Date().toISOString(),
  )?.length;

  return (
    <Box className={classes.container}>
      <Box className="header-container">
        <Box>
          <Typography component="h4" className="heading">
            Live Sessions
          </Typography>
          <Typography className="caption">
            {liveSessionData?.liveEvents?.length ?? 0} in total • {pendingEvents ?? 0} pending •{' '}
            {completedEvents ?? 0} completed
          </Typography>
        </Box>
      </Box>
      <FilterControl
        paper={true}
        searchInputProps={{
          colSpan: {
            xs: 12,
            sm: 6,
          },
          onChange: (evt) => handleChangeQueryParams({ search: evt.target.value }),
        }}
        renderCustomFilters={renderFilterControls()}
      />
      {renderLiveSessionList()}
    </Box>
  );
};

const useStyles = makeStyles({
  container: {
    color: '#6B6C7E',
    '& .heading': {
      color: colors.dark,
      fontWeight: fontWeight.bold,
      fontSize: fontSizes.xxlarge,
    },
    '& .caption': {
      color: colors.grey,
      fontWeight: fontWeight.medium,
      fontSize: fontSizes.large,
    },
    '& .header-container': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 34,
    },
    '& .live-session-container': {
      margin: '16px 0px',
      overflowY: 'auto',
    },
    '& .live-session-list': {
      borderBottom: `2px solid ${colors.seperator}`,
      padding: 10,
    },
  },
});

export default LiveSession;
