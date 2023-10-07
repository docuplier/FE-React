import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';

import PrivateRoute from 'routes/PrivateRoute';
import { PrivatePaths } from 'routes';
import RoleSpecificLoader from 'reusables/RoleSpecificLoader';
import { UserRoles } from 'utils/constants';
import LoadingAnimation from 'reusables/LoadingAnimation';
import NotFoundPage from 'pages/NotFoundPage';

const ProfileRoute = () => {
  return (
    <Suspense fallback={<LoadingAnimation />}>
      <Switch>
        <PrivateRoute
          path={PrivatePaths.PROFILE}
          exact={true}
          component={RoleSpecificLoader({
            [UserRoles.GLOBAL_ADMIN]: lazy(() => import('pages/Profile/ProfileDetails')),
            [UserRoles.SCHOOL_ADMIN]: lazy(() => import('pages/Profile/ProfileDetails')),
            [UserRoles.LECTURER]: lazy(() => import('pages/Profile/ProfileDetails')),
            [UserRoles.STUDENT]: lazy(() => import('pages/Profile/ProfileDetails')),
          })}
        />
        <Route path="*" component={NotFoundPage} />
      </Switch>
    </Suspense>
  );
};

export default React.memo(ProfileRoute);
