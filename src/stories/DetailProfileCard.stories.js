import DetailProfileCard from 'reusables/DetailProfileCard';
import { boolean } from '@storybook/addon-knobs';
import profileImg from 'assets/svgs/profile-img.png';

export default {
  title: 'Detail Profile Card',
  component: DetailProfileCard,
  decorators: [(storyFn) => <div style={{ background: 'white' }}>{storyFn()}</div>],
};

export const LearnerCard = () => (
  <DetailProfileCard
    editable={boolean('editable', true)}
    user={{
      imageSrc: profileImg,
      name: 'Vivian Onyemaenu Helen',
      id: 'QSV/11/1732',
      department: 'Quantity Surveying',
      gender: 'Female',
      level: 200,
      session: '2020/2021',
      semester: 'Second semester',
      location: 'Ondo state Nigeria',
      age: 32,
      transparent: false,
    }}
    courseInfo={{
      enrolled: 234,
      ongoing: 34,
      completed: 16,
    }}
  />
);

export const InstructorCard = () => (
  <DetailProfileCard
    user={{
      imageSrc: profileImg,
      name: 'Vivian Onyemaenu Helen',
      id: 'QSV/11/1732',
      department: 'Quantity Surveying',
      gender: 'Female',
    }}
    courseInfo={{
      total: 234,
      learner: 34,
      completion: 16,
    }}
  />
);

export const LearnerCardWithoutFooter = () => (
  <DetailProfileCard
    user={{
      imageSrc: profileImg,
      name: 'Vivian Onyemaenu Helen',
      id: 'QSV/11/1732',
      department: 'Quantity Surveying',
      gender: 'Female',
      age: 23,
      level: 200,
    }}
  />
);
