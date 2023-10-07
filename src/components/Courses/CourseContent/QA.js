import { useState, memo } from 'react';
import PropTypes from 'prop-types';

import Questions from './Questions';
import Replies from './Replies';

const Sections = {
  QUESTIONS: `Questions`,
  REPLIES: `Replies`,
};

const QA = ({ currentLectureId, courseId }) => {
  const [currentSection, setCurrentSection] = useState(Sections.QUESTIONS);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);

  const navigateToSection = (section) => (questionId = null) => {
    setCurrentSection(section);
    setCurrentQuestionId(questionId);
  };

  return currentSection === Sections.QUESTIONS ? (
    <Questions
      onNavigateToReplies={navigateToSection(Sections.REPLIES)}
      currentLectureId={currentLectureId}
      courseId={courseId}
    />
  ) : (
    <Replies questionId={currentQuestionId} onGoBack={navigateToSection(Sections.QUESTIONS)} />
  );
};

QA.propTypes = {
  currentLectureId: PropTypes.string.isRequired,
};

export default memo(QA);
