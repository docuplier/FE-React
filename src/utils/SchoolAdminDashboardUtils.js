export const facultyStatistics = (isLoadingStat, facultyStat) => {
  if (!isLoadingStat) {
    const getGenderDistributionFilterData = facultyStat?.facultyStatistics?.reduce(
      (acc, faculty) => {
        let total = faculty?.userMaleCount + faculty?.userFemaleCount || 0;

        acc?.data?.push({
          label: faculty?.name,
          count: total,
          tooltipData: [
            { key: 'Male', value: faculty?.userMaleCount },
            { key: 'Female', value: faculty?.userFemaleCount },
            { key: 'Total', value: total },
          ],
          departments: faculty?.ownDepartments,
        });
        return acc;
      },
      { data: [] },
    );

    const getCoursesPerFacultyFilterData = facultyStat?.facultyStatistics?.reduce(
      (acc, faculty) => {
        let total = faculty?.draftCourseCount + faculty?.publishedCourseCount || 0;

        acc?.data?.push({
          label: faculty?.name,
          count: total,
          tooltipData: [
            { key: 'Draft', value: faculty?.draftCourseCount },
            { key: 'Published', value: faculty?.publishedCourseCount },
            { key: 'Total', value: total },
          ],
        });
        return acc;
      },
      { data: [] },
    );

    const getStudentPerFacultyFilterData = facultyStat?.facultyStatistics?.reduce(
      (acc, student) => {
        acc?.data?.push({
          label: student?.name,
          count: student?.studentCount || 0,
          tooltipData: [{ key: 'Student', value: student?.studentCount }],
        });
        return acc;
      },

      { data: [] },
    );
    return {
      getGenderDistributionFilterData,
      getStudentPerFacultyFilterData,
      getCoursesPerFacultyFilterData,
    };
  }
  return { status: 'Loading...' };
};

export const lecturerRating = (rating) => {
  return rating?.lecturerRatings?.results?.reduce(
    (acc, lecturer) => {
      acc.ratingProps.push({
        id: lecturer?.id,
        name: `${lecturer?.firstname} ${lecturer?.lastname}`,
        value: lecturer?.avgRatings || 0,
      });
      return acc;
    },
    { ratingProps: [] },
  );
};

export const courseChartData = (courseEnrollment) => {
  return courseEnrollment?.courseEnrollments?.map((course) => {
    return {
      id: course?.id,
      label: course?.code,
      value: course?.totalEnrolled,
      faculty: course?.department?.faculty?.name || 'No faculty',
    };
  });
};

export const userStatData = (userStatistics) => {
  const CourseStatistics = [
    { label: 'Published', count: userStatistics?.courseUserStatistics?.publishedCourseCount || 0 },
    { label: 'Draft', count: userStatistics?.courseUserStatistics?.draftCourseCount || 0 },
  ];
  const userStat = userStatistics?.courseUserStatistics;

  const totalUser = {
    'School Admin': {
      active: userStat?.activeUsers?.totalSchoolAdmin || 0,
      inactive: userStat?.inactiveUsers?.totalSchoolAdmin || 0,
      total: userStat?.users?.totalSchoolAdmin || 0,
    },
    Student: {
      active: userStat?.activeUsers?.totalStudents || 0,
      inactive: userStat?.inactiveUsers?.totalStudents || 0,
      total: userStat?.users?.totalStudents || 0,
    },
    Lecturer: {
      active: userStat?.activeUsers?.totalLecturers || 0,
      inactive: userStat?.inactiveUsers?.totalLecturers || 0,
      total: userStat?.users?.totalLecturers || 0,
    },
  };

  return { CourseStatistics, totalUser };
};

/**
 * The code below is used by the csv downloader
 */

export const statDataArray = (headerArray = [], dataArray, hasTooltip) => {
  let csvData = [];
  csvData?.push(headerArray);
  //eslint-disable-next-line
  dataArray?.map((item) => {
    if (!hasTooltip) {
      return csvData?.push([item?.label ?? item?.name, item?.count ?? item?.value]);
    } else {
      item?.tooltipData?.map((tooltip) => {
        return csvData?.push([item?.label, tooltip?.key, tooltip?.value]);
      });
    }
  });
  return csvData;
};

export const userDataArray = (totalUser) => {
  let heading = ['User type', 'Active', 'Inactive', 'Total'];
  let schAdmin = [
    'School Adminstrator',
    totalUser?.['School Admin']?.active,
    totalUser?.['School Admin']?.inactive,
    totalUser?.['School Admin']?.total,
  ];
  let student = [
    'Lecturer',
    totalUser?.['Student']?.active,
    totalUser?.['Student']?.inactive,
    totalUser?.['Student']?.total,
  ];
  let lecturer = [
    'Student',
    totalUser?.['Lecturer']?.active,
    totalUser?.['Lecturer']?.inactive,
    totalUser?.['Lecturer']?.total,
  ];

  const userArray = [heading, schAdmin, student, lecturer];
  return userArray;
};
