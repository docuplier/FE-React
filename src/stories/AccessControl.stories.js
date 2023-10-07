import React from 'react';
import AccessControl from 'reusables/AccessControl';
import { UserRoles } from 'utils/constants';

export default {
  title: 'AccessControl',
  component: AccessControl,
  decorators: [
    (StoryFn) => <div style={{ margin: '32px auto', maxWidth: 700 }}>{<StoryFn />}</div>,
  ],
};

export const AccessControlStory = () => {
  return (
    <>
      {/* The child will be rendered anytime a functional children prop is passed */}
      {/* the allowed parameter can then be used to perform any dynamic action */}
      {/* allowed will be true if the permission matches else false */}
      <AccessControl allowedRoles={[UserRoles.SCHOOL_ADMIN, UserRoles.GLOBAL_ADMIN]}>
        {(allowed) => (
          <span style={{ color: allowed ? 'green' : 'red' }}>
            Functional pattern. I should be painted red if you do not have access
          </span>
        )}
      </AccessControl>
      <br />
      {/* The child will not be rendered if the permissions isn't met. This happens when you pass in a node based child*/}
      <AccessControl allowedRoles={[UserRoles.STUDENT]}>
        <span>You will see me if you have this role</span>
      </AccessControl>
    </>
  );
};
