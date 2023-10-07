import CourseProgressCard from 'reusables/CourseProgressCard';
import profileImg from 'assets/svgs/rectangle.svg';

export default {
  title: 'CourseProgressCard',
  component: CourseProgressCard,
};

export const Card = () => (
  <CourseProgressCard
    title="some title goes here"
    imageSrc={profileImg}
    description="followed by some kinda description"
    progress={0}
    chipProp={{ label: 'Enrolled', color: 'success' }}
  />
);

export const footerTextCard = () => (
  <CourseProgressCard
    chipProp={{ label: 'Audit', color: 'warning' }}
    title="some title goes here"
    imageSrc={profileImg}
    description="followed by some kinda description"
    footerText="Hello from footer"
  />
);
