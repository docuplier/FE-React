import { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, TextField, Box } from '@material-ui/core';
import Empty from 'reusables/Empty';
import FilterControl from 'reusables/FilterControl';
import FilePreview from 'reusables/FilePreview';
import { OffsetLimitBasedPagination } from 'reusables/Pagination';
import { useQueryPagination } from 'hooks/useQueryPagination';
import { GET_COURSE_RESOURCES } from 'graphql/queries/courses';
import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET } from 'utils/constants';
import { useNotification } from 'reusables/NotificationBanner';
import LoadingView from 'reusables/LoadingView';
import { extractFileNameFromUrl } from 'utils/TransformationUtils';

const Resources = ({ currentLectureId, courseId }) => {
  const notification = useNotification();
  const [queryParams, setQueryParams] = useState({
    search: '',
    offset: DEFAULT_PAGE_OFFSET,
    limit: DEFAULT_PAGE_LIMIT,
    datePublished: null,
    courseId,
    lectureId: currentLectureId,
  });

  const { data, loading } = useQueryPagination(GET_COURSE_RESOURCES, {
    variables: queryParams,
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });
  const resources = data?.resources?.results || [];

  const handleChangeQueryParams = (changeset) => {
    setQueryParams((prevState) => ({
      ...prevState,
      ...changeset,
    }));
  };

  const renderEmptyState = () => {
    return (
      <Empty
        title={'No Resources'}
        description={'No Resources have been published for this course.'}></Empty>
    );
  };

  const renderFilterControl = () => {
    return (
      <Box my={12}>
        <FilterControl
          paper
          searchInputProps={{
            colSpan: {
              xs: 12,
              sm: 9,
            },
            onChange: (evt) =>
              handleChangeQueryParams({
                search: evt.target.value,
                offset: DEFAULT_PAGE_OFFSET,
              }),
          }}
          renderCustomFilters={
            <Grid item xs={12} sm={3}>
              <TextField
                defaultValue=""
                label="Post date"
                placeholder="Post date"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                variant="outlined"
                onChange={(evt) =>
                  handleChangeQueryParams({
                    datePublished: evt.target.value,
                    offset: DEFAULT_PAGE_OFFSET,
                  })
                }
              />
            </Grid>
          }
        />
      </Box>
    );
  };

  const renderResources = () => {
    return (
      <>
        {resources.map((resource, i) => {
          let {
            createdBy: { firstname, lastname },
          } = resource;

          return (
            <Box mt={i !== 0 && 4}>
              <FilePreview
                key={resource.id}
                file={{
                  name: extractFileNameFromUrl(resource.file),
                  type: resource.contentType,
                  size: resource.size,
                  url: resource.file,
                }}
                metaData={{
                  author: `${lastname} ${firstname}`,
                  datePublished: resource.createdAt,
                }}
              />
            </Box>
          );
        })}
        <Box mt={12}>
          <OffsetLimitBasedPagination
            total={data?.resources?.totalCount}
            onChangeLimit={(_offset, limit) =>
              handleChangeQueryParams({
                offset: DEFAULT_PAGE_OFFSET,
                limit,
              })
            }
            onChangeOffset={(offset) => handleChangeQueryParams({ offset })}
            offset={queryParams.offset}
            limit={queryParams.limit}
          />
        </Box>
      </>
    );
  };

  return (
    <div>
      <LoadingView isLoading={loading}>
        {renderFilterControl()}
        {Boolean(resources?.length) ? renderResources() : renderEmptyState()}
      </LoadingView>
    </div>
  );
};

Resources.propTypes = {
  currentLectureId: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
};

export default memo(Resources);
