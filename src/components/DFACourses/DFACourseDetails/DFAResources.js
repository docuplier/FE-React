import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { Box, makeStyles, Paper, Typography, TextField, Grid, IconButton } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { GET_COURSE_RESOURCES } from 'graphql/queries/courses';
import { useNotification } from 'reusables/NotificationBanner';
import Empty from 'reusables/Empty';
import LoadingView from 'reusables/LoadingView';
import OffsetLimitBasedPagination from 'reusables/Pagination/OffsetLimitBasedPagination';
import FilterControl from 'reusables/FilterControl';
import FilePreview from 'reusables/FilePreview';
import { formatFileName, getFileExtension } from 'utils/TransformationUtils';
import { formatUserNameWithMiddleName } from 'utils/UserUtils';
import { DEFAULT_PAGE_OFFSET, DEFAULT_PAGE_LIMIT, UserRoles } from 'utils/constants';
import { useQueryPagination } from 'hooks/useQueryPagination';
import { fontWeight, colors, fontSizes } from '../../../Css';
import FileUpload from 'reusables/FileUpload';
import { useForm } from 'react-hook-form';
import LoadingButton from 'reusables/LoadingButton';
import { CREATE_RESOURCE } from 'graphql/mutations/course';
import { useMutation } from '@apollo/client';
import { convertToSentenceCase } from 'utils/TransformationUtils';
import AccessControl from 'reusables/AccessControl';

const DFAResources = () => {
  const classes = useStyles();
  const { courseId } = useParams();
  const notification = useNotification();
  const { handleSubmit } = useForm();
  const [fileData, setFileData] = useState();
  const defaultQueryParams = {
    courseId,
    search: '',
    offset: DEFAULT_PAGE_OFFSET,
    limit: DEFAULT_PAGE_LIMIT,
    datePublished: null,
    ordering: null,
  };
  const [queryParams, setQueryParams] = useState(defaultQueryParams);

  const {
    data,
    loading,
    refetch: refetchResourses,
  } = useQueryPagination(GET_COURSE_RESOURCES, {
    variables: queryParams,
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const resources = data?.resources?.results;

  const handleChangeQueryParams = (changeset) => {
    setQueryParams((prevState) => ({
      ...prevState,
      ...changeset,
    }));
  };

  function onError(error) {
    notification.error({
      message: 'Error!',
      description: error?.message,
    });
  }

  const [createResource, { loading: newResourceLoading }] = useMutation(CREATE_RESOURCE, {
    onCompleted: (response) => {
      const { ok, errors } = response.createResource;
      const status = ok === false ? 'error' : 'success';
      const message = errors
        ? errors?.map((error) => error.messages).join('. ')
        : `Resources has been uploaded successfully`;

      notification[status]({
        message: `${convertToSentenceCase(status)}!`,
        description: message,
      });

      refetchResourses();
      setFileData(null);
    },
    onError,
  });

  const renderEmptyState = () => {
    return (
      <Empty
        title={'No Resources'}
        description={'No Resources have been published for this course.'}
      ></Empty>
    );
  };

  const renderResourcesCount = () => {
    return (
      <Box className={classes.container} display="flex" justifyContent="space-between">
        <Box>
          <Typography component="h4" className="title">
            Resources
          </Typography>
          <Typography className="caption">{data?.resources?.totalCount || 0} in total</Typography>
        </Box>
      </Box>
    );
  };

  const renderSearchField = () => {
    return (
      <Box component={Paper} py={10} px={10} mb={12}>
        <FilterControl
          colSpan={4}
          searchInputProps={{
            name: 'search',
            colSpan: {
              xs: 12,
              sm: 9,
            },
            onChange: (evt) => handleChangeQueryParams({ search: evt.target.value }),
          }}
          renderCustomFilters={
            <>
              <Grid item xs={12} sm={3}>
                <TextField
                  id="date"
                  label="Post date"
                  variant="outlined"
                  type="date"
                  fullWidth
                  defaultValue="Post date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  //   style={{ backgroundColor: 'red' }}
                  onChange={(evt) => handleChangeQueryParams({ datePublished: evt.target.value })}
                />
              </Grid>
            </>
          }
        />
      </Box>
    );
  };

  const renderResoureInput = () => {
    const onSubmit = () => {
      const values = {
        file: fileData,
        course: courseId,
      };

      createResource({
        variables: values,
      });
    };

    return (
      <Box border="dashed 1px #BDBDBD" p={Boolean(fileData) && 4}>
        <FileUpload onChange={(value) => setFileData(value)} file={fileData} id={'files'} />
        {Boolean(fileData) && (
          <Box display="flex" justifyContent="space-evenly" mt={12}>
            <LoadingButton
              variant="outlined"
              color="primary"
              isLoading={newResourceLoading}
              onClick={handleSubmit(onSubmit)}
            >
              Add Resources
            </LoadingButton>
          </Box>
        )}
      </Box>
    );
  };

  const renderPagination = () => {
    return (
      <OffsetLimitBasedPagination
        total={data?.resources?.totalCount}
        offset={queryParams.offset}
        limit={queryParams.limit}
        onChangeLimit={(_offset, limit) =>
          handleChangeQueryParams({ limit, offset: DEFAULT_PAGE_OFFSET })
        }
        onChangeOffset={(offset) => handleChangeQueryParams({ offset })}
      />
    );
  };

  const renderFileCard = () => {
    return (
      <Box my={12}>
        {resources?.map((resource, index) => {
          return (
            <Box mb={4}>
              <FilePreview
                key={index}
                file={{
                  name: formatFileName(resource?.file),
                  type: getFileExtension(resource?.file),
                  size: resource?.size,
                  url: resource?.file,
                }}
                metaData={{
                  author: formatUserNameWithMiddleName(
                    resource?.createdBy?.firstname,
                    resource?.createdBy?.middlename,
                    resource?.createdBy?.lastname,
                  ),
                  datePublished: format(new Date(resource?.createdAt), 'LLL dd, yyyy'),
                }}
                rightContent={
                  <IconButton size="small" onClick={() => window.open(resource?.file, '_blank')}>
                    <VisibilityIcon />
                  </IconButton>
                }
              />
            </Box>
          );
        })}
      </Box>
    );
  };

  return (
    <div>
      {renderResourcesCount()}
      {renderSearchField()}
      <AccessControl allowedRoles={[UserRoles.LECTURER]}>{renderResoureInput()}</AccessControl>
      <LoadingView isLoading={loading}>
        {Boolean(resources?.length) ? (
          <>
            {renderFileCard()}
            {renderPagination()}
          </>
        ) : (
          renderEmptyState()
        )}
      </LoadingView>
    </div>
  );
};

const useStyles = makeStyles(() => ({
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
      marginBottom: 34,
    },
  },
}));

export default DFAResources;
