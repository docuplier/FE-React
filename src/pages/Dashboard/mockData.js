export const UsersStatistics = {
  schoolAdmin: {
    active: 10,
    inactive: 15,
    total: 25,
  },
  student: {
    active: 15,
    inactive: 20,
    total: 35,
  },
  lecturers: {
    active: 8,
    inactive: 13,
    total: 21,
  },
};

export const CourseStatistics = [
  { label: 'Published', count: 1000 },
  { label: 'draft', count: 2500 },
];

export const barCharData = [
  {
    label: 'Registered',
    value: 50,
    faculty: 'Faculty of thearter Art and music of the natures art',
  },
  { label: 'Auditee', value: 100, faculty: 'Agric' },
  { label: 'Enrolee', value: 500, faculty: 'Life Science' },
  {
    label: 'Registered',
    value: 50,
    faculty: 'Faculty of thearter Art and music of the natures art',
  },
  { label: 'Auditee', value: 70, faculty: 'Agric' },
  { label: 'Enrolee', value: 20, faculty: 'Life Science' },
  {
    label: 'Registered',
    value: 50,
    faculty: 'Faculty of thearter Art and music of the natures art',
  },
  { label: 'Auditee', value: 90, faculty: 'Agric' },
  { label: 'Enrolee', value: 400, faculty: 'Life Science' },
  {
    label: 'Registered',
    value: 50,
    faculty: 'Faculty of thearter Art and music of the natures art',
  },
  { label: 'Auditee', value: 380, faculty: 'Agric' },
  { label: 'Enrolee', value: 90, faculty: 'Life Science' },
];

export const pieChartData = [
  {
    label: 'Faculty of Surveying and Geo-informatics science',
    count: 6,
    tooltipData: [
      { key: 'Inactive', value: 10 },
      { key: 'active', value: 15 },
      { key: 'Total', value: 25 },
    ],
  },
  {
    label: 'Faculty of Business Administration',
    count: 24,
    tooltipData: [
      { key: 'draft', value: 20 },
      { key: 'pending', value: 25 },
      { key: 'Total', value: 25 },
    ],
  },
  {
    label: 'Faculty of Enterprise Creation Management',
    count: 30,
    tooltipData: [
      { key: 'draft', value: 20 },
      { key: 'pending', value: 25 },
      { key: 'Total', value: 25 },
    ],
  },
  {
    label: 'Faculty of Agricultural Science',
    count: 30,
    tooltipData: [
      { key: 'draft', value: 20 },
      { key: 'pending', value: 25 },
      { key: 'Total', value: 25 },
    ],
  },
  {
    label: 'Faculty of Agricultural Science',
    count: 30,
    tooltipData: [
      { key: 'draft', value: 20 },
      { key: 'pending', value: 25 },
      { key: 'Total', value: 25 },
    ],
  },
];

export const genderDistributionData = [
  {
    label: 'Faculty of Surveying and Geo-informatics science',
    count: 6,
    tooltipData: [
      { key: 'Male', value: 10 },
      { key: 'Female', value: 15 },
      { key: 'Total', value: 25 },
    ],
    departments: [
      {
        name: 'Department Agriculture',
        maleCount: 34,
        femaleCount: 23,
        get Total() {
          return this?.maleCount + this?.femaleCount;
        },
      },
      {
        name: 'Department Music',
        maleCount: 34,
        femaleCount: 63,
        get Total() {
          return this?.maleCount + this?.femaleCount;
        },
      },
      {
        name: 'Department Science',
        maleCount: 39,
        femaleCount: 23,
        get Total() {
          return this?.maleCount + this?.femaleCount;
        },
      },
      {
        name: 'Department Engineering',
        maleCount: 340,
        femaleCount: 23,
        get Total() {
          return this?.maleCount + this?.femaleCount;
        },
      },
    ],
  },
  {
    label: 'Faculty of Business Administration',
    count: 24,
    tooltipData: [
      { key: 'Male', value: 20 },
      { key: 'Female', value: 25 },
      { key: 'Total', value: 25 },
    ],
    departments: [
      {
        name: 'Department Agriculture',
        maleCount: 34,
        femaleCount: 23,
        get Total() {
          return this?.maleCount + this?.femaleCount;
        },
      },
      {
        name: 'Department Music',
        maleCount: 34,
        femaleCount: 63,
        get Total() {
          return this?.maleCount + this?.femaleCount;
        },
      },
      {
        name: 'Department Science',
        maleCount: 39,
        femaleCount: 23,
        get Total() {
          return this?.maleCount + this?.femaleCount;
        },
      },
      {
        name: 'Department Engineering',
        maleCount: 340,
        femaleCount: 23,
        get Total() {
          return this?.maleCount + this?.femaleCount;
        },
      },
    ],
  },
  {
    label: 'Faculty of Enterprise Creation Management',
    count: 30,
    tooltipData: [
      { key: 'Male', value: 20 },
      { key: 'Female', value: 25 },
      { key: 'Total', value: 25 },
    ],
    departments: [
      {
        name: 'Department Agriculture',
        maleCount: 34,
        femaleCount: 23,
        get Total() {
          return this?.maleCount + this?.femaleCount;
        },
      },
      {
        name: 'Department Music',
        maleCount: 34,
        femaleCount: 63,
        get Total() {
          return this?.maleCount + this?.femaleCount;
        },
      },
      {
        name: 'Department Science',
        maleCount: 39,
        femaleCount: 23,
        get Total() {
          return this?.maleCount + this?.femaleCount;
        },
      },
      {
        name: 'Department Engineering',
        maleCount: 340,
        femaleCount: 23,
        get Total() {
          return this?.maleCount + this?.femaleCount;
        },
      },
    ],
  },
  {
    label: 'Faculty of Agricultural Science',
    count: 30,
    tooltipData: [
      { key: 'Male', value: 20 },
      { key: 'Female', value: 25 },
      { key: 'Total', value: 25 },
    ],
    departments: [
      {
        name: 'Department Agriculture',
        maleCount: 34,
        femaleCount: 23,
        get Total() {
          return this?.maleCount + this?.femaleCount;
        },
      },
      {
        name: 'Department Music',
        maleCount: 34,
        femaleCount: 63,
        get Total() {
          return this?.maleCount + this?.femaleCount;
        },
      },
      {
        name: 'Department Science',
        maleCount: 39,
        femaleCount: 23,
        get Total() {
          return this?.maleCount + this?.femaleCount;
        },
      },
      {
        name: 'Department Engineering',
        maleCount: 340,
        femaleCount: 23,
        get Total() {
          return this?.maleCount + this?.femaleCount;
        },
      },
    ],
  },
  {
    label: 'Faculty of Agricultural Science',
    count: 30,
    tooltipData: [
      { key: 'Male', value: 20 },
      { key: 'Female', value: 25 },
      { key: 'Total', value: 25 },
    ],
    departments: [
      {
        name: 'Department Agriculture',
        maleCount: 34,
        femaleCount: 23,
        get Total() {
          return this?.maleCount + this?.femaleCount;
        },
      },
      {
        name: 'Department Music',
        maleCount: 34,
        femaleCount: 63,
        get Total() {
          return this?.maleCount + this?.femaleCount;
        },
      },
      {
        name: 'Department Science',
        maleCount: 39,
        femaleCount: 23,
        get Total() {
          return this?.maleCount + this?.femaleCount;
        },
      },
      {
        name: 'Department Engineering',
        maleCount: 340,
        femaleCount: 23,
        get Total() {
          return this?.maleCount + this?.femaleCount;
        },
      },
    ],
  },
];

export const lecturerRatingData = [
  { name: 'Gbenga Anifowoshe', value: 4.5 },
  { name: 'Gbenga Anifowoshe', value: 4.5 },
  { name: 'Gbenga Anifowoshe', value: 4.5 },
  { name: 'Gbenga Anifowoshe', value: 4.5 },
  { name: 'Gbenga Anifowoshe', value: 4.5 },
];

export const mockData = [
  { title: 'Total Enrollment', value: 1234 },
  { title: 'Total Enrollee', value: 1234 },
  { title: 'No. of Instructors', value: 1234 },
  { title: 'Total Auditee', value: 1234 },
  { title: 'No. of Assessments', value: 1234 },
  { title: 'No. of Assignments', value: 1234 },
];

export const data = [
  { firstName: 'Prof', lastName: 'Ajala', department: 'Music' },
  { firstName: 'Prof', lastName: 'Ajala', department: 'Music' },
  { firstName: 'Prof', lastName: 'Ajala', department: 'Music' },
  { firstName: 'Prof', lastName: 'Ajala', department: 'Music' },
  { firstName: 'Prof', lastName: 'Ajala', department: 'Music' },
  { firstName: 'Prof', lastName: 'Ajala', department: 'Music' },
];

export const facultyDeviation = [
  {
    id: 1,
    name: 'Faculty of agric',
    totalDeviations: 21,
  },
  {
    id: 2,
    name: 'Geography',
    totalDeviations: 20,
  },
  {
    id: 3,
    name: 'Music',
    totalDeviations: 24,
  },
  {
    id: 4,
    name: 'Faculty of Jupiter',
    totalDeviations: 10,
  },
  {
    id: 5,
    name: 'Software Engineering',
    totalDeviations: 2,
  },
];

export const deviations = {
  facultyDeviations: {
    id: 5,
    name: 'Faculty of Software Development',
    totalDeviations: 2,
  },
  facultyDepartmentDeviations: {
    faculty: {
      id: 1,
      name: 'Faculty of engineering',
    },
    id: 11,
    name: 'Music',
    totalDeviations: 45,
  },
  facultyDepartmentLevelDeviations: {
    id: 2,
    name: 'Software Dev Dept',
    usersCount: 57,
    totalDeviations: 6,
  },
};
