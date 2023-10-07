import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/styles';
import { ApolloProvider } from '@apollo/client';
import theme from '../theme';

import { client } from '../apollo';
import { NotificationProvider } from 'reusables/NotificationBanner';
import { WorkBenchContextProvider } from 'components/Dashboard/Instructor/WorkBenchContext';
import { StudenActivityProvider } from 'components/Dashboard/LearnersDashboard/StudenActivityContext';

const AppProviders = ({ children }) => (
  <ApolloProvider client={client}>
    <ThemeProvider theme={theme}>
      <NotificationProvider>
        <StudenActivityProvider>
          <WorkBenchContextProvider>
            <Router>{children}</Router>
          </WorkBenchContextProvider>
        </StudenActivityProvider>
      </NotificationProvider>
    </ThemeProvider>
  </ApolloProvider>
);

AppProviders.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AppProviders };
