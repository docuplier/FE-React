import React, { useState } from 'react';
import { Box, makeStyles, Typography, Grid, Button, IconButton } from '@material-ui/core';
import { useQuery } from '@apollo/client';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import { useParams, useHistory } from 'react-router-dom';
import ArrowBackOutlinedIcon from '@material-ui/icons/ArrowBackOutlined';
import { format } from 'date-fns';

import InstitutionRegistrationCard from 'reusables/InstitutionRegistrationCard';
import UpsertSessionDrawer from './UpsertSessionDrawer';
import { fontWeight } from '../../../Css';
import { GET_PROGRAM_BY_ID_QUERY, GET_SESSIONS_QUERY } from 'graphql/queries/institution';
import LoadingView from 'reusables/LoadingView';
import { useNotification } from 'reusables/NotificationBanner';
import AddNewResourceCard from 'reusables/AddNewResourceCard';
import Chip from 'reusables/Chip';
import AcademicProgramDrawer from '../AcademicProgramDrawer';
import { convertPositionToNthValue } from 'utils/TransformationUtils';
import { DEFAULT_PAGE_OFFSET } from 'utils/constants';

const Sessions = () => {
  const classes = useStyles();
  const notification = useNotification();
  const { institutionId, programId } = useParams();
  const history = useHistory();
  const [sessionToUpsert, setSessionToUpsert] = useState({
    visible: false,
    sessionId: null,
  });
  const [isAcademicProgramDrawerVisible, setIsAcademicProgramDrawerVisible] = useState(false);

  const {
    data: programData,
    loading: isLoadingProgram,
    refetch: refetchProgram,
  } = useQuery(GET_PROGRAM_BY_ID_QUERY, {
    variables: { programId },
    skip: !Boolean(programId),
  });

  const {
    data: sessionsData,
    loading: isLoadingSessions,
    refetch: refetchSessions,
  } = useQuery(GET_SESSIONS_QUERY, {
    variables: { institutionId, limit: 100, offset: DEFAULT_PAGE_OFFSET, programId },
    skip: !institutionId,
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const renderAcademicSessionHeader = (session) => {
    let { name, expired, isActive, currentSemester } = session,
      currentSemesterName = currentSemester?.name || '1',
      chipLabel = '';

    if (expired) chipLabel = 'Completed';
    else
      chipLabel = isActive
        ? `${currentSemesterName}${convertPositionToNthValue(currentSemesterName)}`
        : 'Not Active';

    return (
      <Box display="flex" justifyContent="space-between">
        <Box>
          <Typography variant="body2" style={{ fontWeight: fontWeight.medium }}>
            {name}
          </Typography>
          <Chip
            size="small"
            roundness="md"
            color={isActive ? 'active' : 'secondary'}
            label={chipLabel}
          />
        </Box>
        <Button
          className={classes.baseButton}
          color="primary"
          onClick={() => setSessionToUpsert({ visible: true, sessionId: session.id })}>
          <Box display="flex">
            <Box mr={5}>
              <CreateOutlinedIcon />
            </Box>
            Edit
          </Box>
        </Button>
      </Box>
    );
  };

  const renderAcademicSessionFooter = (session) => {
    const { startSemester, endSemester } = session?.currentSemester || {
      startSemester: null,
      endSemester: null,
    };
    const startDate = new Date(startSemester);
    const endDate = new Date(endSemester);

    return (
      <Box>
        <Typography variant="body2">Duration</Typography>
        <Typography variant="body2" style={{ fontWeight: fontWeight.medium }}>
          {session?.currentSemester
            ? `${format(startDate, 'MMM dd, yyyy')} - ${format(endDate, 'MMM dd, yyyy')}`
            : 'No current semester'}
        </Typography>
      </Box>
    );
  };

  const renderSessions = () => {
    const results = sessionsData?.sessions?.results || [];

    return (
      <Box mt={12}>
        <Grid container spacing={8}>
          {results.map((session) => (
            <Grid item key={session.id} xs={4}>
              <InstitutionRegistrationCard
                topComponent={renderAcademicSessionHeader(session)}
                bottomComponent={renderAcademicSessionFooter(session)}
              />
            </Grid>
          ))}
          <Grid item xs={4}>
            <AddNewResourceCard
              title="Add new session"
              onClick={() => setSessionToUpsert({ visible: true, sessionId: null })}
            />
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderPageHeader = () => {
    const { name, abbreviation } = programData?.program || {};

    return (
      <Box display="flex" justifyContent="space-between">
        <Box>
          <Box mb={1} display="flex">
            <IconButton
              className={classes.backButton}
              color="default"
              onClick={() => history.goBack()}>
              <ArrowBackOutlinedIcon />
            </IconButton>
            <Typography variant="h4" color="textPrimary" className={classes.boldText}>
              {name} {abbreviation && `(${abbreviation})`}
            </Typography>
          </Box>
          <Typography variant="body1" color="textSecondary">
            Details of present and past sessions of the institution
          </Typography>
        </Box>
        <Button
          className={classes.baseButton}
          color="primary"
          onClick={() => setIsAcademicProgramDrawerVisible(true)}>
          Edit
        </Button>
      </Box>
    );
  };

  return (
    <>
      <LoadingView isLoading={isLoadingSessions || isLoadingProgram}>
        <Box maxWidth="800px">
          {renderPageHeader()}
          {renderSessions()}
        </Box>
      </LoadingView>
      <UpsertSessionDrawer
        open={sessionToUpsert.visible}
        onClose={() => setSessionToUpsert({ visible: false, sessionId: null })}
        sessionId={sessionToUpsert.sessionId}
        refetchAllSessions={refetchSessions}
        institutionId={institutionId}
        programId={programId}
      />
      <AcademicProgramDrawer
        open={isAcademicProgramDrawerVisible}
        onClose={() => setIsAcademicProgramDrawerVisible(false)}
        programId={programId}
        institutionId={institutionId}
        onOKSuccess={refetchProgram}
      />
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  boldText: {
    fontWeight: fontWeight.bold,
  },
  backButton: {
    marginRight: theme.spacing(11),
    padding: theme.spacing(4),
    border: `1px solid rgba(0, 0, 0, 0.54)`,
  },
  baseButton: {
    height: 'max-content',
    width: 'max-content',
  },
}));

export default React.memo(Sessions);
