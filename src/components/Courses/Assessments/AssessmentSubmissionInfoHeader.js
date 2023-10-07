import { memo } from 'react';
import PropTypes from 'prop-types';
import { BlockOutlined, CheckCircleOutline, ClearOutlined } from '@material-ui/icons';
import { Box, Paper, Typography, useMediaQuery, useTheme } from '@material-ui/core';

import { AssessmentGradeStatus } from 'utils/constants';
import { fontWeight } from '../../../Css';

const AssessmentSubmissionInfoHeader = ({
  gradeStatus,
  earnedScore: earnedScoreFromProps,
  assessment,
  questionStats,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const earnedScore = gradeStatus === AssessmentGradeStatus.PENDING ? 0 : earnedScoreFromProps;

  const getGradeStatusSettings = () => {
    const passMark = assessment?.passMark || 0;

    if (gradeStatus === AssessmentGradeStatus.PENDING || gradeStatus === undefined) {
      return {
        text: 'Not Graded',
        color: '#9C9C9C',
        icon: BlockOutlined,
      };
    } else if (earnedScore >= passMark) {
      return {
        text: 'Passed',
        color: 'green',
        icon: CheckCircleOutline,
      };
    }

    return {
      text: 'Failed',
      color: 'red',
      icon: ClearOutlined,
    };
  };

  const renderGradeStatus = () => {
    const { text, color, icon: Icon } = getGradeStatusSettings();

    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        width={isSmallScreen ? '100%' : '200px'}
        color="#fff"
        style={{ background: color }}>
        <Typography>
          <Icon />
        </Typography>
        <Typography variant="body2" style={{ fontWeight: fontWeight.bold }}>
          {text}
        </Typography>
      </Box>
    );
  };

  return (
    <Box
      display="flex"
      flexDirection={isSmallScreen ? 'column' : 'row'}
      component={Paper}
      widht="100%"
      square>
      <Box
        display="flex"
        flexDirection={isSmallScreen ? 'column' : 'row'}
        justifyContent="space-between"
        alignItems={isSmallScreen ? 'flex-start' : 'center'}
        style={{ background: '#F7F8F9' }}
        width="100%"
        p={10}
        pr={20}>
        <Box mb={isSmallScreen ? 5 : 0}>
          <Typography variant="body1" color="textPrimary" style={{ fontWeight: fontWeight.bold }}>
            {assessment?.title}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {questionStats?.total} question in total • {questionStats?.totalMultiChoiceQuestions}{' '}
            multichoice • {questionStats?.textQuestionCount} text & essay
          </Typography>
        </Box>
        <Box>
          <Typography color="textPrimary" variant="body1" style={{ fontWeight: fontWeight.bold }}>
            Score: {earnedScore}/{assessment?.totalObtainableScore}
          </Typography>
        </Box>
      </Box>
      {renderGradeStatus()}
    </Box>
  );
};

AssessmentSubmissionInfoHeader.propTypes = {
  gradeStatus: PropTypes.oneOf(Object.values(AssessmentGradeStatus)),
  earnedScore: PropTypes.number,
  assessment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    passMark: PropTypes.number.isRequired,
    totalObtainableScore: PropTypes.number.isRequired,
  }),
  questionStats: PropTypes.shape({
    total: PropTypes.number.isRequired,
    totalMultiChoiceQuestions: PropTypes.number.isRequired,
    textQuestionCount: PropTypes.number.isRequired,
  }),
};

export default memo(AssessmentSubmissionInfoHeader);
