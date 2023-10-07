import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';

import LoadingAnimation from 'reusables/LoadingAnimation';
import NavigationBar from 'reusables/NavigationBar';
import RoleSpecificLoader from 'reusables/RoleSpecificLoader';
import { PrivatePaths } from 'routes';
import PrivateRoute from 'routes/PrivateRoute';
import { UserRoles } from 'utils/constants';
import NotFoundPage from 'pages/NotFoundPage';

const CourseRoutes = () => {
  // Add your routes to this array in the following format:
  const routes = [
    {
      path: `${PrivatePaths.COURSES}/create-course`,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.SCHOOL_ADMIN]: lazy(() =>
          import('../pages/Courses/SchoolAdminCourseRegistration'),
        ),
        [UserRoles.LECTURER]: lazy(() => import('../pages/Courses/LecturerCourseCreation')),
      }),
    },
    {
      path: `${PrivatePaths.COURSES}/all`,
      exact: true,
      component: lazy(() => import('pages/Courses/CourseList')),
    },
    {
      path: `${PrivatePaths.COURSES}/:courseId/assignments/:assignmentId/start-assignment`,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.STUDENT]: lazy(() => import('../pages/Courses/AssignmentSubmission')),
      }),
    },
    {
      path: `${PrivatePaths.COURSES}/:courseId/course-content`,
      exact: true,
      component: lazy(() => import('pages/Courses/CourseContent')),
    },
    {
      path: PrivatePaths.COURSES,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.SCHOOL_ADMIN]: lazy(() => import('pages/Courses/CourseCategory')),
        [UserRoles.LECTURER]: lazy(() => import('pages/Courses/MyCourses')),
        [UserRoles.STUDENT]: lazy(() => import('pages/Courses/CourseList')),
      }),
    },
    {
      path: `${PrivatePaths.COURSES}/:courseId/assignments/:assignmentId`,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.SCHOOL_ADMIN]: lazy(() => import('pages/Courses/Assignments')),
        [UserRoles.LECTURER]: lazy(() => import('pages/Courses/Assignments')),
        [UserRoles.STUDENT]: lazy(() => import('pages/Courses/StudentAssignmentDetail')),
      }),
    },
    {
      path: `${PrivatePaths.COURSES}/:courseId/assignments/:assignmentId/details`,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.LECTURER]: lazy(() => import('pages/Courses/AssignmentDetail')),
        [UserRoles.SCHOOL_ADMIN]: lazy(() => import('pages/Courses/AssignmentDetail')),
      }),
    },
    {
      path: `${PrivatePaths.COURSES}/:courseId/assignments/:assignmentId/:enrolleeId/details`,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.LECTURER]: lazy(() => import('pages/Courses/AssignmentGrade')),
      }),
    },
    {
      path: `${PrivatePaths.COURSES}/:courseId/assessments/create-assessment`,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.LECTURER || UserRoles.SCHOOL_ADMIN || UserRoles.GLOBAL_ADMIN]: lazy(() =>
          import('pages/Courses/AssessmentCreation'),
        ),
      }),
    },
    {
      path: `${PrivatePaths.COURSES}/:courseId/assessments/:assessmentId/questions-overview`,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.LECTURER]: lazy(() => import('pages/Courses/AssessmentQuestionsOverview')),
        [UserRoles.SCHOOL_ADMIN]: lazy(() => import('pages/Courses/AssessmentQuestionsOverview')),
      }),
    },
    {
      path: `${PrivatePaths.COURSES}/:courseId/assessments/:assessmentId/assessment-submissions`,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.STUDENT]: lazy(() => import('pages/Courses/AssessmentSubmission')),
        [UserRoles.LECTURER]: lazy(() => import('pages/Courses/AssessmentSubmission')),
      }),
    },
    {
      path: `${PrivatePaths.COURSES}/:courseId/assessments/:assessmentId/start-assessment`,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.STUDENT]: lazy(() => import('pages/Courses/StudentStartAssessment')),
      }),
    },
    {
      path: `${PrivatePaths.COURSES}/:courseId/assessments/:assessmentId/take-assessment`,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.STUDENT]: lazy(() => import('pages/Courses/StudentTakeAssessment')),
      }),
    },
    {
      path: `${PrivatePaths.COURSES}/:courseId/assessments/:assessmentId`,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.LECTURER]: lazy(() => import('pages/Courses/AssessmentDetails')),
        [UserRoles.SCHOOL_ADMIN]: lazy(() => import('pages/Courses/AssessmentDetails')),
      }),
    },
    {
      path: `${PrivatePaths.COURSES}/:courseId`,
      exact: true,
      component: lazy(() => import('../pages/Courses/CourseDetails')),
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

export default React.memo(CourseRoutes);
