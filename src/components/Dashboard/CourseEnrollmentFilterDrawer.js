import { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { MenuItem, TextField, Box } from '@material-ui/core';

import Drawer from 'reusables/Drawer';
import { useQuery } from '@apollo/client';
import { GET_PROGRAMS_QUERY } from 'graphql/queries/institution';
import { useNotification } from 'reusables/NotificationBanner';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import { DEFAULT_PAGE_OFFSET } from 'utils/constants';

const CourseEnrollmentFilterDrawer = ({ open, onClose, onFilter, programId }) => {
  const notification = useNotification();
  const { userDetails } = useAuthenticatedUser();
  const [filterParams, setFilterParams] = useState({
    programId: undefined,
    programName: undefined,
  });

  const { data: programsData } = useQuery(GET_PROGRAMS_QUERY, {
    variables: {
      institutionId: userDetails?.institution?.id,
      offset: DEFAULT_PAGE_OFFSET,
      limit: 20,
      asFilter: true,
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });
  const programs = programsData?.programs?.results || [];

  useEffect(() => {
    if (open && programId) {
      handleChangeFilterParams({ programId });
    }
  }, [open, programId]);

  const getProgramName = (programId) => {
    return programs?.find((program) => program.id === programId)?.name || '';
  };

  const handleChangeFilterParams = (changeset) => {
    setFilterParams((prevState) => ({
      ...prevState,
      ...changeset,
    }));
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Course Enrollment Filter"
      okText="Save"
      onOk={() => {
        onFilter?.(filterParams);
        onClose();
      }}>
      <Box mb={12}>
        <TextField
          select
          label="Program"
          name="program"
          value={filterParams.programId}
          placeholder="Select a program"
          onChange={(evt) =>
            handleChangeFilterParams({
              programId: evt.target.value,
              programName: getProgramName(evt.target.value),
            })
          }
          variant="outlined"
          fullWidth>
          {programs.map((program) => (
            <MenuItem key={program.id} value={program.id}>
              {program.name}
            </MenuItem>
          ))}
        </TextField>
      </Box>
    </Drawer>
  );
};

CourseEnrollmentFilterDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onFilter: PropTypes.func.isRequired,
  programId: PropTypes.string,
};

export default memo(CourseEnrollmentFilterDrawer);
