import { PrivatePaths } from 'routes';
import history from 'routes/history';

export const navigateToDefaultRoute = () => {
  history.push(PrivatePaths.DASHBOARD);
};

export const navigateToURL = (url) => {
  window.open(url, '_self');
};

export const navigateToActualURL = (url) => {
  history.push(url);
};

export const navigateToDefaultDFARoute = () => {
  history.push(PrivatePaths.DFA_DASHBOARD);
};
