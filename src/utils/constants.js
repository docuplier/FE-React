export const UserRoles = {
  STUDENT: 'STUDENT',
  LECTURER: 'LECTURER',
  SCHOOL_ADMIN: 'SCHOOL_ADMIN',
  GLOBAL_ADMIN: 'GLOBAL_ADMIN',
  EXECUTIVE: 'EXECUTIVE',
  DFA_ADMIN: 'DFA_ADMIN',
  YOUTH: 'YOUTH',
  CIVIL_SERVANT: 'CIVIL_SERVANT',
  K12_TEACHER: 'K12_TEACHER',
  K12_STUDENT: 'K12_STUDENT',
};
export const WorksheetUploadFormats = '.xls, .xlsx, .csv';
export const ImageUploadFormats = '.jpg, .jpeg, .png, .svg';
export const VideoUploadFormats =
  '.mp4, .m4p, .m4v, .mpg, .mp2, .mpeg, .mpe, .mpv, .ogg, .avi, .mov, .qt, .flv, .swf, .avchd';
export const AudioUploadFormats = '.m4a, .mp3, .flac, .wav, .wma, .aac';
export const TextUploadFormats =
  '.pdf, .csv, .txt, .text, .doc, .docx, .rtf, .html, .htm, .odt, .xls, .xlsx, .ppt, .pptx';
export const AssignmentUploadFormats =
  '.pdf, .pptx, .docx, .doc, .txt, .text, .xlsx, .xls, .jpg, .jpeg, .png, .svg';
export const DEFAULT_PAGE_OFFSET = 0;
export const DEFAULT_PAGE_LIMIT = 10;
export const CUSTOM_PAGE_LIMIT = 9;
export const MULTIPLE_OF_NINE_DEFAULT_PAGE_LIMIT = 9;
export const MULTIPLE_OF_TWELVE_DEFAULT_PAGE_LIMIT = 12;
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])*[a-zA-Z\d@$!%*?&]{8,}$/;

export const InstitutionTypes = {
  UNIVERSITY: 'UNIVERSITY',
  POLYTECHNIC: 'POLYTECHNIC',
  COLLEGE_OF_EDUCATION: 'COLLEGE_OF_EDUCATION',
  SCHOOL_OF_HEALTH_TECHNOLOGY: 'SCHOOL_OF_HEALTH_TECHNOLOGY',
  SCHOOL_OF_NURSING: 'SCHOOL_OF_NURSING',
  SCHOOL_OF_SCIENCE_AND_TECHNOLOGY: 'SCHOOL_OF_SCIENCE_AND_TECHNOLOGY',
};

export const DefaultAvatarGroup = [
  { initials: 'AK', color: '#9E68AF' },
  { initials: 'AB', color: '#00B0ED' },
  { initials: 'BJ', color: '#5ACA75' },
  { initials: 'TK', color: '#9E68AF' },
  { initials: 'BC', color: '#F48989' },
];

export const InstitutionStatus = {
  ACTIVE: `ACTIVE`,
  IN_ACTIVE: `IN_ACTIVE`,
  DRAFT: `DRAFT`,
};

export const ProgramType = {
  FULL_TIME: `FULL_TIME`,
  PART_TIME: `PART_TIME`,
  BOTH: `BOTH`,
};

export const GenderType = {
  MALE: `MALE`,
  FEMALE: `FEMALE`,
  OTHERS: `OTHERS`,
};

export const UserTitleType = {
  MR: `MR`,
  MISS: `MISS`,
  MRS: `MRS`,
};

export const LectureSectionStatus = {
  PUBLISHED: 'PUBLISHED',
  UNPUBLISHED: 'UNPUBLISHED',
};

export const CourseStatus = {
  PUBLISHED: 'PUBLISHED',
  DRAFT: 'DRAFT',
};

export const LectureStatus = {
  PUBLISHED: 'PUBLISHED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  DRAFT: 'DRAFT',
  AMENDMENT: 'AMENDMENT',
};

export const LectureResourceType = {
  VIDEO: `VIDEO`,
  PDF: `PDF`,
  AUDIO: `AUDIO`,
  LINK: `LINK`,
  TEXT: `TEXT`,
};

export const LikeTypes = {
  POST: 'POST',
  REPLY: 'REPLY',
};

export const EnrolmentStatus = {
  AUDIT: 'AUDIT',
  ENROL: 'ENROLLED',
  NONE: 'NONE',
};

export const LibraryContentType = {
  HTML: 'HTML',
  VIDEO: 'VIDEO',
  PDF: 'PDF',
  AUDIO: 'AUDIO',
  LINK: 'LINK',
};

export const AssignmentStatus = {
  PUBLISHED: 'PUBLISHED',
  DRAFT: 'DRAFT',
};

export const AssessmentQuestionType = {
  MULTI_CHOICE: 'MULTI_CHOICE',
  TEXT_ESSAY: 'TEXT_ESSAY',
};

export const AssessmentStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
};

export const LiveSessionRepeatMode = {
  NO_REPEAT: { value: 'NO_REPEAT', name: 'Does not repeat' },
  REPEAT: { value: 'REPEAT', name: 'Repeat' },
};

export const LiveSessionInterval = {
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  MONTHLY: 'MONTHLY',
  ANNUALLY: 'ANNUALLY',
};

export const daysOfTheWeek = [
  { name: 'M', value: 'Mon' },
  { name: 'T', value: 'Tuesday' },
  { name: 'W', value: 'Wednesday' },
  { name: 'T', value: 'Thursday' },
  { name: 'F', value: 'Friday' },
  { name: 'S', value: 'Saturday' },
  { name: 'S', value: 'Sunday' },
];

export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const AssessmentGradeStatus = {
  PENDING: 'PENDING',
  DONE: 'DONE',
};

export const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const PHONE_REGEX = /^(\+\d{1,3}[- ]?)?(\d{1}?)?(\d{10})$/;

export const URL_REGEX =
  /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;

export const AssessmentCompletionStatus = {
  PENDING: 'PENDING',
  STARTED: 'STARTED',
  COMPLETED: 'COMPLETED',
};

export const ReceiversType = {
  COURSE: 'COURSE',
  DEPARTMENT: 'DEPARTMENT',
  FACULTY: 'FACULTY',
};

export const RatingType = {
  COURSE: `COURSE`,
  LECTURER: `LECTURER`,
};

export const ExecutiveVisualizationOptions = {
  DEFAULT_STATISTICS: 'DEFAULT_STATISTICS',
  USER_DISTRIBUTION: 'USER_DISTRIBUTION',
  LEARNERS_INTEREST: 'LEARNERS_INTEREST',
  COURSE_ENROLLMENT_TREND: 'COURSE_ENROLLMENT_TREND',
};

export const deviationChartColor = [
  '#3B93A5',
  '#F7B844',
  '#A26BD9',
  '#EC3C65',
  '#0050C8',
  '#C1F666',
  '#D43F97',
  '#1E5D8C',
  '#421243',
  '#7F94B0',
  '#EF6537',
  '#C0ADDB',
];
