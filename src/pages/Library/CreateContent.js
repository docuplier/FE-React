import { memo, useState, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@apollo/client';

import { DEFAULT_PAGE_OFFSET, LibraryContentType } from 'utils/constants';
import { useNotification } from 'reusables/NotificationBanner';
import { GET_FIELD_OF_INTERESTS, GET_LIBRARY_CONTENT_BY_ID } from 'graphql/queries/library';
import { CREATE_LIBRARY_CONTENT, UPDATE_LIBRARY_CONTENT } from 'graphql/mutations/library';
import {
  parseClientResourceToServerTypes,
  transformServerResourceToFormValue,
} from 'utils/LibraryUtils';
import CreateContentForm from 'components/Library/CreateContent/CreateContentForm';
import LoadingView from 'reusables/LoadingView';

const CreateContent = () => {
  const history = useHistory();
  const notification = useNotification();
  const [selectedInterests, setSelectedInterests] = useState([]);
  const params = new URLSearchParams(useLocation().search);
  const contentId = params.get('contentId');
  const categoryId = params.get('categoryId');
  const { control, errors, reset, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      contentFormat: LibraryContentType.VIDEO,
      categoryId,
    },
  });
  const contentFormat = watch('contentFormat');
  const resourceKeyValueStoreRef = useRef({});

  const { data: fieldOfInterestsData, loading: isLoadingInterests } = useQuery(
    GET_FIELD_OF_INTERESTS,
    {
      variables: {
        offset: DEFAULT_PAGE_OFFSET,
        limit: 100,
        asFilter: true,
      },
      onError: (error) => {
        notification.error({
          message: error?.message,
        });
      },
    },
  );

  const { loading } = useQuery(GET_LIBRARY_CONTENT_BY_ID, {
    variables: {
      contentId,
    },
    skip: !contentId,
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
    onCompleted: ({
      libraryContent: {
        name,
        author,
        description,
        thumbnail,
        source,
        tags,
        fieldOfInterests,
        contentFormat,
        content,
        embeddedLink,
        file,
      },
    }) => {
      setSelectedInterests(fieldOfInterests);
      reset({
        name,
        author,
        description: { html: description, editorState: null },
        thumbnail: thumbnail ? { name: thumbnail } : null,
        source: source,
        tags: tags || [],
        categoryId: selectedInterests,
        contentFormat,
        resource: setResource({
          contentFormat,
          content,
          embeddedLink,
          file,
        }),
      });
    },
  });

  const [createLibraryContent, { loading: isLoadingCreateLibraryContent }] = useMutation(
    CREATE_LIBRARY_CONTENT,
    {
      onCompleted: ({ createLibraryContent: { ok, errors } }) => {
        if (ok) {
          notification.success({
            message: 'Library content created successfully',
          });
          history.goBack();
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

  const [updateLibraryContent, { loading: isLoadingUpdateLibraryContent }] = useMutation(
    UPDATE_LIBRARY_CONTENT,
    {
      onCompleted: ({ updateLibraryContent: { ok, errors } }) => {
        if (ok) {
          notification.success({
            message: 'Library content updated successfully',
          });
          history.goBack();
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

  const onSubmit = (values) => {
    const upsertMutation = contentId ? updateLibraryContent : createLibraryContent;
    const thumbnail = values.thumbnail instanceof File ? values.thumbnail : undefined;
    const { file, embeddedLink, content } = parseClientResourceToServerTypes({
      contentFormat,
      formValue: values.resource,
    });
    const _file = file instanceof File ? file : undefined;

    upsertMutation({
      variables: {
        newLibrarycontent: {
          name: values.name,
          author: values.author,
          description: values.description?.html,
          source: values.source,
          tags: values.tags,
          fieldOfInterests:
            values.categoryId.length === 0
              ? selectedInterests?.map((field) => field?.id)
              : values.categoryId,
          contentFormat: values.contentFormat,
          content,
          embeddedLink,
        },
        thumbnail,
        file: _file,
        id: contentId,
      },
    });
  };

  const setResource = ({ contentFormat, content, embeddedLink, file }) => {
    let value = transformServerResourceToFormValue({
      contentFormat,
      content,
      embeddedLink,
      file,
    });
    resourceKeyValueStoreRef.current[contentFormat] = value;

    return value;
  };

  const getResource = (key) => {
    let resource = resourceKeyValueStoreRef.current[key];

    if (key === LibraryContentType.HTML) {
      resource = { html: resource?.html || '', editorState: null };
    }
    return resource || null;
  };

  const handleChangeContentFormat = (evt) => {
    reset({
      contentFormat: evt.target.value,
      resource: getResource(evt.target.value),
    });
  };

  const handleChangeResource = (value) => {
    setValue('resource', value);
    resourceKeyValueStoreRef.current[contentFormat] = value;
  };

  return (
    <LoadingView isLoading={loading}>
      <CreateContentForm
        formProps={{
          control,
          errors,
        }}
        onChangeContentFormat={handleChangeContentFormat}
        onChangeResource={handleChangeResource}
        onSubmit={handleSubmit(onSubmit)}
        loading={isLoadingCreateLibraryContent || isLoadingUpdateLibraryContent}
        fieldOfInterests={fieldOfInterestsData?.fieldOfInterests?.results || []}
        loadingFieldOfInterest={isLoadingInterests}
        contentFormat={contentFormat}
        selectedInterests={selectedInterests}
      />
    </LoadingView>
  );
};

export default memo(CreateContent);
