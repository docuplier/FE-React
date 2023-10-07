import { memo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Typography, makeStyles, Paper, Avatar, TextField } from '@material-ui/core';
import { useQuery, useMutation } from '@apollo/client';

import { colors, fontWeight } from '../../../Css';
import { getNameInitials } from 'utils/UserUtils';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import Question from '../Feedback/Question';
import Reply from '../Feedback/Reply';
import { GET_COURSE_QUESTION_BY_ID } from 'graphql/queries/courses';
import LoadingView from 'reusables/LoadingView';
import { CREATE_REPLY } from 'graphql/mutations/courses';
import { useNotification } from 'reusables/NotificationBanner';
import { likedQuestion, likedReply } from 'utils/FeedbackUtils';
import { transformValueToPluralForm } from 'utils/TransformationUtils';
import Empty from 'reusables/Empty';
import useToggleLike, { LikeType } from 'hooks/useToggleLike';

const Replies = ({ onGoBack, questionId }) => {
  const classes = useStyles();
  const { userDetails } = useAuthenticatedUser();
  const notification = useNotification();
  const [replyText, setReplyText] = useState('');
  const repliesContainer = useRef(null);
  const { handleToggleLike } = useToggleLike();

  const { data, loading, refetch } = useQuery(GET_COURSE_QUESTION_BY_ID, {
    variables: {
      questionId,
    },
  });
  const question = data?.question || null;

  const [createReply, { loading: loadingCreateReply }] = useMutation(CREATE_REPLY, {
    onCompleted: () => {
      notification.success({
        message: 'Comment posted successfully',
      });
      setReplyText('');
      refetch();
      repliesContainer.current.scrollTop = repliesContainer.current.scrollHeight;
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const handleSendReply = (evt) => {
    if (evt.keyCode === 13 && !evt.shiftKey) {
      createReply({
        variables: {
          newReply: {
            body: replyText,
            question: questionId,
          },
        },
        // update: (cache, { data }) => {
        //   const newReply = data?.createReply.reply;
        //   const questionData = cache.readQuery({
        //     query: GET_COURSE_QUESTION_BY_ID,
        //     variables: {
        //       questionId,
        //     },
        //   });

        //   cache.writeQuery({
        //     query: GET_COURSE_QUESTION_BY_ID,
        //     variables: {
        //       questionId,
        //     },
        //     data: {
        //       ...questionData,
        //       question: {
        //         ...questionData.question,
        //         questionReplies: [...questionData.question.questionReplies, newReply],
        //       },
        //     },
        //   });
        // },
      });
    }
  };

  const renderReplyBox = () => {
    return (
      <Box mt={12}>
        <Paper elevation={0}>
          <Box display="flex" alignItems="center" p={8}>
            <Avatar src={userDetails?.image}>
              {getNameInitials(userDetails?.lastname, userDetails?.firstname)}
            </Avatar>
            <Box ml={4} width="100%">
              <LoadingView isLoading={loadingCreateReply}>
                <TextField
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={1}
                  rowsMax={5}
                  value={replyText}
                  onChange={(evt) => setReplyText(evt.target.value)}
                  placeholder="Add reply"
                  className={classes.replyTextfield}
                  onKeyUp={handleSendReply}
                  disabled={loadingCreateReply}
                />
              </LoadingView>
            </Box>
          </Box>
        </Paper>
      </Box>
    );
  };

  const renderEmptyState = () => {
    return <Empty title="No Replies" description="No replies has been made for this question." />;
  };

  const renderReplies = () => {
    const replies = question?.questionReplies || [];

    return (
      <Box width="100%" className={classes.replies}>
        <Typography variant="body1" color="textPrimary" className="title">
          {transformValueToPluralForm(replies.length, 'reply', 'replies')}
        </Typography>
        <Box pl={20} ref={repliesContainer}>
          {Boolean(replies.length)
            ? question?.questionReplies?.map((reply) => {
                return (
                  <Reply
                    comment={reply.body}
                    likeCount={reply.replyLikes.length}
                    onClickLike={() => handleToggleLike({ id: reply.id, type: LikeType.REPLY })}
                    datePublished={reply.createdAt}
                    creator={{
                      firstname: reply.createdBy.firstname,
                      lastname: reply.createdBy.lastname,
                    }}
                    hideLike
                    liked={likedReply(reply, userDetails?.id)}
                  />
                );
              })
            : renderEmptyState()}
        </Box>
        <Box pl={20}>{renderReplyBox()}</Box>
      </Box>
    );
  };

  return (
    <Box>
      <Button variant="contained" onClick={onGoBack}>
        Back to All Questions
      </Button>
      <Box mt={16} mb={12} width="100%">
        <LoadingView isLoading={loading}>
          {question && (
            <Question
              title={question?.title}
              description={question?.body}
              likeCount={question?.questionLikes?.length}
              onClickLike={() => handleToggleLike({ id: questionId, type: LikeType.QUESTION })}
              repliesCount={question?.questionReplies?.length}
              datePublished={question?.createdAt || `${new Date()}`}
              lectureTitle={question?.lecture?.title}
              creator={{
                firstname: question?.createdBy?.firstname,
                lastname: question?.createdBy?.lastname,
              }}
              liked={likedQuestion(question, userDetails?.id)}
              noBorder
            />
          )}
          {renderReplies()}
        </LoadingView>
      </Box>
    </Box>
  );
};

const useStyles = makeStyles((theme) => ({
  replies: {
    '& .title': {
      paddingBottom: theme.spacing(2),
      borderBottom: `1px solid ${colors.secondaryLightGrey}`,
      fontWeight: fontWeight.bold,
    },
  },
  replyTextfield: {
    '& .MuiOutlinedInput-root': {
      background: '#F1F2F6',
    },
  },
}));

Replies.propTypes = {
  onGoBack: PropTypes.func,
  questionId: PropTypes.string,
};

export default memo(Replies);
