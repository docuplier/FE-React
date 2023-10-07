import { useQuery } from '@apollo/client';
import { Avatar, Box, Button, Divider, makeStyles, Typography } from '@material-ui/core';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import InstructorList from 'components/Institutions/InstructorList';
import LevelList from 'components/Institutions/LevelList';
import UpsertDepartmentDrawer from 'components/Institutions/UpsertDepartmentDrawer';
import { GET_DEPARTMENT_BY_ID_QUERY, GET_LEVELS } from 'graphql/queries/institution';
import { GET_USERS } from 'graphql/queries/users';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import BlueHeaderPageLayout from 'Layout/BlueHeaderPageLayout';
import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import AccessControl from 'reusables/AccessControl';
import Chip from 'reusables/Chip';
import MaxWidthContainer from 'reusables/MaxWidthContainer';
import NavigationBar from 'reusables/NavigationBar';
import { useNotification } from 'reusables/NotificationBanner';
import { PrivatePaths } from 'routes';
import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET, UserRoles } from 'utils/constants';
import { getNameInitials } from 'utils/UserUtils';
import { colors, fontSizes, fontWeight } from '../../Css';

const Tabs = ['Lecturers', 'Students'];

const Department = () => {
  const classes = useStyles();
  const [currentTab, setCurrentTab] = useState(0);
  const [isUpsertDepartmentDrawerVisible, setIsUpsertDepartmentDrawerVisible] = useState(false);
  const { userDetails } = useAuthenticatedUser();
  const notification = useNotification();
  const { institutionId, facultyId, departmentId } = useParams();
  const [levelsQueryParams, setLevelsQueryParams] = useState({
    offset: DEFAULT_PAGE_OFFSET,
    limit: DEFAULT_PAGE_LIMIT,
    program: 'All',
    programType: 'All',
    departmentId,
    roles: UserRoles.LECTURER,
  });
  const [instructorsQueryParams, setInstructorsQueryParams] = useState({
    offset: DEFAULT_PAGE_OFFSET,
    limit: DEFAULT_PAGE_LIMIT,
    search: '',
    role: UserRoles.LECTURER,
    institutionId,
    department: departmentId,
  });

  const { data: departmentData, refetch } = useQuery(GET_DEPARTMENT_BY_ID_QUERY, {
    variables: {
      departmentId,
    },
    skip: !departmentId,
    onCompleted: (response) => {
      handleChangeLevelsQueryParams({
        institutionId: response?.department?.faculty?.institution?.id,
      });
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const { data: levelsData, loading: isLoadingLevels } = useQuery(GET_LEVELS, {
    variables: {
      ...levelsQueryParams,
      program: levelsQueryParams.program === 'All' ? null : levelsQueryParams.program,
      programType: levelsQueryParams.programType === 'All' ? null : levelsQueryParams.programType,
    },
    fetchPolicy: 'no-cache',
    skip: !levelsQueryParams.program,
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const { loading: instructorsLoading, data: instructorsData } = useQuery(GET_USERS, {
    variables: { ...instructorsQueryParams, searchTerm: instructorsQueryParams.search },
  });

  const formattedTabs = useMemo(() => {
    return userDetails?.selectedRole !== UserRoles.GLOBAL_ADMIN
      ? Tabs.filter((tab) => tab !== 'Instructors')
      : Tabs;
  }, [userDetails]);

  const getBreadCrumbs = () => {
    const { faculty } = departmentData?.department || {};
    const facultyName = faculty?.name;
    const institutionName = faculty?.institution?.name;

    return userDetails?.selectedRole === UserRoles.GLOBAL_ADMIN
      ? [
          { title: 'Home', to: '/' },
          { title: institutionName, to: PrivatePaths.INSTITUTIONS },
          {
            title: institutionName,
            to: `${PrivatePaths.INSTITUTIONS}/${institutionId}`,
          },
          {
            title: facultyName,
            to: `${PrivatePaths.INSTITUTIONS}/${institutionId}/faculties/${facultyId}`,
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
        ];
  };

  const parseLevelList = () => {
    return (
      levelsData?.levels?.results?.map((level) => {
        return {
          level: level.name,
          courseCount: level.coursesCount,
          id: level.id,
          userCount: level.usersCount || 0,
        };
      }) || []
    );
  };

  const handleChangeLevelsQueryParams = (changeset) => {
    setLevelsQueryParams((prevState) => ({
      ...prevState,
      ...changeset,
    }));
  };

  const handleChangeInstuctorsQueryParams = (changeset) => {
    setInstructorsQueryParams((prevState) => ({
      ...prevState,
      ...changeset,
    }));
  };

  const handleChangeTab = (value) => {
    let roles = null;
    roles = value === 1 ? UserRoles.STUDENT : UserRoles.LECTURER;
    setCurrentTab(value);
    handleChangeLevelsQueryParams({ roles });
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
        <Button variant="contained" disableElevation>
          <MoreVertIcon />
        </Button>
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
            Learners
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

  const renderContent = () => {
    switch (currentTab) {
      case 0:
        return (
          <InstructorList
            totalCountOfInstructors={instructorsData?.users?.totalCount}
            activeCount={instructorsData?.users?.active}
            inactiveCount={instructorsData?.users?.inactive}
            onChangeQueryParams={handleChangeInstuctorsQueryParams}
            queryParams={instructorsQueryParams}
            data={{
              instructors: instructorsData?.users?.results,
              total: instructorsData?.users?.totalCount,
            }}
            loading={instructorsLoading}
          />
        );
      case 1:
        return (
          <LevelList
            usersColumnTitle={'Students'}
            data={parseLevelList()}
            onChangeFilters={handleChangeLevelsQueryParams}
            filters={{
              programType: levelsQueryParams.programType,
              programId: levelsQueryParams.program,
            }}
            loading={isLoadingLevels}
          />
        );
      default:
        return (
          <LevelList
            usersColumnTitle="Students"
            data={parseLevelList()}
            onChangeFilters={handleChangeLevelsQueryParams}
            filters={{
              programType: levelsQueryParams.programType,
              programId: levelsQueryParams.program,
            }}
            loading={isLoadingLevels}
          />
        );
    }
  };

  return (
    <div>
      <NavigationBar />
      <BlueHeaderPageLayout
        showDepartmentText
        onTabChange={handleChangeTab}
        tabs={formattedTabs}
        links={getBreadCrumbs()}
        isPageLoaded={Boolean(departmentData)}
        rightContent={renderBannerRightContent()}
        title={departmentData?.department?.name}
        chipLabel={departmentData?.department?.abbreviation}
        description={departmentData?.department?.description}
        otherInformation={renderDepartmentsMetaData()}>
        <MaxWidthContainer spacing="lg">{renderContent()}</MaxWidthContainer>
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
});

export default React.memo(Department);
