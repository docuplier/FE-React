import React from 'react';
import Drawer from './Drawer';
import { Typography, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import Empty from 'reusables/Empty';
import { borderRadius, fontSizes, spaces } from '../../../Css';
import LoadingView from 'reusables/LoadingView';

const InstructorSummaryDrawer = ({ data, loading, close, open }) => {
  const classes = useStyles();

  return (
    <Drawer title="Summary Report" open={open} onClose={close}>
      <LoadingView isLoading={loading}>
        {!data?.instructorSummary?.length ? (
          <Empty title="No summary report available" />
        ) : (
          data?.instructorSummary?.map((text, i) => (
            <Box mt={5} key={i} className={classes.container}>
              <Box>
                <Typography className={classes.text} color="textPrimary">
                  {text}
                </Typography>
              </Box>
            </Box>
          ))
        )}
      </LoadingView>
    </Drawer>
  );
};

const useStyles = makeStyles(() => ({
  container: {
    background: '#F1F2F6',
    borderRadius: borderRadius.default,
    padding: '8px 16px',
    cursor: 'pointer',
  },
  text: {
    fontSize: fontSizes.medium,
    paddingBottom: 4,
    paddingRight: spaces.small,
  },
}));

export default InstructorSummaryDrawer;
