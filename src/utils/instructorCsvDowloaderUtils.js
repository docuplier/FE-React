import { format } from 'date-fns';

export const getCourseStat = (verticalCharData) => {
  let enrollment = [];
  let courseStat = [];
  let keys = Object?.keys?.(verticalCharData ?? {});
  let courseStatKey = keys?.slice(0, 2);
  let enrolmentKey = keys?.slice(2, -1);
  enrollment?.push(enrolmentKey);
  enrollment?.push([
    verticalCharData?.expected ?? 0,
    verticalCharData?.enrolees ?? 0,
    verticalCharData?.auditees ?? 0,
    verticalCharData?.registered ?? 0,
  ]);
  courseStat?.push(courseStatKey);
  courseStat?.push([
    verticalCharData?.averageCompletionRate?.toFixed(1) || 0,
    verticalCharData?.averagePassRate?.toFixed(1) || 0,
  ]);
  return { enrollment, courseStat };
};

export const getCourseDataArray = (instructorCourses) => {
  const courseData = [];
  let header = [
    'Course',
    'Status',
    'Avg Performance',
    'Course rating',
    'Instructor rating',
    'Total student',
  ];
  instructorCourses?.map((data) => {
    return courseData?.push([
      data?.title ?? '--',
      data?.status === 'PUBLISHED' ? 'Active' : 'Inactive',
      data?.averagePassRate?.toFixed(1) || 0,
      data?.averageCourseRating ?? 0,
      data?.averageInstructorRating ?? 0,
      data?.learnerCount ?? 0,
    ]);
  });
  courseData?.unshift(header);
  return courseData;
};

export const getWorkBenchDataArray = (notificationsData) => {
  const notifications = notificationsData?.notifications?.results || [];
  let notificationArray = [];
  const header = ['Date Created', 'Notification'];

  const notificationItems =
    notifications?.map(({ notification: item, id, createdAt }) => {
      return {
        date: createdAt || '',
        id: id || '',
        body: JSON.parse(item?.data) || [],
      };
    }) || {};

  notificationItems?.map(({ id, date, body: { notification } }) => {
    return notificationArray?.push([
      format(new Date(date), "hh:mm aaa '/' MMM-dd-yyyy"),
      notification?.body,
    ]);
  });
  notificationArray?.unshift(header);
  return notificationArray;
};

export const getSummary = (summaryReport) => {
  let summary = [];
  summaryReport?.instructorSummary?.map((Summary) => {
    return summary?.push([Summary]);
  });
  summary?.unshift(['Summary']);
  return summary;
};
