import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Box, makeStyles } from '@material-ui/core';
import { useParams } from 'react-router-dom';

import BasicResourceCard from 'reusables/BasicResourceCard';
import Empty from 'reusables/Empty';
import LoadingButton from 'reusables/LoadingButton';
import LoadingView from 'reusables/LoadingView';
import { OffsetLimitBasedPagination } from 'reusables/Pagination';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import AccessControl from 'reusables/AccessControl';
import { UserRoles } from 'utils/constants';
import { PrivatePaths } from 'routes';
import { convertToSentenceCase } from 'utils/TransformationUtils';

const FacultyResourceCardList = ({
  data,
  loading,
  onOffsetChange,
  onLimitChange,
  offset,
  limit,
  onRequestAddFaculty,
}) => {
  const classes = useStyles();
  const { institutionId } = useParams();
  const faculties = data?.faculties?.results;
  const { userDetails } = useAuthenticatedUser();
  const isGlobalAdmin = userDetails?.selectedRole === UserRoles.GLOBAL_ADMIN;

  return faculties?.length ? (
    <LoadingView isLoading={loading}>
      <Grid container spacing={8}>
        {faculties?.map((faculty) => (
          <Grid item xs={4} key={faculty?.id}>
            <BasicResourceCard
              path={`${PrivatePaths.INSTITUTIONS}/${institutionId}/faculties/${faculty.id}`}
              statusChip={{
                label: faculty?.isActive ? 'Faculty is active' : 'Faculty is inactive',
                color: faculty?.isActive ? 'active' : 'inactive',
                variant: 'default',
              }}
              imageSrc={null}
              title={faculty?.name}
              description={faculty?.description}
              caption={{
                count: faculty?.departmentCount || 0,
                label: faculty?.departmentCount === 1 ? 'Department' : 'Departments',
              }}
              metaList={[
                {
                  label: 'Students',
                  count: faculty?.studentCount || 0,
                },
                {
                  label: 'Lecturers',
                  count: faculty?.lecturerCount || 0,
                },
              ]}
              creator={{
                name: `${faculty?.createdBy?.firstname} ${faculty?.createdBy?.lastname}`,
                imageSrc: `${faculty?.createdBy?.image}`,
                chip: {
                  label: `${convertToSentenceCase(faculty?.createdBy?.roles[0])}`,
                },
              }}
            />
          </Grid>
        ))}
      </Grid>
      <Box className={classes.paginationWrapper}>
        <OffsetLimitBasedPagination
          onChangeLimit={onLimitChange}
          onChangeOffset={onOffsetChange}
          total={data?.faculties?.totalCount}
          offset={offset}
          limit={limit}
          limitOptions={[9, 18, 45, 99]}
        />
      </Box>
    </LoadingView>
  ) : (
    <Empty
      title="No Faculties"
      description={
        isGlobalAdmin
          ? 'You currently have no registered faculties'
          : 'You currently have no registered faculties. Click the button to add new'
      }>
      <AccessControl allowedRoles={[UserRoles.SCHOOL_ADMIN]}>
        <Box mb={2}>
          <LoadingButton onClick={onRequestAddFaculty}>Add New</LoadingButton>
        </Box>
      </AccessControl>
    </Empty>
  );
};

const useStyles = makeStyles((theme) => ({
  paginationWrapper: {
    marginTop: theme.spacing(12),
  },
}));

FacultyResourceCardList.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      ...BasicResourceCard.propTypes,
    }),
  ),
  loading: PropTypes.bool,
  onChange: PropTypes.func,
  institutionId: PropTypes.string,
  onRequestAddFaculty: PropTypes.func,
};

export default React.memo(FacultyResourceCardList);
