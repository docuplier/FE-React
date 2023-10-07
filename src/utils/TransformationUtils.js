import { DefaultAvatarGroup } from './constants';

export const convertToSentenceCase = (value, caseToconvertFrom = 'hypen') => {
  /* This utilty function converts a string in hyphen_case or camelCase to Sentence Case */
  if (caseToconvertFrom === 'camel') {
    let result = value.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
  } else {
    let resultArray = value?.toLowerCase().split('_');
    for (let i = 0; i < resultArray?.length; i++) {
      resultArray[i] = resultArray[i].charAt(0).toUpperCase() + resultArray[i].slice(1);
      return resultArray.join(' ');
    }
  }
};

export const convertHyphenToCamelCase = (str) => {
  let stringArr = str.split('_');
  let newString = '';
  stringArr.forEach((value) => {
    newString = newString + value.charAt(0).toUpperCase() + value.slice(1);
  });
  newString = newString.charAt(0).toLowerCase() + newString.slice(1);
  return newString;
};

export const getBaseDomain = () => {
  if (process.env.NODE_ENV === 'development') return 'localhost:3000';
  return process.env.REACT_APP_DOMAIN || 'deltalms.org';
};

export const parseUrl = (url) => {
  return `http://${url}.${getBaseDomain()}`;
};

export const convertPositionToNthValue = (n) => {
  try {
    let number = Number(n);
    return ['st', 'nd', 'rd'][((((number + 90) % 100) - 10) % 10) - 1] || 'th';
  } catch (e) {
    //@todo: Flag an error and send to a logging service like sentry
    return 0;
  }
};

export const parseAvatarGroup = (userCount, maxAvatarCountToRender) => {
  let _maxAvatarCountToRender =
    userCount < maxAvatarCountToRender ? userCount : maxAvatarCountToRender;

  return {
    avatarsToRender: DefaultAvatarGroup.slice(0, _maxAvatarCountToRender) || [],
    unrenderedAvatarCount:
      userCount < maxAvatarCountToRender ? 0 : userCount - maxAvatarCountToRender,
  };
};

export const extractFileNameFromUrl = (url) => {
  const startIndex = url?.lastIndexOf('/') + 1;
  return url?.substring(startIndex);
};

export const transformValueToPluralForm = (value, singularSuffix, pluralForm) => {
  switch (value) {
    case 0:
    case 1:
      return `${value} ${singularSuffix}`;
    default:
      return Boolean(pluralForm)
        ? `${value || 0} ${pluralForm}`
        : `${value || 0} ${singularSuffix}s`;
  }
};

export const convertTimeSpentToDuration = (timeSpentInSeconds) => {
  const hours = parseInt(timeSpentInSeconds / 3600);
  const minutes = timeSpentInSeconds % 3600;
  const resolvedMinutes = parseInt(minutes / 60);
  const seconds = parseInt(timeSpentInSeconds % 60);

  const parsedHours = transformValueToPluralForm(hours, 'hr');
  const parsedMins = transformValueToPluralForm(resolvedMinutes, 'min');
  const parsedSecs = transformValueToPluralForm(seconds, 'sec');

  return Boolean(timeSpentInSeconds) ? `${parsedHours} ${parsedMins} ${parsedSecs}` : `0 secs`;
};

export const formatFileName = (value) => {
  return value.substring(value.lastIndexOf('/') + 1);
};

export const getFileExtension = (value) => {
  return value.substring(value.lastIndexOf('.') + 1);
};

export const convertLastUpdatedtoHrs = (updatedAt) => {
  const options = { hour: '2-digit' };
  const hours = new Date(updatedAt).toLocaleString('en-US', options);
  return hours;
};

export const convertIsoDateTimeToDateTime = (isoDateTime) => {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  const localstring = new Date(isoDateTime).toLocaleString('en-US', options);
  return localstring;
};

export const minDate = () => {
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1; //January is 0 so need to add 1 to make it 1!
  const yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }

  return (today = yyyy + '-' + mm + '-' + dd);
};
