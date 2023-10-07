import { useMutation, useApolloClient } from '@apollo/client';
import { LIKE_QUESTION_OR_REPLY } from 'graphql/mutations/courses';
import {
  updateQuestionLikesInApolloCache,
  updateReplyLikesInApolloCache,
} from 'utils/FeedbackUtils';
import { useAuthenticatedUser } from './useAuthenticatedUser';

export const LikeType = {
  QUESTION: `QUESTION`,
  REPLY: `REPLY`,
};

export default function useToggleLike() {
  const client = useApolloClient();
  const { userDetails } = useAuthenticatedUser();

  const [toggleLike, { loading }] = useMutation(LIKE_QUESTION_OR_REPLY, {
    ignoreResults: true,
  });

  const handleToggleLike = ({ id, type }) => {
    const variables = type === LikeType.QUESTION ? { question: id } : { reply: id };

    toggleLike({
      variables: {
        likeUnlike: {
          ...variables,
        },
      },
    });

    if (type === LikeType.QUESTION) {
      updateQuestionLikesInApolloCache(client, id, userDetails?.id);
    } else {
      updateReplyLikesInApolloCache(client, id, userDetails?.id);
    }
  };

  return {
    loading,
    handleToggleLike,
  };
}
