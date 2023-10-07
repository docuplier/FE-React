import { gql } from '@apollo/client';
import {
  CORE_ASSESSMENT_FIELDS,
  CORE_ASSESSMENT_GRADE_FIELDS,
  CORE_ASSESSMENT_SUBMISSION_FIELDS,
  CORE_ASSIGNMENT_FIELDS,
  CORE_ASSIGNMENT_SUBMISSION_FIELDS,
  CORE_CATEGORY_FIELDS,
  CORE_CATEGORY_FILTER_FIELDS,
  CORE_COURSE_FIELDS,
  CORE_COURSE_TRUNCATED_FIELDS,
  CORE_COURSE_LECTURE_FIELDS,
  CORE_COURSE_NOTE_FIELDS,
  CORE_COURSE_QUESTION_FIELDS,
  CORE_COURSE_RESOURCE_FIELDS,
  CORE_COURSE_SECTION_FIELDS,
  CORE_COURSE_AVERAGE_STATS_FIELDS,
  CORE_RATING_FIELDS,
  CORE_SEMESTER_FIELDS,
  CORE_USER_FIELDS,
} from 'graphql/fragments';

export const GET_COURSE_SECTIONS = gql`
  ${CORE_COURSE_SECTION_FIELDS}
  query getSections($courseId: UUID, $limit: Int, $offset: Int) {
    sections(courseId: $courseId, limit: $limit, offset: $offset) {
      totalCount
      results {
        ...SectionPart
      }
    }
  }
`;

export const GET_COURSE_CATEGORIES_QUERY = gql`
  ${CORE_CATEGORY_FIELDS}
  ${CORE_CATEGORY_FILTER_FIELDS}
  query getCourseCategories(
    $search: String
    $offset: Int
    $limit: Int
    $ordering: String
    $asFilter: Boolean = false
  ) {
    categories(search: $search, offset: $offset, limit: $limit, ordering: $ordering) {
      totalCount
      results {
        ...CategoryPart @skip(if: $asFilter)
        ...CategoryFilterPart @include(if: $asFilter)
      }
    }
  }
`;

export const GET_COURSES = gql`
  ${CORE_COURSE_FIELDS}
  ${CORE_COURSE_TRUNCATED_FIELDS}
  ${CORE_COURSE_AVERAGE_STATS_FIELDS}
  query getCourses(
    $instructorId: UUID
    $categoryId: UUID
    $courseUnit: Int
    $institutionId: UUID
    $search: String
    $offset: Int
    $limit: Int
    $ordering: String
    $status: CourseStatus
    $truncateResults: Boolean = false
    $showCourseAverageStats: Boolean = false
  ) {
    courses(
      instructorId: $instructorId
      categoryId: $categoryId
      courseUnit: $courseUnit
      search: $search
      offset: $offset
      limit: $limit
      institutionId: $institutionId
      ordering: $ordering
      status: $status
    ) {
      totalCount
      results {
        ...CoursePart @skip(if: $truncateResults)
        ...CourseTruncatedPart @include(if: $truncateResults)
        ...CourseAverageStatsPart @include(if: $showCourseAverageStats)
      }
    }
  }
`;

export const GET_COURSE_BY_ID = gql`
  ${CORE_COURSE_FIELDS}
  ${CORE_COURSE_AVERAGE_STATS_FIELDS}
  query getCourseById($courseId: UUID, $showCourseAverageStats: Boolean = true) {
    course(courseId: $courseId) {
      ...CoursePart
      ...CourseAverageStatsPart @include(if: $showCourseAverageStats)
    }
  }
`;

export const GET_SECTION_BY_ID = gql`
  ${CORE_COURSE_SECTION_FIELDS}
  query getSectionById($sectionId: UUID) {
    section(sectionId: $sectionId) {
      ...SectionPart
    }
  }
`;

export const GET_LECTURE_BY_ID = gql`
  ${CORE_COURSE_LECTURE_FIELDS}
  query getLectureById($lectureId: UUID) {
    lecture(lectureId: $lectureId) {
      ...LecturePart
    }
  }
`;

export const GET_COURSE_NOTES = gql`
  ${CORE_COURSE_NOTE_FIELDS}
  query getNotes(
    $courseId: UUID
    $lectureId: UUID
    $search: String
    $offset: Int
    $limit: Int
    $datePublished: Date
  ) {
    notes(
      courseId: $courseId
      lectureId: $lectureId
      search: $search
      offset: $offset
      limit: $limit
      datePublished: $datePublished
    ) {
      totalCount
      results {
        ...NotePart
      }
    }
  }
`;

export const GET_COURSE_QUESTIONS = gql`
  ${CORE_COURSE_QUESTION_FIELDS}
  query questions($courseId: UUID, $lectureId: UUID, $offset: Int, $limit: Int) {
    questions(courseId: $courseId, lectureId: $lectureId, offset: $offset, limit: $limit) {
      totalCount
      cursor @client
      results {
        ...QuestionPart
      }
    }
  }
`;

export const GET_COURSE_QUESTION_BY_ID = gql`
  ${CORE_COURSE_QUESTION_FIELDS}
  query question($questionId: UUID) {
    question(questionId: $questionId) {
      ...QuestionPart
    }
  }
`;

export const GET_ENROLLEES_BY_COURSE_ID = gql`
  ${CORE_USER_FIELDS}
  query getEnrolleesUnderCourse(
    $courseId: UUID
    $search: String
    $offset: Int
    $limit: Int
    $ordering: String
  ) {
    enrollees(
      courseId: $courseId
      search: $search
      offset: $offset
      limit: $limit
      ordering: $ordering
    ) {
      totalAuditee
      totalEnrollee
      results {
        id
        createdAt
        updatedAt
        progress
        status
        user {
          ...UserPart
        }
      }
    }
  }
`;

export const GET_COURSE_RESOURCES = gql`
  ${CORE_COURSE_RESOURCE_FIELDS}
  query getResources(
    $courseId: UUID
    $lectureId: UUID
    $search: String
    $offset: Int
    $limit: Int
    $datePublished: Date
  ) {
    resources(
      courseId: $courseId
      lectureId: $lectureId
      search: $search
      offset: $offset
      limit: $limit
      datePublished: $datePublished
    ) {
      totalCount
      results {
        ...ResourcePart
      }
    }
  }
`;

export const GET_LEARNER_ENROLMENTS = gql`
  ${CORE_SEMESTER_FIELDS}
  query getLearnerEnrolments(
    $userId: UUID
    $sessionId: UUID
    $search: String
    $isCompleted: Boolean
    $offset: Int
    $limit: Int
    $ordering: String
    $enrolmentStatus: EnrolmentStatus
  ) {
    enrolments(
      userId: $userId
      sessionId: $sessionId
      search: $search
      isCompleted: $isCompleted
      offset: $offset
      limit: $limit
      ordering: $ordering
      enrolmentStatus: $enrolmentStatus
    ) {
      totalCount
      results {
        id
        progress
        status
        totalLectures
        totalLecturesCompleted
        course {
          id
          banner
          description
          title
        }
        enrolmentProgress {
          currentDuration
          isCompleted
          lecture {
            id
          }
        }
        semester {
          name
          id
          endSemester
          startSemester
        }
        session {
          name
          id
          currentSemester {
            ...SemesterPart
          }
          expired
        }
      }
    }
  }
`;

export const GET_ASSIGNMENTS = gql`
  query getAssignments(
    $courseId: UUID
    $search: String
    $offset: Int
    $limit: Int
    $ordering: String
    $dueDate: Date
    $status: AssignmentStatus
  ) {
    assignments(
      courseId: $courseId
      search: $search
      offset: $offset
      limit: $limit
      ordering: $ordering
      status: $status
      dueDate: $dueDate
    ) {
      totalCount
      results {
        id
        title
        startDate
        dueDate
        submission
        course {
          enrolled
        }
        files {
          assignmentFiles {
            status
            dueDate
            id
          }
          file
          fileSize
          id
        }
        body
        status
        assignmentSubmissions {
          id
          body
          assignment {
            id
            status
          }
        }
      }
    }
  }
`;

export const GET_ASSIGNMENT_BY_ID = gql`
  ${CORE_ASSIGNMENT_FIELDS}
  query getAssignment($assignmentId: UUID) {
    assignment(assignmentId: $assignmentId) {
      ...AssignmentPart
    }
  }
`;

export const GET_ASSIGNMENT_SUBMISSIONS = gql`
  ${CORE_ASSIGNMENT_SUBMISSION_FIELDS}
  query getAssignmentSubmission(
    $courseId: UUID
    $assignmentId: UUID
    $search: String
    $offset: Int
    $limit: Int
    $ordering: String
  ) {
    assignmentSubmissions(
      courseId: $courseId
      assignmentId: $assignmentId
      search: $search
      offset: $offset
      limit: $limit
      ordering: $ordering
    ) {
      totalCount
      results {
        ...AssignmentSubmissionPart
      }
    }
  }
`;

export const GET_ASSIGNMENT_DOCUMENTS = gql`
  query assignmentDocuments(
    $assignmentId: UUID
    $search: String
    $offset: Int
    $limit: Int
    $ordering: String
  ) {
    assignmentDocuments(
      assignmentId: $assignmentId
      search: $search
      offset: $offset
      limit: $limit
      ordering: $ordering
    ) {
      totalCount
      results {
        id
        file
        fileSize
      }
    }
  }
`;

export const GET_ASSIGNMENT_SUBMISSION_BY_ID = gql`
  ${CORE_ASSIGNMENT_SUBMISSION_FIELDS}
  query queryAssignmentSubmission($submissionId: UUID) {
    assignmentSubmission(submissionId: $submissionId) {
      ...AssignmentSubmissionPart
    }
  }
`;

export const ASSIGNMENT_OVERVIEW = gql`
  query assignmentOverview($assignmentId: UUID) {
    assignmentOverview(assignmentId: $assignmentId) {
      submissionCount
      lowestScore
      highestScore
      totalEnrolledSubmitted
      enrollmentCount
      averageScore
      scoreChart {
        title
        value
      }
    }
  }
`;

export const GET_ASSESSMENT_SUBMISSIONS = gql`
  ${CORE_ASSESSMENT_SUBMISSION_FIELDS}
  query getAssessmentSubmissions($assessmentId: UUID, $userId: UUID, $offset: Int, $limit: Int) {
    assessmentSubmissions(
      assessmentId: $assessmentId
      userId: $userId
      offset: $offset
      limit: $limit
    ) {
      totalCount
      results {
        ...AssessmentSubmissionPart
      }
    }
  }
`;

export const GET_ASSESSMENT_SUBMISSION_BY_ID = gql`
  ${CORE_ASSESSMENT_SUBMISSION_FIELDS}
  query getAssessmentSubmission($assessmentSubmissionId: UUID) {
    assessmentSubmission(assessmentSubmissionId: $assessmentSubmissionId) {
      ...AssessmentSubmissionPart
    }
  }
`;

export const GET_ASSESSMENT_GRADES = gql`
  ${CORE_ASSESSMENT_GRADE_FIELDS}
  query assessmentGrades($assessmentId: UUID, $offset: Int, $limit: Int) {
    assessmentGrades(assessmentId: $assessmentId, offset: $offset, limit: $limit) {
      totalCount
      results {
        ...AssessmentGradePart
      }
    }
  }
`;

export const GET_ASSESSMENT_GRADE_BY_ID = gql`
  ${CORE_ASSESSMENT_GRADE_FIELDS}
  query assessmentGrade($assessmentGradeId: UUID) {
    assessmentGrade(assessmentGradeId: $assessmentGradeId) {
      ...AssessmentGradePart
    }
  }
`;

export const GET_COURSE_ASSESSMENT_BY_ID = gql`
  ${CORE_ASSESSMENT_FIELDS}
  query getAssessment($assessmentId: UUID) {
    assessment(assessmentId: $assessmentId) {
      ...AssessmentPart
    }
  }
`;

export const GET_ALL_ASSESSMENTS = gql`
  ${CORE_ASSESSMENT_FIELDS}
  query assessments(
    $courseId: UUID
    $instructorId: UUID
    $status: AssessmentStatus
    $search: String
    $dueDate: Date
    $startDate: Date
    $offset: Int
    $limit: Int
    $ordering: String
    $isGlobalAssessment: Boolean
  ) {
    assessments(
      courseId: $courseId
      instructorId: $instructorId
      status: $status
      search: $search
      offset: $offset
      limit: $limit
      ordering: $ordering
      dueDate: $dueDate
      startDate: $startDate
      isGlobalAssessment: $isGlobalAssessment
    ) {
      totalCount
      pending
      completed
      results {
        ...AssessmentPart
      }
    }
  }
`;

export const GET_ASSESSMENT_OVERVIEW = gql`
  query assessmentOverview($assessmentId: UUID) {
    assessmentOverview(assessmentId: $assessmentId) {
      submissionCount
      lowestScore
      highestScore
      totalEnrolledSubmitted
      learnersEnrolledCount
      averageScore
      scoreChart {
        title
        value
      }
    }
  }
`;

export const GET_ALL_ASSESSMENT_GRADES = gql`
  ${CORE_ASSESSMENT_GRADE_FIELDS}
  query assessmentGrades($assessmentId: UUID, $search: String, $offset: Int, $limit: Int) {
    assessmentGrades(assessmentId: $assessmentId, search: $search, offset: $offset, limit: $limit) {
      totalCount
      results {
        ...AssessmentGradePart
      }
    }
  }
`;

export const GET_COURSE_CATEGORY_BY_ID = gql`
  ${CORE_CATEGORY_FIELDS}
  ${CORE_CATEGORY_FILTER_FIELDS}
  query getCourseCategory($categoryId: UUID, $asFilter: Boolean = false) {
    category(categoryId: $categoryId) {
      ...CategoryPart @skip(if: $asFilter)
      ...CategoryFilterPart @include(if: $asFilter)
    }
  }
`;

export const GET_RATINGS = gql`
  ${CORE_RATING_FIELDS}
  query getRatings(
    $institutionId: UUID
    $rateType: RateTypeEnum
    $courseId: UUID
    $instructorId: UUID
    $search: String
    $offset: Int
    $limit: Int
    $ordering: String
  ) {
    ratings(
      institutionId: $institutionId
      rateType: $rateType
      courseId: $courseId
      instructorId: $instructorId
      search: $search
      offset: $offset
      limit: $limit
      ordering: $ordering
    ) {
      totalCount
      results {
        ...RatingPart
      }
    }
  }
`;

export const GET_COURSE_ENROLLMENT_STAT = gql`
  query getCourseEnrolment($facultyIds: [UUID], $asc: Boolean, $courseIds: [UUID]) {
    courseEnrollments(facultyIds: $facultyIds, asc: $asc, courseIds: $courseIds) {
      id
      title
      code
      totalEnrolled
      department {
        id
        faculty {
          id
          name
        }
      }
    }
  }
`;

export const GET_FACULTY_DEVIATION = gql`
  query getFacultyDeviations($facultyId: UUID) {
    facultyDeviations(facultyId: $facultyId) {
      id
      name
      totalDeviations
    }
  }
`;

export const GET_FACULTY_DEPARTMENTS_DEVIATION = gql`
  query getFacultyDepartmentDeviation($facultyId: UUID, $deviatedFacultyId: UUID) {
    facultyDepartmentDeviations(facultyId: $facultyId, deviatedFacultyId: $deviatedFacultyId) {
      faculty {
        id
        name
      }
      id
      name
      totalDeviations
    }
  }
`;

export const GET_DEPARTMENT_LEVEL_DEVIATION = gql`
  query getFacultyDepartmentLevelDeviation($facultyId: UUID, $deviatedDepartmentId: UUID) {
    facultyDepartmentLevelDeviations(
      facultyId: $facultyId
      deviatedDepartmentId: $deviatedDepartmentId
    ) {
      id
      name
      usersCount
      totalDeviations
    }
  }
`;
