import React from 'react';
import { Box, Divider, Typography, makeStyles, Button } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';

import BlueHeaderPageLayout from 'Layout/BlueHeaderPageLayout';
import { colors, fontSizes, fontWeight } from '../Css';
import MaxWidthContainer from 'reusables/MaxWidthContainer';
import { PrivatePaths } from 'routes';

const UserLayout = ({
  children,
  title,
  description,
  actionBtnTxt,
  btnAction,
  metaData,
  isPageLoaded,
  customInformation,
}) => {
  const classes = useStyles();

  const renderBannerRightContent = () => {
    return (
      <Button onClick={btnAction} startIcon={<AddIcon />} variant="contained">
        {actionBtnTxt}
      </Button>
    );
  };

  const renderFacultieMetaData = () => {
    return (
      <Box display="flex" alignItems="center" className={classes.metaDataContainer}>
        <Typography component="span" variant="body1">
          <Typography component="span" className="boldText">
            {metaData.inTotal}
          </Typography>{' '}
          in total
        </Typography>
        <Box ml={8} mr={8}>
          <Divider orientation="vertical" className="divider" />
        </Box>
        <Typography component="span" variant="body1">
          <Typography component="span" className="boldText">
            {metaData.active}
          </Typography>{' '}
          active
        </Typography>
        <Box ml={8} mr={8}>
          <Divider orientation="vertical" className="divider" />
        </Box>
        <Typography component="span" variant="body1">
          <Typography component="span" className="boldText">
            {metaData.inactive}
          </Typography>{' '}
          inactive
        </Typography>
      </Box>
    );
  };

  return (
    <BlueHeaderPageLayout
      isTabBarHidden={true}
      isPageLoaded={isPageLoaded}
      rightContent={actionBtnTxt ? renderBannerRightContent() : null}
      title={title}
      description={description}
      actionBtnTxt={actionBtnTxt}
      otherInformation={metaData ? renderFacultieMetaData() : customInformation}
      links={[
        { title: 'Home', to: '/' },
        { title: 'Users', to: PrivatePaths.USERS },
      ]}>
      <MaxWidthContainer spacing="lg">{children}</MaxWidthContainer>
    </BlueHeaderPageLayout>
  );
};

const useStyles = makeStyles({
  metaDataContainer: {
    '& .boldText': {
      fontWeight: fontWeight.bold,
    },
    '& .divider': {
      height: fontSizes.large,
      backgroundColor: colors.white,
    },
  },
});

export default React.memo(UserLayout);
