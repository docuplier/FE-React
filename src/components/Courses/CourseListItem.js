import { Box } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

import CourseDescriptionCard from 'reusables/CourseDescriptionCard';
import { convertToSentenceCase } from 'utils/TransformationUtils';
import defaultCourseImg from 'assets/svgs/default-course-bg.jpeg';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import { PrivatePaths } from 'routes';
import Empty from 'reusables/Empty';
import { UserRoles } from 'utils/constants';

const CourseListItem = ({ courseInformation }) => {
  const { userDetails } = useAuthenticatedUser();
  const history = useHistory();
  const pathname = PrivatePaths.COURSES;

  const renderEmptyState = () => {
    return <Empty title={'No Courses'} description={'No Courses Avalaible'}></Empty>;
  };

  return (
    <Box>
      {Boolean(courseInformation?.length)
        ? courseInformation?.map(
            ({
              banner,
              title,
              description,
              id,
              totalDuration,
              unit,
              learnerCount,
              status,
              code,
            }) => {
              const chipProp = userDetails?.selectedRole !== UserRoles.STUDENT && {
                label: convertToSentenceCase(status),
                color: '#fff',
              };
              return (
                <CourseDescriptionCard
                  onClick={() => {
                    history.push(`${pathname}/${id}`);
                  }}
                  index={id}
                  imgSrc={banner || defaultCourseImg}
                  courseCode={code}
                  title={title}
                  description={description}
                  duration={totalDuration}
                  unitCount={unit}
                  chip={chipProp}
                  studentCount={learnerCount || '0'}
                />
              );
            },
          )
        : renderEmptyState()}
    </Box>
  );
};

export default CourseListItem;
