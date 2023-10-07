import { useQuery } from '@apollo/client';
import { Box, Button, Divider, makeStyles, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import DotIcon from '@material-ui/icons/FiberManualRecord';
import UpsertDepartmentDrawer from 'components/Institutions/UpsertDepartmentDrawer';
import UpsertFacultyDrawer from 'components/Institutions/UpsertFacultyDrawer';
import { GET_DEPARTMENTS_QUERY, GET_FACULTY_BY_ID_QUERY } from 'graphql/queries/institution';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import { useQueryPagination } from 'hooks/useQueryPagination';
import BlueHeaderPageLayout from 'Layout/BlueHeaderPageLayout';
import React, { useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import AccessControl from 'reusables/AccessControl';
import Chip from 'reusables/Chip';
import FilterControl from 'reusables/FilterControl';
import LoadingView from 'reusables/LoadingView';
import MaxWidthContainer from 'reusables/MaxWidthContainer';
import NavigationBar from 'reusables/NavigationBar';
import { useNotification } from 'reusables/NotificationBanner';
import ResourceTable from 'reusables/ResourceTable';
import { PrivatePaths } from 'routes';
import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET, UserRoles } from 'utils/constants';
import { colors, fontSizes, fontWeight } from '../../Css';

const Departments = () => {
  const classes = useStyles();
  const [isUpsertDepartmentDrawerVisible, setIsUpsertDepartmentDrawerVisible] = useState(false);
  const [isUpsertFacultyDrawerVisible, setIsUpsertFacultyDrawerVisible] = useState(false);
  const { facultyId, institutionId } = useParams();
  const notification = useNotification();
  const history = useHistory();
  const { pathname } = useLocation();
  const { userDetails } = useAuthenticatedUser();
  const defaultQueryParams = {
    institutionId,
    facultyId,
    search: '',
    offset: DEFAULT_PAGE_OFFSET,
    limit: DEFAULT_PAGE_LIMIT,
    ordering: null,
  };
  const [queryParams, setQueryParams] = useState(defaultQueryParams);

  const {
    data: facultyData,
    loading: isLoadingFaculty,
    refetch: refetchFaculties,
  } = useQuery(GET_FACULTY_BY_ID_QUERY, {
    variables: {
      facultyId,
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const {
    data: departmentsData,
    loading: isLoadingDepartments,
    refetch,
  } = useQueryPagination(GET_DEPARTMENTS_QUERY, {
    variables: queryParams,
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: '30%',
    },
    {
      title: 'Code',
      dataIndex: 'abbreviation',
      sorter: true,
    },
    {
      title: 'No. of Students',
      dataIndex: 'studentCount',
      sorter: true,
    },
    {
      title: 'No. of Courses',
      dataIndex: 'publishedCourseCount',
      sorter: true,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      sorter: true,
      render: (isActive) => (
        <Chip
          label={isActive ? 'ACTIVE' : 'INACTIVE'}
          size="md"
          roundness="sm"
          variant="outlined"
          color={isActive ? 'active' : 'inactive'}
        />
      ),
    },
  ];

  const handleChangeQueryParams = (changeset) => {
    setQueryParams((prevState) => ({
      ...prevState,
      ...changeset,
    }));
  };

  const getBreadCrumbs = () => {
    return userDetails?.selectedRole === UserRoles.GLOBAL_ADMIN
      ? [
          { title: 'Home', to: '/' },
          { title: 'Institutions', to: PrivatePaths.INSTITUTIONS },
          {
            title: facultyData?.faculty?.institution?.name,
            to: `${PrivatePaths.INSTITUTIONS}/${institutionId}`,
          },
        ]
      : [
          { title: 'Home', to: '/' },
          {
            title: facultyData?.faculty?.institution?.name,
            to: `${PrivatePaths.INSTITUTIONS}/${institutionId}`,
          },
        ];
  };

  const refetchQueries = () => {
    handleChangeQueryParams(defaultQueryParams);
    if (queryParams.offset === DEFAULT_PAGE_OFFSET) refetch();
  };

  const renderBannerRightContent = () => {
    return (
      <AccessControl allowedRoles={[UserRoles.SCHOOL_ADMIN]}>
        <Box mr={8}>
          <Button
            variant="outlined"
            startIcon={<CreateOutlinedIcon />}
            style={{ color: colors.white }}
            onClick={() => setIsUpsertFacultyDrawerVisible(true)}>
            Edit Faculty
          </Button>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsUpsertDepartmentDrawerVisible(true)}
          disableElevation>
          Add Department
        </Button>
      </AccessControl>
    );
  };

  const renderDepartmentsMetaData = () => {
    return (
      <Box display="flex" alignItems="center" className={classes.metaDataContainer}>
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
    );
  };

  const renderStats = () => {
    const { departmentCount } = facultyData?.faculty || {};
    const { active, inactive } = departmentsData?.departments || {};

    return (
      <Box display="flex" alignItems="center" className="description" mt={2} mb={8}>
        <Typography variant="body1" color="textSecondary">
          {departmentCount} Total
        </Typography>
        <Box ml={2} mr={2}>
          <DotIcon />
        </Box>
        <Typography variant="body1" color="textSecondary" style={{ color: colors.textSuccess }}>
          {active} Active
        </Typography>
        <Box ml={2} mr={2}>
          <DotIcon />
        </Box>
        <Typography variant="body1" color="textSecondary" style={{ color: colors.textWarning }}>
          {inactive} Disabled
        </Typography>
      </Box>
    );
  };

  const renderRecords = () => {
    let { totalCount, results = [] } = departmentsData?.departments || {};

    return (
      <ResourceTable
        columns={columns}
        loading={isLoadingFaculty ? false : isLoadingDepartments}
        dataSource={results}
        rowSelection={{
          onChange: (_selectedRowKeys, selectedRows) => console.log(selectedRows),
        }}
        onRow={(record) => {
          return {
            onClick: (_evt) => history.push(`${pathname}/departments/${record.id}`),
          };
        }}
        onChangeSort={(_order, property) => handleChangeQueryParams({ ordering: property })}
        filterControl={
          <FilterControl
            searchInputProps={{
              colSpan: {
                xs: 12,
              },
              onChange: (evt) => handleChangeQueryParams({ search: evt.target.value }),
            }}
          />
        }
        pagination={{
          total: totalCount,
          onChangeLimit: (_offset, limit) =>
            handleChangeQueryParams({ limit, offset: DEFAULT_PAGE_OFFSET }),
          onChangeOffset: (offset) => handleChangeQueryParams({ offset }),
          limit: queryParams.limit,
          offset: queryParams.offset,
        }}
      />
    );
  };

  return (
    <div>
      <NavigationBar />
      <LoadingView isLoading={isLoadingFaculty}>
        <BlueHeaderPageLayout
          isTabBarHidden={true}
          links={getBreadCrumbs()}
          isPageLoaded={Boolean(facultyData)}
          rightContent={renderBannerRightContent()}
          title={facultyData?.faculty?.name}
          chipLabel={`Abbrev: ${facultyData?.faculty?.abbreviation}`}
          description={facultyData?.faculty?.description}
          otherInformation={renderDepartmentsMetaData()}>
          <MaxWidthContainer spacing="lg" className={classes.body}>
            <Typography variant="h6" color="textPrimary" className="title">
              Department
            </Typography>
            {renderStats()}
            {renderRecords()}
          </MaxWidthContainer>
        </BlueHeaderPageLayout>
      </LoadingView>
      <UpsertDepartmentDrawer
        open={isUpsertDepartmentDrawerVisible}
        onClose={() => setIsUpsertDepartmentDrawerVisible(false)}
        facultyId={facultyId}
        onCompletedCallback={refetchQueries}
      />
      <UpsertFacultyDrawer
        open={isUpsertFacultyDrawerVisible}
        onClose={() => setIsUpsertFacultyDrawerVisible(false)}
        facultyId={facultyId}
        institutionId={institutionId}
        onCompletedCallback={() => refetchFaculties()}
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
  },
  body: {
    '& .title': {
      fontWeight: fontWeight.bold,
      lineHeight: 0.9,
    },
    '& .description': {
      '& .MuiTypography-colorTextSecondary': {
        fontWeight: fontWeight.medium,
      },
      '& .MuiSvgIcon-root': {
        fontSize: fontSizes.xsmall,
        color: colors.secondaryTextLight,
      },
    },
  },
});

export default React.memo(Departments);
