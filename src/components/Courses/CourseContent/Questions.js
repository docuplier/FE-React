import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Typography, Box, Paper, Avatar, Button, makeStyles } from '@material-ui/core';
import { useQuery, NetworkStatus } from '@apollo/client';

import { getNameInitials } from 'utils/UserUtils';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import { colors, fontWeight } from '../../../Css';
import LoadingButton from 'reusables/LoadingButton';
import CreateQuestionModal from './CreateQuestionModal';
import Question from '../Feedback/Question';
import { GET_COURSE_QUESTIONS } from 'graphql/queries/courses';
import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET } from 'utils/constants';
import LoadingView from 'reusables/LoadingView';
import { likedQuestion } from 'utils/FeedbackUtils';
import Empty from 'reusables/Empty';
import { transformValueToPluralForm } from 'utils/TransformationUtils';
import useToggleLike, { LikeType } from 'hooks/useToggleLike';

const Questions = ({ onNavigateToReplies, currentLectureId, courseId }) => {
  const { userDetails } = useAuthenticatedUser();
  const classes = useStyles();
  const [isCreateQuestionModalVisible, setIsCreateQuestionModalVisible] = useState(false);
  const { handleToggleLike } = useToggleLike();

  const { data, loading, networkStatus, fetchMore, refetch } = useQuery(GET_COURSE_QUESTIONS, {
    variables: {
      courseId,
      lectureId: currentLectureId,
      offset: DEFAULT_PAGE_OFFSET,
      limit: DEFAULT_PAGE_LIMIT,
    },
    // fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
  });
  const { results, totalCount } = data?.questions || {};

  const renderWriteCommentBox = () => {
    return (
      <Box mb={12} className={classes.writeCommentBox}>
        <Paper elevation={0}>
          <Box p={8}>
            <Typography variant="body1" color="textPrimary" className="title">
              Got question and comments?
            </Typography>
            <Box display="flex" mt={8} width="100%">
              <Avatar src={userDetails?.image}>
                {getNameInitials(userDetails?.firstname, userDetails?.lastname)}
              </Avatar>
              <Box ml={5} width="100%">
                <Button
                  variant="outlined"
                  className="CTAButton"
                  onClick={() => setIsCreateQuestionModalVisible(true)}>
                  Ask here to share with learners, experts and others
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    );
  };

  const renderEmptyState = () => {
    return <Empty title="No Questions" description="No question has been asked for this course." />;
  };

  const renderQuestions = () => {
    return (
      <Box>
        <Typography>Found {transformValueToPluralForm(totalCount || 0, 'question')}</Typography>
        <Box>
          {data?.questions?.results?.map((question) => {
            return (
              <Question
                key={question.id}
                title={question.title}
                description={question.body}
                likeCount={question.questionLikes?.length}
                onClickLike={() => handleToggleLike({ id: question.id, type: LikeType.QUESTION })}
                repliesCount={question.questionReplies?.length}
                datePublished={question.createdAt}
                lectureTitle={question.lecture.title}
                creator={{
                  firstname: question.createdBy.firstname,
                  lastname: question.createdBy.lastname,
                }}
                liked={likedQuestion(question, userDetails?.id)}
                onClick={() => onNavigateToReplies(question.id)}
              />
            );
          })}
        </Box>
        <Box mt={12}>
          <LoadingButton
            disabled={loading || !data?.questions?.cursor}
            disableElevation
            isLoading={loading && networkStatus === NetworkStatus.fetchMore}
            variant="contained"
            onClick={() => fetchMore({ variables: { offset: data?.questions?.cursor } })}
            style={{ width: '100%' }}>
            Load more
          </LoadingButton>
        </Box>
      </Box>
    );
  };

  return (
    <LoadingView isLoading={loading && networkStatus !== NetworkStatus.fetchMore}>
      <div>
        {renderWriteCommentBox()}
        {Boolean(results?.length) ? renderQuestions() : renderEmptyState()}
        <CreateQuestionModal
          open={isCreateQuestionModalVisible}
          onClose={() => setIsCreateQuestionModalVisible(false)}
          courseId={courseId}
          lectureId={currentLectureId}
          onCompletedCallback={() =>
            refetch({
              offset: DEFAULT_PAGE_OFFSET,
            })
          }
        />
      </div>
    </LoadingView>
  );
};

const useStyles = makeStyles({
  filterInput: {
    '& .MuiOutlinedInput-root': {
      background: '#F1F2F6',
    },
  },
  writeCommentBox: {
    '& .title': {
      fontWeight: fontWeight.bold,
    },
    '& .CTAButton': {
      background: '#F1F2F6',
      width: '100%',
      '& .MuiButton-label': {
        justifyContent: 'initial',
        color: colors.secondaryTextLight,
      },
    },
  },
});

Questions.propTypes = {
  onNavigateToReplies: PropTypes.func,
  currentLectureId: PropTypes.string,
  courseId: PropTypes.string,
};

export default React.memo(Questions);
