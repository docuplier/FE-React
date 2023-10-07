import React, { useContext, useState } from 'react';
import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET } from 'utils/constants';
import { GET_NOTIFICATIONS } from 'graphql/queries/dashboard';
import useNotification from 'reusables/NotificationBanner/useNotification';
import { useQuery } from '@apollo/client';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';

const WorkbenchContext = React.createContext();

const WorkBenchContextProvider = ({ children }) => {
  const notification = useNotification();
  const { userDetails } = useAuthenticatedUser();
  const [notificationQueryParams, setNotificationQueryParams] = useState({
    offset: DEFAULT_PAGE_OFFSET,
    limit: DEFAULT_PAGE_LIMIT,
  });

  const {
    data: notificationsData,
    loading: isLoadingNotifications,
    fetchMore,
    networkStatus,
    refetch,
  } = useQuery(GET_NOTIFICATIONS, {
    skip: !userDetails,
    variables: notificationQueryParams,
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });
  return (
    <WorkbenchContext.Provider
      value={{
        notificationQueryParams,
        setNotificationQueryParams,
        notificationsData,
        isLoadingNotifications,
        fetchMore,
        refetch,
        networkStatus,
      }}>
      {children}
    </WorkbenchContext.Provider>
  );
};

export const useWorkBenchContext = () => {
  return useContext(WorkbenchContext);
};

export { WorkbenchContext, WorkBenchContextProvider };
