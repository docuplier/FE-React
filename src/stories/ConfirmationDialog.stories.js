import React, { useState } from 'react';
import { text } from '@storybook/addon-knobs';
import ConfirmationDialog from 'reusables/ConfirmationDialog';

export default {
  title: 'ConfirmationDialog',
  component: ConfirmationDialog,
};

export const ConfirmationDialogStory = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Open modal</button>
      <ConfirmationDialog
        title="Are you sure you want to disable this user?"
        description="Lorem ipsum dolor amet connecteur"
        okText="Disable User"
        onOk={() => alert('User disabled')}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
};
