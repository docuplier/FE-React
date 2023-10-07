import React from 'react';
import CourseInfoCard from 'reusables/CourseInfoCard';

export default {
  title: 'CourseInfoCard',
  component: CourseInfoCard,
  decorators: [
    (StoryFn) => <div style={{ background: '#E5E5E5', padding: 50 }}>{<StoryFn />}</div>,
  ],
};

const courseInformation = {
  courseDuration: 22,
  pdfCount: 10,
  audioCount: 6,
  resourceCount: 13,
  lifeTimeAccess: true,
  screens: true,
  certificate: true,
};

export const CourseInfoCardFullwidth = () => (
  <CourseInfoCard paper fullWidth {...courseInformation} />
);

export const CourseInfoCardWithColumns = () => <CourseInfoCard {...courseInformation} />;
