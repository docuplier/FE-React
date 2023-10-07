import { PrivatePaths } from 'routes';
import { convertHyphenToCamelCase } from './TransformationUtils';

export const notificationTypes = {
  CREATE_SCHOOL: 'CREATE_SCHOOL',
  UPDATE_SCHOOL: 'UPDATE_SCHOOL',
  UPDATE_COURSE: 'UPDATE_COURSE',
  CREATE_COURSE: 'CREATE_COURSE',
  CREATE_FACULTY: 'CREATE_FACULTY',
  UPDATE_FACULTY: 'UPDATE_FACULTY',
  CREATE_DEPARTMENT: 'CREATE_DEPARTMENT',
  UPDATE_DEPARTMENT: 'UPDATE_DEPARTMENT',
  CREATE_SCHOOL_ADMIN_USER: 'CREATE_SCHOOL_ADMIN_USER',
  CREATE_LECTURER_USER: 'CREATE_LECTURER_USER',
  CREATE_STUDENT_USER: 'CREATE_STUDENT_USER',
  CREATE_CATEGORY: 'CREATE_CATEGORY',
  UPDATE_CATEGORY: 'UPDATE_CATEGORY',
  CREATE_ASSESSMENT: 'CREATE_ASSESSMENT',
  GRADED_ASSESSMENT: 'GRADED_ASSESSMENT',
  PUBLISHED_ASSESSMENT: 'PUBLISHED_ASSESSMENT',
  CREATE_ASSIGNMENT: 'CREATE_ASSIGNMENT',
  PUBLISHED_ASSIGNMENT: 'PUBLISHED_ASSIGNMENT',
  CREATE_ANNOUNCEMENT: 'CREATE_ANNOUNCEMENT',
  CREATE_LECTURE: 'CREATE_LECTURE',
  UPDATE_LECTURE: 'UPDATE_LECTURE',
  REQUEST_REVIEW_LECTURE: 'REQUEST_REVIEW_LECTURE',
  CREATE_QUESTION: 'CREATE_QUESTION',
  INVITE_USER_COURSE: 'INVITE_USER_COURSE',
};

const links = {
  [notificationTypes.CREATE_SCHOOL]: `${PrivatePaths.INSTITUTIONS}/:objectId`,
  [notificationTypes.UPDATE_SCHOOL]: `${PrivatePaths.INSTITUTIONS}/:objectId`,
  [notificationTypes.CREATE_FACULTY]: `${PrivatePaths.INSTITUTIONS}/:institutionId/faculties/:objectId`,
  [notificationTypes.UPDATE_FACULTY]: `${PrivatePaths.INSTITUTIONS}/:institutionId/faculties/:objectId`,
  [notificationTypes.CREATE_DEPARTMENT]: `${PrivatePaths.INSTITUTIONS}/:institutionId/faculties/:facultyId/departments/:objectId`,
  [notificationTypes.UPDATE_DEPARTMENT]: `${PrivatePaths.INSTITUTIONS}/:institutionId/faculties/:facultyId/departments/:objectId`,
  [notificationTypes.CREATE_SCHOOL_ADMIN_USER]: `${PrivatePaths.USERS}/administrators`,
  [notificationTypes.CREATE_LECTURER_USER]: `${PrivatePaths.USERS}/users/lecturers`,
  [notificationTypes.CREATE_STUDENT_USER]: `${PrivatePaths.USERS}/learners/:objectId`,
  [notificationTypes.CREATE_CATEGORY]: `${PrivatePaths.COURSES}/courses`,
  [notificationTypes.UPDATE_CATEGORY]: `${PrivatePaths.COURSES}/courses`,
  [notificationTypes.CREATE_ASSESSMENT]: `${PrivatePaths.COURSES}/:courseId/assessments/:objectId`,
  [notificationTypes.GRADED_ASSESSMENT]: `${PrivatePaths.COURSES}/:courseId/assessments/:objectId`,
  [notificationTypes.PUBLISHED_ASSESSMENT]: `${PrivatePaths.COURSES}/:courseId`,
  [notificationTypes.CREATE_ASSIGNMENT]: `${PrivatePaths.COURSES}/:courseId/assignments/:objectId`,
  [notificationTypes.PUBLISHED_ASSIGNMENT]: `${PrivatePaths.COURSES}/:courseId`,
  [notificationTypes.CREATE_ANNOUNCEMENT]: `${PrivatePaths.COURSES}/:courseId`,
  [notificationTypes.UPDATE_COURSE]: `${PrivatePaths.COURSES}/:objectId`,
  [notificationTypes.CREATE_COURSE]: `${PrivatePaths.COURSES}/:objectId`,
  [notificationTypes.CREATE_LECTURE]: `${PrivatePaths.COURSES}/:courseId`,
  [notificationTypes.UPDATE_LECTURE]: `${PrivatePaths.COURSES}/:courseId`,
  [notificationTypes.REQUEST_REVIEW_LECTURE]: `${PrivatePaths.COURSES}/:courseId`,
  [notificationTypes.CREATE_QUESTION]: `${PrivatePaths.COURSES}/:courseId/course-content?lectureId=:objectId`,
  [notificationTypes.INVITE_USER_COURSE]: `${PrivatePaths.COURSES}/:courseId`,
};

export const routeNotificationToPath = (type, data) => {
  let linkString = links[type] || '';
  for (const key in data) {
    linkString = linkString.replace(`:${convertHyphenToCamelCase(key)}`, data[key]);
  }
  // Passes an empty string as url if ids needed to build url aren't availaible
  if (/:/.test(linkString) === true) {
    return '';
  }
  return linkString;
};
