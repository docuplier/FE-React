import { gql } from '@apollo/client';
import { CORE_ANNOUNCEMENTS_FIELDS, CORE_ANNOUNCEMENT_COMMENT_FIELDS } from 'graphql/fragments';

export const GET_ANNOUNCEMENTS = gql`
  ${CORE_ANNOUNCEMENTS_FIELDS}
  ${CORE_ANNOUNCEMENT_COMMENT_FIELDS}
  query getAnnouncements(
    $typeIds: [UUID]
    $search: String
    $offset: Int
    $limit: Int
    $startDate: Date
    $endDate: Date
    $datePublished: Date
    $showComments: Boolean = false
  ) {
    announcements(
      typeIds: $typeIds
      search: $search
      offset: $offset
      limit: $limit
      startDate: $startDate
      endDate: $endDate
      datePublished: $datePublished
    ) {
      totalCount
      results {
        ...AnnouncementPart
        comments {
          ...AnnouncementCommentPart @include(if: $showComments)
        }
      }
    }
  }
`;

export const GET_RECIPIENTS = gql`
  query searchReceivers($search: String, $limit: Int) {
    searchReceivers(search: $search, limit: $limit) {
      courses {
        id
        title
      }
      faculties {
        id
        name
      }
      departments {
        id
        name
      }
    }
  }
`;
