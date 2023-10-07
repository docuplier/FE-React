import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Divider,
  Avatar,
  makeStyles,
  Breadcrumbs,
  IconButton,
} from '@material-ui/core';
import { useQuery } from '@apollo/client';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import BackIcon from '@material-ui/icons/ArrowBackIosOutlined';
import { useParams, useHistory, useLocation } from 'react-router-dom';

import NavigationBar from 'reusables/NavigationBar';
import BlueHeaderPageLayout from 'Layout/BlueHeaderPageLayout';
import { PrivatePaths } from 'routes';
import Chip from 'reusables/Chip';
import MaxWidthContainer from 'reusables/MaxWidthContainer';
import { colors, fontSizes, fontWeight } from '../../Css';
import LearnersTable from 'components/Institutions/LearnersTable';
import UpsertDepartmentDrawer from 'components/Institutions/UpsertDepartmentDrawer';
import AccessControl from 'reusables/AccessControl';
import { UserRoles } from 'utils/constants';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import useNotification from 'reusables/NotificationBanner/useNotification';
import {
  GET_DEPARTMENT_BY_ID_QUERY,
  GET_LEVEL_BY_ID,
  GET_PROGRAM_BY_ID_QUERY,
} from 'graphql/queries/institution';
import { getNameInitials } from 'utils/UserUtils';
import CourseSection from 'components/Institutions/CourseSection';
import { convertToSentenceCase } from 'utils/TransformationUtils';

const Tabs = {
  Students: 0,
};

const LevelDetails = () => {
  const classes = useStyles();
  const { institutionId, facultyId, departmentId, levelId } = useParams();
  const { userDetails } = useAuthenticatedUser();
  const [isUpsertDepartmentDrawerVisible, setIsUpsertDepartmentDrawerVisible] = useState(false);
  const [currentTab, setCurrentTab] = useState(Tabs.Students);
  const history = useHistory();
  const notification = useNotification();
  const params = new URLSearchParams(useLocation().search);
  const programType = params.get('programType');
  const programId = params.get('programId');

  const { data: departmentData, refetch } = useQuery(GET_DEPARTMENT_BY_ID_QUERY, {
    variables: {
      departmentId,
    },
    skip: !departmentId,
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const { data: program } = useQuery(GET_PROGRAM_BY_ID_QUERY, {
    variables: { programId: programId.toLowerCase() === 'all' ? null : programId },
    skip: !Boolean(programId),
  });

  const { data: levelData } = useQuery(GET_LEVEL_BY_ID, {
    variables: {
      levelId,
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const getBreadCrumbs = () => {
    const { faculty, name } = departmentData?.department || {};
    const facultyName = faculty?.name;
    const institutionName = faculty?.institution?.name;

    return userDetails?.selectedRole === UserRoles.GLOBAL_ADMIN
      ? [
          { title: 'Home', to: '/' },
          { title: 'Institutions', to: PrivatePaths.INSTITUTIONS },
          {
            title: institutionName,
            to: `${PrivatePaths.INSTITUTIONS}/${institutionId}`,
          },
          {
            title: facultyName,
            to: `${PrivatePaths.INSTITUTIONS}/${institutionId}/faculties/${facultyId}`,
          },
          {
            title: name,
            to: `${PrivatePaths.INSTITUTIONS}/${institutionId}/faculties/${facultyId}/departments/${departmentId}`,
          },
        ]
      : [
          { title: 'Home', to: '/' },
          {
            title: institutionName,
            to: `${PrivatePaths.INSTITUTIONS}/${institutionId}`,
          },
          {
            title: facultyName,
            to: `${PrivatePaths.INSTITUTIONS}/${institutionId}/faculties/${facultyId}`,
          },
          {
            title: name,
            to: `${PrivatePaths.INSTITUTIONS}/${institutionId}/faculties/${facultyId}/departments/${departmentId}`,
          },
        ];
  };

  const renderBannerRightContent = () => {
    return (
      <AccessControl allowedRoles={[UserRoles.SCHOOL_ADMIN]}>
        <Box mr={8}>
          <Button
            variant="outlined"
            startIcon={<CreateOutlinedIcon />}
            style={{ color: colors.white }}
            onClick={() => setIsUpsertDepartmentDrawerVisible(true)}>
            Edit department
          </Button>
        </Box>
      </AccessControl>
    );
  };

  const renderDepartmentsMetaData = () => {
    const { studentCount, createdBy } = departmentData?.department || {};
    const fullName = createdBy?.firstname + ' ' + createdBy?.lastname;

    return (
      <>
        <Box display="flex" alignItems="center" className={classes.metaDataContainer}>
          <Typography component="span" variant="body1">
            <Typography component="span" className="bold-text">
              {studentCount}{' '}
            </Typography>
            Student
          </Typography>
          <Box ml={8} mr={8}>
            <Divider orientation="vertical" className="divider" />
          </Box>
          <Box display="flex" alignItems="center">
            <Avatar className="avatar">{getNameInitials(fullName)}</Avatar>
            <Box ml={4} mr={4}>
              <Typography component="span">{fullName}</Typography>
            </Box>
            <Chip label="Head" roundness="lg" />
          </Box>
        </Box>
        <Box display="flex" mt={8} alignItems="center" className={classes.metaDataContainer}>
          <Typography component="span" variant="body1">
            <Typography component="span" className="bold-text">
              Student-type:{' '}
            </Typography>
            {convertToSentenceCase(programType)}
          </Typography>
          <Box ml={8} mr={8}>
            <Divider orientation="vertical" className="divider" />
          </Box>
          <Typography component="span" variant="body1">
            <Typography component="span" className="bold-text">
              Session:{' '}
            </Typography>
            2020/2021
          </Typography>
          <Box ml={8} mr={8}>
            <Divider orientation="vertical" className="divider" />
          </Box>
          <Typography component="span" variant="body1">
            <Typography component="span" className="bold-text">
              Semester:{' '}
            </Typography>
            Second
          </Typography>
        </Box>
      </>
    );
  };

  const renderNavigationButtons = () => {
    const { level } = levelData || {};
    const programData = program?.program;
    return (
      <Box display="flex" alignItems="center" mb={12} className={classes.navigation}>
        <Box mr={10}>
          <IconButton color="primary" onClick={() => history.goBack()}>
            <BackIcon className="back-icon" />
          </IconButton>
        </Box>
        <Breadcrumbs aria-label="breadcrumbs">
          <Box mr={2}>
            <Button color="primary" onClick={() => history.goBack()}>
              Back
            </Button>
          </Box>
          <Box ml={2}>
            <Button color="primary">
              {level?.name} {programData?.name && `(${programData?.name})`}
            </Button>
          </Box>
        </Breadcrumbs>
      </Box>
    );
  };

  return (
    <div>
      <NavigationBar />
      <BlueHeaderPageLayout
        showDepartmentText
        onTabChange={(value) => setCurrentTab(value)}
        tabs={Object.keys(Tabs)}
        links={getBreadCrumbs()}
        isPageLoaded={Boolean(departmentData?.department)}
        rightContent={renderBannerRightContent()}
        title={departmentData?.department?.name}
        chipLabel={departmentData?.department?.abbreviation}
        description={departmentData?.department?.description}
        otherInformation={renderDepartmentsMetaData()}>
        <MaxWidthContainer spacing="lg">
          {renderNavigationButtons()}
          {currentTab === Tabs.Students ? <LearnersTable /> : <CourseSection />}
        </MaxWidthContainer>
      </BlueHeaderPageLayout>
      <UpsertDepartmentDrawer
        open={isUpsertDepartmentDrawerVisible}
        onClose={() => setIsUpsertDepartmentDrawerVisible(false)}
        departmentId={departmentId}
        onCompletedCallback={refetch}
      />
    </div>
  );
};

const useStyles = makeStyles({
  metaDataContainer: {
    '& .bold-text': {
      fontWeight: fontWeight.bold,
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
  navigation: {
    '& .back-icon': {
      fontSize: fontSizes.large,
    },
    '& button': {
      padding: 0,
      minWidth: 'max-content',
      minHeight: 'max-content',
      fontWeight: fontWeight.regular,
    },
    '& .MuiBreadcrumbs-separator': {
      margin: 0,
      color: colors.primary,
    },
  },
});

export default React.memo(LevelDetails);
