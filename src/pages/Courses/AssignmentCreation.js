import { Box, Button, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { CancelOutlined, Delete } from '@material-ui/icons';
import React from 'react';
import { useHistory } from 'react-router-dom';
import FilePreview from 'reusables/FilePreview';
import LoadingView from 'reusables/LoadingView';
import MaxWidthContainer from 'reusables/MaxWidthContainer';
import Wysiwyg from 'reusables/Wysiwyg';
import { colors, fontSizes } from '../../Css';

const AssignmentCreation = ({ dueDate, title }) => {
  const history = useHistory();
  const classes = useStyles();

  return (
    <LoadingView>
      <Box mb={15} py={8} style={{ background: '#FAFAFA' }}>
        <MaxWidthContainer>
          <Box onClick={() => history.goBack()} className={classes.headerContent}>
            <CancelOutlined />
            <Typography variant="h6" className={classes.navTitle}>
              Exit Assignment
            </Typography>
          </Box>
        </MaxWidthContainer>
      </Box>

      <MaxWidthContainer>
        <Box style={{ borderRadius: 4 }}>
          <Box py={4} pl={4} style={{ background: '#FAFAFA' }}>
            <Typography variant="h6">
              {title ?? 'Introduction Electrical And Electrical Engineering'}
            </Typography>
            <Typography>Due Date: {dueDate ?? 'Feb 23, 2021'}</Typography>
          </Box>
          <Box py={10} px={10}>
            <Grid container spacing={10}>
              <Grid item xs={9}>
                <Box style={{ minHeight: '50vh' }}>
                  <Wysiwyg />
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box
                  pt={10}
                  px={6}
                  style={{
                    borderRadius: 10,
                    background: '#FAFAFA',
                    border: `.5px solid ${colors.lightGrey}`,
                    minHeight: 300,
                  }}>
                  <FilePreview
                    file={{
                      name: 'new_user_template.pdf',
                      type: 'pdf',
                      size: 2000,
                      url: '',
                    }}
                    metaData={{
                      author: 'Prof Emeka Chuks',
                      datePublished: '12-03-2021',
                    }}
                    rightContent={
                      <Box style={{ color: 'red' }}>
                        <Delete />{' '}
                      </Box>
                    }
                    fileInformation={<span>File Information here</span>}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Box
          display="flex"
          justifyContent="flex-end"
          py={8}
          pr={8}
          style={{ background: '#FAFAFA' }}>
          <Button variant="contained" style={{ marginRight: 16 }}>
            Cancel
          </Button>
          <Button variant="contained" color="primary">
            Submit
          </Button>
        </Box>
      </MaxWidthContainer>
    </LoadingView>
  );
};

const useStyles = makeStyles((theme) => ({
  wrapper: {
    background: colors.background,
    width: '100vw',
    minHeight: '100vh',
  },
  headerContent: {
    fontSize: fontSizes.large,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  navTitle: {
    display: 'inline-block',
    marginLeft: 10,
  },
}));

export default AssignmentCreation;
