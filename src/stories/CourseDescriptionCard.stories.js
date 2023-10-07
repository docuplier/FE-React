import React from 'react';
import CourseDescriptionCard from 'reusables/CourseDescriptionCard';

export default {
  title: 'course description card',
  component: CourseDescriptionCard,
};

export const courseDescriptionCard = () => (
  <CourseDescriptionCard
    title="Some title"
    description="some description"
    duration={2345}
    unitCount={3}
  />
);

export const courseDescriptionCardWithStudentCount = () => (
  <CourseDescriptionCard
    title="Some title"
    description="some description"
    duration={2345}
    unitCount={3}
    studentCount={34}
  />
);
