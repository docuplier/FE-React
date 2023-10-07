import React from 'react';
import LoadingView from 'reusables/LoadingView';

export default {
  title: 'LoadingView',
  component: LoadingView,
};

export const LoadingViewStory = () => (
  <div style={{ width: 500, height: 500, border: `1px solid #bdbdbd` }}>
    <LoadingView size={60} isLoading={true}>
      <div style={{ width: '100%', height: '500px' }}>This is loading!!!</div>
    </LoadingView>
  </div>
);
