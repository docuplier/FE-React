import { gql } from '@apollo/client';

export const GET_NOTIFICATIONS = gql`
  query getNotifications($offset: Int, $limit: Int, $isRead: Boolean, $workbench: Boolean) {
    notifications(offset: $offset, limit: $limit, isRead: $isRead, workbench: $workbench) {
      totalCount
      results {
        id
        isRead
        createdAt
        notification {
          type
          data
        }
      }
    }
  }
`;

export const SUBSCRIBE_NOTIFICATION = gql`
  subscription notificationSubscription($userId: UUID) {
    notificationSubscription(userId: $userId) {
      notification {
        id
        notification {
          id
          data
          author {
            firstname
            email
          }
        }
      }
    }
  }
`;
