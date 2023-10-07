import React, { lazy, Suspense } from 'react';
import { Switch } from 'react-router-dom';
import { Box } from '@material-ui/core';

import PrivateRoute from 'routes/PrivateRoute';
import { PrivatePaths } from 'routes';
import LoadingAnimation from 'reusables/LoadingAnimation';
import NavigationBar from 'reusables/DFANavigationBar';
import { colors } from '../../../Css';

// Add your routes to this array in the following format:
const routes = [
  {
    path: PrivatePaths.DFA_DASHBOARD,
    exact: true,
    component: lazy(() => import('./MainDashboard')),
  },
  {
    path: `${PrivatePaths.DFA_DASHBOARD}/course-dashboard`,
    exact: true,
    component: lazy(() => import('./CourseDashboard')),
  },
];

const SchoolAdminDashboardRoutes = () => {
  return (
    <>
      <NavigationBar />
      <Box bgcolor={colors.background}>
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
          </Switch>
        </Suspense>
      </Box>
    </>
  );
};

export default React.memo(SchoolAdminDashboardRoutes);
