import React, { useState } from 'react';
import { useQuery } from '@apollo/client';

import Interest from 'components/ProfileDetails/Interest';
import Overview from 'components/ProfileDetails/Overview';
import Security from 'components/ProfileDetails/Security';
import ProfileLayout from 'Layout/ProfileLayout';
import { UserRoles } from 'utils/constants';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import { convertToSentenceCase } from 'utils/TransformationUtils';
import useNotification from 'reusables/NotificationBanner/useNotification';
import { GET_USER_DETAIL } from 'graphql/queries/users';

const ProfileDetails = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [isEditProfileDrawerOpen, setIsEditProfileDrawerOpen] = useState(false);
  const { userDetails } = useAuthenticatedUser();
  const notification = useNotification();
  const id = userDetails?.id;

  const onClose = () => {
    setIsEditProfileDrawerOpen(false);
  };

  const TabValues = {
    OVERVIEW: 'Overview',
    INTEREST: userDetails.selectedRole === UserRoles.GLOBAL_ADMIN ? null : 'Interest',
    SECURITY: 'Security',
  };
  const tabValue = Object.values(TabValues);

  const {
    data,
    loading,
    refetch: refetchQueries,
  } = useQuery(GET_USER_DETAIL, {
    variables: {
      userId: id,
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const getAgeFromDateOfBirth = (date) => {
    let presentYear = new Date().getFullYear();
    let birthYear = new Date(date).getFullYear();
    let age = presentYear - birthYear;
    return Boolean(age) ? age : '';
  };

  const fullname = data?.user
    ? `${data?.user?.title || ''} ${data?.user?.firstname}  ${data?.user?.middlename || ''} ${
        data?.user?.lastname
      }`
    : 'n/a';
  const user = {
    imageSrc: data?.user?.image,
    name: fullname,
    id: data?.user?.matricNumber || data?.user?.staffId,
    department: data?.user?.department?.name,
    gender: convertToSentenceCase(data?.user?.gender) || 'N/A',
    level: data?.user?.level?.name,
    session: '',
    semester: '',
    location: data?.user?.userinformation?.address,
    age: getAgeFromDateOfBirth(data?.user?.userinformation?.dateOfBirth),
  };

  const renderProfile = () => {
    switch (tabValue[currentTab]) {
      case TabValues.OVERVIEW:
        return (
          <Overview
            data={data}
            onClose={onClose}
            visible={isEditProfileDrawerOpen}
            onCompletedCallback={refetchQueries}
            setVisible={setIsEditProfileDrawerOpen}
          />
        );
      case TabValues.INTEREST:
        return <Interest data={data?.user} onCompletedCallback={refetchQueries} />;
      case TabValues.SECURITY:
        return <Security />;
      default:
        return null;
    }
  };

  return (
    <ProfileLayout
      tabs={tabValue}
      onClick={() => setIsEditProfileDrawerOpen(true)}
      isPageLoaded={!loading}
      user={user}
      onTabChange={(tab) => setCurrentTab(tab)}>
      {renderProfile()}
    </ProfileLayout>
  );
};

export default ProfileDetails;
