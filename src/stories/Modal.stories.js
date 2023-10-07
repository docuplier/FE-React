import React, { useState } from 'react';
import Modal from 'reusables/Modal';
import { ThemeProvider } from '@material-ui/styles';
import theme from 'theme';

export default {
  title: 'Modal',
  component: Modal,
  decorators: [(storyFn) => <ThemeProvider theme={theme}>{storyFn()}</ThemeProvider>],
};

export const ModalStory = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Open modal</button>
      <Modal
        title="Create post"
        okText="Post"
        okButtonProps={{
          isLoading: false,
          disabled: true,
        }}
        open={open}
        onClose={() => setOpen(false)}>
        Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel
        scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus
        auctor fringilla.
      </Modal>
    </>
  );
};
