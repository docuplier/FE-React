import InstructorsList from 'reusables/InstructorsList';
import { boolean } from '@storybook/addon-knobs';
import buildings from 'assets/svgs/buildings.svg';
export default {
  title: 'Instructors List',
  component: InstructorsList,
};

export const InstructorsListStory = () => (
  <InstructorsList
    data={[
      { firstName: 'Ibrahim', lastName: 'Fabro', department: 'Sofware Engineering', imgSrc: '' },
      { firstName: 'Ibrahim', lastName: 'Fabro', department: 'Sofware Engineering', imgSrc: '' },
      { firstName: 'Ibrahim', lastName: 'Fabro', department: 'Sofware Engineering', imgSrc: '' },
      {
        firstName: 'Ibrahim',
        lastName: 'Fabro',
        department: 'Sofware Engineering',
        imgSrc: buildings,
      },
    ]}
    vertical={boolean('vertical', false)}
  />
);

export const VerticalInstructorsListStory = () => (
  <InstructorsList
    data={[
      { firstName: 'Ibrahim', lastName: 'Fabro', department: 'Sofware Engineering', imgSrc: '' },
      { firstName: 'Ibrahim', lastName: 'Fabro', department: 'Sofware Engineering', imgSrc: '' },
      { firstName: 'Ibrahim', lastName: 'Fabro', department: 'Sofware Engineering', imgSrc: '' },
      {
        firstName: 'Ibrahim',
        lastName: 'Fabro',
        department: 'Sofware Engineering',
        imgSrc: buildings,
      },
    ]}
    vertical={true}
  />
);
