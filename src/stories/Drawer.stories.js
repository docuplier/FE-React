import React, { useState } from 'react';
import { text } from '@storybook/addon-knobs';
import Drawer from 'reusables/Drawer';

export default {
  title: 'Drawer',
  component: Drawer,
};

export const DrawerWithFooter = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open drawer</button>
      <Drawer
        okText="Submit"
        onOk={() => alert('submit')}
        cancelText="Cancel"
        title="My title"
        open={isOpen}
        onClose={() => setIsOpen(false)}>
        <span>This is a form</span>
      </Drawer>
    </>
  );
};

export const DrawerWithCustomFooter = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open drawer</button>
      <Drawer footer={<span>This is a custom footer</span>} title="My title" open={isOpen}>
        <span>This is a form</span>
      </Drawer>
    </>
  );
};

export const DrawerWithTabs = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open drawer</button>
      <Drawer
        okText="Submit"
        onOk={() => alert('submit')}
        cancelText="Cancel"
        title="My title"
        onClose={() => setIsOpen(false)}
        tabList={[
          { label: 'Manual Invite', panel: <span>This is for manual invite</span> },
          { label: 'Bulk Upload', panel: <span>This is for bulk upload</span> },
        ]}
        open={isOpen}></Drawer>
    </>
  );
};
