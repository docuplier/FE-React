import { gql } from '@apollo/client/core';
import { CORE_ANNOUNCEMENTS_FIELDS, CORE_ANNOUNCEMENT_COMMENT_FIELDS } from 'graphql/fragments';

export const CREATE_ANNOUNCEMENT = gql`
  ${CORE_ANNOUNCEMENTS_FIELDS}
  mutation createAnnouncement($newAnnouncement: CreateAnnouncementType!) {
    createAnnouncement(newAnnouncement: $newAnnouncement) {
      ok
      errors {
        field
        messages
      }
      announcement {
        ...AnnouncementPart
      }
    }
  }
`;

export const CREATE_ANNOUNCEMENT_COMMENT = gql`
  ${CORE_ANNOUNCEMENT_COMMENT_FIELDS}
  mutation createAnnouncementComment($newComment: CommentCreateGenericType!) {
    createComment(newComment: $newComment) {
      ok
      errors {
        field
        messages
      }
      comment {
        ...AnnouncementCommentPart
      }
    }
  }
`;
