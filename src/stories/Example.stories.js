import React from 'react';
import { text } from '@storybook/addon-knobs';

const Example = ({ title }) => {
  return <div>Welcome to {title} project!!!</div>;
};

export default {
  title: 'Example',
  component: Example,
};

export const ExampleStory = () => <Example title={text('title', 'fountain')} />;
