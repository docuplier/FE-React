import { gql } from '@apollo/client';

export const DELETE_NOTIFICATION = gql`
  mutation deleteNotifications($notificationIds: [UUID]) {
    deleteNotifications(notificationIds: $notificationIds) {
      ok
      success {
        messages
        field
      }
      errors {
        messages
        field
      }
    }
  }
`;
