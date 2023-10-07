import React from 'react';
import RegistrationLayout from 'Layout/RegistrationLayout';

export default {
  title: 'RegLayout',
  component: RegistrationLayout,
};

const Buttons = [
  {
    variant: 'outlined',
    text: 'Save as draft',
    onClick: () => {},
  },
  {
    variant: 'contained',
    color: 'primary',
    text: 'Save',
    onClick: () => {},
  },
];

const handleCloseClick = () => {
  console.log('clicked close');
};

export const RegLayoutStory = () => (
  <RegistrationLayout
    title="Student Creation"
    hasHeaderButton
    headerButtons={Buttons}
    onClose={handleCloseClick}>
    <div>I am a child</div>
  </RegistrationLayout>
);
