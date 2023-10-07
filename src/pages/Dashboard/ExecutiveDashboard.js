import React, { memo, useState, useMemo, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  makeStyles,
  Grid,
  Checkbox,
  Paper,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
} from '@material-ui/core';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { Autocomplete } from '@material-ui/lab';
import { useLazyQuery, useQuery } from '@apollo/client';

import NavigationBar from 'reusables/NavigationBar';
import MaxWidthContainer from 'reusables/MaxWidthContainer';
import { colors, fontSizes, fontWeight, spaces } from '../../Css';
import DonutChart from 'reusables/DonutChart';
import LoadingView from 'reusables/LoadingView';
import CountCard from 'components/Dashboard/CountCard';
import CourseEnrollmentTrend from 'components/Dashboard/ExecutiveDashboard/CourseEnrollmentTrend';
import ActivityStatus from 'components/Dashboard/ExecutiveDashboard/ActivityStatus';
import LearnersInterest from 'components/Dashboard/ExecutiveDashboard/LearnersInterest';
import UserDetails from 'components/Dashboard/UserDetails';
import UpsertEnrollmentFilterDrawer from 'components/Dashboard/ExecutiveDashboard/UpsertEnrollmentFilterDrawer';
import CsvDownloadDrawer from 'components/Dashboard/ExecutiveDashboard/CsvDowloadDrawer';
import { ReactComponent as Export } from 'assets/svgs/ex-icon.svg';

import {
  userOptions,
  genderOptions,
  getGenderDistributionData,
  getInstitutionsData,
  getEnrollmentData,
  getInstitutionsFieldOfInterest,
  getSchoolStat,
  getTotalUserAndGenderDistribution,
  getEnrollmentDataArray,
  getLearnersInterestData,
} from 'utils/executiveDashboardUtils';
import { GET_INSTITUTIONS } from 'graphql/queries/institution';
import {
  GET_INSTITUTIONS_OVERVIEW,
  GET_INSTITUTIONS_ENROLLMENT_TREND,
  GET_INSTITUTIONS_FIELD_OF_INTEREST,
} from 'graphql/queries/dashboard';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import useNotification from 'reusables/NotificationBanner/useNotification';
import Empty from 'reusables/Empty';
import GenderAnalysis from 'components/Dashboard/ExecutiveDashboard/GenderAnalysis';
import LoadingButton from 'reusables/LoadingButton';
import { UserRoles } from 'utils/constants';

const visualizationType = {
  LEARNER: 'LEARNERS_INTEREST',
  STUDENT: 'STUDENT',
  ENROLLMENT_TREND: 'COURSE_ENROLLMENT_TREND',
  ACTIVITY_STATUS: 'USER_DISTRIBUTION',
};

const ExecutiveDashboard = () => {
  const classes = useStyles();
  const { userDetails } = useAuthenticatedUser();
  const notification = useNotification();
  const [schoolArray, setSchoolArray] = useState([]);
  const [selectedUserOption, setSelectedUserOption] = useState(null);
  const [selectedGenderOption, setSelectedGenderOption] = useState(null);
  const [isUpsertCourseFilterVisible, setIsUpsertCourseFilterVisible] = useState(false);
  const [courseEnrollmentFilterParams, setCourseEnrollmentFilterParams] = useState(null);

  const theme = useTheme();
  const { visualizations } = userDetails;
  const isSmScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [openCsvDrawer, setOpenCsvDrawer] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onCloseCsvDrawer = () => {
    handleClose();
    return setOpenCsvDrawer(false);
  };

  const {
    data: schData,
    loading: isLoadingInstitutions,
    refetch: refetchSchools,
  } = useQuery(GET_INSTITUTIONS, {
    variables: {
      institutionId: [userDetails?.institution?.id],
      showUserStats: true,
    },
  });

  const institutionIds = schoolArray?.map(({ id }) => id);

  const empty = {
    data: {
      institutionsOverview: {
        activeUsers: { totalStudents: 0, totalLecturers: 0, totalSchoolAdmin: 0 },
        inactiveUsers: { totalStudents: 0, totalLecturers: 0, totalSchoolAdmin: 0 },
        totalAccessedContents: 0,
        totalCourses: 0,
        totalFaculties: 0,
        totalPrograms: 0,
        totalUploadedContents: 0,
        users: { totalStudents: 0, totalLecturers: 0, totalSchoolAdmin: 0 },
        totalLecturers: 0,
        totalSchoolAdmin: 0,
        totalStudents: 0,
      },
    },
  };
  const [fectchInstitutionsOverview, { data, loading }] = useLazyQuery(GET_INSTITUTIONS_OVERVIEW, {
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  useEffect(() => {
    fectchInstitutionsOverview({
      skip: institutionIds?.length === 0,
      variables: {
        institutionIds,
      },
    });
    //eslint-disable-next-line
  }, [schoolArray]);

  const {
    data: enrollments,
    loading: isLoadingEnrollments,
    refetch: refetchEnrollments,
  } = useQuery(GET_INSTITUTIONS_ENROLLMENT_TREND, {
    variables: {
      institutionId: [userDetails?.institution?.id],
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const { data: learnersInterest, loading: isLoadingInterests } = useQuery(
    GET_INSTITUTIONS_FIELD_OF_INTEREST,
    {
      skip: !institutionIds,
      variables: {
        institutionIds,
      },
      onError: (error) => {
        notification.error({
          message: error?.message,
        });
      },
    },
  );

  const enrollmentData = enrollments?.institutionsEnrolmentTrend;
  const institutionsData = schData?.institutions?.results;
  const learnersInterestData =
    schoolArray.length === 0 ? [] : learnersInterest?.institutionsFieldOfInterests;

  const selectAllOption = useMemo(() => ({ name: 'Select first 10 schools', id: 'all' }), []);

  const addFirstTenAvailableOptions = () => {
    setSchoolArray([...institutionsData.slice(0, 10)]);
  };

  useEffect(() => {
    if (institutionsData) {
      addFirstTenAvailableOptions();
    }
    // eslint-disable-next-line
  }, [schData]);

  const allSchools = useMemo(() => {
    if (!isLoadingInstitutions) {
      if (schoolArray?.length < 10) {
        return [...institutionsData];
      }
      return [selectAllOption, ...institutionsData];
    }
    return [];
    // eslint-disable-next-line
  }, [isLoadingInstitutions]);

  const handleAddAllSchools = (newValue) => {
    const isSelectAllOptionActive = newValue.some((sch) => sch.id === 'all');
    const userAddedNewOption = newValue.length > schoolArray.length;

    if (isSelectAllOptionActive && userAddedNewOption) {
      addFirstTenAvailableOptions();
      return;
    } else if (isSelectAllOptionActive && !userAddedNewOption) {
      setSchoolArray(newValue.filter((sch) => sch.id !== 'all'));
      return;
    }

    setSchoolArray(newValue);
  };

  const filteredEnrollmentData = () => {
    if (!courseEnrollmentFilterParams?.length) {
      return enrollmentData;
    }

    const filterKeys = courseEnrollmentFilterParams?.map(({ name }) => name);

    return enrollmentData?.filter(({ name }) => {
      return filterKeys.indexOf(name) > -1;
    });
  };

  const showVisualization = (chartName) => {
    if (userDetails.selectedRole !== UserRoles.GLOBAL_ADMIN) {
      return visualizations?.includes(chartName);
    }
    return true;
  };

  const showStudentVisualization = () => {
    return (
      showVisualization(visualizationType.LEARNER) || showVisualization(visualizationType.STUDENT)
    );
  };

  const renderDownloadMenu = () => {
    return (
      <>
        <LoadingButton
          disabled={
            isLoadingInterests ||
            isLoadingEnrollments ||
            isLoadingInstitutions ||
            schoolArray.length === 0
          }
          onClick={handleClick}
          aria-haspopup="true"
          variant="contained"
          color="primary"
          aria-expanded={Boolean(anchorEl) ? 'true' : undefined}>
          <Export style={{ marginRight: spaces.medium }} />
          Export
        </LoadingButton>
        <Menu
          open={Boolean(anchorEl)}
          aria-labelledby="demo-positioned-button"
          anchorEl={anchorEl}
          onClose={handleClose}
          classes={{
            paper: classes.menu,
          }}>
          <MenuItem onClick={() => setOpenCsvDrawer(true)}>Export as .csv</MenuItem>
        </Menu>
      </>
    );
  };

  const renderSchoolDropdown = () => {
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

    return (
      <Box component={Paper} square elevation={0} mt={14} mb={14}>
        <Autocomplete
          multiple
          onChange={(event, newValue) => {
            handleAddAllSchools(newValue);
          }}
          value={schoolArray}
          className={classes.schoolDropdown}
          limitTags={10}
          id="checkboxes-tags-demo"
          options={allSchools}
          disableCloseOnSelect
          disabled={isLoadingInstitutions}
          ListboxComponent="p"
          getOptionLabel={(sch) => sch?.name.split(' ').slice(0, 5).join(' ')}
          renderOption={(sch, { selected }) => {
            if (sch?.name === 'Select first 10 schools') {
              return (
                <Box my={4}>
                  <Typography> {sch?.name.split(' ').slice(0, 5).join(' ')} </Typography>
                </Box>
              );
            } else {
              return (
                <>
                  <Checkbox
                    icon={icon}
                    color="primary"
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  <Typography> {sch?.name.split(' ').slice(0, 5).join(' ')} </Typography>
                </>
              );
            }
          }}
          renderInput={(params) => (
            <TextField {...params} fullWidth type="search" variant="outlined" label="School" />
          )}
        />
      </Box>
    );
  };

  const renderCountCards = () => {
    const {
      totalFaculties,
      totalPrograms,
      totalCourses,
      // totalUploadedContents,
      // totalAccessedContents,
    } = schoolArray.length === 0 ? empty.data : data?.institutionsOverview || {};

    return (
      <>
        <Box display="flex" justifyContent="space-between" flexWrap="wrap">
          <Box mb={12}>
            <CountCard count={totalFaculties || 0} label={'Number of Faculties'} mode={'light'} />
          </Box>
          <Box mb={12}>
            <CountCard count={totalPrograms || 0} label={'Number of Programs'} mode={'light'} />
          </Box>
          <Box mb={12}>
            <CountCard count={totalCourses || 0} label={'Number of Courses'} mode={'light'} />
          </Box>
        </Box>
        {/* <Box display="flex" justifyContent="space-between" flexWrap="wrap">
          <Box mb={12}>
            <CountCard
              count={totalUploadedContents}
              label={'Uploaded Contents'}
              mode={'light'}
              cardWidth={(isBigScreen || !isBigScreen) && 320}
            />
          </Box>
          <Box mb={12}>
            <CountCard
              count={totalAccessedContents}
              label={'Content Accessed'}
              mode={'light'}
              cardWidth={(isBigScreen || !isBigScreen) && 320}
            />
          </Box>
        </Box> */}
      </>
    );
  };

  const renderGenderAnalysisContent = () => {
    return (
      <Box>
        <Box mb={12} display="flex" justifyContent="flex-end">
          {renderDownloadMenu()}
        </Box>
        <GenderAnalysis
          isLoading={isLoadingInstitutions}
          inputLabel={'Filter by gender'}
          value={selectedGenderOption}
          options={genderOptions}
          defaultText={'All'}
          chartData={getGenderDistributionData(schoolArray, selectedGenderOption)}
          disabled={
            !getGenderDistributionData(schoolArray, selectedGenderOption) || isLoadingInstitutions
          }
          onClickFilter={(evt) => {
            setSelectedGenderOption(evt.target.value);
            refetchSchools?.();
          }}
        />
      </Box>
    );
  };

  const { facultyData, programsData, courseData, contentUploaded, accessedContent } =
    getSchoolStat(data);
  const { userArray, genderArray, numberOfUsers } =
    getTotalUserAndGenderDistribution(institutionsData);
  const enrollment = getEnrollmentDataArray(enrollmentData);
  const learnersInterestArray = getLearnersInterestData(learnersInterestData);

  const setCsv = {
    'Number of Faculties': facultyData,
    'Number of Programs': programsData,
    'Number of Courses': courseData,
    'Uploaded Contents ': contentUploaded,
    'Content Accessed': accessedContent,
    'Gender Analysis': genderArray,
    'User Distribution': userArray,
    'Number of Users': numberOfUsers,
    'Learners Interest': learnersInterestArray,
    'Course Enrollment Trend': enrollment,
  };

  const renderNumberOfUsersContent = () => {
    const {
      totalLecturers: totalActiveLecturers,
      totalSchoolAdmin: totalActiveSchoolAdmin,
      totalStudents: totalActiveStudents,
    } = schoolArray.length === 0 ? empty.data : data?.institutionsOverview?.activeUsers || {};

    const {
      totalLecturers: totalInactiveLecturers,
      totalSchoolAdmin: totalInactiveSchoolAdmin,
      totalStudents: totalInactiveStudents,
    } = schoolArray.length === 0 ? empty.data : data?.institutionsOverview?.inactiveUsers || {};

    const { totalLecturers, totalSchoolAdmin, totalStudents } =
      schoolArray.length === 0 ? empty.data : data?.institutionsOverview?.users || {};

    const activeUsers = totalActiveStudents + totalActiveSchoolAdmin + totalActiveLecturers || 0;
    const inactiveUsers =
      totalInactiveLecturers + totalInactiveSchoolAdmin + totalInactiveStudents || 0;

    return (
      <Box component={Paper} elevation={0} p={12}>
        <Box className={classes.dChart}>
          <Typography
            color="textPrimary"
            className={classes.title}
            style={{ fontSize: fontSizes.xlarge }}>
            Number of Users
          </Typography>
        </Box>
        <Box>
          <LoadingView isLoading={loading}>
            {!data?.institutionsOverview ? (
              <Empty title="No user statistics available" />
            ) : (
              <>
                <DonutChart
                  data={[activeUsers, inactiveUsers]}
                  donutColors={['#0050C8', '#F1F2F6']}
                  chartLabel={['Active', 'Inactive']}
                />
                <Box display="flex" justifyContent="space-evenly" alignItems="center">
                  <Box alignItems="center" display="inline-flex">
                    <span className={classes.indicator} style={{ background: colors.primary }} />
                    <Typography color="textSecondary" variant="caption" className="learners-count">
                      Active
                    </Typography>
                  </Box>
                  <Box alignItems="center" display="inline-flex">
                    <span className={classes.indicator} style={{ background: '#F1F2F6' }} />
                    <Typography color="textSecondary" variant="caption" className="learners-count">
                      Inactive
                    </Typography>
                  </Box>
                </Box>
                <UserDetails
                  userDetails={[
                    {
                      title: 'Lecturers',
                      totalCount: totalLecturers || 0,
                      activeCount: totalActiveLecturers || 0,
                      inactiveCount: totalInactiveLecturers || 0,
                    },
                    {
                      title: 'Students',
                      totalCount: totalStudents || 0,
                      activeCount: totalActiveStudents || 0,
                      inactiveCount: totalInactiveStudents || 0,
                    },
                    {
                      title: 'School Admin',
                      totalCount: totalSchoolAdmin || 0,
                      activeCount: totalActiveSchoolAdmin || 0,
                      inactiveCount: totalInactiveSchoolAdmin || 0,
                    },
                  ]}
                />
              </>
            )}
          </LoadingView>
        </Box>
      </Box>
    );
  };

  return (
    <div className={classes.wrapper}>
      <NavigationBar />
      <MaxWidthContainer>
        <Box>
          <Grid container spacing={8}>
            <Grid item xs={12} md={8}>
              {renderSchoolDropdown()}
              {renderCountCards()}
              {isSmScreen && (
                <Box mb={12}>
                  <Grid container spacing={8}>
                    <Grid item xs={12} sm={6}>
                      {renderGenderAnalysisContent()}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      {renderNumberOfUsersContent()}
                    </Grid>
                  </Grid>
                </Box>
              )}
              {showVisualization(visualizationType.ACTIVITY_STATUS) && (
                <ActivityStatus
                  options={userOptions}
                  onClickFilter={(evt) => {
                    setSelectedUserOption(evt.target.value);
                    refetchSchools?.();
                  }}
                  defaultText={'All users'}
                  inputLabel={'Filter by user'}
                  value={selectedUserOption}
                  disabled={isLoadingInstitutions}
                  chartData={getInstitutionsData?.(schoolArray, selectedUserOption)}
                  isLoading={isLoadingInstitutions}
                />
              )}
              <Box my={!showStudentVisualization() ? 12 : 0}>
                {showStudentVisualization() && (
                  <Box mt={14} mb={14}>
                    <LearnersInterest
                      chartData={getInstitutionsFieldOfInterest?.(learnersInterestData)}
                      isLoading={isLoadingInterests}
                    />
                  </Box>
                )}
              </Box>
              {showVisualization(visualizationType.ENROLLMENT_TREND) && (
                <Box mb={14}>
                  <CourseEnrollmentTrend
                    onClickFilter={() => setIsUpsertCourseFilterVisible(true)}
                    chartData={getEnrollmentData?.(filteredEnrollmentData())}
                    disabled={isLoadingEnrollments}
                    isLoading={isLoadingEnrollments}
                  />
                </Box>
              )}
            </Grid>
            {!isSmScreen && (
              <Grid item xs={4}>
                <Box mt={52} mb={14}>
                  {renderGenderAnalysisContent()}
                </Box>
                {renderNumberOfUsersContent()}
              </Grid>
            )}
          </Grid>
        </Box>
      </MaxWidthContainer>
      <UpsertEnrollmentFilterDrawer
        open={isUpsertCourseFilterVisible}
        onClose={() => setIsUpsertCourseFilterVisible(false)}
        onFilter={(filterParams) => {
          setCourseEnrollmentFilterParams?.(filterParams);
          refetchEnrollments?.();
        }}
      />
      <CsvDownloadDrawer
        setCsv={setCsv}
        openCsvDrawer={openCsvDrawer}
        onCloseCsvDrawer={onCloseCsvDrawer}
      />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  wrapper: {
    background: colors.background,
  },
  title: {
    fontWeight: fontWeight.bold,
    color: colors.textAlternative,
  },
  indicator: {
    width: 14,
    height: 14,
    marginRight: theme.spacing(4),
    borderRadius: 4,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    background: colors.white,
  },
  schoolDropdown: {
    minWidth: 300,
    '& fieldset.MuiOutlinedInput-notchedOutline': {
      border: 0,
    },
    '& .MuiInputLabel-formControl': {
      top: 5,
    },
  },
  menu: {
    marginTop: 55,
  },
}));

export default memo(ExecutiveDashboard);
