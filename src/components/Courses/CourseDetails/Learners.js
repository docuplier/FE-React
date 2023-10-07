import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import StarIcon from '@material-ui/icons/Star';
import { ReactComponent as DownloadIcon } from 'assets/svgs/download.svg';
import { format } from 'date-fns';
import { Avatar, Box, Typography, makeStyles, Badge, Grid, Select } from '@material-ui/core';
import { useNotification } from 'reusables/NotificationBanner';
import ResourceTable from 'reusables/ResourceTable';
import FilterControl from 'reusables/FilterControl';
import { useQueryPagination } from 'hooks/useQueryPagination';
import { getNameInitials, formatUserNameWithMiddleName } from 'utils/UserUtils';
import { DEFAULT_PAGE_OFFSET, DEFAULT_PAGE_LIMIT, UserRoles } from 'utils/constants';
import { colors, fontSizes, fontWeight } from '../../../Css';
import LearnerStatsModal from '../LearnerStatsModal';
import { GET_ENROLLEES_BY_COURSE_ID } from 'graphql/queries/courses';
import { GET_USER_COURSE_STAT } from 'graphql/queries/users';
import { useQuery } from '@apollo/client';
import LoadingButton from 'reusables/LoadingButton';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import { CSVLink } from 'react-csv';

const studentType = [
  { status: 'ENROLLED', label: 'Enrollees' },
  { status: 'AUDIT', label: 'Auditees' },
];

const Learners = ({ classRepId }) => {
  const classes = useStyles();
  const { userDetails } = useAuthenticatedUser();
  const { courseId } = useParams();
  const [isLearnerStatsVisible, setIsLearnerStatsVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const isLecturer = userDetails.selectedRole === UserRoles.LECTURER;
  const [filterType, setFilterType] = useState(isLecturer ? 'ENROLLED' : null);
  const notification = useNotification();

  const defaultQueryParams = {
    courseId,
    search: '',
    offset: DEFAULT_PAGE_OFFSET,
    limit: DEFAULT_PAGE_LIMIT,
    ordering: null,
  };
  const [queryParams, setQueryParams] = useState(defaultQueryParams);

  const { data, loading } = useQueryPagination(GET_ENROLLEES_BY_COURSE_ID, {
    variables: queryParams,
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const { data: csvDataFetch, loading: isDownloadingCsv } = useQueryPagination(
    GET_ENROLLEES_BY_COURSE_ID,
    {
      /**
       * this query is neccessary for the download of all students data
       * as csv file
       */
      variables: {
        ...queryParams,
        limit: 2500,
      },
      onError: (error) => {
        notification.error({
          message: error?.message,
        });
      },
    },
  );
  const allStudenData = csvDataFetch?.enrollees?.results;

  const { data: learnerCourseStat } = useQuery(GET_USER_COURSE_STAT, {
    variables: {
      userId: selectedUser?.id,
    },
    skip: !selectedUser?.id,
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });
  const { learnerAverageQuizScore, learnerSectionCompleted, learnerSectionPending } =
    learnerCourseStat?.courseOverview || {};

  useEffect(() => {
    if (data && selectedUser) {
      //@todo: This is an hack to update the information of the selected user
      //when likes updates. We should probably rely on the cache directly than state
      const results = data?.enrollees?.results || [];

      const updatedUser = results.find((data) => data?.user?.id === selectedUser.id)?.user;
      setSelectedUser(updatedUser);
    }
  }, [data, selectedUser]);

  const filterItems = (array, filterPramas) => {
    return array?.filter((item) => item?.status === filterPramas);
  };

  const getDataSource = (dataArray) => {
    switch (filterType) {
      case 'ENROLLED':
        return filterItems(dataArray, 'ENROLLED');
      case 'AUDIT':
        return filterItems(dataArray, 'AUDIT');
      default:
        return dataArray;
    }
  };

  const columns = [
    {
      title: 'Name / Student’s ID',
      dataIndex: 'name',
      render: (text, { id, user }) => (
        <div className="name-container">
          <Badge
            classes={{ root: classes.badge }}
            badgeContent={classRepId === user?.id && <StarIcon className={classes.starIcon} />}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}>
            <Avatar src={user?.image} className="avatar">
              {getNameInitials(user.firstname, user.lastname)}
            </Avatar>
          </Badge>

          <Box>
            <div>
              {user.firstname} {user.middlename} {user.lastname}
            </div>
            <div>{user?.matricNumber}</div>
          </Box>
        </div>
      ),
      width: '45%',
    },
    {
      title: 'Enrolled On',
      dataIndex: 'dateOfEnrollment',
      render: (text, { id, createdAt }) => <div>{format(new Date(createdAt), 'LLL dd, yyyy')}</div>,
      sorter: true,
    },
    {
      title: '% Completion',
      dataIndex: 'percentageCompletion',
      render: (text, { id, progress }) => <div>{progress}%</div>,
      sorter: true,
    },
  ];

  const handleChangeQueryParams = (changeset) => {
    setQueryParams((prevState) => ({
      ...prevState,
      ...changeset,
    }));
  };

  const getStudentTableData = () => {
    const students = [];
    (isLecturer
      ? filterItems(allStudenData?.flat(), 'ENROLLED')
      : getDataSource(allStudenData?.flat())
    )?.map((student) =>
      students.push([
        `${student?.user?.firstname ?? '--'} ${student?.user?.lastname ?? '--'} ${
          student?.user?.matricNumber ?? '--'
        }`,
        format(new Date(student?.createdAt), 'LLL-dd-yyyy') ?? '--',
        student.progress ?? '--',
      ]),
    );
    return students;
  };

  const getHeadingData = () => {
    let headingData = [];

    columns?.map((item) => {
      let heading = item?.title;
      return headingData?.push(heading);
    });
    return headingData;
  };

  const handleRowClick = (record) => {
    setSelectedUser(record?.user);
    setIsLearnerStatsVisible(true);
  };

  const getAgeFromDateOfBirth = (date) => {
    let presentYear = new Date().getFullYear();
    let birthYear = new Date(date).getFullYear();
    let age = presentYear - birthYear;
    return Boolean(age) ? age : '';
  };

  return (
    <Box className={classes.container}>
      <Typography component="h4" className="title">
        Students Stats
      </Typography>
      <Typography className="caption">
        {data?.enrollees?.results?.length || 0} learners • {data?.enrollees?.totalAuditee || 0}{' '}
        Auditees • {data?.enrollees?.totalEnrollee || 0} Enrollees
      </Typography>
      <ResourceTable
        columns={columns}
        loading={loading}
        dataSource={getDataSource(data?.enrollees?.results)}
        onRow={(record) => {
          return {
            onClick: (_evt) => handleRowClick(record),
          };
        }}
        onChangeSort={(_order, property) => null}
        filterControl={
          <FilterControl
            paper={true}
            searchInputProps={{
              colSpan: {
                xs: 12,
                sm: 7,
              },
              onChange: (evt) => handleChangeQueryParams({ search: evt.target.value }),
            }}
            renderCustomFilters={
              <Grid item xs={12} sm={5}>
                <Box display="flex" alignItems="center" justifyContent="flex-start">
                  <Box mr={8} width={'100%'}>
                    <Select
                      label="Student Type"
                      native
                      disabled={isLecturer}
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      type="text"
                      fullWidth
                      variant="outlined">
                      <option value="">All</option>
                      {studentType.map((type) => (
                        <option key={type.status} value={type.status}>
                          {type.label}
                        </option>
                      ))}
                    </Select>
                  </Box>
                  <Box>
                    <CSVLink
                      filename={`${filterType ?? 'All'}-student.csv`}
                      data={getStudentTableData()}
                      separator={','}
                      headers={getHeadingData()}>
                      <LoadingButton color="primary" isLoading={isDownloadingCsv}>
                        <DownloadIcon />
                      </LoadingButton>
                    </CSVLink>
                  </Box>
                </Box>
              </Grid>
            }
          />
        }
        pagination={{
          total: data?.enrollees?.totalCount,
          limit: queryParams.limit,
          offset: queryParams.offset,
          onChangeLimit: (_offset, limit) =>
            handleChangeQueryParams({ limit, offset: DEFAULT_PAGE_OFFSET }),
          onChangeOffset: (offset) => handleChangeQueryParams({ offset }),
        }}
      />
      <LearnerStatsModal
        open={isLearnerStatsVisible}
        onClose={() => setIsLearnerStatsVisible(false)}
        profileInfo={{
          user: {
            imageSrc: selectedUser?.image,
            name: formatUserNameWithMiddleName(
              selectedUser?.firstname,
              selectedUser?.middlename,
              selectedUser?.lastname,
            ),
            id: selectedUser?.matricNumber,
            department: selectedUser?.department,
            gender: selectedUser?.gender,
            level: selectedUser?.level?.name,
            age: getAgeFromDateOfBirth(selectedUser?.userinformation?.dateOfBirth),
          },
        }}
        questionData={selectedUser?.questionCreators}
        stats={{
          averageQuizScore: learnerAverageQuizScore,
          sectionCompleted: learnerSectionCompleted,
          sectionPending: learnerSectionPending,
        }}
      />
    </Box>
  );
};

const useStyles = makeStyles({
  container: {
    color: '#393A4A',
    '& .title': {
      color: colors.dark,
      fontWeight: fontWeight.bold,
      fontSize: fontSizes.xxlarge,
    },
    '& .caption': {
      color: colors.grey,
      fontWeight: fontWeight.medium,
      fontSize: fontSizes.large,
      marginBottom: 16,
    },
    '& .name-container': {
      display: 'flex',
    },
    '& .avatar': {
      marginRight: 16,
    },
  },
  badge: {
    '& .MuiBadge-anchorOriginBottomRightRectangle': {
      right: 20,
      bottom: 10,
      postition: 'relative',
    },
  },
  starIcon: {
    width: 20,
    position: 'absolute',
  },
});

export default Learners;
