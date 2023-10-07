import React, { useState } from 'react';
import { Box, Paper } from '@material-ui/core';
import LearningGroupCard from './LearningGroupCard';
import { useHistory, useParams } from 'react-router-dom';
import { GET_ALL_TASKS } from 'graphql/queries/task';
import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET } from 'utils/constants';
import { useNotification } from 'reusables/NotificationBanner';
import { PrivatePaths } from 'routes';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import { UserRoles } from 'utils/constants';
import { useQueryPagination } from 'hooks/useQueryPagination';
import { OffsetLimitBasedPagination } from 'reusables/Pagination';
import FilterControl from 'reusables/FilterControl';
import LoadingView from 'reusables/LoadingView';
import { convertIsoDateTimeToDateTime } from 'utils/TransformationUtils';
import Empty from 'reusables/Empty';

const LearningGroupActive = ({ InstituteId, classRep }) => {
  const history = useHistory();
  const { courseId } = useParams();
  const { userDetails } = useAuthenticatedUser();
  const notification = useNotification();
  const [queryParams, setQueryParams] = useState({
    search: '',
    offset: DEFAULT_PAGE_OFFSET,
    limit: DEFAULT_PAGE_LIMIT,
    courseId,
  });

  const { data, loading: isLoadingTasks } = useQueryPagination(GET_ALL_TASKS, {
    variables: queryParams,

    onError: (error) => {
      notification.error({
        message: error.message,
      });
    },
  });

  const tasks = data?.tasks?.results;

  const handleChangeQueryParams = (changeset) => {
    setQueryParams((prevState) => ({
      ...prevState,
      ...changeset,
    }));
  };

  const renderEmpty = () => {
    return <Empty title="No Task" description="Tasks added will display here" />;
  };

  return (
    <Box>
      <Box component={Paper} my={10} px={10} py={10}>
        <FilterControl
          searchInputProps={{
            name: 'search',
            colSpan: {
              xs: 12,
              sm: 12,
            },
            onChange: (evt) => handleChangeQueryParams({ search: evt.target.value }),
            offset: DEFAULT_PAGE_OFFSET,
          }}
        />
      </Box>
      <LoadingView isLoading={isLoadingTasks}>
        {tasks?.length ? (
          <Box>
            {tasks?.map((task, i) => (
              <Box key={task.id}>
                <LearningGroupCard
                  description={task.description}
                  date={convertIsoDateTimeToDateTime(task.createdAt)}
                  onClick={() =>
                    classRep || userDetails?.selectedRole !== UserRoles.STUDENT
                      ? history.push(
                          `${PrivatePaths.COURSES}/${courseId}?tab=learning-group&taskId=${task.id}`,
                        )
                      : !!task?.currentGroup?.id &&
                        history.push(
                          `${PrivatePaths.COURSES}/${courseId}?tab=learning-group&taskId=${task.id}&taskgroupId=${task.currentGroup?.id}`,
                        )
                  }
                  createdBy={`${task?.createdBy?.firstname} ${task?.createdBy?.lastname}`}
                  groupNo={task.totalGroups}
                  studentNo={task.totalStudents}
                  title={task.title}
                />
              </Box>
            ))}
          </Box>
        ) : (
          renderEmpty()
        )}
      </LoadingView>
      <Box style={{ marginTop: 10 }}>
        <OffsetLimitBasedPagination
          total={data?.tasks?.totalCount}
          onChangeLimit={(_offset, limit) =>
            handleChangeQueryParams({
              offset: DEFAULT_PAGE_OFFSET,
              limit,
            })
          }
          onChangeOffset={(offset) => handleChangeQueryParams({ offset })}
          offset={queryParams.offset}
          limit={queryParams.limit}
        />
      </Box>
    </Box>
  );
};

export default LearningGroupActive;
