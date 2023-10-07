import _ from 'lodash/fp';
import { convertToSentenceCase } from './TransformationUtils';

export const getFormError = (name, errors) => {
  let hasError = false,
    message = '',
    formattedName = convertToSentenceCase(name, 'camel');

  switch (_.get(`${name}.type`, errors)) {
    case 'required':
      hasError = true;
      message = `${formattedName} is required`;
      break;
    case 'pattern':
      hasError = true;
      message = `${formattedName} has a bad format`;
      break;
    case 'maxLength':
      hasError = true;
      message = `${formattedName} is greater than the maximum length`;
      break;
    case 'minLength':
      hasError = true;
      message = `${formattedName} is lesser than the minimum length`;
      break;
    case 'min':
      hasError = true;
      message = `${formattedName} must not be greater than minimum`;
      break;
    case 'max':
      hasError = true;
      message = `${formattedName} must not be greater than maximum`;
      break;
    case 'validate':
      hasError = true;
      message = `${formattedName} failed validation`;
      break;
    default:
      hasError = false;
      message = '';
  }

  return {
    hasError: hasError || Boolean(errors[name]?.message),
    message: errors[name]?.message || message,
  };
};
