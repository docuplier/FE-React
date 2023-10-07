import React, { lazy, Suspense } from 'react';
import { Route, Router, Switch } from 'react-router-dom';

import AccountSetup from 'pages/Authentication/AccountSetup';
import ExistingUserPasswordCreation from 'pages/Authentication/ExistingUserPasswordCreation';
import ExistingUserValidation from 'pages/Authentication/ExistingUserValidation';
import ForgotPassword from 'pages/Authentication/ForgotPassword';
import LearnersRegistration from 'pages/Authentication/LearnersRegistration';
import Stages from 'pages/Authentication/LearnersRegistration/Stages';
import Login from 'pages/Authentication/Login';
import ResetPassword from 'pages/Authentication/ResetPassword';
import NotFoundPage from 'pages/NotFoundPage';
import Redirects from 'pages/Redirects';
import LoadingAnimation from 'reusables/LoadingAnimation';
import Splashscreen from 'reusables/Splashscreen';
import history from './history';
import PrivateRoute from './PrivateRoute';
import ExistingUserOTPVerification from 'pages/Authentication/ExistingUserOTPVerification';
import SchoolList from 'pages/SchoolList';
import ExistingUserDataVerifyPage from 'pages/Authentication/ExistingUserDataVerifyPage';
import Registration from 'pages/Authentication/DFARegistration';
import DFALogin from 'pages/Authentication/DFAAuthentication/DFALogin';
import DFAResetPassword from 'pages/Authentication/DFAAuthentication/DFAResetPassword';

export const PublicPaths = {
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  INSTRUCTOR: '/instructor-registration',
  LEARNERS_REGISTRATION: '/learners-registration',
  LEARNERS_REGISTRATION_STAGES: '/learners-registration-stages',
  ACCOUNT_SETUP: '/account-setup',
  EXISTING_USER_OTP_VERIFICATION: '/existing-user-otp-verification',
  EXISTING_USER_PASSWORD_CREATION: '/existing-user-password-creation',
  EXISTING_USER_VALIDATION: '/existing-user-validation',
  SCHOOL_LIST: '/school-list',
  EXISTING_USER_DATA_PAGE: '/verify-data',
  REGISTER: '/register',
  DFA_LOGIN: '/signin',
  DFA_RESET_PASSWORD: '/dfa-reset-password',
  DFA_ACTIVITY_LOG: '/dfa-activity-log',
  DFA_ASSESSMENT: '/dfa-assessment',
  DFA_START_ASSESSMENT: '/dfa-start-assessment',
  DFA_INTERMEDIATE_ASSESSMENT: '/dfa-intermediate-assessment',
};

export const PrivatePaths = {
  INSTITUTIONS: '/institutions',
  COURSES: '/courses',
  LEARNERS: '/learners',
  DASHBOARD: '/dashboard',
  USERS: '/users',
  MY_LEARNING: '/my-learning',
  LIBRARY: '/library',
  LIVE_SESSION: '/live-session',
  PROFILE: '/profile',
  HELP_PAGE: '/get-help',
  ANNOUNCEMENT: '/announcement',
  EXECUTIVE: '/executive',
  LOW_GRADE: '/low-grade',
  NOTIFICATION: '/notifications',
  CREATE_TASK: '/create_task',
  ASSESSMENTS: '/assessments',
  ACTIVITY_LOG: '/activity-log',
  DFA_ACTIVITY_LOG: '/dfa-activity-log',
  DFA_ASSESSMENTS: '/dfa-assessments',
  DFA_DASHBOARD: '/dfa-dashboard',
  DFA_ASSESSMENT: '/dfa-assessment',
  DFA_START_ASSESSMENT: '/dfa-start-assessment',
  DFA_INTERMEDIATE_ASSESSMENT: '/dfa-intermediate-assessment',
  DFA_COURSE_DETAILS: '/dfa-course-details',
  DFA_INSTITUTIONS: '/dfa-institutions',
  DFA_USERS: '/dfa-users',
};

const publicRoutes = [
  /* Add paths for unauthorized users */
  { path: PublicPaths.LOGIN, exact: true, component: Login },
  { path: PublicPaths.DFA_LOGIN, exact: true, component: DFALogin },
  { path: PublicPaths.DFA_RESET_PASSWORD, exact: true, component: DFAResetPassword },

  { path: PublicPaths.LEARNERS_REGISTRATION, exact: true, component: LearnersRegistration },
  { path: PublicPaths.LEARNERS_REGISTRATION_STAGES, exact: true, component: Stages },
  { path: PublicPaths.FORGOT_PASSWORD, exact: true, component: ForgotPassword },
  { path: PublicPaths.RESET_PASSWORD, exact: true, component: ResetPassword },
  { path: PublicPaths.EXISTING_USER_DATA_PAGE, exact: true, component: ExistingUserDataVerifyPage },
  {
    path: PublicPaths.INSTRUCTOR,
    exact: false,
    component: lazy(() => import('pages/Authentication/InstructorRegistration')),
  },
  { path: PublicPaths.ACCOUNT_SETUP, exact: true, component: AccountSetup },
  {
    path: PublicPaths.EXISTING_USER_OTP_VERIFICATION,
    exact: true,
    component: ExistingUserOTPVerification,
  },
  {
    path: PublicPaths.EXISTING_USER_PASSWORD_CREATION,
    exact: true,
    component: ExistingUserPasswordCreation,
  },
  { path: PublicPaths.EXISTING_USER_VALIDATION, exact: true, component: ExistingUserValidation },
  {
    path: PublicPaths.SCHOOL_LIST,
    exact: true,
    component: SchoolList,
  },
  {
    path: PublicPaths.REGISTER,
    exact: true,
    component: Registration,
  },
];

const privateRoutes = [
  /* Add paths for authorized users */
  {
    path: PrivatePaths.INSTITUTIONS,
    exact: false,
    component: lazy(() => import('./InstitutionRoutes')),
  },
  { path: PrivatePaths.COURSES, exact: false, component: lazy(() => import('./CourseRoutes')) },

  {
    path: PrivatePaths.ACTIVITY_LOG,
    exact: false,
    component: lazy(() => import('./ActivityLogRoutes')),
  },
  { path: PrivatePaths.LEARNERS, exact: false, component: lazy(() => import('./LearnersRoutes')) },

  {
    path: PrivatePaths.DASHBOARD,
    exact: false,
    component: lazy(() => import('./DashboardRoutes')),
  },

  { path: PrivatePaths.USERS, exact: false, component: lazy(() => import('./UsersRoutes')) },
  {
    path: PrivatePaths.MY_LEARNING,
    exact: false,
    component: lazy(() => import('./MyLearningRoutes')),
  },
  {
    path: PrivatePaths.LIBRARY,
    exact: false,
    component: lazy(() => import('./LibraryRoutes')),
  },
  {
    path: PrivatePaths.LIVE_SESSION,
    exact: false,
    component: lazy(() => import('./LiveSessionRoutes')),
  },
  {
    path: PrivatePaths.PROFILE,
    exact: false,
    component: lazy(() => import('./ProfileRoutes')),
  },
  {
    path: PrivatePaths.HELP_PAGE,
    exact: true,
    component: lazy(() => import('pages/Help')),
  },
  {
    path: PrivatePaths.ANNOUNCEMENT,
    exact: false,
    component: lazy(() => import('./AnnouncementRoutes')),
  },
  {
    path: PrivatePaths.EXECUTIVE,
    exact: false,
    component: lazy(() => import('./ExecutiveRoutes')),
  },
  {
    path: PrivatePaths.ASSESSMENTS,
    exact: false,
    component: lazy(() => import('./AssessmentRoutes')),
  },
  {
    path: PrivatePaths.NOTIFICATION,
    exact: true,
    component: lazy(() => import('../pages/Notification.js')),
  },
  {
    path: PrivatePaths.CREATE_TASK,
    exact: true,
    component: lazy(() => import('./TaskRoutes.js')),
  },

  {
    path: PrivatePaths.DFA_ACTIVITY_LOG,
    exact: false,
    component: lazy(() => import('./ActivityLogRoutes')),
  },
  {
    path: PrivatePaths.DFA_ASSESSMENTS,
    exact: false,
    component: lazy(() => import('./DFAAssessmentRoutes')),
  },
  {
    path: PrivatePaths.DFA_ASSESSMENT,
    exact: false,
    component: lazy(() => import('./DFAAssessmentRoutes')),
  },
  {
    path: PrivatePaths.DFA_DASHBOARD,
    exact: false,
    component: lazy(() => import('./DFA/DFADashboardRoutes')),
  },
  {
    path: PrivatePaths.DFA_INSTITUTIONS,
    exact: false,
    component: lazy(() => import('./DFA/DFAInstitutionRoutes')),
  },
  {
    path: PrivatePaths.DFA_USERS,
    exact: false,
    component: lazy(() => import('./DFA/UsersRoutes')),
  },
  {
    path: PrivatePaths.DFA_COURSE_DETAILS,
    exact: false,
    component: lazy(() => import('./DFA/DFACoursesRoutes')),
  },
];

const Routes = () => (
  <Splashscreen>
    <Suspense fallback={<LoadingAnimation />}>
      <Router history={history}>
        <Switch>
          {publicRoutes.map((route, index) => (
            <Route key={index} path={route.path} exact={route.exact} component={route.component} />
          ))}
          {privateRoutes.map((route, index) => (
            <PrivateRoute
              key={index}
              path={route.path}
              exact={route.exact}
              component={route.component}
            />
          ))}
          <Route path="/" component={Redirects} />
          <Route path="*" component={NotFoundPage} />
        </Switch>
      </Router>
    </Suspense>
  </Splashscreen>
);

export default Routes;
