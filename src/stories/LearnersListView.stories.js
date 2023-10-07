import React from 'react';

import LearnersListView from '../reusables/LearnersListView';

export default {
  title: 'LearnersListView',
  component: LearnersListView,
};

export const LearnersListViewStory = () => (
  <LearnersListView level={100} courseCount={200} studentCount={2368} />
);
