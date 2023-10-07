import { memo, useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  makeStyles,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  CircularProgress,
  InputAdornment,
} from '@material-ui/core';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

import Empty from 'reusables/Empty';
import LoadingView from 'reusables/LoadingView';
import { colors, fontSizes } from '../../../Css';
import Drawer from 'reusables/Drawer';
import { GET_INSTITUTIONS } from 'graphql/queries/institution';
import { GET_SESSIONS } from 'graphql/queries/dashboard';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import useNotification from 'reusables/NotificationBanner/useNotification';
import { GET_PROGRAMS_QUERY } from 'graphql/queries/institution';

const UpsertEnrollmentFilterDrawer = ({ open, onClose, checked, onFilter }) => {
  const classes = useStyles();
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [filterParams, setFilterParams] = useState([]);

  const { userDetails } = useAuthenticatedUser();
  const notification = useNotification();

  const {
    data,
    loading,
    refetch: refetchSchools,
  } = useQuery(GET_INSTITUTIONS, {
    variables: {
      institutionId: [userDetails?.institution?.id || ''],
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const {
    data: programsData,
    loading: loadingPrograms,
    refetch: refetchPrograms,
  } = useQuery(GET_PROGRAMS_QUERY, {
    skip: !selectedSchool,
    variables: {
      institutionId: selectedSchool || '',
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const {
    data: sessions,
    loading: isLoadingSessions,
    refetch,
  } = useQuery(GET_SESSIONS, {
    skip: !selectedProgram,
    variables: {
      institutionId: selectedSchool || '',
      programId: selectedProgram || '',
    },
  });

  const institutions = data?.institutions?.results || [];
  const programs = programsData?.programs?.results || [];

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const handleCloseDrawer = () => {
    onClose();
  };

  useEffect(() => {
    if (open) {
      refetchSchools?.();
    }
  }, [open, refetchSchools]);

  const renderSchoolDropdown = () => {
    return (
      <Box mt={8} mb={8}>
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel id="select-label">School</InputLabel>
          <Select
            fullWidth
            disabled={!institutions?.length || loading}
            labelId="select-label"
            variant="outlined"
            name="session"
            value={selectedSchool || ''}
            endAdornment={
              !!loading && (
                <InputAdornment position="end" className={classes.selectAdornment}>
                  <CircularProgress color="primary" size={25} />
                </InputAdornment>
              )
            }
            onChange={(evt) => {
              setSelectedSchool(evt.target.value);
              setSelectedProgram('');
              refetchPrograms?.();
            }}>
            {institutions?.map(({ name, id }) => {
              return (
                <MenuItem key={id} value={id}>
                  {name.split(' ').slice(0, 5).join(' ')}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Box>
    );
  };

  const renderProgramDropdown = () => {
    return (
      <Box mt={8} mb={8}>
        <FormControl variant="outlined" className={classes.formControl}>
          <InputLabel id="select-label">Program</InputLabel>
          <Select
            fullWidth
            disabled={!selectedSchool || !programs?.length || !!loadingPrograms}
            labelId="select-label"
            variant="outlined"
            name="session"
            value={selectedProgram || ''}
            endAdornment={
              !!loadingPrograms && (
                <InputAdornment position="end" className={classes.selectAdornment}>
                  <CircularProgress color="primary" size={25} />
                </InputAdornment>
              )
            }
            onChange={(evt) => {
              setSelectedProgram(evt.target.value);
              refetch?.();
            }}>
            {programs?.map(({ name, id }) => {
              return (
                <MenuItem key={id} value={id}>
                  {name}
                </MenuItem>
              );
            })}
          </Select>
          {!selectedSchool && !loadingPrograms && (
            <FormHelperText style={{ background: '#fafafa' }}>
              Select a school to enable this field
            </FormHelperText>
          )}
        </FormControl>
      </Box>
    );
  };

  const handleChange = (evt) => {
    setFilterParams([
      ...filterParams,
      {
        name: evt.target.name,
      },
    ]);
  };

  const renderCheckboxOptions = () => {
    return (
      <Box mt={14} mb={14}>
        <LoadingView isLoading={isLoadingSessions}>
          {sessions?.sessions?.results?.length ? (
            <FormGroup column>
              {sessions?.sessions?.results?.map((session, i) => {
                return (
                  <Box mb={8}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          key={session?.id}
                          value={session?.institution?.id}
                          icon={icon}
                          color="primary"
                          name={session?.name}
                          onChange={handleChange}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={checked}
                        />
                      }
                      label={session?.name}
                    />
                  </Box>
                );
              })}
            </FormGroup>
          ) : (
            <Empty title={'No academic session found'} />
          )}
        </LoadingView>
      </Box>
    );
  };

  const renderTitle = () => (
    <Typography style={{ fontSize: fontSizes.xlarge }}>
      <strong>Course Enrollment Filter</strong>
    </Typography>
  );

  return (
    open && (
      <Drawer
        open={open}
        onClose={handleCloseDrawer}
        className={classes.drawer}
        containerWidth={375}
        okText="Ok"
        onOk={() => {
          onFilter?.(filterParams);
          onClose();
        }}
        title={renderTitle()}>
        <Box>
          {renderSchoolDropdown()}
          {renderProgramDropdown()}
          {renderCheckboxOptions()}
        </Box>
      </Drawer>
    )
  );
};

const useStyles = makeStyles((theme) => ({
  drawer: {
    '& .MuiDrawer-paper ': {
      overflowY: 'hidden',
      width: 375,
    },
  },
  selectAdornment: {
    marginRight: theme.spacing(-4),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 325,
    background: colors.white,
  },
}));

UpsertEnrollmentFilterDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  checked: PropTypes.bool,
  onCompletedCallback: PropTypes.func,
  onFilter: PropTypes.func,
};

export default memo(UpsertEnrollmentFilterDrawer);
