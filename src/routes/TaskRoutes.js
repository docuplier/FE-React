import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';

import { PrivatePaths } from 'routes';
import PrivateRoute from 'routes/PrivateRoute';
import LoadingAnimation from 'reusables/LoadingAnimation';
import RoleSpecificLoader from 'reusables/RoleSpecificLoader.js';
import { UserRoles } from 'utils/constants.js';
import NotFoundPage from 'pages/NotFoundPage';

const TaskRoutes = () => {
  // Add your routes to this array in the following format:
  const routes = [
    {
      path: PrivatePaths.CREATE_TASK,
      exact: true,
      component: lazy(() => import('../pages/CreateTask.js')),
    },
  ];

  return (
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
  );
};

export default React.memo(TaskRoutes);
