import { gql } from '@apollo/client';
import {
  CORE_ASSIGNMENT_FIELDS,
  CORE_ASSIGNMENT_SUBMISSION_FIELDS,
  CORE_EXISTING_USER_FULL_FIELDS,
  CORE_INSTITUTION_FIELDS,
  CORE_LEVEL_FIELDS,
  CORE_SEMESTER_FIELDS,
  CORE_USER_FIELDS,
  CORE_USER_EXPORT_FIELDS,
} from '../fragments';

export const USERS_STATISTICS = gql`
  query getUsersStatistics {
    userStatistics {
      name
      total
      active
      inActive
    }
  }
`;

export const GET_USERS = gql`
  ${CORE_USER_FIELDS}
  ${CORE_USER_EXPORT_FIELDS}
  ${CORE_INSTITUTION_FIELDS}
  query getUsers(
    $role: SignupRoleEnum
    $search: String
    $offset: Int
    $limit: Int
    $department: UUID
    $level: UUID
    $institutionId: UUID
    $program: UUID
    $programType: AcademicProgramTypeEnumList
    $asExport: Boolean = false
  ) {
    users(
      search: $search
      offset: $offset
      limit: $limit
      role: $role
      department: $department
      level: $level
      institutionId: $institutionId
      program: $program
      programType: $programType
    ) {
      totalCount
      active
      inactive
      results {
        ...UserExportPart @include(if: $asExport)
        ...UserPart @skip(if: $asExport)
        programType @skip(if: $asExport)
        department {
          id
          name
        }
        faculty {
          id
          name
        }
      }
    }
  }
`;

export const GET_USER_DETAIL = gql`
  ${CORE_USER_FIELDS}
  ${CORE_LEVEL_FIELDS}
  query getUserById($userId: UUID) {
    user(userId: $userId) {
      interests {
        id
        name
        description
        thumbnail
        numberOfView
        contentCount
      }
      ...UserPart
      department {
        id
        name
      }
      userinformation {
        about
        address
        city
        nin
        dateOfBirth
        id
        lgaOfOrigin
        nationality
        postalCode
        state
        stateOfOrigin
      }
    }
  }
`;

export const GET_LEARNER_ENROLMENT_COURSES = gql`
  ${CORE_SEMESTER_FIELDS}
  query getLearnerCourses(
    $userId: UUID
    $search: String
    $isCompleted: Boolean
    $offset: Int
    $limit: Int
    $ordering: String
    $enrolmentStatus: EnrolmentStatus
  ) {
    enrolments(
      userId: $userId
      search: $search
      isCompleted: $isCompleted
      limit: $limit
      offset: $offset
      ordering: $ordering
      enrolmentStatus: $enrolmentStatus
    ) {
      totalCount
      results {
        id
        progress
        status
        course {
          id
          banner
          description
          title
          code
        }
        enrolmentProgress {
          currentDuration
          isCompleted
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

export const GET_USER_COURSE_STAT = gql`
  query getUserCourseStatById($userId: UUID, $sessionId: UUID) {
    courseOverview(userId: $userId, sessionId: $sessionId) {
      instructorTotalCourse
      instructorLearnerCount
      instructorCompletedCourse
      learnerOngoingCourse
      learnerEnrolledCourse
      learnerSectionPending
      learnerAverageQuizScore
      learnerSectionCompleted
      learnerCompletedCourse
    }
  }
`;

export const GET_ASSIGNMENT_BY_ID = gql`
  ${CORE_ASSIGNMENT_SUBMISSION_FIELDS}
  ${CORE_ASSIGNMENT_FIELDS}
  query getAssignmentById($assignmentId: UUID) {
    assignment(assignmentId: $assignmentId) {
      ...AssignmentPart
      assignmentSubmissions {
        ...AssignmentSubmissionPart
      }
    }
  }
`;

export const GET_USER = gql`
  query {
    loggedInUser {
      id
    }
  }
`;

export const GET_USER_LEVEL = gql`
  query getLevels {
    levels {
      totalCount
      results {
        id
        name
      }
    }
  }
`;

export const GET_EXISTING_USERS = gql`
  ${CORE_USER_FIELDS}
  query existingUsers($search: String, $offset: Int, $limit: Int) {
    existingUsers(search: $search, offset: $offset, limit: $limit) {
      totalCount
      migrated
      pending
      results {
        ...UserPart
      }
    }
  }
`;

export const GET_LECTURERS_RATING = gql`
  query getLecturerRating($facultyIds: [UUID], $limit: Int, $offset: Int, $ordering: String) {
    lecturerRatings(facultyIds: $facultyIds, limit: $limit, offset: $offset, ordering: $ordering) {
      totalCount
      active
      inactive
      results {
        id
        firstname
        lastname
        avgRatings
      }
    }
  }
`;

export const GET_USER_STATISTICS = gql`
  query getUserStatistics($facultyIds: [UUID]) {
    courseUserStatistics(facultyIds: $facultyIds) {
      publishedCourseCount
      draftCourseCount
      users {
        totalStudents
        totalLecturers
        totalSchoolAdmin
      }
      activeUsers {
        totalStudents
        totalLecturers
        totalSchoolAdmin
      }
      inactiveUsers {
        totalStudents
        totalLecturers
        totalSchoolAdmin
      }
    }
  }
`;
