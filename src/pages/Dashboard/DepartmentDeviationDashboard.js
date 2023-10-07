import { memo } from 'react';
import { useLocation } from 'react-router';
import { useQuery } from '@apollo/client';
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Select,
  MenuItem,
  Divider,
  Grid,
  makeStyles,
} from '@material-ui/core';

import AssignmentDetailLayout from 'Layout/AssignmentDetailLayout';
import { PrivatePaths } from 'routes';
import MaxWidthContainer from 'reusables/MaxWidthContainer';
import { borderRadius, fontWeight, colors } from '../../Css';
import GraduateIcon from 'assets/svgs/graduate.svg';
import LoadingView from 'reusables/LoadingView';
import NavigationBar from 'reusables/NavigationBar';
import { GET_DEPARTMENTS_QUERY } from 'graphql/queries/institution';
import useNotification from 'reusables/NotificationBanner/useNotification';
import { GET_DEPARTMENT_LEVEL_DEVIATION } from 'graphql/queries/courses';

const DepartmentDeviationDashboard = () => {
  const classes = useStyles();
  const notification = useNotification();
  const params = new URLSearchParams(useLocation().search);
  const facultyId = params.get('facultyId');
  const departmentId = params.get('departmentId');
  const facultyName = params.get('name');
  const [filteredDeptId, setFilteredDeptId] = useState(departmentId);

  const { data: departmentsData } = useQuery(GET_DEPARTMENTS_QUERY, {
    onError,
    skip: !facultyId,
    variables: {
      facultyId,
    },
  });

  function onError(error) {
    notification.error({
      message: 'Error!',
      description: error?.message,
    });
  }
  const departments = departmentsData?.departments?.results;

  const { data: levelData, loading } = useQuery(GET_DEPARTMENT_LEVEL_DEVIATION, {
    skip: !facultyId,
    variables: {
      facultyId,
      deviatedDepartmentId: filteredDeptId,
    },
    onError,
  });
  const levelObject = levelData?.facultyDepartmentLevelDeviations;
  const numberOfDeviations = levelObject
    ?.map((dev) => dev?.totalDeviations)
    ?.reduce((acc, current) => acc + current, 0);

  const renderHeader = () => {
    return (
      <Box component={Paper} elevation={0} py={8}>
        <MaxWidthContainer>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex">
              <Typography
                color="textPrimary"
                variant="body1"
                style={{ fontWeight: fontWeight.bold }}>
                {facultyName}
              </Typography>
              <Box ml={4}>
                <Select
                  placeholder="Department"
                  name="department"
                  onChange={(e) => setFilteredDeptId(e.target.value)}
                  className={classes.departmentDropdown}>
                  {departments?.map(({ id, name }) => (
                    <MenuItem value={id}>{name}</MenuItem>
                  ))}
                </Select>
              </Box>
            </Box>
            <Box>
              <Typography
                color="textPrimary"
                component="span"
                variant="caption"
                style={{ fontWeight: fontWeight.bold }}>
                No of deviation:
              </Typography>
              <Typography component="span" variant="caption" style={{ marginLeft: 5 }}>
                {numberOfDeviations}
              </Typography>
            </Box>
          </Box>
        </MaxWidthContainer>
      </Box>
    );
  };

  const renderIcon = () => {
    return (
      <Box mr={4} bgcolor="#F1F2F6" p={5} borderRadius={borderRadius.full}>
        <img src={GraduateIcon} alt="icon" />
      </Box>
    );
  };

  const renderStat = ({ name, count }) => {
    return (
      <Box>
        <Typography color="textPrimary" variant="h3" style={{ fontWeight: fontWeight.bold }}>
          {count}
        </Typography>
        <Box mt={4}>
          <Typography variant="body2">{name}</Typography>
        </Box>
      </Box>
    );
  };

  const renderDeviationCard = () => {
    return (
      <Grid container spacing={8}>
        {levelObject?.map(({ id, name, usersCount, totalDeviations }) => (
          <Grid item xs={12} sm={6} md={4}>
            <Box key={id} component={Paper} elevation={0} p={12} className={classes.deviationCard}>
              <Box display="flex" alignItems="center">
                {renderIcon()}
                <Typography
                  color="textPrimary"
                  component="h6"
                  variant="body1"
                  style={{ fontWeight: fontWeight.bold }}>
                  {name}
                </Typography>
              </Box>
              <Box mt={12} display="flex" justifyContent="space-between" alignItems="center">
                {renderStat({ name: 'No. of Student', count: usersCount })}
                <Divider orientation="vertical" className="divider" />
                {renderStat({ name: 'Student Deviation', count: totalDeviations })}
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderDeviationList = () => {
    return (
      <MaxWidthContainer>
        <LoadingView isLoading={loading}>
          <Box my={20}>{renderDeviationCard()}</Box>
        </LoadingView>
      </MaxWidthContainer>
    );
  };

  return (
    <>
      <NavigationBar />
      <AssignmentDetailLayout
        isLoading={false}
        withMaxWidth={false}
        links={[{ title: 'Home', to: PrivatePaths.DASHBOARD }]}>
        {renderHeader()}
        <LoadingView isLoading={false}>{renderDeviationList()}</LoadingView>
      </AssignmentDetailLayout>
    </>
  );
};

const useStyles = makeStyles({
  deviationCard: {
    '& .divider': {
      height: 70,
      backgroundColor: colors.secondaryLightGrey,
    },
  },
  departmentDropdown: {
    minWidth: 200,
    '&.MuiInput-underline:before': {
      borderBottom: `1px dashed rgba(0, 0, 0, 0.42)`,
    },
  },
});

export default memo(DepartmentDeviationDashboard);
