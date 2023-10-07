import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';

import PrivateRoute from 'routes/PrivateRoute';
import { PrivatePaths } from 'routes';
import RoleSpecificLoader from 'reusables/RoleSpecificLoader';
import { UserRoles } from 'utils/constants';
import DFANavigationBar from 'reusables/DFANavigationBar';
import LoadingAnimation from 'reusables/LoadingAnimation';
import NotFoundPage from 'pages/NotFoundPage';

const UsersRoutes = () => {
  const routes = [
    {
      path: `${PrivatePaths.DFA_USERS}/administrators`,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.SCHOOL_ADMIN]: lazy(() => import('pages/DFAUsers/Administrators')),
      }),
    },
    {
      path: `${PrivatePaths.DFA_USERS}/students`,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.SCHOOL_ADMIN]: lazy(() => import('pages/DFAUsers/Learners')),
      }),
    },
    {
      path: `${PrivatePaths.DFA_USERS}/K-12-teachers`,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.SCHOOL_ADMIN]: lazy(() => import('pages/DFAUsers/K12Teachers')),
      }),
    },
    {
      path: `${PrivatePaths.DFA_USERS}/lecturers`,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.SCHOOL_ADMIN]: lazy(() => import('pages/DFAUsers/Instructors')),
      }),
    },
    {
      path: `${PrivatePaths.DFA_USERS}/migration`,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.SCHOOL_ADMIN]: lazy(() => import('pages/DFAUsers/Migration')),
      }),
    },
    {
      path: PrivatePaths.DFA_USERS,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.SCHOOL_ADMIN]: lazy(() => import('pages/DFAUsers/UsersOverview')),
      }),
    },
    {
      path: `${PrivatePaths.DFA_USERS}/instructors/:id`,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.SCHOOL_ADMIN]: lazy(() => import('pages/DFAUsers/InstructorDetail')),
        [UserRoles.GLOBAL_ADMIN]: lazy(() => import('pages/DFAUsers/InstructorDetail')),
      }),
    },
    {
      path: `${PrivatePaths.DFA_USERS}/learners/:id`,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.SCHOOL_ADMIN]: lazy(() => import('pages/DFAUsers/LearnerDetail')),
        [UserRoles.GLOBAL_ADMIN]: lazy(() => import('pages/DFAUsers/LearnerDetail')),
      }),
    },
  ];

  return (
    <div>
      <DFANavigationBar />
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

export default React.memo(UsersRoutes);
