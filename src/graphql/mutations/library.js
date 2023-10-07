import { gql } from '@apollo/client';
import { CORE_LIBRARY_CONTENT_FIELDS } from 'graphql/fragments';
import { CORE_LIBRARY_FIELD_OF_INTEREST_FIELDS } from 'graphql/fragments';

export const BOOKMARK_CONTENT = gql`
  mutation bookmarkContent($contentId: UUID) {
    bookmarkContent(bookmarkInput: { contentId: $contentId }) {
      ok
      errors {
        messages
        field
      }
      success {
        field
        messages
      }
    }
  }
`;

export const CREATE_LIBRARY_CONTENT = gql`
  ${CORE_LIBRARY_CONTENT_FIELDS}
  mutation createLibraryContent(
    $newLibrarycontent: LibraryContentCreateGenericType!
    $file: Upload
    $thumbnail: Upload
  ) {
    createLibraryContent(
      newLibrarycontent: $newLibrarycontent
      file: $file
      thumbnail: $thumbnail
    ) {
      ok
      errors {
        messages
        field
      }
      librarycontent {
        ...LibraryContentPart
      }
    }
  }
`;

export const CREATE_FIELD_OF_INTEREST = gql`
  ${CORE_LIBRARY_FIELD_OF_INTEREST_FIELDS}
  mutation createFieldOfInterest(
    $newFieldofinterest: FieldOfInterestCreateGenericType!
    $thumbnail: Upload
  ) {
    createFieldOfInterest(newFieldofinterest: $newFieldofinterest, thumbnail: $thumbnail) {
      ok
      errors {
        messages
        field
      }
      fieldofinterest {
        ...LibraryFieldOfInterestPart
      }
    }
  }
`;

export const UPDATE_LIBRARY_CONTENT = gql`
  ${CORE_LIBRARY_CONTENT_FIELDS}
  mutation updateLibraryContent(
    $newLibrarycontent: LibraryContentUpdateGenericType!
    $file: Upload
    $thumbnail: Upload
    $id: ID!
  ) {
    updateLibraryContent(
      newLibrarycontent: $newLibrarycontent
      file: $file
      thumbnail: $thumbnail
      id: $id
    ) {
      ok
      errors {
        messages
        field
      }
      librarycontent {
        ...LibraryContentPart
      }
    }
  }
`;

export const UPDATE_FIELD_OF_INTEREST = gql`
  ${CORE_LIBRARY_FIELD_OF_INTEREST_FIELDS}
  mutation updateFieldOfInterest(
    $newFieldofinterest: FieldOfInterestUpdateGenericType!
    $thumbnail: Upload
    $id: ID!
  ) {
    updateFieldOfInterest(newFieldofinterest: $newFieldofinterest, thumbnail: $thumbnail, id: $id) {
      ok
      errors {
        messages
        field
      }
      fieldofinterest {
        ...LibraryFieldOfInterestPart
      }
    }
  }
`;

export const DELETE_FIELD_OF_INTEREST = gql`
  ${CORE_LIBRARY_FIELD_OF_INTEREST_FIELDS}
  mutation deleteFieldOfInterest($thumbnail: Upload, $id: ID!) {
    deleteFieldOfInterest(thumbnail: $thumbnail, id: $id) {
      ok
      errors {
        messages
        field
      }
      fieldofinterest {
        ...LibraryFieldOfInterestPart
      }
    }
  }
`;

export const DELETE_LIBRARY_CONTENT = gql`
  ${CORE_LIBRARY_CONTENT_FIELDS}
  mutation deleteLibraryContent($id: ID!, $file: Upload, $thumbnail: Upload) {
    deleteLibraryContent(id: $id, file: $file, thumbnail: $thumbnail) {
      ok
      errors {
        messages
        field
      }
      librarycontent {
        ...LibraryContentPart
      }
    }
  }
`;

export const REMOVE_BOOKMARK = gql`
  mutation removeBookmarkContent($bookmarkInput: BookmarkInputType!) {
    removeBookmarkContent(bookmarkInput: $bookmarkInput) {
      ok
      errors {
        messages
        field
      }
      success {
        messages
        field
      }
    }
  }
`;
