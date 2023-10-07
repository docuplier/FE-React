import { memo } from 'react';
import { Box, Drawer, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';

import RegistrationLayout from 'Layout/RegistrationLayout';
import LoadingView from 'reusables/LoadingView';
import NavigationBar from 'reusables/NavigationBar';

const TextContentDrawer = ({ onClose, data, open }) => {
  return (
    <Drawer anchor="bottom" open={open}>
      <NavigationBar />
      <LoadingView isLoading={false} size={60}>
        <RegistrationLayout onClose={onClose} title={data?.title}>
          <Box maxWidth={744} m="auto">
            <Typography
              variant="body2"
              color="textPrimary"
              dangerouslySetInnerHTML={{ __html: data?.content }}
            />
          </Box>
        </RegistrationLayout>
      </LoadingView>
    </Drawer>
  );
};

TextContentDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string,
  }),
};

export default memo(TextContentDrawer);
