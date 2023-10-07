import React from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  Avatar,
  makeStyles,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { useHistory, useLocation } from 'react-router-dom';

import ResourceTable from 'reusables/ResourceTable';
import { getNameInitials } from 'utils/UserUtils';
import { format } from 'date-fns';
import { DEFAULT_PAGE_OFFSET, UserRoles } from 'utils/constants';
import Chip from 'reusables/Chip';
import FilePreview from 'reusables/FilePreview';
import { fontSizes, fontWeight, spaces } from '../../../Css';
import Empty from 'reusables/Empty';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';

const AssignmentListAndResources = ({
  queryParams,
  data,
  setQueryParams,
  loading,
  assignmentDocuments,
}) => {
  const classes = useStyles();
  const history = useHistory();
  const { pathname } = useLocation();
  const submitionData = data?.assignmentSubmissions?.results;
  const documents = assignmentDocuments?.assignmentDocuments?.results;
  const { userDetails } = useAuthenticatedUser();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const columns = [
    {
      title: 'Name / Learner’s ID',
      dataIndex: 'name',
      render: (text, { id, submitedBy }) => (
        <Box display="flex">
          <Avatar className={classes.avatar}>
            {getNameInitials(submitedBy?.firstname, submitedBy?.lastname)}
          </Avatar>
          <Box>
            <div>
              {submitedBy?.firstname} {submitedBy?.middlename} {submitedBy?.lastname}
            </div>
            <div>{submitedBy?.matricNumber}</div>
          </Box>
        </Box>
      ),
      width: '40%',
    },
    {
      title: 'Date submited',
      dataIndex: 'dateSubmited',
      render: (text, { id, createdAt }) => <div>{format(new Date(createdAt), 'LLL dd, yyyy')}</div>,
      width: '25%',
      sorter: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (text, { id, score }) => (
        <div>
          <Chip
            className={!score && classes.chipColor}
            label={score ? 'Done' : 'Pending'}
            color={`${score && 'active'}`}
            variant="outlined"
            roundness="sm"
          />
        </div>
      ),
      sorter: true,
    },
    {
      title: 'Score',
      dataIndex: 'Score',
      render: (text, { id, score }) => (
        <div style={{ textAlign: 'right', paddingRight: 50 }}>{score ? score : '-'}</div>
      ),
      sorter: true,
    },
  ];

  const handleChangeQueryParams = (changeset) => {
    setQueryParams((prevState) => ({
      ...prevState,
      ...changeset,
    }));
  };

  const renderEmpty = () => {
    return (
      <Box pb={15}>
        <Empty title="No resources" description="No resource files were added" />
      </Box>
    );
  };

  return (
    <Grid container spacing={10}>
      <Grid item xs={12} md={8}>
        <ResourceTable
          loading={loading}
          columns={columns}
          dataSource={submitionData}
          onRow={(record, rowIndex) => {
            if (userDetails?.selectedRole === UserRoles.LECTURER) {
              return {
                onClick: (event) => history.push(`${pathname}/${record?.id}/details`),
              };
            }
          }}
          onChangeSort={(_order, property) => null}
          pagination={{
            total: data?.assignmentSubmissions?.totalCount,
            limit: queryParams?.limit,
            offset: queryParams?.offset,
            onChangeLimit: (_offset, limit) =>
              handleChangeQueryParams({ limit, offset: DEFAULT_PAGE_OFFSET }),
            onChangeOffset: (offset) => handleChangeQueryParams({ offset }),
          }}
        />
      </Grid>
      <Grid item xs={12} md={4} style={{ marginTop: isSmallScreen ? 0 : 25 }}>
        <Card square>
          <Box className={classes.resources} mb={10}>
            <Typography>Resources</Typography>
          </Box>
          {assignmentDocuments?.assignmentDocuments?.totalCount !== 0 ? (
            <Box>
              {documents?.map((file) => {
                const fileNameArray = file?.file?.split('/');
                const fileName = fileNameArray[fileNameArray.length - 1];
                return (
                  <Box mb={5} px={15}>
                    <FilePreview
                      key={file.id}
                      file={{
                        name: fileName,
                        type: file.type,
                        size: file.fileSize,
                        url: file.file,
                      }}
                      limitInformationToSize={true}
                    />
                  </Box>
                );
              })}
            </Box>
          ) : (
            renderEmpty()
          )}
        </Card>
      </Grid>
    </Grid>
  );
};

const useStyles = makeStyles(() => ({
  avatar: {
    marginRight: spaces.medium,
  },
  resources: {
    height: 90,
    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
    '& > *': {
      fontWeight: fontWeight.bold,
      fontSize: fontSizes.large,
      padding: spaces.medium,
    },
  },
  chipColor: {
    color: '#FFB321',
    background: '#fff',
    border: 'solid #FFB321 1px',
  },
}));
export default AssignmentListAndResources;
