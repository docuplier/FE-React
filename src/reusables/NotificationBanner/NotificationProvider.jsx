// This a provider for the notification Banner
import React, { useState } from "react";

import NotificationContext from "./NotificationContext";
import DefaultNotificationView from "./DefaultNotificationView";

const NotificationProvider = ({ children }) => {
  const [notificationSettings, setNotificationSettings] = useState({});

  function handleSetNotificationSettings(
    message,
    description,
    style,
    duration
  ) {
    setNotificationSettings({
      id: Date.now(),
      message,
      description,
      style,
      duration
    });
  }

  return (
    <NotificationContext.Provider
      value={{
        notificationSettings,
        onSetNotificationSettings: handleSetNotificationSettings
      }}
    >
      <DefaultNotificationView
        id={notificationSettings.id}
        message={notificationSettings.message}
        description={notificationSettings.description}
        style={notificationSettings.style}
        duration={notificationSettings.duration}
      />
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
