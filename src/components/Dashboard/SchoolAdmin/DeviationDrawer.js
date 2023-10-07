import React from 'react';
import { makeStyles, Drawer, Box, Typography, Paper } from '@material-ui/core';
import { fontSizes, colors, fontWeight } from '../../../Css';
import { CancelOutlined } from '@material-ui/icons';
import { PrivatePaths } from 'routes';
import { useHistory } from 'react-router';
import { useQuery } from '@apollo/client';
import { GET_FACULTY_DEPARTMENTS_DEVIATION } from 'graphql/queries/courses';
import LoadingView from 'reusables/LoadingView';

const DeviationDrawer = ({ facultyDeviationData, facultyId, onCloseDeviationDrawer }) => {
  const classes = useStyles();
  const history = useHistory();

  const handleNavigate = (id, deviatedId, facultyName) => {
    history.push(
      `${PrivatePaths.DASHBOARD}/department-deviation-dashboard?departmentId=${id}&&facultyId=${deviatedId}&&name=${facultyName}`,
    );
  };

  const { data, loading } = useQuery(GET_FACULTY_DEPARTMENTS_DEVIATION, {
    skip: !facultyId || !facultyDeviationData?.item?.facultyId,
    variables: {
      facultyId,
      deviatedFacultyId: facultyDeviationData?.item?.facultyId,
    },
  });

  const sumtotalDeviations = data?.facultyDepartmentDeviations
    ?.map((item) => item.totalDeviations)
    .reduce((acc, current) => acc + current, 0);

  const renderDepartmentCard = () => {
    return (
      <>
        {data?.facultyDepartmentDeviations?.map(
          ({ faculty: { id: deviatedId, name: facultyName }, id, name, totalDeviations }) => (
            <Box
              py={8}
              mb={12}
              px={12}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              component={Paper}
              square
              elevetion={0}
              onClick={() => handleNavigate(id, deviatedId, facultyName)}
              style={{ cursor: 'pointer' }}
            >
              <Typography>{name}</Typography>
              <Typography> {totalDeviations}</Typography>
            </Box>
          ),
        )}
      </>
    );
  };

  return (
    <Drawer
      anchor="right"
      classes={{ root: classes.dialog }}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      open={Boolean(facultyDeviationData)}
      onClose={onCloseDeviationDrawer}
    >
      <Box display="flex" justifyContent="space-between" alignItems="top">
        <Box className={classes.header}>
          <Box pb={6}>
            <Typography className="title" color="textPrimary">
              {facultyDeviationData?.label}
            </Typography>
          </Box>
          <Typography>
            {sumtotalDeviations} Students deviated from{' '}
            <Typography
              variant="body1"
              style={{ fontWeight: fontWeight.bold }}
              color="textPrimary"
              component="span"
            >
              {facultyDeviationData?.label}
            </Typography>
          </Typography>
        </Box>
        <Box pt={8} pr={8}>
          <CancelOutlined onClick={onCloseDeviationDrawer} style={{ cursor: 'pointer' }} />
        </Box>
      </Box>
      <Box bgcolor="#F6F7F7" p={8} height="100vh">
        <Typography variant="body2" color="textPrimary" style={{ fontWeight: fontWeight.bold }}>
          Departments in {facultyDeviationData?.label}
        </Typography>
        <LoadingView isLoading={loading}>
          <Box my={12}>{renderDepartmentCard()}</Box>
        </LoadingView>
      </Box>
    </Drawer>
  );
};

const useStyles = makeStyles((theme) => ({
  header: {
    background: colors.white,
    padding: theme.spacing(8),
    width: '100%',
    top: 0,
    left: 0,
    boxSizing: 'border-box',
    boxShadow: `inset 0px -1px 0px #E7E7ED`,
    '& .title': {
      margin: 0,
      fontWeight: fontWeight.bold,
      wordWrap: 'break-word',
      fontSize: fontSizes.xlarge,
    },
  },
  dialog: {
    width: 500,

    [theme.breakpoints.down('xs')]: {
      maxWidth: '95vw',
    },
  },
}));

export default DeviationDrawer;
