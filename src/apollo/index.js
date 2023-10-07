import { ApolloClient, ApolloLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { createUploadLink } from 'apollo-upload-client';
import { onError } from '@apollo/client/link/error';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { cache } from './cache';
import { getAuthToken } from 'utils/Auth';

const httpLink = createUploadLink({
  uri: process.env.REACT_APP_GRAPHQL_URL,
});
// const AUTH_TOKEN = getAuthToken();

const authLink = setContext((_, { headers }) => {
  const token = getAuthToken();

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const wsLink = new WebSocketLink({
  uri: process.env.REACT_APP_GRAPHQL_WEB_SOCKET_LINK,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: localStorage.getItem('token'),
    },
  },
});

const splitLink = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  authLink.concat(httpLink),
);

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    //@todo: handle refresh token/logout here for unauthorized responses
    //optionally send the errors to a logging service like sentry
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`),
    );
  }

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

export const client = new ApolloClient({
  link: ApolloLink.from([splitLink, httpLink, authLink, errorLink]),
  cache,
  assumeImmutableResults: true,
  connectToDevTools: process.env.NODE_ENV === 'development',
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      // nextFetchPolicy: 'cache-first'
    },
  },
});
