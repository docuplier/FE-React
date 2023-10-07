import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Box, Typography } from '@material-ui/core';
// import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
// import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ModeCommentOutlinedIcon from '@material-ui/icons/ModeCommentOutlined';

import { spaces } from '../../../Css';
import FeedbackBase from './FeedbackBase';

const Question = ({
  title,
  description,
  likeCount,
  onClickLike,
  repliesCount,
  datePublished,
  lectureTitle,
  creator,
  liked,
  onClick,
  noBorder,
  hideAvatar,
  backgroundColor,
}) => {
  // const handleLikeClick = (evt) => {
  //   evt.stopPropagation();
  //   onClickLike();
  // };

  const renderFooterLeftContent = () => {
    return `${lectureTitle} • ${format(new Date(datePublished), 'LLL dd, yyyy')}`;
  };

  const renderFooterRightContent = () => {
    // const Icon = liked ? ThumbUpAltIcon : ThumbUpAltOutlinedIcon;

    return (
      <Box>
        {/* <Button onClick={handleLikeClick}>
          <Typography component="a" variant="body2" color="primary">
            <Icon />
            {likeCount} likes
          </Typography>
        </Button> */}
        <Typography
          component="a"
          variant="body2"
          color="primary"
          style={{ marginLeft: spaces.medium }}>
          <ModeCommentOutlinedIcon />
          {repliesCount} replies
        </Typography>
      </Box>
    );
  };

  return (
    <FeedbackBase
      backgroundColor={backgroundColor}
      title={title}
      description={description}
      hideAvatar={hideAvatar}
      creator={creator}
      onClick={onClick}
      noBorder={noBorder}
      footerLeftContent={renderFooterLeftContent()}
      footerRightContent={renderFooterRightContent()}
    />
  );
};

Question.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  likeCount: PropTypes.number,
  onClickLike: PropTypes.number,
  repliesCount: PropTypes.number,
  datePublished: PropTypes.string,
  lectureTitle: PropTypes.string,
  creator: PropTypes.shape({
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    imgSrc: PropTypes.string,
  }),
  liked: PropTypes.bool,
  onClick: PropTypes.bool,
  noBorder: PropTypes.bool,
  hideAvatar: PropTypes.bool,
  backgroundColor: PropTypes.string,
};

export default React.memo(Question);
