import { gql } from '@apollo/client';

export const CREATE_TASK = gql`
  mutation createTask($newTask: CreateTaskInputType!) {
    createTask(newTask: $newTask) {
      task {
        id
        title
      }
      ok
      errors {
        field
        messages
      }
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation updateTask($newUpdateTask: UpdateTaskInputType!, $id: ID!) {
    updateTask(newTask: $newUpdateTask, id: $id) {
      task {
        title
        id
      }
      ok
      errors {
        field
        messages
      }
    }
  }
`;

export const DELETE_TASK = gql`
  mutation deleteTask($id: ID!) {
    deleteTask(id: $id) {
      ok
      errors {
        field
        messages
      }
    }
  }
`;

export const CREATE_TASK_GROUP = gql`
  mutation createTaskGroup($newTaskgroup: CreateTaskGroupInputType!) {
    createTaskGroup(newTaskgroup: $newTaskgroup) {
      ok
      errors {
        field
        messages
      }
      taskgroup {
        id
      }
    }
  }
`;

export const UPDATE_TASK_GROUP = gql`
  mutation updateTaskGroup($newUpdateTaskgroup: UpdateTaskGroupInputType!, $id: ID!) {
    updateTaskGroup(newTaskgroup: $newUpdateTaskgroup, id: $id) {
      ok
      errors {
        field
        messages
      }
    }
  }
`;

export const TOGGLE_LIKE = gql`
  mutation toggleLike($newLike: CreateTaskGroupLikeInputType!) {
    toggleLike(newLike: $newLike) {
      newLike {
        id
      }
      ok
      errors {
        field
        messages
      }
    }
  }
`;

export const TASK_SUBMISSION = gql`
  mutation submitTask($groupId: UUID!, $submissions: [CreateTaskSubmissionType]) {
    submitTask(groupId: $groupId, submissions: $submissions) {
      ok
      errors {
        messages
        field
      }
      submissions {
        id
      }
    }
  }
`;
