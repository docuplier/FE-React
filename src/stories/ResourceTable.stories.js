import React from 'react';
import { action } from '@storybook/addon-actions';
import ResourceTable from 'reusables/ResourceTable';

export default {
  title: 'ResourceTable',
  component: ResourceTable,
  decorators: [(storyFn) => <div style={{ margin: '32px auto', maxWidth: 500 }}>{storyFn()}</div>],
};

//ResourceTable is a completely dubbed version of the antd Table with very similar Apis
//This component has some new props like the options props, allows you renderTooltip for columns etc
//@see https://ant.design/components/table/#header
export const ResourceTableStory = () => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: true,
    },
    {
      title: 'School',
      dataIndex: 'school',
      align: 'justify',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      sorter: true,
    },
    {
      title: 'Religion',
      dataIndex: 'religion',
      render: (text, data) => `${text} in view`,
      ellipsis: true,
      tooltip: true,
    },
  ];

  const dataSource = [
    { name: 'Gbenga', school: 'Futa', age: 60, religion: 'Christianity', active: false },
    { name: 'Toyin', school: 'Unilag', age: 70, religion: 'Islamic', active: true },
    { name: 'Tobi', school: 'Eksu', age: 80, religion: 'Traditional', active: false },
  ];

  return (
    <ResourceTable
      columns={columns}
      dataSource={[]}
      rowSelection={{
        onChange: (selectedRowKeys, selectedRows) =>
          action('selectedRows')({ selectedRowKeys, selectedRows }),
      }}
      onRow={(record, rowIndex) => {
        return {
          onClick: (event) => action('rowClicked with data')(record),
        };
      }}
      onChangeSort={(order, property) => action('table sorted with')({ order, property })}
      filterControl={<span>Dummy filter control</span>}
      // options={["Delete", "Edit"]}
      options={(record) => ['Edit', 'Delete', record.active ? 'Deactivate' : 'Activate']}
      onSelectOption={(option, data) => action('option clicked')({ option, data })}
      pagination={{
        total: 30,
      }}
      loading={false}
    />
  );
};
