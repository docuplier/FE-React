import { gql } from '@apollo/client';

import { LibraryContentType } from './constants';
import VideoDefaultImage from 'assets/svgs/library-content-video.svg';
import AudioDefaultImage from 'assets/svgs/library-content-audio.svg';
import PdfDefaultImage from 'assets/svgs/library-content-pdf.svg';
import LinkDefaultImage from 'assets/svgs/library-content-link.svg';
import WYSIWYGDefaultImage from 'assets/svgs/library-content-wysiwyg.svg';

export const getContentImage = (contentImage, type) => {
  if (contentImage) return contentImage;

  switch (type) {
    case LibraryContentType.HTML:
      return WYSIWYGDefaultImage;
    case LibraryContentType.VIDEO:
      return VideoDefaultImage;
    case LibraryContentType.PDF:
      return PdfDefaultImage;
    case LibraryContentType.AUDIO:
      return AudioDefaultImage;
    case LibraryContentType.LINK:
      return LinkDefaultImage;
    default:
      return null;
  }
};

export const updateBookmarkedStatusInCache = (client, contentId) => {
  const libraryContentInCache = extractLibraryContentFromApolloCache(client, contentId);
  let { bookmarked } = libraryContentInCache || {};
  console.log('gad', libraryContentInCache);
  if (libraryContentInCache) {
    if (bookmarked) {
      bookmarked = false;
    } else {
      bookmarked = true;
    }

    updateLibraryContentInApolloCache(client, contentId, bookmarked);
  }
};

const extractLibraryContentFromApolloCache = (client, contentId) => {
  return client.readFragment({
    id: `LibraryContentType:${contentId}`,
    fragment: gql`
      fragment LibraryContentPart on LibraryContentType {
        bookmarked
      }
    `,
  });
};

const updateLibraryContentInApolloCache = (client, contentId, bookmarked) => {
  client.writeFragment({
    id: `LibraryContentType:${contentId}`,
    fragment: gql`
      fragment LibraryContentPart on LibraryContentType {
        bookmarked
      }
    `,
    data: {
      bookmarked,
    },
  });
};

export const parseClientResourceToServerTypes = ({ contentFormat, formValue }) => {
  let result = { file: undefined, embeddedLink: undefined, content: undefined };

  switch (contentFormat) {
    case LibraryContentType.HTML:
      return {
        ...result,
        content: formValue.html,
      };
    case LibraryContentType.AUDIO:
    case LibraryContentType.VIDEO:
      let valueByTab =
        formValue.selected === 'file'
          ? { file: formValue.file }
          : { embeddedLink: formValue.embeddedLink };

      return {
        ...result,
        ...valueByTab,
      };
    case LibraryContentType.PDF:
      return {
        ...result,
        file: formValue,
      };
    case LibraryContentType.LINK:
      return {
        ...result,
        embeddedLink: formValue,
      };
    default:
      return result;
  }
};

export const transformServerResourceToFormValue = ({
  contentFormat,
  content,
  embeddedLink,
  file,
}) => {
  let result = null;

  switch (contentFormat) {
    case LibraryContentType.HTML:
      result = { html: content, editorState: null };
      break;
    case LibraryContentType.AUDIO:
    case LibraryContentType.VIDEO:
      result = {
        file,
        embeddedLink: embeddedLink || content,
        selected: file ? 'file' : 'embeddedLink',
      };
      break;
    case LibraryContentType.PDF:
      result = { name: file };
      break;
    case LibraryContentType.LINK:
      result = embeddedLink || content;
      break;
    default:
      result = null;
      break;
  }

  return result;
};
