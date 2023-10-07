import React from "react";

const NotificationContext = React.createContext({
  notificationSettings: null,
  onSetNotificationSettings: () => null,
});

export default NotificationContext;
