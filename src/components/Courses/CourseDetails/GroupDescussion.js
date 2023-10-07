import React, { useState, useRef } from 'react';
import { Box, TextField, Paper, Button, InputAdornment } from '@material-ui/core';
import { Send, AttachFile } from '@material-ui/icons';
import { DEFAULT_PAGE_OFFSET } from 'utils/constants';
import { OffsetLimitBasedPagination } from 'reusables/Pagination';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { ArrowBackIos } from '@material-ui/icons';
import { useQuery, useMutation } from '@apollo/client';
import { CREATE_POST } from 'graphql/mutations/taskReply';

import Empty from 'reusables/Empty';
import DiscussionCard from 'reusables/DiscussionCard';
import { PrivatePaths } from 'routes';
import { useNotification } from 'reusables/NotificationBanner';
import { GET_TASK_POSTS } from 'graphql/queries/task';
import LoadingButton from 'reusables/LoadingButton';
import LoadingView from 'reusables/LoadingView';

const defaultQueryParams = {
  search: '',
  offset: DEFAULT_PAGE_OFFSET,
  limit: 5,
};

const GroupDescussion = ({ task }) => {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const imageRef = useRef();
  const history = useHistory();
  const [queryParams, setQueryParams] = useState(defaultQueryParams);
  const { courseId } = useParams();
  const params = new URLSearchParams(useLocation().search);
  const taskId = params.get('taskId');
  const descId = params.get('taskgroupId');
  const notification = useNotification();

  const handleChangeQueryParams = (changeset) => {
    setQueryParams((prevState) => ({
      ...prevState,
      ...changeset,
    }));
  };

  const {
    data: taskPosts,
    refetch,
    loading: loadingPosts,
  } = useQuery(GET_TASK_POSTS, {
    variables: { ...queryParams, groupId: descId },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const descussions = taskPosts?.taskGroupPosts?.results;
  const repliesTaskPostIds = descussions?.map((des) => des.id);

  const [createPost, { loading }] = useMutation(CREATE_POST, {
    onCompleted: () => {
      notification.success({
        message: 'Post sent Successfully',
      });
      refetch();
      setMessage('');
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const submitPost = () => {
    if (!message.length) return;
    createPost({
      variables: {
        file: file?.[0],
        newTaskgrouppost: {
          group: descId,
          message,
          repliesTaskPost: repliesTaskPostIds,
        },
      },
    });
  };

  const renderDiscussionCard = (discussions) => {
    return (
      <>
        <Box bgcolor={'inherit'}>
          {discussions?.map((discussion) => {
            return (
              <Box key={discussion.id} style={{ marginBottom: 16, cursor: 'pointer' }}>
                <DiscussionCard
                  disabled={task?.isArchived}
                  type="POST"
                  refetch={refetch}
                  onClick={() =>
                    history.push(
                      `${PrivatePaths.COURSES}/${courseId}?tab=learning-group&taskId=${taskId}&taskgroupId=${descId}&descussionId=${discussion.id}`,
                    )
                  }
                  descussion={{ ...discussion }}
                />
              </Box>
            );
          })}
        </Box>
      </>
    );
  };

  const renderEmpty = () => {
    return <Empty title="No Post" description="Type your message to start discussion" />;
  };

  return (
    <Box>
      <Button
        className="back_btn"
        onClick={() => history.goBack()}
        color="primary"
        variant="outlined"
        style={{ marginBottom: 16, border: 'none' }}>
        <ArrowBackIos />
        Back
      </Button>
      <Box p={12} component={Paper} display="flex" justifyContent="flex-start">
        <TextField
          style={{ width: '85%', marginRight: 24 }}
          type="search"
          label="Type a new message"
          variant="outlined"
          value={message}
          required
          disabled={task?.isArchived}
          onChange={(e) => setMessage(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <AttachFile
                  style={{ cursor: 'pointer' }}
                  onClick={() => imageRef.current.click()}
                />
                <input
                  type="file"
                  hidden
                  disabled={task?.isArchived}
                  ref={imageRef}
                  file={file}
                  onChange={(e) => setFile(e.target.files)}
                />
              </InputAdornment>
            ),
          }}
        />
        <LoadingButton
          disabled={loading || task?.isArchived}
          isLoading={loading}
          variant="contained"
          color="primary"
          onClick={submitPost}>
          <Send />
        </LoadingButton>
      </Box>
      <LoadingView isLoading={loadingPosts}>
        <Box>{renderDiscussionCard()}</Box>
        {!!descussions?.length ? (
          <Box>
            {renderDiscussionCard(descussions)}
            <Box mt={8}>
              <OffsetLimitBasedPagination
                total={taskPosts?.taskGroupPosts?.totalCount}
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
        ) : (
          renderEmpty()
        )}
      </LoadingView>
    </Box>
  );
};

export default GroupDescussion;
