import { gql } from '@apollo/client';
import { CORE_COURSE_FIELDS } from 'graphql/fragments';

export const CREATE_COURSE = gql`
  ${CORE_COURSE_FIELDS}
  mutation createCourse($newCourse: CourseInputType!) {
    createCourse(newCourse: $newCourse) {
      ok
      errors {
        messages
        field
      }
      course {
        ...CoursePart
      }
    }
  }
`;

export const UPDATE_COURSE = gql`
  ${CORE_COURSE_FIELDS}
  mutation updateCourse($newCourse: UpdateCourseInputType!, $banner: Upload, $id: ID!) {
    updateCourse(id: $id, banner: $banner, newCourse: $newCourse) {
      ok
      errors {
        messages
        field
      }
      course {
        ...CoursePart
      }
    }
  }
`;

export const CREATE_COURSE_SECTION = gql`
  mutation createCourseSection(
    $title: String!
    $course: ID!
    $sectionLectures: [ID!]
    $description: String
  ) {
    createSection(
      newSection: {
        title: $title
        description: $description
        course: $course
        sectionLectures: $sectionLectures
      }
    ) {
      ok
      errors {
        messages
      }
      section {
        id
        title
        description
        sectionLectures {
          id
          title
        }
      }
    }
  }
`;

export const UPDATE_COURSE_SECTION = gql`
  mutation updateCourseSection(
    $title: String!
    $sectionId: ID!
    $sectionLectures: [ID!]
    $description: String
  ) {
    updateSection(
      id: $sectionId
      newSection: { title: $title, description: $description, sectionLectures: $sectionLectures }
    ) {
      ok
      errors {
        messages
      }
      section {
        id
        title
        description
        sectionLectures {
          id
          title
        }
      }
    }
  }
`;

export const CREATE_RESOURCE = gql`
  mutation createResource($file: Upload, $course: ID!, $lecture: ID) {
    createResource(file: $file, newResource: { course: $course, lecture: $lecture }) {
      ok
      errors {
        messages
      }
      resource {
        id
      }
    }
  }
`;

export const CREATE_LECTURE = gql`
  mutation createLecture($file: Upload, $newLecture: LectureCreateGenericType!) {
    createLecture(file: $file, newLecture: $newLecture) {
      ok
      errors {
        messages
        field
      }
      lecture {
        id
        title
      }
    }
  }
`;

export const UPDATE_LECTURE = gql`
  mutation updateLecture($lectureId: ID!, $file: Upload, $newLecture: LectureUpdateGenericType!) {
    updateLecture(id: $lectureId, file: $file, newLecture: $newLecture) {
      ok
      errors {
        messages
        field
      }
      lecture {
        id
        title
      }
    }
  }
`;

export const UPDATE_LECTURE_POSITION = gql`
  mutation updateLecturePosition($lecturePosition: SectionLecturePositionInputType!) {
    lecturePosition(lecturePosition: $lecturePosition) {
      ok
      errors {
        messages
      }
      success {
        messages
      }
    }
  }
`;

export const CREATE_UPDATE_PROGRESS = gql`
  mutation createUpdateProgress($lectureProgress: LectureProgressInputType!) {
    createUpdateProgress(lectureProgress: $lectureProgress) {
      ok
      errors {
        messages
      }
    }
  }
`;
