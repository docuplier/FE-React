import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';

import NavigationBar from 'reusables/NavigationBar';
import { PrivatePaths } from 'routes';
import PrivateRoute from 'routes/PrivateRoute';
import LoadingAnimation from 'reusables/LoadingAnimation';
import NotFoundPage from 'pages/NotFoundPage';

const LibraryRoutes = () => {
  const routes = [
    {
      path: PrivatePaths.LIBRARY,
      exact: true,
      component: lazy(() => import('pages/Library/Homepage')),
    },
    {
      path: `${PrivatePaths.LIBRARY}/categories/:categoryId/contents/:contentId`,
      exact: true,
      component: lazy(() => import('pages/Library/ContentDetails')),
    },
    {
      path: [`${PrivatePaths.LIBRARY}/saved`, `${PrivatePaths.LIBRARY}/categories/:categoryId`],
      exact: true,
      component: lazy(() => import('pages/Library/CategoryDetails')),
    },
    {
      path: `${PrivatePaths.LIBRARY}/categories`,
      exact: true,
      component: lazy(() => import('pages/Library/Categories')),
    },
    {
      path: `${PrivatePaths.LIBRARY}/create-content`,
      exact: true,
      component: lazy(() => import('pages/Library/CreateContent')),
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

export default React.memo(LibraryRoutes);
