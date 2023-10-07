import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';

import { PrivatePaths, PublicPaths } from 'routes';
import PrivateRoute from 'routes/PrivateRoute';
import LoadingAnimation from 'reusables/LoadingAnimation';
import RoleSpecificLoader from 'reusables/RoleSpecificLoader.js';
import { UserRoles } from 'utils/constants.js';
import NotFoundPage from 'pages/NotFoundPage';

const DFADashboardRoutes = () => {
  // Add your routes to this array in the following format:
  const routes = [
    {
      path: PrivatePaths.DFA_DASHBOARD,
      exact: false,
      component: RoleSpecificLoader({
        [UserRoles.K12_STUDENT]: lazy(() => import('pages/DFADashboard/K12StudentDashboard.js')),
        [UserRoles.K12_TEACHER]: lazy(() => import('pages/DFADashboard/K12TeacherDashboard.js')),
        [UserRoles.CIVIL_SERVANT]: lazy(() =>
          import('pages/DFADashboard/CivilServantDashboard.js'),
        ),
        [UserRoles.YOUTH]: lazy(() => import('pages/DFADashboard/YouthDashboard.js')),
        [UserRoles.SCHOOL_ADMIN]: lazy(() => import('pages/DFADashboard/SchoolAdmin')),
        [UserRoles.STUDENT]: lazy(() => import('pages/DFADashboard/K12StudentDashboard.js')),
        [UserRoles.GLOBAL_ADMIN]: lazy(() => import('pages/DFADashboard/YouthDashboard.js')),
        [UserRoles.EXECUTIVE]: lazy(() => import('pages/DFADashboard/CivilServantDashboard.js')),
      }),
    },

    {
      path: `${PublicPaths.DFA_COURSE_DETAILS}`,
      exact: false,
      component: lazy(() => import('pages/DFACourses/DFACourseDetails.js')),
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

export default React.memo(DFADashboardRoutes);
