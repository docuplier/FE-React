export const userOptions = [
  { name: 'Learners', id: 'Learners' },
  { name: 'Lecturers', id: 'Lecturers' },
  { name: 'School Admin', id: 'School_Admin' },
];

export const genderOptions = [
  { name: 'Male', id: 'Male' },
  { name: 'Female', id: 'Female' },
];

export const getGenderDistributionData = (data) => {
  return data?.map(({ name, userMaleCount, userFemaleCount }) => {
    const schName = name.split(' ').slice(0, 5).join(' ');
    const total = userMaleCount + userFemaleCount || 0;

    return {
      label: schName,
      count: total,
      tooltipData: [
        { key: 'Total', value: total },
        { key: 'Male', value: userMaleCount || 0 },
        { key: 'Female', value: userFemaleCount || 0 },
      ],
    };
  });
};

export const getInstitutionsData = (data, option = 'All users' || null) => {
  return data?.map(({ name, users, abbreviation, activeUsers, inactiveUsers }) => {
    const schName = abbreviation.split(' ').slice(0, 5).join(' ');
    const {
      totalLecturers: totalActiveLecturers,
      totalSchoolAdmin: totalActiveSchoolAdmin,
      totalStudents: totalActiveStudents,
    } = activeUsers || {};

    const {
      totalLecturers: totalInactiveLecturers,
      totalSchoolAdmin: totalInactiveSchoolAdmin,
      totalStudents: totalInactiveStudents,
    } = inactiveUsers || {};

    const totalActiveUsers =
      totalActiveSchoolAdmin + totalActiveStudents + totalActiveLecturers || 0;
    const totalInactiveUsers =
      totalInactiveSchoolAdmin + totalInactiveStudents + totalInactiveLecturers || 0;
    const totalUsers = totalActiveUsers + totalInactiveUsers || 0;

    if (option === 'Learners') {
      const totalStudent = totalActiveStudents + totalInactiveStudents || 0;

      return {
        name: schName,
        topLineValue: totalActiveStudents || 0,
        bottomLineValue: totalInactiveStudents || 0,
        tooltipData: [
          { key: 'Total', value: totalStudent || 0 },
          { key: 'Active', value: totalActiveStudents || 0 },
          { key: 'Inactive', value: totalInactiveStudents || 0 },
        ],
      };
    } else if (option === 'Lecturers') {
      const totalLecturers = totalActiveLecturers + totalInactiveLecturers || 0;

      return {
        name: schName,
        topLineValue: totalActiveLecturers || 0,
        bottomLineValue: totalInactiveLecturers || 0,
        tooltipData: [
          { key: 'Total', value: totalLecturers || 0 },
          { key: 'Active', value: totalActiveLecturers || 0 },
          { key: 'Inactive', value: totalInactiveLecturers || 0 },
        ],
      };
    } else if (option === 'School_Admin') {
      const totalSchoolAdmin = totalActiveSchoolAdmin + totalInactiveSchoolAdmin || 0;

      return {
        name: schName,
        topLineValue: totalActiveSchoolAdmin || 0,
        bottomLineValue: totalInactiveSchoolAdmin,
        tooltipData: [
          { key: 'Total', value: totalSchoolAdmin || 0 },
          { key: 'Active', value: totalActiveSchoolAdmin || 0 },
          { key: 'Inactive', value: totalInactiveSchoolAdmin || 0 },
        ],
      };
    } else
      return {
        name: schName,
        topLineValue: totalActiveUsers || 0,
        bottomLineValue: totalInactiveUsers || 0,
        tooltipData: [
          { key: 'Total', value: totalUsers || 0 },
          { key: 'Active', value: totalActiveUsers || 0 },
          { key: 'Inactive', value: totalInactiveUsers || 0 },
        ],
      };
  });
};

export const getEnrollmentData = (data) => {
  return data?.map((enrollment) => ({
    name: enrollment.name,
    topLineValue: enrollment.enrolmentRate,
    bottomLineValue: enrollment.completionRate,
    tooltipData: [
      { key: 'Enrollment rate', value: enrollment.enrolmentRate },
      { key: 'Completion rate', value: enrollment.completionRate },
    ],
  }));
};

export const getInstitutionsFieldOfInterest = (data) => {
  return data?.map((interest) => ({
    name: interest.name,
    data: interest.userCount,
    tooltipData: [
      { key: 'Interest', value: interest.name },
      { key: 'Learners', value: interest.userCount },
    ],
  }));
};

/**
 * the code bellow are for csv download implementation
 */

export const getSchoolStat = (data) => {
  const {
    totalFaculties,
    totalPrograms,
    totalCourses,
    totalUploadedContents,
    totalAccessedContents,
  } = data?.institutionsOverview || {};
  const facultyData = [['Total Faculties', totalFaculties]];
  const programsData = [['Total Program', totalPrograms]];
  const courseData = [['Total Courses', totalCourses]];
  const contentUploaded = [['Total Content Uploaded', totalUploadedContents]];
  const accessedContent = [['Total accessed content', totalAccessedContents]];

  return { facultyData, programsData, courseData, contentUploaded, accessedContent };
};

export const getTotalUserAndGenderDistribution = (institutionsData) => {
  let userArray = [];
  let genderArray = [];
  let numberOfUsers = [];
  institutionsData?.map((data) => {
    return userArray?.push([
      data?.name,
      data?.abbreviation,
      data?.inactiveUsers?.totalStudents,
      data?.inactiveUsers?.totalLecturers,
      data?.inactiveUsers?.totalSchoolAdmin,
      data?.activeUsers?.totalStudents,
      data?.activeUsers?.totalLecturers,
      data?.activeUsers?.totalSchoolAdmin,
      data?.users?.totalStudents,
      data?.users?.totalLecturers,
      data?.users?.totalSchoolAdmin,
    ]);
  });
  userArray?.unshift([
    'School',
    'abbreviation',
    'Inactive students',
    'Inactive lecturers',
    'Inactive School admin',
    'Active students',
    'Active lecturers',
    'Active School admin',
    'Total students',
    'Total lecturers',
    'Total School admin',
  ]);
  institutionsData?.map((data) => {
    return genderArray?.push([
      data?.name,
      data?.abbreviation,
      data?.userFemaleCount,
      data?.userMaleCount,
      data?.userMaleCount + data?.userFemaleCount,
    ]);
  });
  genderArray?.unshift(['School', 'abbreviation', 'Female count', 'Male count', 'Total']);

  institutionsData?.map((data) => {
    return numberOfUsers?.push([
      data?.name,
      data?.abbreviation,
      data?.users?.totalStudents,
      data?.users?.totalLecturers,
      data?.users?.totalSchoolAdmin,
    ]);
  });
  numberOfUsers?.unshift([
    'School',
    'abbreviation',
    'Total students',
    'Total lecturers',
    'Total School admin',
  ]);
  return { userArray, genderArray, numberOfUsers };
};

export const getEnrollmentDataArray = (enrollmentData) => {
  let enrollment = [];
  enrollmentData?.map((data) => {
    return enrollment?.push([
      data?.name,
      data?.currentSemester?.[0] ?? '---',
      data?.isActive,
      data?.enrolmentRate,
      data?.completionRate,
      data?.expired,
    ]);
  });
  enrollment?.unshift([
    'Session name',
    'Current semester',
    'Active status',
    'Enrollment rate',
    'Completion rate',
    'Expired',
  ]);
  return enrollment;
};

export const getLearnersInterestData = (learnersInterestData) => {
  let learnersInterestArray = [];
  learnersInterestData?.map((data) => {
    return learnersInterestArray?.push([data?.name, data?.userCount]);
  });
  learnersInterestArray?.unshift(['Interest field', 'Total learners']);
  return learnersInterestArray;
};
