export const RepliesMock = [
  {
    user: {
      firstname: 'Gbenga',
      lastname: 'Anifowoshe',
    },
    comment: 'This is rather good',
    createdAt: '03-09-2020',
    likesCount: 657,
  },
];

export const AnnouncementMock = [
  {
    id: '12',
    title: 'Ask questions: Join me for this Instagram livestream',
    createdAt: '2020-03-10',
    user: {
      firstname: 'Gbenga',
      lastname: 'Anifowoshe',
      image: null,
      title: 'Professor',
    },
    body: 'This is a simple <b>body</b>',
  },
  {
    id: '13',
    title: 'Ask questions: Join me for this Instagram livestream',
    createdAt: '2020-03-10',
    user: {
      firstname: 'Gbenga',
      lastname: 'Anifowoshe',
      image: null,
      title: 'Professor',
    },
    body: 'This is a simple <b>body</b>',
  },
];

export const ResourcesMock = [
  {
    id: '1',
    name: 'Practical_to_field_survey.pdf',
    user: {
      firstname: 'Gbenga',
      lastname: 'Anifowoshe',
      title: 'Professor',
    },
    size: 1006778,
    publishedAt: '2020-03-10',
    url: '',
    type: 'pdf',
  },
  {
    id: '2',
    name: 'Practical_to_field_survey.pdf',
    user: {
      firstname: 'Gbenga',
      lastname: 'Anifowoshe',
      title: 'Professor',
    },
    size: 1006778,
    publishedAt: '2020-03-10',
    url: '',
    type: 'pdf',
  },
  {
    id: '3',
    name: 'Practical_to_field_survey.pdf',
    user: {
      firstname: 'Gbenga',
      lastname: 'Anifowoshe',
      title: 'Professor',
    },
    size: 1006778,
    publishedAt: '2020-03-10',
    url: '',
    type: 'pdf',
  },
];

export const Lectures = [
  {
    id: '1',
    name: 'Lecture 1',
  },
  {
    id: '2',
    name: 'Lecture 2',
  },
  {
    id: '3',
    name: 'Lecture 3',
  },
];

export const LectureNotesMock = [
  {
    id: '1',
    content:
      'Professor Emeka Chucks of Delta State Business School contrasts traditional approaches to branding - where brands are a visual identity and a promise to customers - to brands...',
    section: {
      id: '12',
      name: 'Introduction',
      position: 1,
    },
    lecture: {
      id: '13',
      name: 'Bonus Lecture',
      position: 2,
    },
    createdAt: '2020-03-10',
  },
  {
    id: '2',
    content:
      'Professor Emeka Chucks of Delta State Business School contrasts traditional approaches to branding - where brands are a visual identity and a promise to customers - to brands...',
    section: {
      id: '14',
      name: 'Conclusion',
      position: 1,
    },
    lecture: {
      id: '15',
      name: 'Bonus Lecture 2',
      position: 2,
    },
    createdAt: '2020-03-10',
  },
];

export const QuestionsMock = [
  {
    id: '1',
    title: 'How do you turn it around when you fail to turn the user?',
    description:
      'Professor Emeka Chucks of Delta State Business School contrasts traditional approaches to branding - where brands are a visual identity and a promise to customers - to brands',
    lecture: {
      id: '12',
      title: 'Lecture 8',
    },
    createdAt: '03-09-2020',
    likesCount: 829,
    repliesCount: 23,
    user: {
      firstname: 'Gbenga',
      lastname: 'Anifowoshe',
    },
  },
  {
    id: '2',
    title: 'How do you turn it around when you fail to turn the user?',
    description:
      'Professor Emeka Chucks of Delta State Business School contrasts traditional approaches to branding - where brands are a visual identity and a promise to customers - to brands',
    lecture: {
      id: '123',
      title: 'Lecture 8',
    },
    createdAt: '03-09-2020',
    likesCount: 829,
    repliesCount: 23,
    user: {
      firstname: 'Gbenga',
      lastname: 'Anifowoshe',
    },
  },
];
