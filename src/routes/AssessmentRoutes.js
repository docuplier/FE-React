import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import RoleSpecificLoader from 'reusables/RoleSpecificLoader';
import { PrivatePaths } from 'routes';
import PrivateRoute from 'routes/PrivateRoute';
import LoadingAnimation from 'reusables/LoadingAnimation';
import NavigationBar from 'reusables/NavigationBar';
import NotFoundPage from 'pages/NotFoundPage';
import { UserRoles } from 'utils/constants';

const AssessmentRoutes = () => {
  // Add your routes to this array in the following format:
  const routes = [
    {
      path: PrivatePaths.ASSESSMENTS,
      exact: true,
      component: lazy(() => import('pages/Assessments/index.js')),
    },
    {
      path: `${PrivatePaths.ASSESSMENTS}/create-assessment`,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.LECTURER]: lazy(() => import('pages/Courses/AssessmentCreation')),
        [UserRoles.SCHOOL_ADMIN]: lazy(() => import('pages/Courses/AssessmentCreation')),
        [UserRoles.GLOBAL_ADMIN]: lazy(() => import('pages/Courses/AssessmentCreation')),
      }),
    },
    {
      path: `${PrivatePaths.ASSESSMENTS}/:assessmentId/start-assessment`,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.STUDENT]: lazy(() => import('pages/Courses/StudentStartAssessment')),
      }),
    },
    {
      path: `${PrivatePaths.ASSESSMENTS}/:assessmentId/take-assessment`,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.STUDENT]: lazy(() => import('pages/Courses/StudentTakeAssessment')),
      }),
    },
    {
      path: `${PrivatePaths.ASSESSMENTS}/:assessmentId/assessment-submissions`,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.STUDENT]: lazy(() => import('pages/Courses/AssessmentSubmission')),
        [UserRoles.LECTURER]: lazy(() => import('pages/Courses/AssessmentSubmission')),
        [UserRoles.SCHOOL_ADMIN]: lazy(() => import('pages/Courses/AssessmentSubmission')),
      }),
    },
    {
      path: `${PrivatePaths.ASSESSMENTS}/:assessmentId`,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.LECTURER]: lazy(() => import('pages/Courses/AssessmentDetails')),
        [UserRoles.SCHOOL_ADMIN]: lazy(() => import('pages/Courses/AssessmentDetails')),
      }),
    },
    {
      path: `${PrivatePaths.ASSESSMENTS}/:assessmentId/questions-overview`,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.LECTURER]: lazy(() => import('pages/Courses/AssessmentQuestionsOverview')),
        [UserRoles.SCHOOL_ADMIN]: lazy(() => import('pages/Courses/AssessmentQuestionsOverview')),
      }),
    },
  ];

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

export default React.memo(AssessmentRoutes);
