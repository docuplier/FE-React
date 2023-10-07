export const activityTypes = [
  {
    label: 'Logged In',
    value: 'LOGGED_IN',
  },
  {
    label: 'Logged Out',
    value: 'LOGGED_OUT',
  },
  {
    label: 'Course Enrollment',
    value: 'COURSE_ENROLLMENT',
  },

  {
    label: 'Course Creation',
    value: 'COURSE_CREATION',
  },
  {
    label: 'Course Modification',
    value: 'COURSE_MODIFICATION',
  },
  {
    label: 'Assignment Completion',
    value: 'ASSIGNMENT_COMPLETION',
  },
  {
    label: 'Assignment Creation',
    value: 'ASSIGNMENT_CREATION',
  },
  {
    label: 'Assignment Modification',
    value: 'ASSIGNMENT_MODIFICATION',
  },
  {
    label: 'Assessment Modification',
    value: 'ASSESSMENT_MODIFICATION',
  },
  {
    label: 'Assessment Creation',
    value: 'ASSESSMENT_CREATION',
  },
  {
    label: 'Assessment Started',
    value: 'ASSESSMENT_STARTED',
  },
  {
    label: 'Assessment Submission',
    value: 'ASSESSMENT_SUBMISSION',
  },
  {
    label: 'Assignment Submission',
    value: 'ASSIGNMENT_SUBMISSION',
  },
];

export const convertUnderscoreToTitleCase = (input) => {
  return input
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
