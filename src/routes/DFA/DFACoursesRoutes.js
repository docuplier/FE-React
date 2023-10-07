import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';

import LoadingAnimation from 'reusables/LoadingAnimation';
import NavigationBar from 'reusables/NavigationBar';
import RoleSpecificLoader from 'reusables/RoleSpecificLoader';
import { PrivatePaths } from 'routes';
import PrivateRoute from 'routes/PrivateRoute';
import { UserRoles } from 'utils/constants';
import NotFoundPage from 'pages/NotFoundPage';
import DFANavigationBar from 'reusables/DFANavigationBar';

const DFACourseRoutes = () => {
  // Add your routes to this array in the following format:
  const routes = [
    {
      path: `${PrivatePaths.DFA_COURSE_DETAILS}/:courseId`,
      exact: true,
      component: lazy(() => import('pages/DFACourses/DFACourseDetails')),
    },
    {
      path: `${PrivatePaths.DFA_COURSE_DETAILS}/:courseId/assignments/:assignmentId`,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.STUDENT]: lazy(() => import('pages/DFACourses/DFAStudentAssignmentDetails.js')),
        [UserRoles.LECTURER]: lazy(() =>
          import('pages/DFACourses/DFALecturerAssignmentDetails.js'),
        ),
      }),
    },
    {
      path: `${PrivatePaths.DFA_COURSE_DETAILS}/:courseId/assignments/:assignmentId/details`,
      exact: true,
      component: lazy(() => import('pages/DFACourses/DFAAssignmentDetials')),
    },
    {
      path: `${PrivatePaths.DFA_COURSE_DETAILS}/:courseId/assessments/:assessmentId/details`,
      exact: true,
      component: lazy(() => import('pages/DFACourses/AssessmentDetails')),
    },
    {
      path: `${PrivatePaths.DFA_COURSE_DETAILS}/:courseId/assessments/:assessmentId`,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.LECTURER]: lazy(() => import('pages/Courses/AssessmentDetails')),
        [UserRoles.SCHOOL_ADMIN]: lazy(() => import('pages/Courses/AssessmentDetails')),
      }),
    },

    {
      path: `${PrivatePaths.DFA_COURSE_DETAILS}/:courseId/assessments/:assessmentId/assessment-submissions`,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.STUDENT]: lazy(() => import('pages/DFACourses/AssessmentSubmission')),
        [UserRoles.LECTURER]: lazy(() => import('pages/DFACourses/AssessmentSubmission')),
      }),
    },

    {
      path: `${PrivatePaths.DFA_COURSE_DETAILS}/:courseId/assignments/:assignmentId/start-assignment`,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.STUDENT]: lazy(() => import('pages/DFACourses/DFAAssignmentSubmission.js')),
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

export default React.memo(DFACourseRoutes);
