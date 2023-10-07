import React from 'react';
import Breadcrumb from 'reusables/Breadcrumb';

export default {
  title: 'Breadcrumb',
  component: Breadcrumb,
};

const links = [
  { title: 'Courses', to: '/courses' },
  { title: 'Course Lessons', to: '/courses/lessons' },
  { title: 'Intro to Chemistry', to: 'courses/lessons/intro-to-chemistry' },
];

export const BreadcrumbStory = () => <Breadcrumb links={links} />;
