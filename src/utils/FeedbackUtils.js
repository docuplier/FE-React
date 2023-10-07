import { gql } from '@apollo/client';

export const likedQuestion = (question, userId) => {
  return Boolean(question?.questionLikes?.find((like) => like.user.id === userId));
};

export const updateQuestionLikesInApolloCache = (client, questionId, userId) => {
  const questionInCache = extractQuestionFromApolloCache(client, questionId);
  const liked = likedQuestion(questionInCache, userId);
  let questionLikes = questionInCache?.questionInCache || [];

  if (liked) {
    questionLikes = questionLikes.filter((like) => like.user.id !== userId);
  } else {
    questionLikes = [
      ...questionLikes,
      {
        id: `${Date.now()}`,
        user: {
          id: userId,
        },
      },
    ];
  }

  updateQuestionInApolloCache(client, questionLikes, questionId);
};

export const likedReply = (reply, userId) => {
  return Boolean(reply.replyLikes.find((like) => like.user.id === userId));
};

export const updateReplyLikesInApolloCache = (client, replyId, userId) => {
  const replyInCache = extractReplyFromApolloCache(client, replyId);
  const liked = likedReply(replyInCache, userId);
  let { replyLikes } = replyInCache;

  if (liked) {
    replyLikes = replyLikes.filter((like) => like.user.id !== userId);
  } else {
    replyLikes = [
      ...replyLikes,
      {
        id: `${Date.now()}`,
        user: {
          id: userId,
        },
      },
    ];
  }

  updateReplyInApolloCache(client, replyLikes, replyId);
};

const extractQuestionFromApolloCache = (client, questionId) => {
  return client.readFragment({
    id: `QuestionType:${questionId}`,
    fragment: gql`
      fragment QuestionPart on QuestionType {
        questionLikes {
          id
          user {
            id
          }
        }
      }
    `,
  });
};

const updateQuestionInApolloCache = (client, questionLikes, questionId) => {
  client.writeFragment({
    id: `QuestionType:${questionId}`,
    fragment: gql`
      fragment QuestionPart on QuestionType {
        questionLikes {
          id
          user {
            id
          }
        }
      }
    `,
    data: {
      questionLikes,
    },
  });
};

const extractReplyFromApolloCache = (client, replyId) => {
  return client.readFragment({
    id: `ReplyType:${replyId}`,
    fragment: gql`
      fragment ReplyPart on ReplyType {
        replyLikes {
          id
          user {
            id
          }
        }
      }
    `,
  });
};

const updateReplyInApolloCache = (client, replyLikes, replyId) => {
  client.writeFragment({
    id: `ReplyType:${replyId}`,
    fragment: gql`
      fragment ReplyPart on ReplyType {
        replyLikes {
          id
          user {
            id
          }
        }
      }
    `,
    data: {
      replyLikes,
    },
  });
};
