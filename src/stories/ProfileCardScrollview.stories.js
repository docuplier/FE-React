import React from 'react';
import { object, text } from '@storybook/addon-knobs';

import ProfileCardsScrollview from 'reusables/ProfileCardsScrollview';

export default {
  title: 'Profile card',
  component: ProfileCardsScrollview,
  decorators: [(storyFn) => <div style={{ margin: 'auto' }}>{storyFn()}</div>],
};

export const ProfileCardsScrollviewStory = () => {
  const profiles = object('profiles', [
    {
      name: 'Aderibigbe Kamoru',
      level: 'SENIOR LECTURER II',
      title: 'Prof',
      id: '1',
    },
    {
      name: 'Segun Oroyo',
      level: 'SENIOR LECTURER II',
      title: 'Prof',
      id: '2',
    },
    {
      name: 'Gbenga Anifowoshe',
      level: 'SENIOR LECTURER II',
      title: 'Prof',
      id: '3',
    },

    {
      name: 'Modupe Adeyemo',
      level: 'SENIOR LECTURER II',
      title: 'Prof',
      id: '4',
    },

    {
      name: 'Chioma Halim',
      level: 'SENIOR LECTURER II',
      title: 'Prof',
      id: '5',
    },
    {
      name: 'Blessing Funso',
      level: 'SENIOR LECTURER II',
      title: 'Prof',
      id: '6',
    },
    {
      name: 'Samuel Olabiyi',
      level: 'SENIOR LECTURER II',
      title: 'Prof',
      id: '',
    },
  ]);
  return (
    <ProfileCardsScrollview
      profiles={profiles}
      title={text('title', 'Lecturers')}
      caption={text('caption', 'Learn with the best in their fields')}
    />
  );
};
