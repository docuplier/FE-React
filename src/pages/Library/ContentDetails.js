import { memo, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
  IconButton,
} from '@material-ui/core';
import BookmarkBorderOutlinedIcon from '@material-ui/icons/BookmarkBorderOutlined';
import BookmarkOutlinedIcon from '@material-ui/icons/BookmarkOutlined';
import DeleteOutlineOutlined from '@material-ui/icons/DeleteOutlineOutlined';
import { useQuery, useMutation } from '@apollo/client';
import { useParams, useHistory, Link } from 'react-router-dom';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';

import { PrivatePaths } from 'routes';
import AssignmentDetailLayout from 'Layout/AssignmentDetailLayout';
import MaxWidthContainer from 'reusables/MaxWidthContainer';
import { borderRadius, colors, fontWeight } from '../../Css';
import { DEFAULT_PAGE_OFFSET, LibraryContentType, UserRoles } from 'utils/constants';
import MediaPlayer from 'reusables/MediaPlayer';
import { extractFileNameFromUrl, getFileExtension } from 'utils/TransformationUtils';
import LinkPreview from 'reusables/LinkPreview';
import FilePreview from 'reusables/FilePreview';
import Chip from 'reusables/Chip';
import RelatedCard from 'components/Library/ContentDetails/RelatedCard';
import { getContentImage } from 'utils/LibraryUtils';
import { useQueryPagination } from 'hooks/useQueryPagination';
import { GET_LIBRARY_CONTENT_BY_ID, GET_RELATED_CONTENTS } from 'graphql/queries/library';
import { useNotification } from 'reusables/NotificationBanner';
import LoadingView from 'reusables/LoadingView';
// import { useBookmarkLibraryContent } from 'hooks/useBookmarkLibraryContent';
import {
  BOOKMARK_CONTENT,
  DELETE_LIBRARY_CONTENT,
  REMOVE_BOOKMARK,
} from 'graphql/mutations/library';
import AccessControl from 'reusables/AccessControl';
import ConfirmationDialog from 'reusables/ConfirmationDialog';

const ContentDetails = () => {
  const classes = useStyles();
  const theme = useTheme();
  const { categoryId, contentId } = useParams();
  const notification = useNotification();
  const history = useHistory();
  const isXsScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const [isConfirmationDialogVisible, setIsConfirmationDialogVisible] = useState(false);

  const {
    data: libraryContentData,
    loading: isLoadingLibraryContent,
    refetch,
  } = useQuery(GET_LIBRARY_CONTENT_BY_ID, {
    variables: {
      contentId,
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const [bookmarkContent, { loading }] = useMutation(BOOKMARK_CONTENT, {
    onCompleted: (data) => {
      notification.success({
        message: 'Done',
      });
      refetch();
      refetchRelatedContent();
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const [removeBookmark, { isRemovingBookmark }] = useMutation(REMOVE_BOOKMARK, {
    onCompleted: (data) => {
      notification.success({
        message: 'Successfully removed from saved content',
      });
      refetch();
      refetchRelatedContent();
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const [deleteContent, { loading: isDeletingContent }] = useMutation(DELETE_LIBRARY_CONTENT, {
    onCompleted: ({ deleteLibraryContent: { ok, errors } }) => {
      if (ok) {
        notification.success({
          message: 'Library content deleted',
        });
        history.push(`${PrivatePaths.LIBRARY}/categories/${categoryId}`);
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
  });

  const handleSave = (content) => {
    const variables = {
      contentId: content.id,
    };

    content?.bookmarked
      ? removeBookmark({
          variables: {
            bookmarkInput: { contentId: content.id },
          },
        })
      : bookmarkContent({ variables });
  };

  const libraryContent = useMemo(() => {
    return libraryContentData?.libraryContent || {};
  }, [libraryContentData]);

  const {
    data: relatedContentsData,
    loading: isLoadingRelatedContents,
    refetch: refetchRelatedContent,
  } = useQueryPagination(GET_RELATED_CONTENTS, {
    variables: {
      interestId: categoryId,
      offset: DEFAULT_PAGE_OFFSET,
      limit: 5,
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });
  const relatedContents = relatedContentsData?.relatedContents?.results || [];

  const handleDeleteContent = () => {
    deleteContent({
      variables: {
        id: contentId,
      },
    });
  };

  const resource = useMemo(() => {
    const link = libraryContent?.file || libraryContent?.embeddedLink || libraryContent?.content;

    switch (libraryContent?.contentFormat) {
      case LibraryContentType.VIDEO:
      case LibraryContentType.AUDIO:
        return (
          <Box
            width="100%"
            height={libraryContent?.contentFormat === LibraryContentType.VIDEO ? 'auto' : 150}>
            <Box position="relative" paddingBottom="56.25%">
              <Box position="absolute" top={0} left={0} width="100%" height="100%">
                <MediaPlayer url={link} />
              </Box>
            </Box>
          </Box>
        );
      case LibraryContentType.PDF:
        return (
          <FilePreview
            file={{
              name: extractFileNameFromUrl(link),
              size: 0,
              type: getFileExtension(link),
              url: link,
            }}
            limitInformationToSize={true}
          />
        );
      case LibraryContentType.LINK:
        return <LinkPreview url={link} />;
      case LibraryContentType.HTML:
        return (
          <Typography
            color="textPrimary"
            variant="body2"
            dangerouslySetInnerHTML={{ __html: libraryContent?.content }}
          />
        );
      default:
        return null;
    }
  }, [libraryContent]);

  const renderContentHeader = () => {
    const BookmarkedIcon = libraryContent?.bookmarked
      ? BookmarkOutlinedIcon
      : BookmarkBorderOutlinedIcon;

    return (
      <Box display={isXsScreen ? 'block' : 'flex'} pb={12}>
        <Box className="imageContainer">
          <img
            src={getContentImage(libraryContent?.thumbnail, libraryContent?.contentFormat)}
            alt="favicon"
          />
        </Box>
        <Box ml={isXsScreen ? 0 : 12}>
          <Typography color="textPrimary" variant="h6" style={{ fontWeight: fontWeight.bold }}>
            {libraryContent?.name}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body2"
            dangerouslySetInnerHTML={{ __html: libraryContent?.description }}
          />
          <Box mt={10} display="flex">
            <Button
              isLoading={loading || isRemovingBookmark}
              variant="contained"
              className="headerButton"
              size="small"
              onClick={() => handleSave(libraryContent)}
              startIcon={
                <BookmarkedIcon color={libraryContent?.bookmarked ? 'primary' : 'inherit'} />
              }>
              Save
            </Button>
            <AccessControl allowedRoles={[UserRoles.GLOBAL_ADMIN]}>
              <Box display="flex" alignItems="center">
                <Box ml={5}>
                  <Button
                    variant="contained"
                    className="headerButton"
                    size="small"
                    onClick={() =>
                      history.push(
                        `${PrivatePaths.LIBRARY}/create-content?contentId=${libraryContent?.id}`,
                      )
                    }
                    startIcon={<CreateOutlinedIcon />}>
                    Edit Content
                  </Button>
                </Box>
                <Box ml={5}>
                  <IconButton size="small" onClick={() => setIsConfirmationDialogVisible(true)}>
                    <DeleteOutlineOutlined style={{ color: colors.error }} />
                  </IconButton>
                </Box>
              </Box>
            </AccessControl>
          </Box>
        </Box>
      </Box>
    );
  };

  const renderContentResource = () => {
    return (
      <Box py={12} className="contentResource">
        {resource}
      </Box>
    );
  };

  const renderContentTags = () => {
    return (
      <>
        <Box mt={2} display="flex" justifyContent="flex-start" alignItems="center">
          <Typography style={{ paddingRight: 5 }}>By {libraryContent?.author} | </Typography>
          <Link
            to={{ pathname: libraryContent?.source }}
            target="_blank"
            style={{ textDecoration: 'none' }}>
            {' '}
            {libraryContent?.source}
          </Link>
        </Box>
        <Box py={12} display="flex" flexWrap="wrap">
          {libraryContent?.tags?.map((tag) => (
            <Box mr={4}>
              <Chip key={tag} label={tag} roundness="sm" className="tag" />
            </Box>
          ))}
        </Box>
      </>
    );
  };

  const renderContent = () => {
    return (
      <Grid item xs={12} md={7} className={classes.content}>
        <Box>
          {renderContentHeader()}
          {renderContentResource()}
          {renderContentTags()}
        </Box>
      </Grid>
    );
  };

  const renderRelated = () => {
    return (
      <Grid item xs={12} md={4}>
        <Typography color="textPrimary" style={{ fontWeight: fontWeight.bold }} variant="h6">
          Related
        </Typography>
        {relatedContents.map((related) => {
          return (
            <Box mt={8}>
              <RelatedCard
                key={related.id}
                id={related.id}
                title={related.name}
                viewsCount={related.viewCount}
                saved={related.bookmarked}
                onClickSave={(id) => handleSave(related)}
                to={`${PrivatePaths.LIBRARY}/categories/${categoryId}/contents/${related.id}`}
              />
            </Box>
          );
        })}
      </Grid>
    );
  };

  return (
    <AssignmentDetailLayout
      withMaxWidth={false}
      links={[
        { title: 'Library', to: PrivatePaths.LIBRARY },
        {
          title:
            libraryContent?.fieldOfInterests?.length && libraryContent?.fieldOfInterests[0]?.name,
          to: `${PrivatePaths.LIBRARY}/categories/${categoryId}`,
        },
      ]}>
      <MaxWidthContainer>
        <LoadingView isLoading={isLoadingLibraryContent || isLoadingRelatedContents}>
          <Box mt={24} pb={24}>
            <Grid container>
              {renderContent()}
              <Grid item xs={1} />
              {renderRelated()}
            </Grid>
          </Box>
        </LoadingView>
      </MaxWidthContainer>
      <ConfirmationDialog
        title={`Are you sure you want to delete this content?`}
        description="Deleting this content is irreversible"
        okText="Delete Content"
        onOk={handleDeleteContent}
        okButtonProps={{
          isLoading: isDeletingContent,
          danger: true,
        }}
        onClose={() => {
          setIsConfirmationDialogVisible(false);
        }}
        open={isConfirmationDialogVisible}
      />
    </AssignmentDetailLayout>
  );
};

const useStyles = makeStyles((theme) => ({
  content: {
    '& .headerButton': {
      color: colors.grey,
    },
    '& .imageContainer': {
      width: 168,
      minWidth: 128,
      height: 128,
      borderRadius: borderRadius.default,
      '& img': {
        width: '100%',
        height: '100%',
        borderRadius: borderRadius.default,
        objectFit: 'cover',
      },
      [theme.breakpoints.down('xs')]: {
        width: '100%',
      },
    },
    '& .contentResource': {
      borderTop: `1px solid ${colors.secondaryLightGrey}`,
      borderBottom: `1px solid ${colors.secondaryLightGrey}`,
    },
    '& .tag': {
      background: colors.secondaryLightGrey,
    },
  },
}));

export default memo(ContentDetails);
