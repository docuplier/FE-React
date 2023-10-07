import { gql } from '@apollo/client';

export const DELETE_NOTIFICATIONS = gql`
  mutation deleteNotifications($allNotifications: Boolean, $notificationIds: [UUID]) {
    deleteNotifications(allNotifications: $allNotifications, notificationIds: $notificationIds) {
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

export const MARK_NOTIFICATIONS = gql`
  mutation markNotifications($notificationIds: [UUID]!) {
    markNotifications(notificationIds: $notificationIds) {
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
