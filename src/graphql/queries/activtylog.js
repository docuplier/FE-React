import { gql } from '@apollo/client';

export const GET_ACTIVITY_LOG = gql`
  query GetActivities(
    $startDate: Date
    $endDate: Date
    $activityTypes: [String]
    $search: String
    $limit: Int
    $ordering: String
  ) {
    allActivities(
      startDate: $startDate
      endDate: $endDate
      activityTypes: $activityTypes
      search: $search
      limit: $limit
      ordering: $ordering
    ) {
      results {
        id
        user {
          firstname
          lastname
        }
        createdAt
        message
        activityType
      }
      totalCount
    }
  }
`;
