import React from 'react';
import AboutCourseCard from 'components/Courses/AboutCourseCard';
import Empty from 'reusables/Empty';

const About = ({ course }) => {
  const renderEmptyState = () => {
    return (
      <Empty title={'No Course Description'} description={'No Course Description found'}></Empty>
    );
  };

  return Boolean(course?.description) ? (
    <AboutCourseCard
      descriptionHtml={course?.description}
      objectivesHtml={course?.objectives}
      showTitle={true}
    />
  ) : (
    renderEmptyState()
  );
};

export default About;
