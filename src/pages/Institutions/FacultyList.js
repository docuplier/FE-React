import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Box, Typography, makeStyles, Button, Avatar, Grid } from '@material-ui/core';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import LinkIcon from '@material-ui/icons/Link';
import { useQuery } from '@apollo/client';

import { GET_FACULTIES_QUERY, GET_INSTITUTIONS_BY_ID } from 'graphql/queries/institution';
import { PrivatePaths } from 'routes';
import NavigationBar from 'reusables/NavigationBar';
import Chip from 'reusables/Chip';
import BlueHeaderPageLayout from 'Layout/BlueHeaderPageLayout';
import { colors, fontSizes, fontWeight } from '../../Css';
import MaxWidthContainer from 'reusables/MaxWidthContainer';
import LoadingView from 'reusables/LoadingView';
import { useNotification } from 'reusables/NotificationBanner';
import FacultyResourceCardList from 'components/Institutions/FacultyResourceCardList';
import {
  DEFAULT_PAGE_OFFSET,
  UserRoles,
  MULTIPLE_OF_NINE_DEFAULT_PAGE_LIMIT,
} from 'utils/constants';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import { getNameInitials } from 'utils/UserUtils';
import UpsertFacultyDrawer from 'components/Institutions/UpsertFacultyDrawer';
import { useQueryPagination } from 'hooks/useQueryPagination';
import { parseUrl } from 'utils/TransformationUtils';
import AccessControl from 'reusables/AccessControl';
import FacultyStats from 'components/Institutions/FacultyStats';

const GlobalAdminLinks = [
  { title: 'Home', to: '/' },
  { title: 'Institution', to: `${PrivatePaths.INSTITUTIONS}` },
];

const SchoolAdminLinks = [{ title: 'Home', to: '/' }];

const FacultyList = () => {
  const history = useHistory();
  const classes = useStyles();
  const { institutionId } = useParams();
  const notification = useNotification();
  const [isUpsertFacultyDrawerVisible, setIsUpsertFacultyDrawerVisible] = useState(false);
  const defaultQueryParams = {
    offset: DEFAULT_PAGE_OFFSET,
    limit: MULTIPLE_OF_NINE_DEFAULT_PAGE_LIMIT,
    institutionId,
    showUserStats: true,
  };
  const [queryParams, setQueryParams] = useState(defaultQueryParams);

  const { data: institutionData, loading: institutionLoading } = useQuery(GET_INSTITUTIONS_BY_ID, {
    variables: { institutionId, truncateResults: true, showUserStats: true },
  });

  const {
    data,
    loading: facultyLoading,
    refetch,
  } = useQueryPagination(GET_FACULTIES_QUERY, {
    variables: queryParams,
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const institution = institutionData?.institution;
  const faculties = data?.faculties?.results;
  const { userDetails } = useAuthenticatedUser();
  const isGlobalAdmin = userDetails?.selectedRole === UserRoles.GLOBAL_ADMIN;

  const refetchQueries = () => {
    handleChangeQueryParams(defaultQueryParams);
    if (queryParams.offset === DEFAULT_PAGE_OFFSET) refetch();
  };

  const handleChangeQueryParams = (changeset) => {
    setQueryParams((prevState) => ({
      ...prevState,
      ...changeset,
    }));
  };

  const handleEditSchool = () => {
    if (userDetails?.selectedRole === UserRoles.GLOBAL_ADMIN) {
      history.push(
        `${PrivatePaths.INSTITUTIONS}/create-school?institutionId=${institutionId}&mode=edit`,
      );
      return;
    }
    history.push(`${PrivatePaths.INSTITUTIONS}/${institutionId}/school-management`);
  };

  const renderBannerRightContent = () => {
    return (
      <>
        <Box mr={8}>
          <Button
            variant="outlined"
            startIcon={<CreateOutlinedIcon />}
            style={{ color: colors.white }}
            onClick={handleEditSchool}>
            Edit School
          </Button>
        </Box>
        <AccessControl allowedRoles={[UserRoles.GLOBAL_ADMIN]}>
          <Button
            variant="contained"
            startIcon={<LinkIcon style={{ transform: 'rotate(45deg)' }} />}
            style={{ color: colors.black }}
            disabled={!!institution?.subdomain === false}
            onClick={() => window.open(parseUrl(institution?.subdomain), '_blank')}>
            Open Site
          </Button>
        </AccessControl>
        <AccessControl allowedRoles={[UserRoles.SCHOOL_ADMIN]}>
          <Button variant="contained" onClick={() => setIsUpsertFacultyDrawerVisible(true)}>
            Add Faculty
          </Button>
        </AccessControl>
      </>
    );
  };

  const renderFacultyStats = () => {
    return (
      <AccessControl allowedRoles={[UserRoles.SCHOOL_ADMIN]}>
        <Box mb={20}>
          <Grid container spacing={8}>
            <Grid item xs={4}>
              <FacultyStats
                totalCount={data?.faculties?.totalCount || 0}
                activeCount={data?.faculties?.active || 0}
                inactiveCount={data?.faculties?.inactive || 0}
              />
            </Grid>
          </Grid>
        </Box>
      </AccessControl>
    );
  };

  const renderFacultiesMetaData = () => {
    return (
      <Box display="flex" alignItems="center" className={classes.metaDataContainer}>
        {!!faculties?.head && (
          <Box display="flex" alignItems="center">
            <Avatar className="avatar">
              {getNameInitials(faculties?.head?.firstname, faculties?.head?.lastname)}
            </Avatar>
            <Box ml={4} mr={4}>
              <Typography component="span">
                {faculties?.head?.firstname} {faculties?.head?.lastname}
              </Typography>
            </Box>
            <Chip label="Head" roundness="lg" />
          </Box>
        )}
      </Box>
    );
  };

  return (
    <div>
      <NavigationBar />
      <LoadingView isLoading={institutionLoading || facultyLoading}>
        <BlueHeaderPageLayout
          avatarSrc={institution?.logo}
          links={isGlobalAdmin ? GlobalAdminLinks : SchoolAdminLinks}
          isTabBarHidden={true}
          isPageLoaded={Boolean(institution)}
          rightContent={renderBannerRightContent()}
          title={institution?.name}
          description={institution?.description}
          otherInformation={
            !!data?.faculties?.results?.length === true && renderFacultiesMetaData()
          }>
          <MaxWidthContainer spacing="lg">
            {renderFacultyStats()}
            <FacultyResourceCardList
              data={data}
              onOffsetChange={(offset) => handleChangeQueryParams({ offset })}
              onLimitChange={(_offset, limit) =>
                handleChangeQueryParams({ offset: DEFAULT_PAGE_OFFSET, limit })
              }
              offset={queryParams.offset}
              limit={queryParams.limit}
              loading={facultyLoading}
              onRequestAddFaculty={() => setIsUpsertFacultyDrawerVisible(true)}
            />
          </MaxWidthContainer>
        </BlueHeaderPageLayout>
        <UpsertFacultyDrawer
          open={isUpsertFacultyDrawerVisible}
          onClose={() => setIsUpsertFacultyDrawerVisible(false)}
          institutionId={institutionId}
          onCompletedCallback={refetchQueries}
        />
      </LoadingView>
    </div>
  );
};

const useStyles = makeStyles({
  metaDataContainer: {
    '& .bold-text': {
      fontWeight: fontWeight.bold,
      paddingRight: 5,
    },
    '& .divider': {
      height: fontSizes.large,
      backgroundColor: colors.white,
    },
    '& .avatar': {
      backgroundColor: colors.avatarDefaultBackground,
      width: 24,
      height: 24,
      color: colors.white,
      fontWeight: fontWeight.bold,
      fontSize: fontSizes.xsmall,
    },
  },
});

export default React.memo(FacultyList);
