import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import RoleSpecificLoader from 'reusables/RoleSpecificLoader';
import { PrivatePaths } from 'routes';
import PrivateRoute from 'routes/PrivateRoute';
import LoadingAnimation from 'reusables/LoadingAnimation';
import NotFoundPage from 'pages/NotFoundPage';
import { UserRoles } from 'utils/constants';
import DFANavigationBar from 'reusables/DFANavigationBar';
import { Box, Typography } from '@material-ui/core';
import MaxWidthContainer from 'reusables/MaxWidthContainer';
import { ReactComponent as Logo } from 'assets/svgs/newDFA-logo.svg';

const DFAAssessmentRoutes = () => {
  // Add your routes to this array in the following format:

  const routes = [
    {
      path: PrivatePaths.DFA_ASSESSMENTS,
      exact: true,
      component: lazy(() => import('pages/DFAAssessments/index')),
    },
    {
      path: `${PrivatePaths.DFA_ASSESSMENTS}/create-assessment`,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.LECTURER]: lazy(() => import('pages/Courses/AssessmentCreation')),
        [UserRoles.SCHOOL_ADMIN]: lazy(() => import('pages/Courses/AssessmentCreation')),
        [UserRoles.GLOBAL_ADMIN]: lazy(() => import('pages/Courses/AssessmentCreation')),
      }),
    },
    {
      path: `${PrivatePaths.DFA_ASSESSMENTS}/:assessmentId/start-assessment`,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.STUDENT]: lazy(() => import('pages/Courses/StudentStartAssessment')),
      }),
    },
    {
      path: `${PrivatePaths.DFA_ASSESSMENTS}/:assessmentId/take-assessment`,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.STUDENT]: lazy(() => import('pages/Courses/StudentTakeAssessment')),
      }),
    },
    {
      path: `${PrivatePaths.DFA_ASSESSMENTS}/:assessmentId/assessment-submissions`,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.STUDENT]: lazy(() => import('pages/Courses/AssessmentSubmission')),
        [UserRoles.LECTURER]: lazy(() => import('pages/Courses/AssessmentSubmission')),
        [UserRoles.SCHOOL_ADMIN]: lazy(() => import('pages/Courses/AssessmentSubmission')),
      }),
    },
    {
      path: `${PrivatePaths.DFA_ASSESSMENTS}/:assessmentId`,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.LECTURER]: lazy(() => import('pages/Courses/AssessmentDetails')),
        [UserRoles.SCHOOL_ADMIN]: lazy(() => import('pages/Courses/AssessmentDetails')),
      }),
    },
    {
      path: `${PrivatePaths.DFA_ASSESSMENTS}/:assessmentId/questions-overview`,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.LECTURER]: lazy(() => import('pages/Courses/AssessmentQuestionsOverview')),
        [UserRoles.SCHOOL_ADMIN]: lazy(() => import('pages/Courses/AssessmentQuestionsOverview')),
      }),
    },

    {
      path: `${PrivatePaths.DFA_ASSESSMENT}`,
      exact: false,
      component: lazy(() => import('pages/DFACourses/DFAStudentTakeAssessment')),
    },
    {
      path: `${PrivatePaths.DFA_INTERMEDIATE_ASSESSMENT}`,
      exact: false,
      component: lazy(() => import('pages/DFACourses/DFAIntermediatePath')),
    },
    {
      path: `${PrivatePaths.DFA_START_ASSESSMENT}`,
      exact: false,
      component: lazy(() => import('pages/DFACourses/DFAIntermediateTakeAssessment')),
    },
  ];

  return (
    <>
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
    </>
  );
};

export default React.memo(DFAAssessmentRoutes);
