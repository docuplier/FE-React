import React from 'react';
import VerticalTabs from 'reusables/VerticalTabs';

export default {
  title: 'VerticalTabs',
  component: VerticalTabs,
};

export const VerticalTab = () => {
  return (
    <VerticalTabs
      tabList={[
        {
          label: 'Profile',
          component: <span>Profile</span>,
        },
        {
          label: 'Contact',
          component: <span>Contact</span>,
        },
        {
          label: 'Administrator',
          component: <span>Administrator</span>,
        },
      ]}
    />
  );
};
