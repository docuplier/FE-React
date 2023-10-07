import { memo, useState } from 'react';
import { Box } from '@material-ui/core';
import { format } from 'date-fns';
import { useLocation, useHistory } from 'react-router-dom';

import AssignmentDetailLayout from 'Layout/AssignmentDetailLayout';
import MaxWidthContainer from 'reusables/MaxWidthContainer';
import { PrivatePaths } from 'routes';
import FilterControl from 'reusables/FilterControl';
import ResourceTable from 'reusables/ResourceTable';
import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET } from 'utils/constants';
import UpsertCategoryDrawer from 'components/Library/UpsertCategoryDrawer';
import ConfirmationDialog from 'reusables/ConfirmationDialog';
import { useQueryPagination } from 'hooks/useQueryPagination';
import { GET_FIELD_OF_INTERESTS } from 'graphql/queries/library';
import { useNotification } from 'reusables/NotificationBanner';
import { useMutation } from '@apollo/client';
import { DELETE_FIELD_OF_INTEREST } from 'graphql/mutations/library';

const Categories = () => {
  const { pathname } = useLocation();
  const history = useHistory();
  const notification = useNotification();
  const [isCategoryDrawerVisible, setIsCategoryDrawerVisible] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(false);
  const [queryParams, setQueryParams] = useState({
    search: undefined,
    limit: DEFAULT_PAGE_LIMIT,
    offset: DEFAULT_PAGE_OFFSET,
  });

  const { data, loading, refetch } = useQueryPagination(GET_FIELD_OF_INTERESTS, {
    variables: queryParams,
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const [deleteCategory, { loading: isLoadingDeleteCategory }] = useMutation(
    DELETE_FIELD_OF_INTEREST,
    {
      onCompleted: ({ deleteFieldOfInterest: { ok, errors } }) => {
        if (ok) {
          notification.success({
            message: `${categoryToDelete.name} deleted successfully`,
          });
          setCategoryToDelete(null);
          refetch();
          return;
        }

        notification.error({
          message: errors.map((error) => error.messages).join('. '),
        });
      },
      onError: (error) => {
        notification.error({
          message: error?.message,
        });
      },
    },
  );

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: '30%',
    },
    {
      title: 'Items',
      dataIndex: 'contentCount',
      sorter: true,
    },
    {
      title: 'Date created',
      dataIndex: 'createdAt',
      sorter: true,
      render: (text) => format(new Date(text), 'MMM dd, yyyy'),
    },
    {
      title: 'Last Modified',
      dataIndex: 'updatedAt',
      sorter: true,
      render: (text) => format(new Date(text), 'MMM dd, yyyy'),
    },
    {
      title: 'No. of views',
      dataIndex: 'numberOfView',
      sorter: true,
      render: (text) => text || 0,
    },
  ];

  const handleChangeQueryParams = (changeset) => {
    setQueryParams((prevState) => ({
      ...prevState,
      ...changeset,
    }));
  };

  const handleSelectOption = (option, data) => {
    switch (option) {
      case 'Edit':
        setCategoryToEdit(data);
        setIsCategoryDrawerVisible(true);
        break;
      case 'Delete':
        setCategoryToDelete(data);
        break;
      default:
        break;
    }
  };

  const handleDeleteCategory = () => {
    deleteCategory({
      variables: {
        id: categoryToDelete?.id,
      },
    });
  };

  const renderFilterControl = () => {
    return (
      <FilterControl
        okButtonProps={{
          isLoading: false,
          children: 'Add Category',
          color: 'primary',
          onClick: () => setIsCategoryDrawerVisible(true),
        }}
        searchInputProps={{
          onChange: (evt) => handleChangeQueryParams({ search: evt.target.value }),
          colSpan: {
            xs: 12,
          },
        }}
      />
    );
  };

  return (
    <AssignmentDetailLayout
      withMaxWidth={false}
      links={[{ title: 'Library', to: PrivatePaths.LIBRARY }]}>
      <MaxWidthContainer>
        <Box mt={24} pb={24}>
          <ResourceTable
            columns={columns}
            loading={loading}
            dataSource={data?.fieldOfInterests?.results || []}
            options={['Edit', 'Delete']}
            onSelectOption={handleSelectOption}
            onRow={(record) => {
              return {
                onClick: (_evt) => history.push(`${pathname}/${record.id}`),
              };
            }}
            filterControl={renderFilterControl()}
            pagination={{
              total: data?.fieldOfInterests?.totalCount,
              onChangeLimit: (_offset, limit) =>
                handleChangeQueryParams({ limit, offset: DEFAULT_PAGE_OFFSET }),
              onChangeOffset: (offset) => handleChangeQueryParams({ offset }),
              limit: queryParams.limit,
              offset: queryParams.offset,
            }}
          />
        </Box>
      </MaxWidthContainer>
      <UpsertCategoryDrawer
        open={isCategoryDrawerVisible}
        onClose={() => setIsCategoryDrawerVisible(false)}
        categoryId={categoryToEdit?.id}
        onCompletedCallback={() => refetch()}
      />
      <ConfirmationDialog
        open={Boolean(categoryToDelete)}
        onClose={() => setCategoryToDelete(null)}
        title={`Are you sure you want to delete ${categoryToDelete?.name}?`}
        description="Please make sure you have deleted all the contents for this category"
        okText="Delete Category"
        onOk={handleDeleteCategory}
        okButtonProps={{
          isLoading: isLoadingDeleteCategory,
          danger: true,
        }}
      />
    </AssignmentDetailLayout>
  );
};

export default memo(Categories);
