export const DOMAIN = process.env.REACT_APP_DOMAIN || 'localhost:3000';

export const getSubdomain = () => {
  let hostname = window.location.hostname.toLowerCase();

  const hasDomain = hostname.includes(DOMAIN) || hostname.includes('localhost');

  if (hasDomain) {
    return hostname.split(DOMAIN)[0].split('.')[0];
  }
  return hostname;
};
