import { useMutation, useApolloClient } from '@apollo/client';
import { BOOKMARK_CONTENT } from 'graphql/mutations/library';
import { useNotification } from 'reusables/NotificationBanner';
import { updateBookmarkedStatusInCache } from 'utils/LibraryUtils';

export function useBookmarkLibraryContent() {
  const client = useApolloClient();
  const notification = useNotification();

  const [bookmarkContent, { loading }] = useMutation(BOOKMARK_CONTENT, {
    onCompleted: (data) => {
      notification.success({
        message: data?.bookmarkContent?.success?.messages,
      });
    },
    ignoreResults: true,
  });

  const handleBookmarkContent = (contentId) => {
    bookmarkContent({
      variables: {
        contentId,
      },
    });

    updateBookmarkedStatusInCache(client, contentId);
  };

  return {
    loading,
    handleBookmarkContent,
  };
}
