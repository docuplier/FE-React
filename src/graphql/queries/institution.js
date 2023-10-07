import { gql } from '@apollo/client';
import {
  CORE_FACULTY_FIELDS,
  CORE_FACULTY_FILTER_FIELDS,
  CORE_INSTITUTION_FIELDS,
  CORE_INSTITUTION_TRUNCATED_FIELDS,
  CORE_USER_FIELDS,
  CORE_DEPARTMENT_FIELDS,
  CORE_PROGRAM_TYPE_FILTER_FIELDS,
  CORE_PROGRAM_TYPE_FIELDS,
  CORE_SESSION_FIELDS,
  CORE_LEVEL_FIELDS,
  CORE_SESSION_FILTER_FIELDS,
} from 'graphql/fragments';

export const GET_LEVELS_QUERY = gql`
  query getlevels(
    $departmentId: UUID
    $programType: ProgramTypeEnumList
    $program: UUID
    $institutionId: UUID
  ) {
    levels(
      departmentId: $departmentId
      programType: $programType
      program: $program
      institutionId: $institutionId
    ) {
      totalCount
      results {
        id
        name
      }
    }
  }
`;

export const GET_INSTITUTIONS = gql`
  ${CORE_INSTITUTION_FIELDS}
  ${CORE_INSTITUTION_TRUNCATED_FIELDS}
  query getInstitution(
    $institutionIds: [UUID]
    $search: String
    $offset: Int
    $limit: Int
    $status: InstitutionStatusEnumList
    $showUserStats: Boolean = false
    $showInstitutionsStats: Boolean = false
    $truncateResults: Boolean = true
  ) {
    institutions(
      institutionIds: $institutionIds
      search: $search
      offset: $offset
      limit: $limit
      status: $status
    ) {
      totalCount @include(if: $showInstitutionsStats)
      draft @include(if: $showInstitutionsStats)
      active @include(if: $showInstitutionsStats)
      inactive @include(if: $showInstitutionsStats)
      results {
        ...InstitutionPart @skip(if: $truncateResults)
        ...InstitutionTruncatedPart @include(if: $truncateResults)
        studentCount @include(if: $showInstitutionsStats)
        lecturerCount @include(if: $showInstitutionsStats)
        userMaleCount @include(if: $showUserStats)
        userFemaleCount @include(if: $showUserStats)
        users {
          totalStudents @include(if: $showUserStats)
          totalLecturers @include(if: $showUserStats)
          totalSchoolAdmin @include(if: $showUserStats)
        }
        activeUsers {
          totalStudents @include(if: $showUserStats)
          totalLecturers @include(if: $showUserStats)
          totalSchoolAdmin @include(if: $showUserStats)
        }
        inactiveUsers {
          totalStudents @include(if: $showUserStats)
          totalLecturers @include(if: $showUserStats)
          totalSchoolAdmin @include(if: $showUserStats)
        }
      }
    }
  }
`;

export const GET_FACULTY_BY_ID_QUERY = gql`
  ${CORE_FACULTY_FIELDS}
  query getFaculty($facultyId: UUID) {
    faculty(facultyId: $facultyId) {
      ...FacultyPart
    }
  }
`;

export const GET_DEPARTMENTS_QUERY = gql`
  query getDepartments(
    $institutionId: UUID
    $facultyId: UUID
    $search: String
    $offset: Int
    $limit: Int
    $ordering: String
    $active: Boolean
  ) {
    departments(
      institutionId: $institutionId
      facultyId: $facultyId
      search: $search
      offset: $offset
      limit: $limit
      ordering: $ordering
      active: $active
    ) {
      totalCount
      active
      inactive
      results {
        name
        abbreviation
        isActive
        id
        studentCount
        publishedCourseCount
      }
    }
  }
`;

export const GET_INSTITUTIONS_BY_ID = gql`
  ${CORE_INSTITUTION_FIELDS}
  ${CORE_INSTITUTION_TRUNCATED_FIELDS}
  query getInstitutionById($institutionId: UUID, $truncateResults: Boolean = false) {
    institution(institutionId: $institutionId) {
      ...InstitutionPart @skip(if: $truncateResults)
      ...InstitutionTruncatedPart @include(if: $truncateResults)
    }
  }
`;

export const GET_FACULTIES_QUERY = gql`
  ${CORE_USER_FIELDS}
  ${CORE_INSTITUTION_FIELDS}
  ${CORE_FACULTY_FIELDS}
  ${CORE_FACULTY_FILTER_FIELDS}
  query getFaculties(
    $institutionId: UUID
    $offset: Int
    $limit: Int
    $active: Boolean
    $asFilter: Boolean = false
    $showUserStats: Boolean = false
  ) {
    faculties(institutionId: $institutionId, offset: $offset, limit: $limit, active: $active) {
      totalCount
      active
      inactive
      results {
        ...FacultyPart @skip(if: $asFilter)
        ...FacultyFilterPart @include(if: $asFilter)
        lecturerCount @include(if: $showUserStats)
        studentCount @include(if: $showUserStats)
        head {
          firstname @include(if: $showUserStats)
          lastname @include(if: $showUserStats)
        }
      }
    }
  }
`;

export const GET_PROGRAMS_QUERY = gql`
  ${CORE_PROGRAM_TYPE_FIELDS}
  ${CORE_PROGRAM_TYPE_FILTER_FIELDS}
  query getPrograms($institutionId: UUID, $offset: Int, $limit: Int, $asFilter: Boolean = false) {
    programs(institutionId: $institutionId, offset: $offset, limit: $limit) {
      totalCount
      results {
        ...ProgramTypeFilterPart @include(if: $asFilter)
        ...ProgramTypePart @skip(if: $asFilter)
      }
    }
  }
`;

export const GET_DEPARTMENT_BY_ID_QUERY = gql`
  ${CORE_DEPARTMENT_FIELDS}
  query getDepartment($departmentId: UUID) {
    department(departmentId: $departmentId) {
      ...DepartmentPart
    }
  }
`;

export const GET_PROGRAM_BY_ID_QUERY = gql`
  ${CORE_PROGRAM_TYPE_FIELDS}
  query program($programId: UUID) {
    program(programId: $programId) {
      ...ProgramTypePart
    }
  }
`;

export const GET_SESSIONS_QUERY = gql`
  ${CORE_SESSION_FIELDS}
  ${CORE_SESSION_FILTER_FIELDS}
  query getSessions(
    $institutionId: UUID
    $offset: Int
    $limit: Int
    $programId: UUID
    $asFilter: Boolean = false
  ) {
    sessions(institutionId: $institutionId, offset: $offset, limit: $limit, programId: $programId) {
      totalCount
      results {
        ...SessionPart @skip(if: $asFilter)
        ...SessionFilterPart @include(if: $asFilter)
      }
    }
  }
`;

export const GET_LEVELS = gql`
  ${CORE_LEVEL_FIELDS}
  query getLevels(
    $program: UUID
    $programType: ProgramTypeEnumList
    $departmentId: UUID
    $institutionId: UUID
    $offset: Int
    $limit: Int
    $roles: SignupRoleEnum
  ) {
    levels(
      program: $program
      programType: $programType
      departmentId: $departmentId
      institutionId: $institutionId
      offset: $offset
      limit: $limit
      roles: $roles
    ) {
      totalCount
      results {
        ...LevelPart
      }
    }
  }
`;

export const GET_SESSION_BY_ID_QUERY = gql`
  ${CORE_SESSION_FIELDS}
  query session($sessionId: UUID) {
    session(sessionId: $sessionId) {
      ...SessionPart
    }
  }
`;

export const GET_LEVEL_BY_ID = gql`
  ${CORE_LEVEL_FIELDS}
  query getLevelById($levelId: UUID) {
    level(levelId: $levelId) {
      ...LevelPart
    }
  }
`;

export const GET_INSTITUTION_OVERVIEW = gql`
  query getInstitutionOverview($institutionId: UUID) {
    institutionOverview(institutionId: $institutionId) {
      courseCount
      categoryCount
      subcategoryCount
    }
  }
`;

export const GET_PROGRAM_LEVELS = gql`
  query levels($program: UUID, $departmentId: UUID) {
    levels(program: $program, departmentId: $departmentId) {
      totalCount
      results {
        id
        name
      }
    }
  }
`;

export const GET_FACULTY_STATISTICS = gql`
  query getFacultystat($facultyIds: [UUID]) {
    facultyStatistics(facultyIds: $facultyIds) {
      name
      id
      departmentCount
      studentCount
      lecturerCount
      userCount
      publishedCourseCount
      draftCourseCount
      userMaleCount
      userFemaleCount
      ownDepartments {
        id
        name
        userMaleCount
        userFemaleCount
      }
    }
  }
`;

export const GET_ALL_INSTITUTIONS = gql`
  ${CORE_INSTITUTION_FIELDS}
  query allInstitutions {
    allInstitutions {
      ...InstitutionPart
    }
  }
`;
