import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';

import NavigationBar from 'reusables/NavigationBar';
import { PrivatePaths } from 'routes';
import PrivateRoute from 'routes/PrivateRoute';
import LoadingAnimation from 'reusables/LoadingAnimation';
import RoleSpecificLoader from 'reusables/RoleSpecificLoader';
import { UserRoles } from 'utils/constants';
import NotFoundPage from 'pages/NotFoundPage';

const LiveSessionRoutes = () => {
  const routes = [
    {
      path: PrivatePaths.LIVE_SESSION,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.SCHOOL_ADMIN]: lazy(() => import('pages/LiveSession/CalendarView')),
        [UserRoles.STUDENT]: lazy(() => import('pages/LiveSession/CalendarView')),
        [UserRoles.LECTURER]: lazy(() => import('pages/LiveSession/CalendarView')),
      }),
    },
    {
      path: `${PrivatePaths.LIVE_SESSION}/create-live-session`,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.SCHOOL_ADMIN]: lazy(() => import('../pages/LiveSession/UpsertLiveSession')),
        [UserRoles.LECTURER]: lazy(() => import('../pages/LiveSession/UpsertLiveSession')),
      }),
    },
  ];

  return (
    <div>
      <NavigationBar />
      <Suspense fallback={<LoadingAnimation />}>
        <Switch>
          {routes.map((route, index) => {
            return (
              <PrivateRoute
                key={index}
                path={route.path}
                exact={route.exact}
                component={route.component}
              />
            );
          })}
          <Route path="*" component={NotFoundPage} />
        </Switch>
      </Suspense>
    </div>
  );
};

export default React.memo(LiveSessionRoutes);
