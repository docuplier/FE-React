import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';

import { PrivatePaths, PublicPaths } from 'routes';
import PrivateRoute from 'routes/PrivateRoute';
import LoadingAnimation from 'reusables/LoadingAnimation';
import RoleSpecificLoader from 'reusables/RoleSpecificLoader.js';
import { UserRoles } from 'utils/constants.js';
import NotFoundPage from 'pages/NotFoundPage';

const DashboardRoutes = () => {
  // Add your routes to this array in the following format:
  const routes = [
    {
      path: `${PrivatePaths.DASHBOARD}/department-deviation-dashboard`,
      exact: false,
      component: lazy(() => import('pages/Dashboard/DepartmentDeviationDashboard')),
    },
    {
      path: PrivatePaths.DASHBOARD,
      exact: false,
      component: RoleSpecificLoader({
        [UserRoles.LECTURER]: lazy(() => import('../pages/Dashboard/InstructorDashboard.js')),
        [UserRoles.SCHOOL_ADMIN]: lazy(() => import('pages/Dashboard/SchoolAdmin')),
        [UserRoles.STUDENT]: lazy(() => import('pages/Dashboard/StudentDashboard')),
        [UserRoles.GLOBAL_ADMIN]: lazy(() => import('pages/Dashboard/ExecutiveDashboard')),
        [UserRoles.EXECUTIVE]: lazy(() => import('pages/Dashboard/ExecutiveDashboard')),
      }),
    },
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

        [UserRoles.SCHOOL_ADMIN]: lazy(() => import('pages/DFADashboard/K12TeacherDashboard.js')),
        [UserRoles.STUDENT]: lazy(() => import('pages/DFADashboard/K12StudentDashboard.js')),
        [UserRoles.GLOBAL_ADMIN]: lazy(() => import('pages/DFADashboard/YouthDashboard.js')),
        [UserRoles.EXECUTIVE]: lazy(() => import('pages/DFADashboard/CivilServantDashboard.js')),
      }),
    },
    {
      path: PrivatePaths.DFA_ASSESSMENT_DASHBOARD,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.K12_STUDENT]: lazy(() => import('pages/Dashboard/StudentDashboard')),
        [UserRoles.K12_TEACHER]: lazy(() => import('pages/Dashboard/StudentDashboard')),
        [UserRoles.CIVIL_SERVANT]: lazy(() => import('pages/Dashboard/StudentDashboard')),
        [UserRoles.YOUTH]: lazy(() => import('pages/Dashboard/StudentDashboard')),

        [UserRoles.STUDENT]: lazy(() => import('pages/Dashboard/StudentDashboard')),
      }),
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

export default React.memo(DashboardRoutes);
