import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';

import NavigationBar from 'reusables/NavigationBar';
import { PrivatePaths } from 'routes';
import PrivateRoute from 'routes/PrivateRoute';
import LoadingAnimation from 'reusables/LoadingAnimation';
import RoleSpecificLoader from 'reusables/RoleSpecificLoader';
import { UserRoles } from 'utils/constants';
import NotFoundPage from 'pages/NotFoundPage';

const routes = [
  {
    path: `${PrivatePaths.EXECUTIVE}`,
    exact: true,
    component: lazy(() => import('../pages/Executive/ExecutiveList')),
  },
  {
    path: `${PrivatePaths.EXECUTIVE}/new-executive`,
    exact: true,
    component: lazy(() => import('../pages/Executive/ExecutiveCreation')),
  },
];

const ExecutiveRoutes = () => {
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
                component={RoleSpecificLoader({
                  [UserRoles.GLOBAL_ADMIN]: route.component,
                })}
              />
            );
          })}
          <Route path="*" component={NotFoundPage} />
        </Switch>
      </Suspense>
    </div>
  );
};

export default React.memo(ExecutiveRoutes);
