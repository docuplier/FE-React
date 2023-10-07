import CourseInfoHeader from 'reusables/CourseInfoHeader';

export default {
  title: 'CourseInfoHeader',
  component: CourseInfoHeader,
};

export const InfoHeaderTile = () => (
  <CourseInfoHeader quizScore={60} modulesCompletedCount={5} modulesPendingCount={13} />
);
