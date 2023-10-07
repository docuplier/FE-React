import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';

import { PrivatePaths } from 'routes';
import PrivateRoute from 'routes/PrivateRoute';
import LoadingAnimation from 'reusables/LoadingAnimation';
import NavigationBar from 'reusables/NavigationBar';
import NotFoundPage from 'pages/NotFoundPage';

// Add your routes to this array in the following format:
const routes = [
  {
    path: PrivatePaths.ANNOUNCEMENT,
    exact: true,
    component: lazy(() => import('pages/Announcement')),
  },
];

const AnnouncementRoutes = () => {
  return (
    <>
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
    </>
  );
};

export default React.memo(AnnouncementRoutes);
