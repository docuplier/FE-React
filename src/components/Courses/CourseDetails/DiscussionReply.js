import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Divider,
  Button,
  Paper,
  Avatar,
  TextField,
  InputAdornment,
  CircularProgress,
} from '@material-ui/core';
import DiscussionCard from 'reusables/DiscussionCard';
import { ArrowBackIos } from '@material-ui/icons';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import { getNameInitials } from 'utils/UserUtils';
import Empty from 'reusables/Empty';
import { useNotification } from 'reusables/NotificationBanner';
import { GET_TASK_POST, POST_REPLIES } from 'graphql/queries/task';
import { useQuery, useMutation } from '@apollo/client';
import { REPLY_POST } from 'graphql/mutations/taskReply';
import { DEFAULT_PAGE_OFFSET } from 'utils/constants';
import { OffsetLimitBasedPagination } from 'reusables/Pagination';
import LoadingView from 'reusables/LoadingView';

const defaultQueryParams = {
  search: '',
  offset: DEFAULT_PAGE_OFFSET,
  limit: 5,
};

const DiscussionReply = ({ task }) => {
  const [newReply, setNewReply] = useState('');
  const history = useHistory();
  const params = new URLSearchParams(useLocation().search);
  const descussionId = params.get('descussionId');
  const { userDetails } = useAuthenticatedUser();
  const notification = useNotification();
  const [queryParams, setQueryParams] = useState(defaultQueryParams);

  const handleChangeQueryParams = (changeset) => {
    setQueryParams((prevState) => ({
      ...prevState,
      ...changeset,
    }));
  };

  const { data: taskPosts, refetch } = useQuery(GET_TASK_POST, {
    variables: { postId: descussionId },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });
  const discussion = taskPosts?.taskGroupPost;

  const {
    data: replyRes,
    refetch: refetchReplies,
    loading: isLoadingReplies,
  } = useQuery(POST_REPLIES, {
    variables: { ...queryParams, postId: descussionId },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });
  const replies = replyRes?.taskGroupReplies?.results;

  const [createReply, { loading }] = useMutation(REPLY_POST, {
    onCompleted: () => {
      notification.success({
        message: 'Post sent Successfully',
      });
      refetch();
      refetchReplies();
      setNewReply('');
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!newReply.length) return;
    createReply({
      variables: {
        newTaskgrouppostreply: {
          post: descussionId,
          reply: newReply,
        },
      },
    });
  };

  const renderEmpty = () => {
    return <Empty title="No Replies" description="Type your message to send a reply" />;
  };

  return (
    <Box>
      <Box mb={8}>
        <Button
          variant="outlined"
          color="Primary"
          style={{ border: 'none' }}
          onClick={() => history.goBack()}>
          <ArrowBackIos /> Go back to all posts
        </Button>
      </Box>
      <DiscussionCard
        disabled={task?.isArchived}
        type={'POST'}
        refetch={refetch}
        descussion={{ ...discussion }}
        descussionId={descussionId}
      />

      <Box mt={4}>
        <Typography>{replies?.length} replies</Typography>
        <Divider style={{ margin: '16px 0' }} />
        <Box ml={16}>
          <Box
            component={Paper}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            p={12}>
            <Box mr={8}>
              <Avatar src={userDetails?.image}>
                {getNameInitials(userDetails?.firstName, userDetails?.lastName)}
              </Avatar>
            </Box>
            <Box width={'100%'}>
              <form onSubmit={handleSendReply} style={{ width: '100%' }}>
                <TextField
                  style={{ width: '100%' }}
                  fullWidth
                  disabled={task?.isArchived}
                  variant="outlined"
                  label="Add reply"
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      {loading && <CircularProgress color="secondary" />}
                    </InputAdornment>
                  }
                />
                <input type="submit" hidden />
              </form>
            </Box>
          </Box>
          <LoadingView isLoading={isLoadingReplies}>
            {replies?.length
              ? replies?.map((reply) => {
                  return (
                    <Box key={reply.id}>
                      <DiscussionCard
                        disabled={task?.isArchived}
                        type="REPLY"
                        refetch={refetchReplies}
                        descussion={{ ...reply }}
                        descussionId={descussionId}
                      />
                    </Box>
                  );
                })
              : renderEmpty()}
          </LoadingView>
        </Box>
        <Box mt={8}>
          <OffsetLimitBasedPagination
            total={replyRes?.taskGroupReplies?.totalCount}
            onChangeLimit={(_offset, limit) =>
              handleChangeQueryParams({
                offset: DEFAULT_PAGE_OFFSET,
                limit,
              })
            }
            onChangeOffset={(offset) => handleChangeQueryParams({ offset })}
            offset={queryParams.offset}
            limit={queryParams.limit}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default DiscussionReply;
