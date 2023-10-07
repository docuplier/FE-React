import { Box, Grid } from '@material-ui/core';
import { useQuery } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import CourseFilters from 'components/MyLearning/CourseFilters';
import MyLearningPageLayout from 'Layout/MyLearningPageLayout';
import { useState } from 'react';
import CourseProgressCard from 'reusables/CourseProgressCard';
import MaxWidthContainer from 'reusables/MaxWidthContainer';
import { OffsetLimitBasedPagination } from 'reusables/Pagination';
import {
  MULTIPLE_OF_TWELVE_DEFAULT_PAGE_LIMIT,
  DEFAULT_PAGE_OFFSET,
  EnrolmentStatus,
} from 'utils/constants';
import { GET_LEARNER_ENROLMENT_COURSES, GET_USER_COURSE_STAT } from 'graphql/queries/users';
import useNotification from 'reusables/NotificationBanner/useNotification';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import { convertToSentenceCase } from 'utils/TransformationUtils';
import Empty from 'reusables/Empty';
import { useQueryPagination } from 'hooks/useQueryPagination';
import LoadingView from 'reusables/LoadingView';
import { PrivatePaths } from 'routes';

const defaultQueryParams = {
  offset: DEFAULT_PAGE_OFFSET,
  limit: MULTIPLE_OF_TWELVE_DEFAULT_PAGE_LIMIT,
  session: '',
  semester: '',
  enrolmentsStatus: null,
  search: '',
};
const tabs = ['All Courses', 'Pending', 'Completed'];

const MyLearning = () => {
  const [queryParams, setQueryParams] = useState(defaultQueryParams);
  const [currentTab, setCurrentTab] = useState(0);
  const notification = useNotification();
  const history = useHistory();
  const pathname = PrivatePaths?.COURSES;
  const { userDetails } = useAuthenticatedUser();

  const { data, loading: isLoadingCourses } = useQueryPagination(GET_LEARNER_ENROLMENT_COURSES, {
    variables: {
      userId: userDetails?.id,
      search: queryParams.search,
      enrolmentStatus: queryParams.enrolmentsStatus === 'all' ? null : queryParams.enrolmentsStatus,
      offset: queryParams.offset,
      limit: queryParams.limit,
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
        userId: userDetails?.id,
      },
      onError: (error) => {
        notification.error({
          message: error?.message,
        });
      },
    },
  );
  const { learnerAverageQuizScore, learnerCompletedCourse, learnerOngoingCourse } =
    learnerCourseStat?.courseOverview || {};

  const handleChangeQueryParams = (changeset) => {
    setQueryParams((prevState) => ({
      ...prevState,
      ...changeset,
    }));
  };

  const handleChangeTab = (value) => {
    let roles = null;

    setCurrentTab(value);
    handleChangeQueryParams({ roles });
  };

  const renderEmptyState = () => <Empty title="No Courses" description="No Courses Avalaible" />;

  const renderMyLearningCard = (courseInformation) => {
    return (
      <>
        <CourseFilters filters={queryParams} onChange={handleChangeQueryParams} />
        {Boolean(courseInformation?.length) ? (
          <>
            <Box my={20}>
              <Grid container spacing={10}>
                {courseInformation?.map(
                  ({ course: { description, title, banner, id, code }, progress, status }) => {
                    return (
                      <Grid item md={3} lg={3} sm={6} xs={12}>
                        <CourseProgressCard
                          onClick={() => {
                            history.push(`${pathname}/${id}`);
                          }}
                          key={id}
                          description={description ?? 'N/A'}
                          courseCode={code}
                          title={title}
                          imageSrc={banner}
                          progress={progress}
                          chipProp={{
                            label: convertToSentenceCase(status),
                            color: status === EnrolmentStatus.ENROL ? 'success' : 'warning',
                          }}
                        />
                      </Grid>
                    );
                  },
                )}
              </Grid>
            </Box>
            <Box>
              <OffsetLimitBasedPagination
                total={data?.enrolments?.totalCount}
                offset={queryParams.offset}
                limit={queryParams.limit}
                onChangeOffset={(offset, _limit) => handleChangeQueryParams({ offset })}
                onChangeLimit={(_offset, limit) => {
                  handleChangeQueryParams({ limit });
                  handleChangeQueryParams({ offset: 0 });
                }}
              />
            </Box>
          </>
        ) : (
          renderEmptyState()
        )}
      </>
    );
  };

  const renderContent = () => {
    const tabComponents = {
      0: renderMyLearningCard(data?.enrolments?.results),
      1: renderMyLearningCard(
        data?.enrolments?.results?.filter(({ progress }) => progress >= 0 && progress !== 100),
      ),
      2: renderMyLearningCard(
        data?.enrolments?.results?.filter(({ progress }) => progress === 100),
      ),
    };

    return tabComponents[currentTab];
  };

  return (
    <MyLearningPageLayout
      tabs={tabs}
      onTabChange={handleChangeTab}
      title={'My Learning'}
      stats={{
        quizScore: learnerAverageQuizScore,
        modulesCompletedCount: learnerCompletedCourse,
        modulesPendingCount: learnerOngoingCourse,
      }}>
      <LoadingView isLoading={isLoadingCourses || isLoadinglearnerCourseStat}>
        <MaxWidthContainer spacing="lg">{renderContent()}</MaxWidthContainer>
      </LoadingView>
    </MyLearningPageLayout>
  );
};

export default MyLearning;
