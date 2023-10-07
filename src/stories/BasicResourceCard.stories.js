import React from 'react';
import BasicResourceCard from '../reusables/BasicResourceCard';

export default {
  title: 'BasicResourceCard',
  component: BasicResourceCard,
};

export const BasicResourceCardWithoutImage = () => (
  <div style={{ width: 500, height: 300 }}>
    <BasicResourceCard
      title="Administrator"
      description="Some kind of description should come here to man ans his name is my name always and I have to be here"
      caption={{
        count: 5,
        label: 'in total',
      }}
      metaList={[
        {
          label: 'Active',
          count: 1,
        },
        { label: 'Inactive', count: 1 },
      ]}
      creator={{
        name: 'Benson Emeka John',
        imageSrc: null,
        chip: {
          label: 'Admin',
        },
      }}
    />
  </div>
);

export const BasicResourceCardWithImage = () => (
  <div style={{ width: 500, height: 300 }}>
    <BasicResourceCard
      imageSrc={null}
      title="Administrator"
      description="Some kind of description should come here to man ans his name is my name always and I have to be here"
      caption={{
        count: 5,
        label: 'in total',
      }}
      metaList={[
        {
          label: 'Active',
          count: 1,
        },
        { label: 'Inactive', count: 1 },
      ]}
      creator={{
        name: 'Benson Emeka John',
        imageSrc: null,
        chip: {
          label: 'Admin',
        },
      }}
    />
  </div>
);

export const BasicResourceCardDisabled = () => (
  <div style={{ width: 500, height: 300 }}>
    <BasicResourceCard
      disabled
      title="Administrator"
      description="Some kind of description should come here to man ans his name is my name always and I have to be here"
      caption={{
        count: 5,
        label: 'in total',
      }}
      metaList={[
        {
          label: 'Active',
          count: 1,
        },
        { label: 'Inactive', count: 1 },
      ]}
      creator={{
        name: 'Benson Emeka John',
        imageSrc: null,
        chip: {
          label: 'Admin',
        },
      }}
    />
  </div>
);

export const BasicResourceCardWithStatusChip = () => (
  <div style={{ width: 500, height: 300 }}>
    <BasicResourceCard
      imageSrc={null}
      statusChip={{
        label: 'Faculty is active',
        chipTypes: 'filled',
      }}
      title="Administrator"
      description="Some kind of description should come here to man ans his name is my name always and I have to be here"
      caption={{
        count: 5,
        label: 'in total',
      }}
      metaList={[
        {
          label: 'Active',
          count: 1,
        },
        { label: 'Inactive', count: 1 },
      ]}
      creator={{
        name: 'Benson Emeka John',
        imageSrc: null,
        chip: {
          label: 'Admin',
        },
      }}
    />
  </div>
);
