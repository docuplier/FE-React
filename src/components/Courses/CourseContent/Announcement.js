import { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { Avatar, Box, TextField, makeStyles, Typography, Button } from '@material-ui/core';
import { useMutation } from '@apollo/client';

import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import { getNameInitials } from 'utils/UserUtils';
import { fontWeight } from '../../../Css';
import AnnouncementCard from 'reusables/AnnouncementCard';
import Reply from '../Feedback/Reply';
import { CREATE_ANNOUNCEMENT_COMMENT } from 'graphql/mutations/announcement';
import { useNotification } from 'reusables/NotificationBanner';

const Announcement = ({ id, creator, createdAt, body, title, comments, refetchAnnouncement }) => {
  const classes = useStyles();
  const { userDetails } = useAuthenticatedUser();
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  const [newComment, setNewComment] = useState('');
  const notification = useNotification();

  const [createAnnouncementComment] = useMutation(CREATE_ANNOUNCEMENT_COMMENT, {
    onCompleted: () => {
      notification.success({
        message: 'Comment posted successfully',
      });
      refetchAnnouncement?.();
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const handleSendComment = (evt) => {
    if (evt.keyCode === 13 && !evt.shiftKey) {
      createAnnouncementComment({
        variables: {
          newComment: {
            body: newComment,
            announcement: id,
          },
        },
        // optimisticResponse: {
        //   createComment: {
        //     comment: {
        //       id: 'temp-id',
        //       __typename: 'CommentType',
        //       body: newComment,
        //       createdAt: format(new Date(), 'yyyy-LL-dd'),
        //       createdBy: {
        //         id: userDetails?.id,
        //         firstname: userDetails?.firstname,
        //         lastname: userDetails?.lastname,
        //         image: userDetails?.image,
        //       },
        //     },
        //   },
        // },
      });
      setNewComment('');
    }
  };

  const renderWriteCommentBox = () => {
    return (
      <Box my={12} display="flex">
        <Avatar src={userDetails?.image}>
          {getNameInitials(userDetails?.lastname, userDetails?.firstname)}
        </Avatar>
        <Box ml={4} width="100%">
          <TextField
            variant="outlined"
            fullWidth
            multiline
            rows={1}
            rowsMax={5}
            value={newComment}
            placeholder="Add reply"
            onKeyUp={handleSendComment}
            onChange={(evt) => setNewComment(evt.target.value)}
            className={classes.replyTextfield}
          />
          <Box mt={4}>
            <Typography component="span" variant="body1" color="textPrimary">
              Press
              <Typography component="span" className={classes.boldText}>
                {' '}
                Enter{' '}
              </Typography>
              to post,
              <Typography component="span" className={classes.boldText}>
                {' '}
                Shift + Enter{' '}
              </Typography>
              to go to a new line.
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  const renderComments = () => {
    return (
      <Box>
        <Button
          variant="text"
          color="primary"
          onClick={() => setIsCommentsVisible((prevState) => !prevState)}>
          {isCommentsVisible ? 'Hide' : 'Show'} comments({comments?.length})
        </Button>
        {isCommentsVisible && (
          <Box maxHeight={300} style={{ overflowY: 'scroll' }}>
            {comments?.map((comment) => (
              <Reply
                key={comment.id}
                comment={comment.body}
                hideLike={true}
                datePublished={comment.createdAt}
                creator={{
                  firstname: comment.createdBy.firstname,
                  lastname: comment.createdBy.lastname,
                }}
              />
            ))}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <div>
      <AnnouncementCard
        announcement={{
          posterAvatar: creator?.image,
          poster: `${creator?.lastname} ${creator?.firstname}`,
          datePosted: createdAt,
          descriptionHtml: body,
          title,
        }}
      />
      {renderWriteCommentBox()}
      {renderComments()}
    </div>
  );
};

const useStyles = makeStyles(() => ({
  replyTextfield: {
    '& .MuiOutlinedInput-root': {
      background: '#F1F2F6',
    },
  },
  boldText: {
    fontWeight: fontWeight.bold,
  },
}));

Announcement.propTypes = {
  id: PropTypes.string.isRequired,
  creator: PropTypes.shape({
    firstname: PropTypes.string.isRequired,
    lastname: PropTypes.string.isRequired,
    image: PropTypes.string,
  }),
  createdAt: PropTypes.string,
  body: PropTypes.string,
  title: PropTypes.string,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      createdBy: PropTypes.shape({
        id: PropTypes.string.isRequired,
        lastname: PropTypes.string.isRequired,
        firstname: PropTypes.string.isRequired,
        image: PropTypes.string,
      }),
      createdAt: PropTypes.string.isRequired,
      body: PropTypes.string.isRequired,
    }),
  ),
};

export default memo(Announcement);
