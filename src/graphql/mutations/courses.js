import { gql } from '@apollo/client/core';
import {
  CORE_ASSIGNMENT_FIELDS,
  CORE_ASSIGNMENT_SUBMISSION_FIELDS,
  CORE_CATEGORY_FIELDS,
  CORE_COURSE_NOTE_FIELDS,
  CORE_COURSE_QUESTION_FIELDS,
  CORE_COURSE_REPLY_FIELDS,
  CORE_COURSE_FIELDS,
  CORE_ASSESSMENT_GRADE_FIELDS,
  CORE_ASSESSMENT_FIELDS,
  CORE_ASSESSMENT_QUESTION_FIELDS,
  CORE_ASSESSMENT_SUBMISSION_FIELDS,
  CORE_RATING_FIELDS,
} from 'graphql/fragments';

export const CREATE_NOTE = gql`
  ${CORE_COURSE_NOTE_FIELDS}
  mutation createNote($newNote: NoteCreateGenericType!) {
    createNote(newNote: $newNote) {
      ok
      errors {
        field
        messages
      }
      note {
        ...NotePart
      }
    }
  }
`;

export const BULK_UPLOAD_RESOURCE = gql`
  mutation bulkUploadResource($uploadDetails: BulkUploadInputType!) {
    bulkUpload(uploadDetails: $uploadDetails) {
      ok
      errors {
        messages
        field
      }
      success {
        messages
        field
      }
    }
  }
`;

export const CREATE_QUESTION = gql`
  ${CORE_COURSE_QUESTION_FIELDS}
  mutation createQuestion($newQuestion: QuestionCreateGenericType!) {
    createQuestion(newQuestion: $newQuestion) {
      ok
      errors {
        field
        messages
      }
      question {
        ...QuestionPart
      }
    }
  }
`;

export const UPDATE_NOTE = gql`
  ${CORE_COURSE_NOTE_FIELDS}
  mutation updateNote($newNote: NoteUpdateGenericType!, $id: ID!) {
    updateNote(newNote: $newNote, id: $id) {
      ok
      errors {
        field
        messages
      }
      note {
        ...NotePart
      }
    }
  }
`;

export const DELETE_NOTE = gql`
  ${CORE_COURSE_NOTE_FIELDS}
  mutation deleteNote($id: ID!) {
    deleteNote(id: $id) {
      ok
      errors {
        field
        messages
      }
      note {
        ...NotePart
      }
    }
  }
`;

export const CREATE_REPLY = gql`
  ${CORE_COURSE_REPLY_FIELDS}
  mutation createReply($newReply: ReplyCreateGenericType!) {
    createReply(newReply: $newReply) {
      ok
      errors {
        field
        messages
      }
      reply {
        ...ReplyPart
      }
    }
  }
`;

export const LIKE_QUESTION_OR_REPLY = gql`
  mutation like($likeUnlike: LikeUnlikeType!) {
    like(likeUnlike: $likeUnlike) {
      ok
      errors {
        messages
        field
      }
      success {
        messages
        field
      }
    }
  }
`;

export const CREATE_ENROLLMENT = gql`
  mutation createEnrollment($newEnrolment: EnrolmentCreateGenericType!) {
    createEnrolment(newEnrolment: $newEnrolment) {
      ok
      enrolment {
        id
        status
      }
      errors {
        field
        messages
      }
    }
  }
`;

export const DELETE_ENROLLMENT = gql`
  mutation deleteEnrollment($id: ID!) {
    deleteEnrolment(id: $id) {
      ok
      enrolment {
        id
        status
      }
      errors {
        field
        messages
      }
    }
  }
`;

export const CREATE_CATEGORY = gql`
  ${CORE_CATEGORY_FIELDS}
  mutation createCategory($title: String!, $description: String, $parent: ID) {
    createCategory(newCategory: { title: $title, description: $description, parent: $parent }) {
      ok
      errors {
        field
        messages
      }
      category {
        ...CategoryPart
      }
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  ${CORE_CATEGORY_FIELDS}
  mutation updateCategory($categoryId: ID!, $title: String!, $description: String) {
    updateCategory(id: $categoryId, newCategory: { title: $title, description: $description }) {
      ok
      errors {
        field
        messages
      }
      category {
        ...CategoryPart
      }
    }
  }
`;

export const DELETE_ASSIGNMENT = gql`
  mutation deleteAssignment($id: ID!, $deleteFiles: [UUID], $files: [Upload]) {
    deleteAssignment(id: $id, deleteFiles: $deleteFiles, files: $files) {
      ok
      errors {
        field
        messages
      }
    }
  }
`;

export const UPDATE_ASSIGNMENT_SUBMISSION = gql`
  ${CORE_ASSIGNMENT_FIELDS}
  ${CORE_ASSIGNMENT_SUBMISSION_FIELDS}
  mutation updateAssignmentSubmission(
    $assignment: ID!
    $body: String!
    $remark: String
    $score: Float
    $files: [Upload]
    $id: ID!
  ) {
    updateAssignmentSubmission(
      newAssignmentsubmission: {
        assignment: $assignment
        body: $body
        remark: $remark
        score: $score
      }
      id: $id
      files: $files
    ) {
      ok
      assignmentsubmission {
        ...AssignmentSubmissionPart
        id
        assignment {
          ...AssignmentPart
        }
      }
      errors {
        field
        messages
      }
    }
  }
`;

export const CREATE_ASSIGNMENT_SUBMISSION = gql`
  mutation createAssignmentSubmission(
    $newAssignmentsubmission: AssignmentSubmissionCreateGenericType!
    $files: [Upload]
  ) {
    createAssignmentSubmission(newAssignmentsubmission: $newAssignmentsubmission, files: $files) {
      ok
      assignmentsubmission {
        id
      }
      errors {
        field
        messages
      }
    }
  }
`;

export const UPDATE_ASSIGNMENT = gql`
  ${CORE_ASSIGNMENT_FIELDS}
  mutation updateAssignment(
    $newAssignment: AssignmentUpdateGenericType!
    $deleteFiles: [UUID]
    $files: [Upload]
    $assignmentId: ID!
  ) {
    updateAssignment(
      newAssignment: $newAssignment
      id: $assignmentId
      deleteFiles: $deleteFiles
      files: $files
    ) {
      ok
      errors {
        field
        messages
      }
      assignment {
        ...AssignmentPart
      }
    }
  }
`;

export const EXPORT_RESULT_GRADES_ASSESMENT = gql`
  mutation downloadGrade($assessmentId: UUID) {
    downloadGrade(assessmentId: $assessmentId) {
      ok
      success {
        messages
        field
      }
      errors {
        messages
      }
    }
  }
`;

export const EXPORT_RESULT_GRADES_ASSIGNMENT = gql`
  mutation downloadAssignment($assignmentId: UUID) {
    downloadAssignment(assignmentId: $assignmentId) {
      ok
      success {
        messages
        field
      }
      errors {
        messages
      }
    }
  }
`;

export const CREATE_ASSIGNMENT = gql`
  ${CORE_ASSIGNMENT_FIELDS}
  mutation createAssignment(
    $title: String!
    $body: String!
    $files: [Upload]
    $course: ID!
    $dueDate: CustomDate
    $startDate: CustomDate
    $maxScore: Float!
    $status: AssignmentStatusEnumCreate
    $deleteFiles: [UUID]
  ) {
    createAssignment(
      files: $files
      deleteFiles: $deleteFiles
      newAssignment: {
        title: $title
        body: $body
        course: $course
        dueDate: $dueDate
        status: $status
        startDate: $startDate
        maxScore: $maxScore
      }
    ) {
      ok
      errors {
        messages
        field
      }
      assignment {
        ...AssignmentPart
      }
    }
  }
`;

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

export const UPDATE_ASSESSMENT_GRADE = gql`
  ${CORE_ASSESSMENT_GRADE_FIELDS}
  mutation updateAssessmentGrade($submissionDetails: UpdateSubmissionGradeInputType) {
    updateAssessmentGrade(submissionDetails: $submissionDetails) {
      ok
      assessmentGrade {
        ...AssessmentGradePart
      }
      errors {
        messages
        field
      }
    }
  }
`;

export const CREATE_ASSESSMENT_SUBMISSION = gql`
  ${CORE_ASSESSMENT_SUBMISSION_FIELDS}
  mutation createAssessmentSubmission($newAssessmentsubmission: AssessmentSubmissionInputType!) {
    createAssessmentSubmission(newAssessmentsubmission: $newAssessmentsubmission) {
      ok
      assessmentsubmission {
        ...AssessmentSubmissionPart
      }
      errors {
        messages
        field
      }
    }
  }
`;

export const CREATE_COURSE_ASSESSMENT = gql`
  ${CORE_ASSESSMENT_FIELDS}
  mutation createAssessment($newAssessment: AssessmentInputType!) {
    createAssessment(newAssessment: $newAssessment) {
      ok
      errors {
        field
        messages
      }
      assessment {
        ...AssessmentPart
      }
    }
  }
`;

export const CREATE_GLOBAL_ASSESSMENT = gql`
  ${CORE_ASSESSMENT_FIELDS}
  mutation createGlobalAssessment($newAssessment: AssessmentInputType!) {
    createGlobalAssessment(newAssessment: $newAssessment) {
      ok
      errors {
        field
        messages
      }
      assessment {
        ...AssessmentPart
      }
    }
  }
`;

export const DELETE_COURSE_ASSESSMENT_QUESTION = gql`
  ${CORE_ASSESSMENT_QUESTION_FIELDS}
  mutation deleteAssessmentQuestion($id: ID!) {
    deleteAssessmentQuestion(id: $id) {
      ok
      errors {
        field
        messages
      }
      assessmentquestion {
        ...AssessmentQuestionPart
      }
    }
  }
`;

export const START_ASSESSMENT = gql`
  mutation startAssessment($assessmentId: UUID!) {
    startAssessment(assessment: $assessmentId) {
      ok
      errors {
        field
        messages
      }
    }
  }
`;

export const MARK_ASSESSMENT_AS_COMPLETED = gql`
  mutation markAssessmentAsCompleted($assessmentId: UUID!) {
    completeAssessment(assessment: $assessmentId) {
      ok
      errors {
        field
        messages
      }
    }
  }
`;

export const UPSERT_RATING = gql`
  ${CORE_RATING_FIELDS}
  mutation createRating($rateInput: RatingInputType) {
    createRating(rateInput: $rateInput) {
      ok
      errors {
        field
        messages
      }
      rating {
        ...RatingPart
      }
    }
  }
`;
