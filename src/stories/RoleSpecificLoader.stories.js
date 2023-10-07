import React from 'react';
import RoleSpecificLoader from 'reusables/RoleSpecificLoader';
import { UserRoles } from 'utils/constants';

export default {
  title: 'RoleSpecificLoader',
  component: RoleSpecificLoader,
  decorators: [
    (StoryFn) => <div style={{ margin: '32px auto', maxWidth: 700 }}>{<StoryFn />}</div>,
  ],
};

export const RoleSpecificLoaderStory = () => {
  return (
    <>
      <br />
      {RoleSpecificLoader({
        [UserRoles.GLOBAL_ADMIN]: <span>Hey this is the global admin</span>,
        [UserRoles.STUDENT]: <span>Hey this is the student</span>,
      })}
    </>
  );
};
