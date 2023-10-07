import { memo } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Dialog, Box, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import Empty from 'reusables/Empty';
import DetailProfileCard from 'reusables/DetailProfileCard';
import CourseInfoHeader from 'reusables/CourseInfoHeader';
import Question from 'components/Courses/Feedback/Question';
import { colors, spaces } from '../../Css';
import { likedQuestion } from 'utils/FeedbackUtils';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import useToggleLike, { LikeType } from 'hooks/useToggleLike';

const LearnerStatsModal = ({ open, onClose, profileInfo, questionData, stats }) => {
  const classes = useStyles();
  const { userDetails } = useAuthenticatedUser();
  const { handleToggleLike } = useToggleLike();

  const renderEmptyState = () => {
    return (
      <Empty
        title={'No Questions'}
        description={'No Questions have been asked by this user.'}></Empty>
    );
  };

  return (
    <Dialog
      onClose={onClose}
      aria-labelledby="simple-dialog-title"
      open={open}
      maxWidth="lg"
      classes={{ root: classes.root }}>
      <Box className={classes.banner} px={18} display="flex" justifyContent="space-between">
        <DetailProfileCard {...profileInfo} />
        <CloseIcon className="icon" onClick={onClose} />
      </Box>
      <Box py={12} px={20}>
        <Box className={classes.infoCard}>
          <CourseInfoHeader
            quizScore={stats?.averageQuizScore}
            modulesCompletedCount={stats?.sectionCompleted}
            modulesPendingCount={stats?.sectionPending}
          />
          <Typography variant="h6" color="textPrimary" className="asked-by">
            All question asked by {profileInfo.user.name}
          </Typography>
        </Box>
        <Box style={{ maxWidth: '700px' }} pb={50}>
          {Boolean(questionData?.length)
            ? questionData?.map((question, index) => (
                <Question
                  backgroundColor="#fff"
                  key={question.id || index}
                  datePublished={format(new Date(question?.createdAt), 'LLL dd, yyyy')}
                  title={question?.title}
                  description={question?.body}
                  likeCount={question?.likes || 0}
                  repliesCount={question?.replies || 0}
                  hideAvatar
                  lectureTitle={question?.lecture?.title}
                  liked={likedQuestion(question, userDetails?.id)}
                  onClickLike={() => handleToggleLike({ id: question.id, type: LikeType.QUESTION })}
                />
              ))
            : renderEmptyState()}
        </Box>
      </Box>
    </Dialog>
  );
};

const useStyles = makeStyles(() => ({
  root: {
    position: 'relative',
    '& .MuiDialog-paper': {
      padding: 0,
    },
  },
  banner: {
    background: 'linear-gradient(98.68deg, #041E44 14.09%, #0050C8 140.86%)',
    position: 'sticky',
    zIndex: '100',
    top: 0,
    '& .icon': {
      color: colors.white,
      marginTop: spaces.medium,
      cursor: 'pointer',
    },
  },
  infoCard: {
    '& .asked-by': {
      padding: spaces.medium,
      paddingLeft: 0,
    },
  },
}));

LearnerStatsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  profileInfo: PropTypes.shape({
    ...DetailProfileCard.propTypes,
  }),
  questionData: PropTypes.shape({
    ...Question.propTypes,
  }),
  stats: PropTypes.shape({
    quizScore: PropTypes.number,
    modulesCompletedCount: PropTypes.number,
    modulesPendingCount: PropTypes.number,
  }),
};

export default memo(LearnerStatsModal);
