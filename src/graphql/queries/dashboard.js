import { gql } from '@apollo/client';
import { CORE_SESSION_FIELDS } from 'graphql/fragments';

export const GET_STUDENT_ACTIVITIES = gql`
  query getActivities($startDate: Date, $endDate: Date) {
    studentActivities(startDate: $startDate, endDate: $endDate) {
      date
      assessments {
        title
        dueTime
      }
      assignments {
        title
      }
      liveSessions {
        title
        startDatetime
      }
    }
  }
`;

export const GET_INTRUCTOR_OVERVIEW = gql`
  query instructorOverview {
    instructorOverview {
      averageCompletionRate
      averagePassRate
      expected
      enrolees
      auditees
      registered
    }
  }
`;

export const GET_COURSE_ENROLLMENT_TREND = gql`
  query courseEnrolmentTrend($course: UUID, $program: UUID) {
    courseEnrolmentTrend(course: $course, program: $program) {
      id
      name
      completionRate
      enrolmentRate
    }
  }
`;

export const GET_INSTITUTIONS_OVERVIEW = gql`
  query institutionsOverview($institutionIds: [UUID]) {
    institutionsOverview(institutionIds: $institutionIds) {
      totalFaculties
      totalPrograms
      totalCourses
      totalUploadedContents
      totalAccessedContents
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

export const GET_INSTITUTIONS_ENROLLMENT_TREND = gql`
  ${CORE_SESSION_FIELDS}
  query institutionsEnrolmentTrend($institutionIds: [UUID], $semesterId: UUID) {
    institutionsEnrolmentTrend(institutionIds: $institutionIds, semesterId: $semesterId) {
      ...SessionPart
    }
  }
`;

export const GET_SESSIONS = gql`
  query sessions($institutionId: UUID, $programId: UUID) {
    sessions(institutionId: $institutionId, programId: $programId) {
      results {
        id
        name
        institution {
          id
        }
        program {
          id
        }
      }
    }
  }
`;
export const GET_INSTRUCTOR_SUMMARY = gql`
  query instructorSummary {
    instructorSummary
  }
`;

export const GET_NOTIFICATIONS = gql`
  query notifications(
    $isRead: Boolean
    $search: String
    $offset: Int
    $limit: Int
    $ordering: String
    $workbench: Boolean
  ) {
    notifications(
      isRead: $isRead
      search: $search
      offset: $offset
      limit: $limit
      ordering: $ordering
      workbench: $workbench
    ) {
      totalCount
      results {
        id
        createdAt
        notification {
          id
          data
        }
      }
    }
  }
`;

export const GET_INSTITUTIONS_FIELD_OF_INTEREST = gql`
  query institutionsFieldOfInterests($institutionIds: [UUID]) {
    institutionsFieldOfInterests(institutionIds: $institutionIds) {
      id
      name
      userCount
    }
  }
`;
