import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';

import PrivateRoute from 'routes/PrivateRoute';
import { PrivatePaths } from 'routes';
import RoleSpecificLoader from 'reusables/RoleSpecificLoader';
import { UserRoles } from 'utils/constants';
import NavigationBar from 'reusables/NavigationBar';
import LoadingAnimation from 'reusables/LoadingAnimation';
import NotFoundPage from 'pages/NotFoundPage';

const UsersRoutes = () => {
  const routes = [
    {
      path: `${PrivatePaths.USERS}/administrators`,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.SCHOOL_ADMIN]: lazy(() => import('pages/Users/Administrators')),
      }),
    },
    // @todo: Uncomment this route when custom users page has been integrated
    // {
    //   path: `${PrivatePaths.USERS}/custom-users`,
    //   exact: true,
    //   component: RoleSpecificLoader({
    //     [UserRoles.SCHOOL_ADMIN]: lazy(() => import('pages/Users/CustomUsers')),
    //   }),
    // },
    {
      path: `${PrivatePaths.USERS}/students`,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.SCHOOL_ADMIN]: lazy(() => import('pages/Users/Learners')),
      }),
    },
    {
      path: `${PrivatePaths.USERS}/lecturers`,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.SCHOOL_ADMIN]: lazy(() => import('pages/Users/Instructors')),
      }),
    },
    {
      path: `${PrivatePaths.USERS}/migration`,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.SCHOOL_ADMIN]: lazy(() => import('pages/Users/Migration')),
      }),
    },
    {
      path: PrivatePaths.USERS,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.SCHOOL_ADMIN]: lazy(() => import('pages/Users/UsersOverview')),
      }),
    },
    {
      path: `${PrivatePaths.USERS}/instructors/:id`,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.SCHOOL_ADMIN]: lazy(() => import('pages/Users/InstructorDetail')),
        [UserRoles.GLOBAL_ADMIN]: lazy(() => import('pages/Users/InstructorDetail')),
      }),
    },
    {
      path: `${PrivatePaths.USERS}/learners/:id`,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.SCHOOL_ADMIN]: lazy(() => import('pages/Users/LearnerDetail')),
        [UserRoles.GLOBAL_ADMIN]: lazy(() => import('pages/Users/LearnerDetail')),
      }),
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

export default React.memo(UsersRoutes);
