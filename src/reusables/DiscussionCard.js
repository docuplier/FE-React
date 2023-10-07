import React from 'react';
import { Box, Avatar, Typography, Button, IconButton } from '@material-ui/core';
import AutoLinkText from 'react-autolink-text2';
import { ThumbUp, ThumbUpAltOutlined, ChatBubbleOutline } from '@material-ui/icons';
import { getNameInitials } from 'utils/UserUtils';
import { convertIsoDateTimeToDateTime } from 'utils/TransformationUtils';
import { ImageUploadFormats } from 'utils/constants';
import { TOGGLE_LIKE } from 'graphql/mutations/task';
import { useNotification } from 'reusables/NotificationBanner';
import { useMutation } from '@apollo/client';
import FilePreview from 'reusables/FilePreview';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { formatFileName, getFileExtension } from 'utils/TransformationUtils';
import { ReactComponent as DownloadIcon } from 'assets/svgs/download-ic.svg';

const DiscussionCard = ({ descussion, onClick, descussionId, refetch, type, disabled }) => {
  const notification = useNotification();

  const [toggleLike] = useMutation(TOGGLE_LIKE, {
    onCompleted: (data) => {
      notification.success({
        message: data?.toggleLike?.newLike?.id ? 'Liked' : 'Unlike',
      });
      refetch();
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const upsertLike = (typeId) => {
    toggleLike({
      variables: {
        newLike: {
          typeId,
          likeType: type,
        },
      },
    });
  };

  const downloadFile = (file) => {
    const link = document.createElement('a');
    link.href = file;
    link.setAttribute('target', '_blank');
    link.setAttribute('download', file);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <Box bgcolor={'inherit'} width="100%">
      <Box key={descussion?.id} display="flex" justifyContent="flex-start" mt={12}>
        <Avatar src={descussion?.createdBy?.image} onClick={onClick}>
          {getNameInitials(
            descussion?.createdBy?.lastname || '',
            descussion?.createdBy?.firstname || '',
          )}
        </Avatar>
        <Box ml={12} width="100%">
          <Box style={{ cursor: 'pointer' }}>
            <Typography
              variant="body1"
              style={{ fontWeight: 'bold' }}
              color="textPrimary"
              onClick={onClick}>
              {descussion?.createdBy?.firstname
                ? `${descussion?.createdBy?.firstname} ${descussion?.createdBy?.lastname}`
                : descussion?.title}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              <AutoLinkText
                text={descussion?.message || descussion?.reply}
                linkProps={{ target: '_blank' }}
              />
            </Typography>
            {descussion?.file &&
              (ImageUploadFormats.includes(descussion?.file?.split('.')?.slice(-1)[0]) ? (
                <Box onClick={onClick}>
                  <img
                    style={{
                      margin: '24px 0',
                      width: '250px',
                      height: '250px',
                    }}
                    src={descussion?.file}
                    alt={descussion?.file}
                  />
                </Box>
              ) : (
                <Box mt={4} onClick={(e) => e.stopPropagation()}>
                  <FilePreview
                    file={{
                      name: formatFileName(descussion?.file),
                      type: getFileExtension(descussion?.file),
                      size: descussion.size,
                      url: descussion.file,
                    }}
                    limitInformationToSize={true}
                    rightContent={
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <IconButton
                          size="small"
                          onClick={() => window.open(descussion?.file, '_blank')}>
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          style={{ marginLeft: 8 }}
                          onClick={() => downloadFile(descussion?.file)}>
                          <DownloadIcon />
                        </IconButton>
                      </Box>
                    }
                  />
                </Box>
              ))}
          </Box>
          <Box width={'100%'} display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography>{convertIsoDateTimeToDateTime(descussion?.createdAt)}</Typography>
            </Box>
            <Box display="flex" justifyContent="flex-start" alignItems="center" mt={8}>
              <Button
                disabled={disabled}
                onClick={() => upsertLike(descussion?.id)}
                variant="outlined"
                color="primary"
                style={{ marginRight: 16, border: 'none' }}>
                {descussion?.liked ? (
                  <ThumbUp style={{ marginRight: 8 }} />
                ) : (
                  <ThumbUpAltOutlined style={{ marginRight: 8 }} />
                )}{' '}
                {descussion?.totalLikes} Likes
              </Button>
              {!descussionId && (
                <Button
                  onClick={onClick}
                  style={{ border: 'none' }}
                  variant="outlined"
                  color="primary">
                  <ChatBubbleOutline style={{ marginRight: 8 }} /> {descussion?.totalReplies}{' '}
                  Replies
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DiscussionCard;
