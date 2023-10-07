import React, { useState, useEffect } from 'react';
import { Box, Button, Paper, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import ContentListView from 'reusables/ContentListView';
import { AssessmentCompletionStatus, AssessmentStatus } from 'utils/constants';
import { colors } from '../../Css';
import { ReactComponent as CalendarNew } from 'assets/svgs/calendar-new.svg';
import { ReactComponent as CalendarNewGreen } from 'assets/svgs/Icon-calendar-16-green.svg';
import { PrivatePaths } from 'routes';
import Empty from 'reusables/Empty';
import { format } from 'date-fns';
import { convertToSentenceCase } from 'utils/TransformationUtils';
import { useHistory, useLocation } from 'react-router-dom';

import { OffsetLimitBasedPagination } from 'reusables/Pagination';
import { Calendar } from 'react-modern-calendar-datepicker';

export default function AllAssessments({ data, handleChangeQueryParams, queryParams }) {
  const [openCalendar, setOpenCalendar] = useState(false);
  const classes = useStyles();
  const location = useLocation();
  const isDfa = location?.pathname?.startsWith('/dfa');
  const [selectedDayRange, setSelectedDayRange] = useState({
    from: null,
    to: null,
  });

  useEffect(() => {
    if (selectedDayRange.from && selectedDayRange.to) {
      handleChangeQueryParams({
        startDate: format(
          new Date(
            selectedDayRange.from.year,
            selectedDayRange.from.month - 1,
            selectedDayRange.from.day,
          ),
          'yyyy-MM-dd',
        ),
        endDate: format(
          new Date(
            selectedDayRange.to.year,
            selectedDayRange.to.month - 1,
            selectedDayRange.to.day,
          ),
          'yyyy-MM-dd',
        ),
      });
    }
  }, [selectedDayRange, handleChangeQueryParams]);

  const handleNavigationForLecturerAndSchoolAdmin = (assessmentId, status) => {
    if (status === AssessmentStatus.DRAFT) {
      return isDfa
        ? `${PrivatePaths.DFA_ASSESSMENTS}/create-assessment?id=${assessmentId}`
        : `${PrivatePaths.ASSESSMENTS}/create-assessment?id=${assessmentId}`;
    }

    return isDfa
      ? `${PrivatePaths.DFA_ASSESSMENTS}/${assessmentId}`
      : `${PrivatePaths.ASSESSMENTS}/${assessmentId}`;
  };
  const handleRoutes = ({ assessmentId, status }) => {
    return handleNavigationForLecturerAndSchoolAdmin(assessmentId, status);
  };
  const totalCount = data?.length ?? 0;
  const renderFilterControl = () => {
    return (
      <Box p={8} display="flex" alignItems="center" justifyContent={'space-between'}>
        <TextField
          defaultValue=""
          placeholder="Search"
          style={{
            width: '80%',
            marginRight: '4px',
          }}
          variant="outlined"
          onChange={(evt) => handleChangeQueryParams({ search: evt.target.value })}
        />
        <Box style={{ position: 'relative' }}>
          <Button
            endIcon={isDfa ? <CalendarNewGreen /> : <CalendarNew />}
            variant="text"
            disableElevation
            className={classes.activityType}
            onClick={() => setOpenCalendar(!openCalendar)}
            color="primary"
            sx={{
              ml: {
                xs: 4,
                md: 0,
              },
            }}
            style={{
              backgroundColor: isDfa ? '#D4F7DC' : '#F0F5FF',
              fontWeight: 400,
              padding: '0 20px',
              border: 'none',
              color: isDfa && '#267939',
            }}
          >
            Range
          </Button>
          {openCalendar && (
            <Box style={{ position: 'absolute', left: '-100%' }}>
              <Calendar
                value={selectedDayRange}
                colorPrimary={colors.primary}
                colorPrimaryLight={colors.primaryLight}
                onChange={setSelectedDayRange}
              />
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  return data?.length ? (
    <>
      <Box mb={5} bgcolor="white" borderRadius="8px" component={Paper}>
        {renderFilterControl()}
      </Box>
      <Box>
        {data.map(
          ({
            title,
            status,
            totalSubmissions,
            dueDate,
            startTime,
            dueTime,
            completed,
            startDate,
            id: assessmentId,
            description,
            fileCount,
          }) => (
            <Box my={5} mb={10}>
              <ContentListView
                key={assessmentId}
                title={title}
                status={convertToSentenceCase(status)}
                submissionsCount={totalSubmissions}
                description={description}
                fileCount={fileCount}
                // startDate={new Date(`${startDate}`)}
                // dueDate={new Date(`${dueDate} `)}
                dueDate={dueDate ? new Date(`${dueDate} 23:59:59`) : null}
                startDate={startDate ? new Date(`${startDate} 23:59:59`) : null}
                url={handleRoutes({
                  assessmentId,
                  status,
                  completionStatus: completed,
                  startDate,
                  startTime,
                  dueDate,
                  dueTime,
                })}
                submission={completed === AssessmentCompletionStatus.COMPLETED}
              />
            </Box>
          ),
        )}
      </Box>
      <OffsetLimitBasedPagination
        total={totalCount}
        onChangeLimit={(_offset, limit) => handleChangeQueryParams({ limit, offset: 0 })}
        onChangeOffset={(offset, _limit) => handleChangeQueryParams({ limit: _limit, offset })}
        offset={queryParams.offset}
        limit={queryParams.limit}
      />
    </>
  ) : (
    <Empty title={'No Assessment'} description={'No Global Assessment.'} />
  );
}

const useStyles = makeStyles((theme) => ({
  filterInput: {
    '& .MuiOutlinedInput-root': {
      background: '#F1F2F6',
    },
  },
  activityType: {
    border: '1px solid #CDCED9',
    height: '100%',
    borderRadius: '8px',
    background: '#F1F2F6',
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    padding: '10px',
    justifyContent: 'space-between',
    cursor: 'pointer',
  },
  activityMenu: {
    width: 'auto',
    padding: '10px',
  },
  activtyBody: {
    height: '300px',
    overflow: 'auto',
  },
}));
