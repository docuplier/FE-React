import { gql } from '@apollo/client';
import {
  TASK_FIELDS,
  TASK_GROUP_FIELDS,
  TASK_GROUP_POST_FIELD,
  REPLY_TASK_FIELD,
  TASK_SUBMISSION_FIELDS,
} from '../fragments';

export const TASK_AVAIL_USERS = gql`
  query taskAvalailableUsers($taskId: UUID, $search: String) {
    taskAvailableUsers(taskId: $taskId, search: $search) {
      id
      firstname
      lastname
      image
    }
  }
`;

export const GET_TASK = gql`
  ${TASK_FIELDS}
  query getTask($taskId: UUID) {
    task(taskId: $taskId) {
      ...taskPart
    }
  }
`;

export const GET_TASK_GROUP = gql`
  ${TASK_GROUP_FIELDS}
  query getTaskGroup($taskGroupId: UUID) {
    taskGroup(taskGroupId: $taskGroupId) {
      ...taskGroupPart
    }
  }
`;

export const GET_TASK_GROUPS = gql`
  ${TASK_GROUP_FIELDS}
  query getAllGroups($taskId: UUID) {
    taskGroups(taskId: $taskId) {
      ...taskGroupPart
    }
  }
`;

export const GET_ALL_TASKS = gql`
  ${TASK_FIELDS}
  query tasks(
    $courseId: UUID
    $search: String
    $offset: Int
    $limit: Int
    $ordering: String
    $archived: Boolean
  ) {
    tasks(
      courseId: $courseId
      search: $search
      offset: $offset
      limit: $limit
      ordering: $ordering
      archived: $archived
    ) {
      totalCount
      results {
        ...taskPart
      }
    }
  }
`;

export const GET_ALL_TASK_GROUPS = gql`
  ${TASK_GROUP_FIELDS}
  query taskGroups($taskId: UUID) {
    taskGroups(taskId: $taskId) {
      ...taskGroupPart
    }
  }
`;

export const GET_TASK_POSTS = gql`
  ${TASK_GROUP_POST_FIELD}
  query getPosts($groupId: UUID, $search: String, $offset: Int, $limit: Int, $ordering: String) {
    taskGroupPosts(
      groupId: $groupId
      search: $search
      offset: $offset
      limit: $limit
      ordering: $ordering
    ) {
      totalCount
      results {
        ...taskGroupPostPart
      }
    }
  }
`;

export const GET_TASK_POST = gql`
  ${TASK_GROUP_POST_FIELD}
  query getPost($postId: UUID) {
    taskGroupPost(postId: $postId) {
      ...taskGroupPostPart
    }
  }
`;

export const POST_REPLIES = gql`
  ${REPLY_TASK_FIELD}
  query postReplies($postId: UUID, $search: String, $offset: Int, $limit: Int, $ordering: String) {
    taskGroupReplies(
      postId: $postId
      search: $search
      offset: $offset
      limit: $limit
      ordering: $ordering
    ) {
      totalCount
      results {
        ...replyTaskPart
      }
    }
  }
`;

export const GET_TASK_SUBMISSIONS = gql`
  ${TASK_SUBMISSION_FIELDS}
  query taskSubmissions($taskId: UUID) {
    taskSubmissions(taskId: $taskId) {
      ...taskSubmissionPart
    }
  }
`;

export const GET_TASK_GROUP_SUBMISSIONS = gql`
  ${TASK_SUBMISSION_FIELDS}
  query groupSubmissions($groupId: UUID) {
    groupSubmissions(groupId: $groupId) {
      ...taskSubmissionPart
    }
  }
`;
