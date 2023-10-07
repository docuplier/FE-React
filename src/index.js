import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import './index.css';
import App from './App';
import { AppProviders } from './contexts';
import { Helmet } from 'react-helmet';

ReactDOM.render(
  <React.StrictMode>
    <AppProviders>
      <Helmet>
        {process.env.REACT_APP_GRAPHQL_URL?.includes('api.dslms.ng') && (
          <script
            src="https://embed.tawk.to/62062bd7b9e4e21181be962c/1frk1mgkn"
            type="text/javascript"
          />
        )}
      </Helmet>
      <App />
    </AppProviders>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
