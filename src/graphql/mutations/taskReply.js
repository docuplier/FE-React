import { gql } from '@apollo/client';

export const CREATE_POST = gql`
  mutation createPost($newTaskgrouppost: CreateTaskGroupPostInputType!, $file: Upload) {
    createPost(newTaskgrouppost: $newTaskgrouppost, file: $file) {
      ok
      errors {
        messages
        field
      }
      taskgrouppost {
        id
      }
    }
  }
`;

export const REPLY_POST = gql`
  mutation replyPost($newTaskgrouppostreply: CreateTaskGroupPostReplyInputType!) {
    replyPost(newTaskgrouppostreply: $newTaskgrouppostreply) {
      ok
      errors {
        field
        messages
      }
      taskgrouppostreply {
        id
      }
    }
  }
`;

export const TOGGLE_LIKE = gql`
  mutation toggleLike($newLike: CreateTaskGroupLikeInputType!) {
    toggleLike(newLike: $newLike) {
      ok
      errors {
        field
        messages
      }
      newLike {
        id
      }
    }
  }
`;

export const CREATE_REPLY = gql`
  mutation createReply($newReply: ReplyCreateGenericType!) {
    createReply(newReply: $newReply) {
      ok
      errors {
        messages
        field
      }
      reply {
        id
      }
    }
  }
`;
