import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography, Box, TextField, MenuItem } from '@material-ui/core';
import { useLocation, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import LearnersListView from 'reusables/LearnersListView';
import { fontWeight } from '../../Css';
import { useNotification } from 'reusables/NotificationBanner';
import { GET_PROGRAMS_QUERY } from 'graphql/queries/institution';
import { formatProgramType } from 'utils/program';
import LoadingView from 'reusables/LoadingView';
import { convertToSentenceCase } from 'utils/TransformationUtils';
import { ProgramType } from 'utils/constants';
import Empty from 'reusables/Empty';

const LevelList = ({ usersColumnTitle, data, onChangeFilters, filters, loading }) => {
  const { pathname } = useLocation();
  const { institutionId } = useParams();
  const notification = useNotification();
  const { programType = null, programId } = filters;

  const { data: programsData, loading: isLoadingPrograms } = useQuery(GET_PROGRAMS_QUERY, {
    variables: { institutionId },
    onCompleted: (response) => {
      if (!response.programs.error && !programId) {
        onChangeFilters({
          program: response?.programs?.results[0]?.id,
        });
      }
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });
  const programsDataResults = programsData?.programs?.results || [];

  const renderProgramType = () =>
    formatProgramType(programsDataResults, programId)?.map((program) => (
      <MenuItem key={program.value} value={program.value}>
        {convertToSentenceCase(program.name)}
      </MenuItem>
    ));

  const renderFilter = () => {
    return (
      <Box mb={8}>
        <Grid container spacing={10}>
          <Grid item xs={3}>
            <TextField
              value={programId}
              select
              label="Program"
              variant="outlined"
              onChange={(evt) => onChangeFilters({ program: evt.target.value })}
              fullWidth>
              <MenuItem value="All">All</MenuItem>
              {programsDataResults?.map((program) => (
                <MenuItem key={program.id} value={program.id}>
                  {program.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={3}>
            <TextField
              select
              label="Student Type"
              onChange={(evt) => onChangeFilters({ programType: evt.target.value })}
              variant="outlined"
              value={programId === 'All' ? 'All' : programType}
              fullWidth>
              <MenuItem value={'All'}>{'All'}</MenuItem>
              {renderProgramType()}
            </TextField>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderHeader = () => {
    const columns = ['Level', 'Courses', usersColumnTitle];

    return (
      <Box ml={12} mr={12}>
        <Grid container>
          {columns.map((column) => (
            <Grid item xs={4} key={column}>
              <Typography
                variant="body1"
                color="textSecondary"
                style={{ fontWeight: fontWeight.bold }}>
                {column}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  const renderEmptyState = () => {
    return <Empty title={'No Data'} description={'No Data Avalaible.'}></Empty>;
  };

  return (
    <div>
      {renderFilter()}
      {renderHeader()}
      <LoadingView isLoading={loading || isLoadingPrograms}>
        {Boolean(data?.length) ? (
          <>
            {data?.map((item, index) => {
              return (
                <Box mt={4} key={item.id || index}>
                  <LearnersListView
                    {...item}
                    path={`${pathname}/levels/${item.id}?programId=${programId}&programType=${programType}`}
                  />
                </Box>
              );
            })}
          </>
        ) : (
          renderEmptyState()
        )}
      </LoadingView>
    </div>
  );
};

LevelList.propTypes = {
  usersColumnTitle: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      ...LearnersListView.propTypes,
    }),
  ),
  onChangeFilters: PropTypes.func,
  filters: PropTypes.shape({
    programType: PropTypes.oneOf(Object.values(ProgramType)),
    programId: PropTypes.string,
  }),
  loading: PropTypes.bool.isRequired,
};

export default React.memo(LevelList);
