import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Button, Typography } from '@material-ui/core';
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';

import FeedbackBase from './FeedbackBase';

const Reply = ({
  comment,
  likeCount,
  onClickLike,
  datePublished,
  creator,
  liked,
  noBorder,
  hideLike,
}) => {
  const { firstname, lastname } = creator || {};

  const handleLikeClick = (evt) => {
    evt.stopPropagation();
    onClickLike();
  };

  const renderFooterLeftContent = () => {
    return format(new Date(datePublished), 'LLL dd, yyyy');
  };

  const renderFooterRightContent = () => {
    const Icon = liked ? ThumbUpAltIcon : ThumbUpAltOutlinedIcon;

    return !hideLike ? (
      <Button onClick={handleLikeClick}>
        <Typography component="a" variant="body2" color="primary">
          <Icon className="icon" />
          {likeCount} likes
        </Typography>
      </Button>
    ) : null;
  };

  return (
    <FeedbackBase
      title={`${lastname} ${firstname}`}
      description={comment}
      creator={creator}
      noBorder={noBorder}
      footerLeftContent={renderFooterLeftContent()}
      footerRightContent={renderFooterRightContent()}
    />
  );
};

Reply.propTypes = {
  comment: PropTypes.string,
  likeCount: PropTypes.number,
  onClickLike: PropTypes.number,
  datePublished: PropTypes.string,
  creator: PropTypes.shape({
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    imgSrc: PropTypes.string,
  }),
  liked: PropTypes.bool,
  noBorder: PropTypes.bool,
  hideLike: PropTypes.bool,
};

export default React.memo(Reply);
