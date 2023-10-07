import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';

import UserDetailLayout from 'Layout/UserDetailLayout';
import Overview from 'components/Users/LearnerDetail/Overview';
import PersonalData from 'components/Users/LearnerDetail/PersonalData';
import Interests from 'components/Users/LearnerDetail/Interests';
import { GET_USER_DETAIL, GET_USER_COURSE_STAT } from 'graphql/queries/users';
import { GET_LEARNER_ENROLMENTS } from 'graphql/queries/courses';
import { convertToSentenceCase } from 'utils/TransformationUtils';
import useNotification from 'reusables/NotificationBanner/useNotification';
import avatar from 'assets/svgs/avatar.png';
import LoadingView from 'reusables/LoadingView';

const InstructorsTab = {
  OVERVIEW: 'Overview',
  PERSONAL_DATA: 'Personal Data',
  INTERESTS: 'Interests',
};

const defaultFilterValues = {
  enrolmentStatus: null,
  searchTerm: '',
  semester: '',
  session: '',
};

const LearnerDetail = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [filterValue, setFilterValue] = useState(defaultFilterValues);
  const tabValue = Object.values(InstructorsTab);
  const notification = useNotification();
  const { id } = useParams();

  const onChange = (e) => {
    const { name, value } = e.target;
    setFilterValue({ ...filterValue, [name]: value });
  };

  const { data, loading } = useQuery(GET_USER_DETAIL, {
    variables: {
      userId: id,
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const { data: learnerCourseStat, loading: isLoadinglearnerCourseStat } = useQuery(
    GET_USER_COURSE_STAT,
    {
      variables: {
        userId: id,
      },
      onError: (error) => {
        notification.error({
          message: error?.message,
        });
      },
    },
  );

  const { data: learnerCourses, loading: isLoadingCourses } = useQuery(GET_LEARNER_ENROLMENTS, {
    variables: {
      userId: id,
      search: filterValue.searchTerm,
      enrolmentStatus: filterValue.enrolmentStatus === 'all' ? null : filterValue.enrolmentStatus,
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });
  const learnerCount = learnerCourseStat?.courseOverview;
  const completedCourses = learnerCourses?.enrolments?.results?.filter(
    (course) => course.progress === 100,
  );

  const fullname = data?.user ? `${data?.user?.firstname} ${data?.user?.lastname}` : 'n/a';

  const renderContent = () => {
    switch (tabValue[currentTab]) {
      case InstructorsTab.PERSONAL_DATA:
        return <PersonalData data={data} />;
      case InstructorsTab.OVERVIEW:
        return (
          <Overview
            learnerCourses={learnerCourses}
            completedCourses={completedCourses}
            onChange={onChange}
            filterValue={filterValue}
            setFilterValue={setFilterValue}
            learnerCourseStat={learnerCourseStat}
          />
        );
      case InstructorsTab.INTERESTS:
        return <Interests data={data?.user?.interests || []} />;
      default:
        return null;
    }
  };

  return (
    <UserDetailLayout
      onTabChange={(tab) => setCurrentTab(tab)}
      tabs={tabValue}
      isPageLoaded={Boolean(data?.user)}
      user={{
        imageSrc: data?.user?.image || avatar,
        name: fullname,
        id: data?.user?.matricNumber,
        department: data?.user?.department?.name,
        gender: convertToSentenceCase(data?.user?.gender),
        level: data?.user?.level?.name,
        session: '2020/2021',
        semester: 'Second semester',
        location: data?.user?.userinformation?.address,
        transparent: false,
      }}
      courseInfo={{
        enrolled: learnerCount?.learnerEnrolledCourse,
        ongoing: learnerCount?.learnerOngoingCourse,
        completed: learnerCount?.learnerCompletedCourse,
      }}>
      <LoadingView isLoading={isLoadingCourses && loading && isLoadinglearnerCourseStat}>
        {renderContent()}
      </LoadingView>
    </UserDetailLayout>
  );
};

export default LearnerDetail;
