import React from 'react';
import ContentListView from '../reusables/ContentListView';

export default {
  title: 'ContentListView',
  component: ContentListView,
};

export const ContentListViewStory = () => (
  <ContentListView
    title="Introduction Electrical and Electronic Engineering"
    description="Explain who is here, lorem ipsum dolor amet connecteur. Explain who is here, lorem ipsum dolor amet..."
    submissionsCount={5}
    fileCount={12}
    startDate="Feb 23, 2022"
    dueDate="Feb 2,5 2022"
  />
);
