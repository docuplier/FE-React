import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';

import PrivateRoute from 'routes/PrivateRoute';
import { PrivatePaths } from 'routes';
import RoleSpecificLoader from 'reusables/RoleSpecificLoader';
import { UserRoles } from 'utils/constants';
import LoadingAnimation from 'reusables/LoadingAnimation';
import NotFoundPage from 'pages/NotFoundPage';

const InstitutionRoutes = () => {
  return (
    <Suspense fallback={<LoadingAnimation />}>
      <Switch>
        <PrivateRoute
          path={PrivatePaths.DFA_INSTITUTIONS}
          exact={true}
          component={RoleSpecificLoader({
            [UserRoles.GLOBAL_ADMIN]: lazy(() => import('pages/Institutions/Schools')),
          })}
        />
        <PrivateRoute
          path={`${PrivatePaths.DFA_INSTITUTIONS}/create-school`}
          exact={true}
          component={RoleSpecificLoader({
            [UserRoles.GLOBAL_ADMIN]: lazy(() => import('pages/Institutions/SchoolCreation')),
          })}
        />
        <PrivateRoute
          path={`${PrivatePaths.DFA_INSTITUTIONS}/:institutionId/school-management`}
          exact={false}
          component={RoleSpecificLoader({
            [UserRoles.SCHOOL_ADMIN]: lazy(() => import('pages/Institutions/SchoolManagement')),
          })}
        />
        <PrivateRoute
          path={`${PrivatePaths.DFA_INSTITUTIONS}/:institutionId`}
          exact={true}
          component={lazy(() => import('pages/Institutions/FacultyList'))}
        />
        <PrivateRoute
          path={`${PrivatePaths.DFA_INSTITUTIONS}/:institutionId/faculties/:facultyId`}
          exact={true}
          component={lazy(() => import('pages/Institutions/Departments'))}
        />
        <PrivateRoute
          path={`${PrivatePaths.DFA_INSTITUTIONS}/:institutionId/faculties/:facultyId/departments/:departmentId`}
          exact={true}
          component={lazy(() => import('pages/Institutions/DepartmentDetails'))}
        />
        <PrivateRoute
          path={`${PrivatePaths.DFA_INSTITUTIONS}/:institutionId/faculties/:facultyId/departments/:departmentId/levels/:levelId`}
          exact={true}
          component={lazy(() => import('pages/Institutions/LevelDetails'))}
        />
        <Route path="*" component={NotFoundPage} />
      </Switch>
    </Suspense>
  );
};

export default React.memo(InstitutionRoutes);
