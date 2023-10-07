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
        [UserRoles.LECTURER]: lazy(() => import('pages/DFACourses/DFAAssessmentCreation')),
        [UserRoles.SCHOOL_ADMIN]: lazy(() => import('pages/DFACourses/DFAAssessmentCreation')),
        [UserRoles.GLOBAL_ADMIN]: lazy(() => import('pages/DFACourses/DFAAssessmentCreation')),
      }),
    },
    {
      path: `${PrivatePaths.DFA_ASSESSMENTS}/:assessmentId/start-assessment`,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.STUDENT]: lazy(() => import('pages/DFACourses/DFAStudentStartAssessment')),
      }),
    },
    {
      path: `${PrivatePaths.DFA_ASSESSMENTS}/:assessmentId/take-assessment`,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.STUDENT]: lazy(() => import('pages/DFACourses/DFAStudentTakeAssessment')),
      }),
    },
    {
      path: `${PrivatePaths.DFA_ASSESSMENTS}/:assessmentId/assessment-submissions`,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.STUDENT]: lazy(() => import('pages/DFACourses/DFAAssessmentSubmission')),
        [UserRoles.LECTURER]: lazy(() => import('pages/DFACourses/DFAAssessmentSubmission')),
        [UserRoles.SCHOOL_ADMIN]: lazy(() => import('pages/DFACourses/DFAAssessmentSubmission')),
      }),
    },
    {
      path: `${PrivatePaths.DFA_ASSESSMENTS}/:assessmentId`,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.LECTURER]: lazy(() => import('pages/DFACourses/DFAAssessmentDetails')),
        [UserRoles.SCHOOL_ADMIN]: lazy(() => import('pages/DFACourses/DFAAssessmentDetails')),
      }),
    },
    {
      path: `${PrivatePaths.DFA_ASSESSMENTS}/:assessmentId/questions-overview`,
      exact: true,
      component: RoleSpecificLoader({
        [UserRoles.LECTURER]: lazy(() => import('pages/DFACourses/DFAAssessmentQuestionsOverview')),
        [UserRoles.SCHOOL_ADMIN]: lazy(() =>
          import('pages/DFACourses/DFAAssessmentQuestionsOverview'),
        ),
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
