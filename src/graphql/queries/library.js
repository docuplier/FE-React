import { gql } from '@apollo/client';
import {
  CORE_LIBRARY_CONTENT_FIELDS,
  CORE_LIBRARY_CONTENT_TRUNCATED_FIELDS,
  CORE_LIBRARY_FIELD_OF_INTEREST_FIELDS,
} from 'graphql/fragments';

export const GET_SAVED_CONTENTS = gql`
  ${CORE_LIBRARY_CONTENT_FIELDS}
  query savedContents($search: String, $offset: Int, $limit: Int, $ordering: String) {
    savedContents(search: $search, offset: $offset, limit: $limit, ordering: $ordering) {
      totalCount
      results {
        id
        content {
          ...LibraryContentPart
        }
      }
    }
  }
`;

export const GET_FIELD_OF_INTERESTS = gql`
  ${CORE_LIBRARY_FIELD_OF_INTEREST_FIELDS}
  query fieldOfInterests(
    $search: String
    $searchByContent: String
    $interestId: UUID
    $offset: Int
    $limit: Int
    $ordering: String
    $asFilter: Boolean = false
  ) {
    fieldOfInterests(
      search: $search
      searchByContent: $searchByContent
      interestId: $interestId
      offset: $offset
      limit: $limit
      ordering: $ordering
    ) {
      totalCount
      results {
        id
        name
        ...LibraryFieldOfInterestPart @skip(if: $asFilter)
      }
    }
  }
`;

export const GET_FIELD_OF_INTEREST = gql`
  ${CORE_LIBRARY_FIELD_OF_INTEREST_FIELDS}
  query fieldOfInterest($interestId: UUID) {
    fieldOfInterest(interestId: $interestId) {
      ...LibraryFieldOfInterestPart
    }
  }
`;

export const GET_LIBRARY_CONTENT_BY_ID = gql`
  ${CORE_LIBRARY_CONTENT_FIELDS}
  query getLibraryContentById($contentId: UUID) {
    libraryContent(contentId: $contentId) {
      ...LibraryContentPart
    }
  }
`;

export const GET_LIBRARY_CONTENTS = gql`
  ${CORE_LIBRARY_CONTENT_TRUNCATED_FIELDS}
  query libraryContents(
    $interestId: UUID
    $search: String
    $offset: Int
    $limit: Int
    $ordering: String
  ) {
    libraryContents(
      interestId: $interestId
      search: $search
      offset: $offset
      limit: $limit
      ordering: $ordering
    ) {
      totalCount
      results {
        ...LibraryContentTruncatedPart
      }
    }
  }
`;

export const GET_RELATED_CONTENTS = gql`
  query relatedContents($interestId: UUID, $offset: Int, $limit: Int) {
    relatedContents(interestId: $interestId, offset: $offset, limit: $limit) {
      totalCount
      results {
        name
        id
        viewCount
        bookmarked
      }
    }
  }
`;

export const GET_FIELD_OF_INTERESTS_SEARCH = gql`
  query fieldOfInterestsSearch(
    $search: String
    $searchByContent: String
    $interestId: UUID
    $offset: Int
    $limit: Int
    $ordering: String
  ) {
    fieldOfInterests(
      search: $search
      searchByContent: $searchByContent
      interestId: $interestId
      offset: $offset
      limit: $limit
      ordering: $ordering
    ) {
      totalCount
      results {
        id
        name
        id
        name
        createdAt
        updatedAt
        contentCount
        numberOfView
        description
        libraryInterests(search: $searchByContent) {
          id
          name
          description
          thumbnail
          contentFormat
          content
        }
      }
    }
  }
`;
