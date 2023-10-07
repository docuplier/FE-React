import { memo, useEffect, useMemo, useState } from 'react';
import React from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Checkbox,
  makeStyles,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
} from '@material-ui/core';
import MaxWidthContainer from 'reusables/MaxWidthContainer';
import CourseEnrollmentGraph from 'components/Dashboard/SchoolAdmin/CourseEnrollmentGraph';
import CourseStatisticsGraph from 'components/Dashboard/SchoolAdmin/CourseStatisticsGraph';
import { UserStatisticsGraph } from 'components/Dashboard/SchoolAdmin/UserStatisticsGraph';
import LecturerRatingList from 'components/Dashboard/SchoolAdmin/LecturerRatingList';
import DistributionByGenderGraph from 'components/Dashboard/SchoolAdmin/DistributionByGenderGraph';
import FacultyStudentGraph from 'components/Dashboard/SchoolAdmin/FacultyStudentGraph';
import FacultyCoursesGraph from 'components/Dashboard/SchoolAdmin/FacultyCourseGraph';
import LecturersPerformanceDrawer from 'components/Dashboard/SchoolAdmin/LecturersPerformanceDrawer';
import GenderDistributionDrawer from 'components/Dashboard/SchoolAdmin/GenderDistributionDrawer';
import { useQuery } from '@apollo/client';
import { GET_FACULTIES_QUERY, GET_FACULTY_STATISTICS } from 'graphql/queries/institution';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import useNotification from 'reusables/NotificationBanner/useNotification';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import LoadingView from 'reusables/LoadingView';
import { GET_LECTURERS_RATING, GET_USER_STATISTICS } from 'graphql/queries/users';
import {
  GET_COURSES,
  GET_COURSE_ENROLLMENT_STAT,
  GET_FACULTY_DEVIATION,
} from 'graphql/queries/courses';
import { useHistory } from 'react-router-dom';
import { PrivatePaths } from 'routes';
import CourseEnrollmentHeader from 'components/Dashboard/SchoolAdmin/CourseEnrollmentHeader';
import {
  lecturerRating,
  courseChartData,
  userStatData,
  facultyStatistics,
  statDataArray,
  userDataArray,
} from 'utils/SchoolAdminDashboardUtils';
import Empty from 'reusables/Empty';
import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET } from 'utils/constants';
import { AutocompleteWithTag } from 'reusables/TaggerFields';
import CsvDownloadDrawer from 'components/Dashboard/SchoolAdmin/CsvDownloadDrawer';
import { ReactComponent as Export } from 'assets/svgs/export-icon.svg';
import { spaces } from '../../../Css';
import LoadingButton from 'reusables/LoadingButton';
import DeviationChart from 'components/Dashboard/SchoolAdmin/DeviationChart';
import DeviationDrawer from 'components/Dashboard/SchoolAdmin/DeviationDrawer';

const MainDashboard = () => {
  const { userDetails } = useAuthenticatedUser();
  const notification = useNotification();
  const [coursesDropdownOptions, setcoursesDropdownOptions] = useState([]);
  const [openRatingsDrawer, setOpenRatingsDrawer] = useState(false);
  const [genderDistributionDataToView, setGenderDistributionDataToView] = useState(null);
  const [facultyArray, setFacultyArray] = useState([]);
  const [changeFilter, setFilterChange] = useState(true);
  const [shouldExportRatingsData, setShouldExportRatingsData] = useState(false);
  const [coursesToSelect, setCoursesToSelect] = useState([]);
  const [searchText, setSearchText] = useState();
  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  const isSmScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [openCsvDrawer, setOpenCsvDrawer] = useState(false);
  const [dataToOpenDeviation, setDataToOpenDeviation] = useState(null);
  const [filteredFacultyId, setFilterFacultyId] = useState(null);
  const [selectedFacultyData, setSelectedFacultyData] = useState(null);

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

  const isDisable = () => {
    let isDisable = false;
    if (coursesDropdownOptions?.length >= 10) {
      isDisable = true;
    }
    return isDisable;
  };

  const { data: faculties, loading: isLoadingFaculties } = useQuery(GET_FACULTIES_QUERY, {
    variables: {
      institutionId: userDetails?.institution?.id,
      asFilter: true,
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const { data: facultyDeviation, loading: loadingDeviations } = useQuery(GET_FACULTY_DEVIATION, {
    skip: !Boolean(faculties?.faculties?.results?.length),
    variables: {
      facultyId: filteredFacultyId || faculties?.faculties?.results?.[0]?.id,
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const facultyIds = useMemo(() => {
    return (
      facultyArray?.map((faculty) => faculty?.id)?.filter((facultyId) => facultyId !== 'all') || []
    );
  }, [facultyArray]);

  const { data: facultyStat, loading: isLoadingStat } = useQuery(GET_FACULTY_STATISTICS, {
    skip: facultyIds.length === 0,
    variables: {
      facultyIds: facultyIds,
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const { loading: isLoadingRatingsForExport, data: ratingsForExport } = useQuery(
    GET_LECTURERS_RATING,
    {
      skip: facultyIds.length === 0 || !shouldExportRatingsData,
      variables: {
        facultyIds: facultyIds,
        offset: DEFAULT_PAGE_OFFSET,
        limit: 1000,
      },
      onCompleted: () => {
        setOpenCsvDrawer(true);
      },
      onError: (error) => {
        notification.error({
          message: error?.message,
        });
      },
    },
  );

  const { data: ratings, loading: isLoadingRatings } = useQuery(GET_LECTURERS_RATING, {
    skip: facultyIds.length === 0,
    variables: {
      facultyIds: facultyIds,
      offset: DEFAULT_PAGE_OFFSET,
      limit: DEFAULT_PAGE_LIMIT,
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const lecturerRatings = lecturerRating(ratings)?.ratingProps;
  const total = ratings?.lecturerRatings?.totalCount;

  const { data: userStatistics, loading: isLoadingUserStat } = useQuery(GET_USER_STATISTICS, {
    skip: facultyIds.length === 0,
    variables: {
      facultyIds: facultyIds,
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const onExportButtonClick = () => {
    ratingsForExport === undefined ? setShouldExportRatingsData(true) : setOpenCsvDrawer(true);
    handleClose();
  };
  const { CourseStatistics, totalUser } = userStatData(userStatistics);

  const courseIds = coursesDropdownOptions?.map((course) => course?.id);
  const { data: courseEnrollment, loading: isLoadingEnrollment } = useQuery(
    GET_COURSE_ENROLLMENT_STAT,
    {
      skip: courseIds?.length >= 10 || facultyIds.length === 0,
      variables: {
        facultyIds: facultyIds,
        courseIds: courseIds || [],
        asc: changeFilter === 'true' ? true : false,
      },
      onError: (error) => {
        notification.error({
          message: error?.message,
        });
      },
    },
  );

  const { loading: isLoadingCourses } = useQuery(GET_COURSES, {
    skip: !userDetails?.institution?.id,
    variables: {
      institutionId: userDetails?.institution?.id,
      search: searchText,
      limit: 20,
      truncateResults: true,
    },
    onCompleted: (data) => {
      const {
        courses: { results },
      } = data;
      if (results) {
        setCoursesToSelect(results);
      }
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const {
    getCoursesPerFacultyFilterData,
    getGenderDistributionFilterData,
    getStudentPerFacultyFilterData,
  } = facultyStatistics(isLoadingStat, facultyStat);

  let EnrollmentdataArray = courseChartData(courseEnrollment)?.map((course) => [
    course?.faculty,
    course?.label,
    course?.value,
  ]);
  EnrollmentdataArray?.unshift(['Faculty', 'Course code', 'Enrolled']);

  const studentPerFacultyDataArray = statDataArray(
    ['Faculty', 'Count'],
    getStudentPerFacultyFilterData?.data,
  );
  const getGenderDistDataArray = statDataArray(
    ['Faculty', 'Gender', 'Count'],
    getGenderDistributionFilterData?.data,
    true,
  );
  const lecturerRatingArray = statDataArray(
    ['Lecturer name, Rating'],
    lecturerRating(ratingsForExport)?.ratingProps,
  );
  const courseStatDataArray = statDataArray(['Status', 'Count'], CourseStatistics);
  const coursePerfaculty = statDataArray(
    ['Faculty', 'Gender', 'Count'],
    getCoursesPerFacultyFilterData?.data,
    true,
  );

  const totalUserData = userDataArray();

  const setCsv = {
    'Course Enrollment': EnrollmentdataArray,
    'Students per Faculty': studentPerFacultyDataArray,
    'Distribution By Gender': getGenderDistDataArray,
    'Lecturer Rating': lecturerRatingArray,
    'Course Statistics': courseStatDataArray,
    'Course Per Faculty': coursePerfaculty,
    'Total User': totalUserData,
  };

  const selectAllOption = useMemo(() => ({ name: 'Select All', id: 'all' }), []);
  const allFaculties = useMemo(() => {
    if (!isLoadingFaculties) {
      return [selectAllOption, ...faculties?.faculties?.results];
    }

    return [];
    // eslint-disable-next-line
  }, [isLoadingFaculties]);

  const addAllAvailableOptions = () => {
    setFacultyArray([selectAllOption, ...faculties?.faculties?.results]);
  };

  useEffect(() => {
    if (faculties?.faculties?.results) {
      addAllAvailableOptions();
    }
    // eslint-disable-next-line
  }, [faculties]);

  const handleAddAllFaculties = (newValue) => {
    const isSelectAllOptionActive = newValue.some((faculties) => faculties.id === 'all');
    const userAddedNewOption = newValue.length > facultyArray.length;

    if (isSelectAllOptionActive && userAddedNewOption) {
      addAllAvailableOptions();
      return;
    } else if (isSelectAllOptionActive && !userAddedNewOption) {
      setFacultyArray(newValue.filter((opt) => opt.id !== 'all'));
      return;
    }

    setFacultyArray(newValue);
  };

  const renderDownloadMenu = () => {
    return (
      <>
        <LoadingButton
          disabled={
            isLoadingFaculties ||
            isLoadingStat ||
            isLoadingUserStat ||
            isLoadingCourses ||
            isLoadingEnrollment ||
            isLoadingRatingsForExport ||
            facultyIds.length === 0
          }
          isLoading={isLoadingRatingsForExport}
          onClick={handleClick}
          aria-haspopup="true"
          variant="contained"
          color="primary"
          aria-expanded={Boolean(anchorEl) ? 'true' : undefined}>
          <Export style={{ marginRight: spaces.medium }} /> Export
        </LoadingButton>
        <Menu
          open={Boolean(anchorEl)}
          aria-labelledby="demo-positioned-button"
          anchorEl={anchorEl}
          onClose={handleClose}
          classes={{
            paper: classes.menu,
          }}>
          <MenuItem onClick={() => onExportButtonClick()}>Export as .csv</MenuItem>
        </Menu>
      </>
    );
  };

  const renderFacultyDropdown = () => {
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

    return (
      <Box mb={8} display="flex" justifyContent="space-between" width="100%">
        <Box width="88%" mr={3}>
          <AutocompleteWithTag
            scrollable={true}
            onChange={(newValue) => {
              handleAddAllFaculties(newValue);
            }}
            value={facultyArray}
            getTagLabel={(option) => option.name}
            className={classes.facultyDropdown}
            textFieldProps={{
              label: 'Faculty',
            }}
            limitTags={10}
            id="checkboxes-tags-demo"
            options={allFaculties}
            getOptionLabel={(option) => option?.name}
            renderOption={(option, { selected }) => {
              return (
                <>
                  <Checkbox
                    icon={icon}
                    color="primary"
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  <Typography> {option?.name} </Typography>
                </>
              );
            }}
          />
        </Box>
        <Box mb={12}>{renderDownloadMenu()}</Box>
      </Box>
    );
  };

  const renderLeftSection = () => {
    return (
      <Grid item xs={12} md={8}>
        <Box mb={12}>
          <Grid container spacing={8}>
            <Grid item xs={12} sm={6}>
              <LoadingView isLoading={isLoadingStat}>
                <FacultyStudentGraph
                  data={getStudentPerFacultyFilterData?.data || []}
                  chartEvents={{
                    onClick: (value) => console.log(value),
                  }}
                />
              </LoadingView>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LoadingView isLoading={isLoadingStat}>
                <FacultyCoursesGraph
                  data={getCoursesPerFacultyFilterData?.data || []}
                  chartEvents={{
                    onClick: (value) => console.log(value),
                  }}
                />
              </LoadingView>
            </Grid>
          </Grid>
        </Box>
        <Box mb={12}>
          {isSmScreen && renderRightSection()}
          <Box component={Paper} elevation={0} p={12}>
            <Grid container>
              <Grid item xs={12} sm={12}>
                <CourseEnrollmentHeader
                  onSearch={{
                    onClick: (newValue) => {
                      setcoursesDropdownOptions(newValue);
                    },
                  }}
                  inputValue={searchText}
                  onInputChange={(evt, value) => setSearchText(value)}
                  searchArray={coursesToSelect}
                  checkDisable={isDisable}
                  onChangeFilter={(e) => setFilterChange(e.target.value)}
                />
                <LoadingView isLoading={isLoadingEnrollment}>
                  {courseChartData(courseEnrollment)?.length > 0 ? (
                    <CourseEnrollmentGraph
                      height={500}
                      isLoading={!isLoadingEnrollment && !isLoadingCourses}
                      data={courseChartData(courseEnrollment)}
                      chartEvents={{
                        onClick: ({ item: data }) =>
                          data?.id &&
                          history.push(
                            `${PrivatePaths.DASHBOARD}/course-dashboard?courseId=${data?.id}`,
                          ),
                      }}
                    />
                  ) : (
                    <Empty
                      title="No data available"
                      description="Please use the dropdown above to make a new selection"
                    />
                  )}
                </LoadingView>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <DeviationChart
          faculties={faculties}
          selectedFacultyData={selectedFacultyData}
          onChangeFilter={(e) => {
            setSelectedFacultyData(e.target.value);
            setFilterFacultyId(e.target.value);
          }}
          chartEvents={{
            onClick: (value) => {
              if (value?.index === -1) return;
              setDataToOpenDeviation(value);
            },
          }}
          isLoading={loadingDeviations}
          chartData={facultyDeviation?.facultyDeviations}
        />
      </Grid>
    );
  };

  const renderRightSection = () => {
    return (
      <Grid item xs={12} md={4}>
        <Box mb={8}>
          <Grid container spacing={8}>
            <Grid item xs={12} sm={6} md={12}>
              <CourseStatisticsGraph
                isLoading={isLoadingUserStat}
                data={CourseStatistics.map((stat) => ({
                  label: stat.label,
                  count: stat.count,
                }))}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={12}>
              <Box>
                {!isLoadingUserStat && facultyIds.length > 0 ? (
                  <UserStatisticsGraph UsersStatistics={totalUser} />
                ) : (
                  <Empty title="No user statistics available" />
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Grid container spacing={8}>
          <Grid item xs={12} sm={6} md={12}>
            <Box>
              <LecturerRatingList
                isLoading={isLoadingRatings}
                ratingProps={lecturerRatings}
                hasMoreResults={total > DEFAULT_PAGE_LIMIT}
                onClickViewAll={() => setOpenRatingsDrawer(true)}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={12}>
            <Box mb={12}>
              {getGenderDistributionFilterData?.data?.length > 0 ? (
                <DistributionByGenderGraph
                  isLoading={isLoadingStat}
                  data={getGenderDistributionFilterData?.data}
                  chartEvents={{
                    onClick: ({ item }) => {
                      setGenderDistributionDataToView({
                        facultyName: item?.label,
                        departments: item?.departments?.map((department) => ({
                          name: department?.name,
                          maleCount: department?.userMaleCount,
                          femaleCount: department?.userFemaleCount,
                          total: department?.Total,
                        })),
                      });
                    },
                  }}
                />
              ) : (
                <Empty title="No user statistics available" />
              )}
            </Box>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  return (
    <MaxWidthContainer>
      <Box py={28}>
        {renderFacultyDropdown()}
        <Grid container spacing={8}>
          {renderLeftSection()}
          {!isSmScreen && renderRightSection()}
        </Grid>
        <LecturersPerformanceDrawer
          open={openRatingsDrawer}
          onClose={() => setOpenRatingsDrawer(false)}
          facultyIds={facultyIds}
        />
        <GenderDistributionDrawer
          data={genderDistributionDataToView}
          onClose={() => setGenderDistributionDataToView(null)}
        />
        <CsvDownloadDrawer
          setCsv={setCsv}
          openCsvDrawer={openCsvDrawer}
          onCloseCsvDrawer={onCloseCsvDrawer}
        />
        <DeviationDrawer
          onCloseDeviationDrawer={() => setDataToOpenDeviation(null)}
          facultyDeviationData={dataToOpenDeviation}
          facultyId={filteredFacultyId || faculties?.faculties?.results?.[0]?.id}
        />
      </Box>
    </MaxWidthContainer>
  );
};

const useStyles = makeStyles({
  facultyDropdown: {
    background: '#fff',
    width: 300,
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
});

export default memo(MainDashboard);
