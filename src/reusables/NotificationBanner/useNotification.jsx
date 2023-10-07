import { useContext } from 'react';

import NotificationContext from './NotificationContext';

const useNotification = () => {
  const { onSetNotificationSettings } = useContext(NotificationContext);

  const showNotification = (style) => ({ message, description, duration }) => {
    onSetNotificationSettings(message, description, style, duration);
  };

  return {
    error: showNotification('error'),
    success: showNotification('success'),
    warn: showNotification('warning'),
    info: showNotification('info'),
  };
};

export default useNotification;
