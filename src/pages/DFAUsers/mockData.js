import profileImg from 'assets/svgs/instructor-img.png';

export const courses = [
  {
    title: 'Construction & Maintenance of Crop Processing & Storage',
    desc: 'DSLMS specialize in everything from software development to data',
    image: profileImg,
    count: 23,
    progress: 0,
    status: 'Enrolled',
  },
  {
    title: 'Construction & Maintenance of Crop Processing & Storage',
    desc: 'DSLMS specialize in everything from software development to data',
    image: profileImg,
    count: 23,
    progress: 32,
    status: 'Audit',
  },
  {
    title: 'Construction & Maintenance of Crop Processing & Storage',
    desc: 'DSLMS specialize in everything from software development to data',
    image: profileImg,
    count: 23,
    progress: 50,
    status: 'Enrolled',
  },
  {
    title: 'Construction & Maintenance of Crop Processing & Storage',
    desc: 'DSLMS specialize in everything from software development to data',
    image: profileImg,
    count: 23,
    progress: 100,
    status: 'Audit',
  },
  {
    title: 'Construction & Maintenance of Crop Processing & Storage',
    desc: 'DSLMS specialize in everything from software development to data',
    image: profileImg,
    count: 23,
    progress: 0,
    status: 'Audit',
  },
  {
    title: 'Construction & Maintenance of Crop Processing & Storage',
    desc: 'DSLMS specialize in everything from software development to data',
    image: profileImg,
    count: 23,
    progress: 67,
    status: 'Audit',
  },
  {
    title: 'Construction & Maintenance of Crop Processing & Storage',
    desc: 'DSLMS specialize in everything from software development to data',
    image: profileImg,
    count: 23,
    progress: 100,
    status: 'Enrolled',
  },
];

const filterArray = (data, filter) => {
  return data.find((element) => element.name === filter);
};

export const getUsersOverview = (data) => [
  {
    title: 'Administrators',
    description:
      'Users within an institution who is delegated to manage the activities on the platform.',
    caption: {
      count: filterArray(data, 'administrators').total,
      label: 'In total',
    },
    metaList: [
      {
        label: 'Active',
        count: filterArray(data, 'administrators').active,
      },
      {
        label: 'Inactive',
        count: filterArray(data, 'administrators').inActive,
      },
    ],
  },
  {
    title: 'Lecturers',
    description: 'Users registered on the platform for the purpose of delivering course content.',
    caption: {
      count: filterArray(data, 'lecturers').total,
      label: 'In total',
    },
    metaList: [
      {
        label: 'Active',
        avatars: [],
        count: filterArray(data, 'lecturers').active,
      },
      {
        label: 'Inactive',
        avatars: [],
        count: filterArray(data, 'lecturers').inActive,
      },
    ],
  },
  {
    title: 'Custom Users',
    description:
      'Senior executives within the state government given different analytics permission.',
    caption: {
      count: 0,
      label: 'In total',
    },
    metaList: [
      {
        label: 'Active',
        avatars: [],
        count: 0,
      },
      {
        label: 'Inactive',
        avatars: [],
        count: 0,
      },
    ],
    disabled: true,
  },
  {
    title: 'Students',
    description: 'Users registered on the platform for the purpose of learning.',
    caption: {
      count: filterArray(data, 'students').total,
      label: 'In total',
    },
    metaList: [
      {
        label: 'Active',
        avatars: [],
        count: filterArray(data, 'students').active,
      },
      {
        label: 'Inactive',
        avatars: [],
        count: filterArray(data, 'students').inActive,
      },
    ],
  },
  {
    title: 'Migration',
    description: 'Users registered on the platform for the purpose of learning.',
    caption: {
      count: filterArray(data, 'Migration').total,
      label: 'In total',
    },
    metaList: [
      {
        label: 'Migrated',
        avatars: [],
        count: filterArray(data, 'Migration').active,
      },
      {
        label: 'Pending',
        avatars: [],
        count: filterArray(data, 'Migration').inActive,
      },
    ],
  },
];

export const FAQ = [
  {
    sumary: 'How do I login as fresh or returning student?',
    detail:
      'One can apply for a postgraduate programme few months before the completion of his service year, so that he/she will be able to meet up with the admission. ',
    extra:
      'NOTE: One must COMPLETE his national service before he can be sucessfully screened into the programme.',
  },
  {
    sumary: 'How do I login as candidate seeking admission?',
    detail:
      'One can apply for a postgraduate programme few months before the completion of his service year, so that he/she will be able to meet up with the admission. NOTE: One must COMPLETE his national service before he can be sucessfully screened into the programme.',
  },
  {
    sumary: 'What is my default login password?',
    detail:
      'One can apply for a postgraduate programme few months before the completion of his service year, so that he/she will be able to meet up with the admission. NOTE: One must COMPLETE his national service before he can be sucessfully screened into the programme.',
  },
  {
    sumary: 'Is there a flexible payment plan?',
    detail:
      'One can apply for a postgraduate programme few months before the completion of his service year, so that he/she will be able to meet up with the admission. NOTE: One must COMPLETE his national service before he can be sucessfully screened into the programme.',
  },
  {
    sumary: 'Can one defer an academic session?',
    detail:
      'One can apply for a postgraduate programme few months before the completion of his service year, so that he/she will be able to meet up with the admission. NOTE: One must COMPLETE his national service before he can be sucessfully screened into the programme.',
  },
  {
    sumary:
      'Can one transfer to another school after completing his/her first year as an academic masters student?',
    detail:
      'One can apply for a postgraduate programme few months before the completion of his service year, so that he/she will be able to meet up with the admission. NOTE: One must COMPLETE his national service before he can be sucessfully screened into the programme.',
  },
  {
    sumary: 'How do I login as fresh or returning student?',
    detail:
      'One can apply for a postgraduate programme few months before the completion of his service year, so that he/she will be able to meet up with the admission. NOTE: One must COMPLETE his national service before he can be sucessfully screened into the programme.',
  },
];
