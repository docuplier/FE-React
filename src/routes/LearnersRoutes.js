import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';

import PrivateRoute from 'routes/PrivateRoute';
import { PrivatePaths } from 'routes';
import LoadingAnimation from 'reusables/LoadingAnimation';
import NotFoundPage from 'pages/NotFoundPage';

// Add your routes to this array in the following format:
const routes = [
  {
    path: PrivatePaths.INSTITUTIONS,
    exact: true,
    component: lazy(() => import('../pages/Learners')),
  },
];

const LearnersRoutes = () => {
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

export default React.memo(LearnersRoutes);
