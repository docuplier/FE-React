import React from 'react';
import { Box, Typography, Grid } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { borderRadius, colors } from '../../../Css';
import CountCard from '../CountCard';
import RadialChart from '../RadialChart';
import Drawer from './Drawer';
import { useHistory } from 'react-router';
import { PrivatePaths } from 'routes';

const InstructorCourseDrawer = ({ data, onClose }) => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Drawer open={Boolean(data)} onClose={onClose} title={data?.title} hasBorder={false}>
      <Box>
        <Typography variant="subtitle2">
          Showing total number of students taking courses outside their department in each dept.
        </Typography>
        <Box mt={12} mb={8}>
          <Grid container spacing={8}>
            <Grid item xs={12} sm={6}>
              <CountCard count={data?.expectedLearnerCount} label="Expected" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CountCard count={data?.learnerCount} label="Registered" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CountCard count={data?.totalAudited} label="Auditee" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CountCard count={data?.totalEnrolled} label="Enrollee" />
            </Grid>
          </Grid>
        </Box>
        <Grid container spacing={8}>
          <Grid item xs={12} sm={6}>
            <Box className={classes.radialBox}>
              <RadialChart
                series={data?.averageCompletionRate?.toFixed(1) || 0}
                height={160}
                subtitle="Course Completion Rate"
                sideSpacing={8}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box className={classes.radialBox}>
              <RadialChart
                series={data?.averagePassRate?.toFixed(1) || 0}
                height={160}
                subtitle="Course Pass Rate"
                sideSpacing={8}
              />
            </Box>
          </Grid>
        </Grid>
        <Link to={`${PrivatePaths.COURSES}/${data?.id}`} className={classes.viewCouseLink}>
          <Box mt={12} display="flex" justifyContent="space-between" alignItems="center">
            <Typography color="primary">View course information</Typography>
            <ArrowForwardIosIcon style={{ cursor: 'pointer', color: colors.primary }} />
          </Box>
        </Link>
      </Box>
    </Drawer>
  );
};

const useStyles = makeStyles((theme) => ({
  radialBox: {
    background: '#FAFAFA',
    borderRadius: borderRadius.default,
    height: 213,
    boxSizing: 'border-box',
  },
  viewCouseLink: {
    display: 'block',
    textDecoration: 'none',
  },
}));

export default InstructorCourseDrawer;
