import { useQuery } from '@apollo/client';
import { formatISO } from 'date-fns';
import { GET_STUDENT_ACTIVITIES } from 'graphql/queries/dashboard';
import React, { useContext, useState } from 'react';
import { useNotification } from 'reusables/NotificationBanner';

const ActivityContext = React.createContext();

const StudenActivityProvider = ({ children }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const notification = useNotification();

  //@todo: Pass loading to LoadingView of learners dashboard page when merging
  const { data, loading } = useQuery(GET_STUDENT_ACTIVITIES, {
    variables: {
      startDate: parseDateAsQueryParam(startDate),
      endDate: parseDateAsQueryParam(endDate),
    },
    skip: !startDate && !endDate,
    onError: (error) => {
      notification.error({
        message: 'An error occured. Please try again later',
      });
    },
  });

  const studentActivitiesData = data?.studentActivities;

  function parseDateAsQueryParam(date) {
    if (date) {
      const { year, month, day } = date;
      return formatISO(new Date(year, month - 1, day), { representation: 'date' });
    }
    return null;
  }
  return (
    <ActivityContext.Provider
      value={{
        startDate,
        endDate,
        setEndDate,
        setStartDate,
        studentActivitiesData,
        loading,
        selectedDay,
        setSelectedDay,
      }}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivityData = () => {
  return useContext(ActivityContext);
};
export { StudenActivityProvider, ActivityContext };
