import { gql } from '@apollo/client/core';

export const CORE_CATEGORY_FIELDS = gql`
  fragment CategoryPart on CategoryType {
    id
    title
    description
    child {
      id
      title
      description
    }
  }
`;
export const CORE_CATEGORY_FILTER_FIELDS = gql`
  fragment CategoryFilterPart on CategoryType {
    id
    title
    child {
      id
      title
    }
  }
`;

export const CORE_INSTITUTION_TRUNCATED_FIELDS = gql`
  fragment InstitutionTruncatedPart on InstitutionType {
    id
    name
    description
    abbreviation
    logo
    subdomain
    status
    administrator {
      id
      email
      firstname
      lastname
      roles
      image
    }
  }
`;

export const CORE_INSTITUTION_FIELDS = gql`
  fragment InstitutionPart on InstitutionType {
    id
    name
    email
    description
    abbreviation
    address
    address2
    logo
    phone
    url
    subdomain
    createdAt
    status
    city
    state
    lga
    phone
    type
    favicon
    administrator {
      id
      email
      firstname
      lastname
      roles
      image
    }
  }
`;

export const CORE_COURSE_LECTURE_FIELDS = gql`
  fragment LecturePart on LectureType {
    body
    createdAt
    duration
    embeddedLink
    description
    file
    id
    position
    status
    title
    type
    updatedAt
    fileSize
    createdBy {
      id
      email
      firstname
      lastname
    }
    course {
      id
    }
    section {
      id
    }
  }
`;

export const CORE_COURSE_REPLY_FIELDS = gql`
  fragment ReplyPart on ReplyType {
    id
    body
    createdBy {
      id
      firstname
      lastname
      image
    }
    replyLikes {
      id
      user {
        id
      }
    }
    createdAt
  }
`;

export const CORE_COURSE_QUESTION_FIELDS = gql`
  ${CORE_COURSE_REPLY_FIELDS}
  fragment QuestionPart on QuestionType {
    id
    title
    body
    likes
    replies
    updatedAt
    lecture {
      body
      createdAt
      duration
      embeddedLink
      file
      id
      position
      status
      title
      type
      updatedAt
      createdBy {
        id
        email
        firstname
        lastname
        middlename
      }
    }
    createdAt
    createdBy {
      id
      firstname
      lastname
      image
    }
    questionLikes {
      id
      user {
        id
      }
    }
    questionReplies {
      ...ReplyPart
    }
  }
`;

export const CORE_LEVEL_FIELDS = gql`
  fragment LevelPart on LevelType {
    id
    name
    usersCount
    coursesCount
    default
  }
`;

export const CORE_USER_FIELDS = gql`
  ${CORE_INSTITUTION_FIELDS}
  ${CORE_COURSE_QUESTION_FIELDS}
  ${CORE_LEVEL_FIELDS}
  fragment UserPart on UserType {
    id
    email
    firstname
    lastname
    middlename
    matricNumber
    isActive
    level {
      ...LevelPart
    }
    roles
    image
    phone
    gender
    title
    staffId
    designation
    department {
      id
      name
    }
    institution {
      id
      name
    }
    institutions {
      ...InstitutionPart
    }
    questionCreators {
      ...QuestionPart
    }
    userinformation {
      dateOfBirth
    }
    program {
      id
    }
    faculty {
      name
    }
    visualizations
  }
`;

export const CORE_USER_EXPORT_FIELDS = gql`
  fragment UserExportPart on UserType {
    id
    email
    firstname
    lastname
    middlename
    matricNumber
    gender
    isActive
    level {
      id
      name
    }
  }
`;

export const CORE_EXISTING_USER_FIELDS = gql`
  fragment ExistingUserPart on UserType {
    id
    lastname
    firstname
    middlename
    matricNumber
    email
    maskedEmail
    phone
    maskedPhone
    createdAt
    updatedAt
    staffId
  }
`;

export const CORE_EXISTING_USER_FULL_FIELDS = gql`
  fragment ExistingUserFullPart on ExistingUserFullType {
    id
    lastname
    firstname
    middlename
    matricNumber
    email
    phone
    gender
    department {
      id
      name
    }
    level {
      id
      name
    }
    institution {
      id
      name
    }
    faculty {
      id
      name
    }
    createdAt
    updatedAt
  }
`;

export const CORE_DEPARTMENT_FILTER_FIELDS = gql`
  fragment DepartmentFilterPart on DepartmentType {
    id
    name
  }
`;

export const CORE_DEPARTMENT_FIELDS = gql`
  ${CORE_USER_FIELDS}
  fragment DepartmentPart on DepartmentType {
    id
    name
    description
    abbreviation
    studentCount
    lecturerCount
    userMaleCount
    userFemaleCount
    createdBy {
      ...UserPart
    }
    isActive
    faculty {
      id
      name
      institution {
        id
        name
      }
    }
  }
`;

export const CORE_SEMESTER_FIELDS = gql`
  fragment SemesterPart on SemesterType {
    id
    endSemester
    startSemester
    name
    createdAt
    updatedAt
  }
`;

export const CORE_FACULTY_FILTER_FIELDS = gql`
  fragment FacultyFilterPart on FacultyType {
    id
    isActive
    name
  }
`;

export const CORE_FACULTY_FIELDS = gql`
  ${CORE_USER_FIELDS}
  fragment FacultyPart on FacultyType {
    id
    isActive
    name
    description
    abbreviation
    departmentCount
    createdBy {
      ...UserPart
    }
  }
`;
export const CORE_PROGRAM_TYPE_FILTER_FIELDS = gql`
  fragment ProgramTypeFilterPart on ProgramType {
    id
    name
  }
`;

export const CORE_PROGRAM_TYPE_FIELDS = gql`
  ${CORE_LEVEL_FIELDS}
  fragment ProgramTypePart on ProgramType {
    id
    programType
    name
    abbreviation
    levels {
      ...LevelPart
    }
  }
`;

export const CORE_SESSION_FILTER_FIELDS = gql`
  fragment SessionFilterPart on SessionType {
    id
    name
    isActive
  }
`;

export const CORE_SESSION_FIELDS = gql`
  ${CORE_SEMESTER_FIELDS}
  fragment SessionPart on SessionType {
    id
    name
    isActive
    expired
    createdAt
    updatedAt
    completionRate
    enrolmentRate
    institutionSessionSemester {
      ...SemesterPart
    }
    currentSemester {
      ...SemesterPart
    }
  }
`;

export const CORE_COURSE_ENROLLMENT_FIELDS = gql`
  ${CORE_USER_FIELDS}
  fragment EnrollmentPart on EnrollmentType {
    createdAt
    id
    semester
    session
    progress
    status
    updatedAt
    user {
      ...UserPart
    }
  }
`;

export const CORE_COURSE_RESOURCE_FIELDS = gql`
  ${CORE_USER_FIELDS}
  fragment ResourcePart on ResourceType {
    contentType
    createdAt
    createdBy {
      ...UserPart
    }
    file
    id
    size
    updatedAt
  }
`;

export const CORE_ANNOUNCEMENT_COMMENT_FIELDS = gql`
  fragment AnnouncementCommentPart on CommentType {
    id
    createdBy {
      id
      lastname
      firstname
      image
    }
    createdAt
    body
  }
`;

export const CORE_ANNOUNCEMENTS_FIELDS = gql`
  fragment AnnouncementPart on AnnouncementType {
    body
    createdAt
    file
    id
    title
    updatedAt
    createdBy {
      id
      firstname
      middlename
      lastname
      image
    }
  }
`;

export const CORE_COURSE_SECTION_FIELDS = gql`
  ${CORE_COURSE_LECTURE_FIELDS}
  fragment SectionPart on SectionType {
    createdAt
    description
    id
    position
    sectionLectures {
      ...LecturePart
      section {
        id
      }
    }
    title
    updatedAt
    lectureCount
    lectureDurationCount
  }
`;

export const CORE_COURSE_TRUNCATED_FIELDS = gql`
  fragment CourseTruncatedPart on CourseType {
    id
    code
    title
    banner
    description
    totalDuration
    unit
    learnerCount
    totalEnrolled
    status
    leadInstructor {
      id
    }
  }
`;

export const CORE_COURSE_FIELDS = gql`
  ${CORE_DEPARTMENT_FILTER_FIELDS}
  ${CORE_PROGRAM_TYPE_FIELDS}
  ${CORE_SEMESTER_FIELDS}
  ${CORE_LEVEL_FIELDS}
  ${CORE_INSTITUTION_FIELDS}
  ${CORE_USER_FIELDS}
  ${CORE_COURSE_SECTION_FIELDS}
  ${CORE_COURSE_LECTURE_FIELDS}
  fragment CoursePart on CourseType {
    id
    status
    title
    description
    banner
    code
    unit
    enrolled
    updatedAt
    totalVideoDuration
    resourceDocumentCount
    totalAudited
    totalEnrolled
    lectureCount
    sectionCount
    totalDuration
    learnerCount
    objectives
    prerequisites
    expectedLearnerCount
    lecturerCount
    assessmentCount
    assignmentCount
    secondaryDepartments {
      department {
        name
        id
      }
      level {
        name
        id
      }
    }
    categories {
      id
      title
    }
    classRep {
      ...UserPart
    }
    crsSections {
      ...SectionPart
    }
    createdBy {
      ...UserPart
    }
    crsLectures {
      ...LecturePart
    }
    program {
      ...ProgramTypePart
    }
    semester {
      ...SemesterPart
    }
    aggregateFileCount {
      type
      total
    }
    department {
      ...DepartmentFilterPart
      faculty {
        id
        name
      }
    }
    institution {
      ...InstitutionPart
    }
    leadInstructor {
      ...UserPart
      department {
        ...DepartmentFilterPart
      }
    }
    level {
      ...LevelPart
    }
    instructors {
      id
      email
      lastname
      firstname
      image
      staffId
      department {
        ...DepartmentFilterPart
      }
      program {
        ...ProgramTypePart
      }
    }
  }
`;

export const CORE_COURSE_AVERAGE_STATS_FIELDS = gql`
  fragment CourseAverageStatsPart on CourseType {
    averageCourseRating
    averageCompletionRate
    averagePassRate
    averageInstructorRating
  }
`;

export const CORE_COURSE_NOTE_FIELDS = gql`
  fragment NotePart on NoteType {
    id
    body
    createdAt
    lecture {
      id
      title
      position
      section {
        id
        title
        position
      }
    }
    course {
      id
    }
  }
`;

export const CORE_LIBRARY_CONTENT_TRUNCATED_FIELDS = gql`
  fragment LibraryContentTruncatedPart on LibraryContentType {
    id
    name
    description
    thumbnail
    contentFormat
    content
  }
`;

export const CORE_LIBRARY_CONTENT_FIELDS = gql`
  fragment LibraryContentPart on LibraryContentType {
    id
    name
    author
    description
    thumbnail
    tags
    contentFormat
    content
    file
    embeddedLink
    source
    bookmarked
    fieldOfInterests {
      id
      name
    }
  }
`;

export const CORE_LIBRARY_FIELD_OF_INTEREST_FIELDS = gql`
  ${CORE_LIBRARY_CONTENT_TRUNCATED_FIELDS}
  fragment LibraryFieldOfInterestPart on FieldOfInterestType {
    id
    name
    createdAt
    updatedAt
    contentCount
    numberOfView
    description
    libraryInterests {
      ...LibraryContentTruncatedPart
    }
  }
`;

export const CORE_FILE_FIELDS = gql`
  fragment FilePart on AssignmentDocumentType {
    id
    createdAt
    file
    fileSize
    updatedAt
  }
`;

export const CORE_ASSIGNMENT_SUBMISSION_FIELDS = gql`
  ${CORE_USER_FIELDS}
  ${CORE_FILE_FIELDS}
  ${CORE_USER_FIELDS}
  ${CORE_COURSE_FIELDS}
  ${CORE_FILE_FIELDS}
  fragment AssignmentSubmissionPart on AssignmentSubmissionType {
    id
    body
    createdAt
    remark
    score
    updatedAt
    submitedBy {
      ...UserPart
    }
    files {
      ...FilePart
    }
    assignment {
      id
      body
      createdAt
      dueDate
      maxScore
      startDate
      status
      title
      updatedAt
      submission
      files {
        ...FilePart
      }
      course {
        ...CoursePart
      }
      createdBy {
        ...UserPart
      }
    }
  }
`;

export const CORE_ASSIGNMENT_FIELDS = gql`
  ${CORE_USER_FIELDS}
  ${CORE_COURSE_FIELDS}
  ${CORE_FILE_FIELDS}
  ${CORE_ASSIGNMENT_SUBMISSION_FIELDS}
  fragment AssignmentPart on AssignmentType {
    id
    body
    createdAt
    dueDate
    maxScore
    startDate
    status
    title
    updatedAt
    submission
    files {
      ...FilePart
    }
    course {
      ...CoursePart
    }
    createdBy {
      ...UserPart
    }
    assignmentSubmissions {
      ...AssignmentSubmissionPart
    }
  }
`;

export const CORE_ASSESSMENT_QUESTION_OPTION_FIELDS = gql`
  fragment AssessmentQuestionOptionPart on AssessmentOptionType {
    id
    body
    createdAt
    updatedAt
    isAnswer
  }
`;

export const CORE_ASSESSMENT_TARGET_FIELDS = gql`
  fragment AssessmentTargetsPart on AssessmentTargetType {
    createdAt
    id
    isAllDepartment
    isAllLevels
    targetLevels {
      id
      name
    }
    targetDepartments {
      id
      name
    }
    updatedAt
  }
`;

export const CORE_ASSESSMENT_QUESTION_FIELDS = gql`
  ${CORE_ASSESSMENT_QUESTION_OPTION_FIELDS}
  fragment AssessmentQuestionPart on AssessmentQuestionType {
    id
    body
    score
    type
    updatedAt
    createdAt
    options {
      ...AssessmentQuestionOptionPart
    }
  }
`;

export const CORE_ASSESSMENT_SUBMISSION_FIELDS = gql`
  ${CORE_ASSESSMENT_QUESTION_OPTION_FIELDS}
  ${CORE_ASSESSMENT_QUESTION_FIELDS}
  fragment AssessmentSubmissionPart on AssessmentSubmissionType {
    id
    answer
    createdAt
    updatedAt
    score
    option {
      ...AssessmentQuestionOptionPart
    }
    question {
      ...AssessmentQuestionPart
    }
    submittedBy {
      id
      firstname
      lastname
    }
  }
`;

export const CORE_ASSESSMENT_GRADE_FIELDS = gql`
  ${CORE_ASSESSMENT_QUESTION_FIELDS}
  fragment AssessmentGradePart on AssessmentGradeType {
    id
    score
    gradeStatus
    scorePercentage
    createdAt
    updatedAt
    user {
      id
      firstname
      lastname
      matricNumber
      middlename
    }
    assessment {
      id
      createdAt
      updatedAt
      title
      passMark
      totalObtainableScore
      totalQuestions
      multichoiceQuestionCount
      textQuestionCount
      assessmentQuestions {
        ...AssessmentQuestionPart
      }
    }
  }
`;

export const CORE_ASSESSMENT_FIELDS = gql`
  ${CORE_COURSE_FIELDS}
  ${CORE_ASSESSMENT_QUESTION_FIELDS}
  ${CORE_ASSESSMENT_TARGET_FIELDS}
  fragment AssessmentPart on AssessmentType {
    id
    createdAt
    duration
    dueTime
    dueDate
    startDate
    startTime
    status
    title
    isGlobalAssessment
    totalObtainableScore
    completed
    totalQuestions
    totalSubmissions
    multichoiceQuestionCount
    textQuestionCount
    updatedAt
    passMark
    course {
      ...CoursePart
    }
    createdBy {
      id
      email
      firstname
      lastname
    }
    assessmentQuestions {
      ...AssessmentQuestionPart
    }
    assessmentTargets {
      ...AssessmentTargetsPart
    }
  }
`;

export const CORE_LIVE_EVENT_FIELDS = gql`
  fragment LiveEventPart on LiveEventType {
    id
    title
    description
    totalAttendees
    createdAt
    startDatetime
    endDatetime
    meetingLink
    parentEvent
    repeatMode
    title
    updatedAt
    createdBy {
      id
      firstname
      lastname
    }
  }
`;

export const CORE_RATING_FIELDS = gql`
  ${CORE_USER_FIELDS}
  ${CORE_COURSE_FIELDS}
  fragment RatingPart on RatingType {
    id
    rate
    review
    instructor {
      ...UserPart
    }
    ratedBy {
      ...UserPart
    }
    course {
      ...CoursePart
    }
    review
    createdAt
    updatedAt
  }
`;

export const TASK_FIELDS = gql`
  fragment taskPart on TaskType {
    id
    title
    isArchived
    description
    createdAt
    updatedAt
    totalGroups
    totalStudents
    totalPosts
    dueDate
    createdBy {
      id
      firstname
      lastname
    }
    currentGroup {
      id
      name
      totalStudents
    }
    course {
      id
      title
    }
  }
`;

export const TASK_GROUP_FIELDS = gql`
  ${TASK_FIELDS}
  fragment taskGroupPart on TaskGroupType {
    id
    createdAt
    submitted
    name
    updatedAt
    totalStudents
    totalPosts
    groupAdmin {
      id
      firstname
      lastname
      image
    }
    groupUsers {
      user {
        id
        firstname
        lastname
        image
      }
    }
    task {
      ...taskPart
    }
  }
`;

export const REPLY_TASK_FIELD = gql`
  fragment replyTaskPart on TaskGroupPostReplyType {
    id
    reply
    updatedAt
    totalLikes
    liked
    post {
      id
    }
    createdAt
    createdBy {
      id
      firstname
      lastname
      image
    }
  }
`;

export const TASK_GROUP_POST_FIELD = gql`
  fragment taskGroupPostPart on TaskGroupPostType {
    id
    message
    updatedAt
    totalLikes
    totalReplies
    liked
    createdAt
    file
    createdBy {
      id
      firstname
      lastname
      image
    }
  }
`;

export const TASK_SUBMISSION_FIELDS = gql`
  ${TASK_GROUP_FIELDS}
  fragment taskSubmissionPart on TaskSubmissionType {
    id
    size
    updatedAt
    createdAt
    documentTitle
    file
    group {
      ...taskGroupPart
    }
  }
`;
