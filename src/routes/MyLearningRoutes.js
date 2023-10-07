import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';

import NavigationBar from 'reusables/NavigationBar';
import { PrivatePaths } from 'routes';
import PrivateRoute from 'routes/PrivateRoute';
import LoadingAnimation from 'reusables/LoadingAnimation';
import RoleSpecificLoader from 'reusables/RoleSpecificLoader';
import { UserRoles } from 'utils/constants';
import NotFoundPage from 'pages/NotFoundPage';

// Add your routes to this array in the following format:
const routes = [
  {
    path: PrivatePaths.MY_LEARNING,
    exact: true,
    component: lazy(() => import('../pages/MyLearning')),
  },
];

const MyLearningRoutes = () => {
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
                  [UserRoles.STUDENT]: route.component,
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

export default React.memo(MyLearningRoutes);
