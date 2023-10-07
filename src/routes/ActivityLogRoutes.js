import React, { lazy, Suspense } from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import LoadingAnimation from 'reusables/LoadingAnimation';
import NavigationBar from 'reusables/NavigationBar';
import { PrivatePaths } from 'routes';
import PrivateRoute from 'routes/PrivateRoute';
import NotFoundPage from 'pages/NotFoundPage';
import DFANavigationBar from 'reusables/DFANavigationBar';
import { Box, Typography } from '@material-ui/core';
import MaxWidthContainer from 'reusables/MaxWidthContainer';
import { ReactComponent as Logo } from 'assets/svgs/newDFA-logo.svg';

const ActivityLogRoutes = () => {
  const location = useLocation();
  const isDfa = location?.pathname?.startsWith('/dfa'); // TODO: get isdfa from user object

  // Add your routes to this array in the following format:
  const routes = [
    {
      path: PrivatePaths.ACTIVITY_LOG,
      exact: true,
      component: lazy(() => import('pages/ActivityLog/HomePage.js')),
    },
    {
      path: `${PrivatePaths.DFA_ACTIVITY_LOG}`,
      exact: false,
      component: lazy(() => import('pages/ActivityLog/HomePage.js')),
    },
  ];

  return (
    <div>
      {isDfa ? <DFANavigationBar /> : <NavigationBar />}
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
      {isDfa && (
        <Box
          bgcolor={'white'}
          style={{
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <MaxWidthContainer>
            <Box display="flex" alignItems="center" justifyContent={'space-between'} py={8}>
              <Box display="flex" alignItems="center">
                <Logo />
                {/* <img src={logoImage} alt="logo" /> */}
              </Box>
              <Typography>©2023 Tech4Dev, Inc.</Typography>
            </Box>
          </MaxWidthContainer>
        </Box>
      )}
    </div>
  );
};

export default React.memo(ActivityLogRoutes);
