import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Box, makeStyles, Typography, Button } from '@material-ui/core';
import classNames from 'classnames';

import { colors, fontSizes } from '../../../Css';
import { getNameInitials } from 'utils/UserUtils';

const FeedbackBase = ({
  title,
  description,
  creator,
  footerLeftContent,
  footerRightContent,
  hideAvatar,
  onClick,
  noBorder,
  backgroundColor,
}) => {
  const classes = useStyles({ noBorder, backgroundColor });
  const { firstname, lastname, imgSrc } = creator || {};

  const renderTitle = () => {
    return (
      <Typography variant="body1" color="textPrimary">
        {title}
      </Typography>
    );
  };

  const renderFooter = () => {
    return (
      <Box
        mt={8}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        className={classes.footer}>
        <Typography variant="body2" color="primary" component="span">
          {footerLeftContent}
        </Typography>
        <Box>{footerRightContent}</Box>
      </Box>
    );
  };

  return (
    <Button onClick={onClick} className={classNames(classes.container, classes.clickableButton)}>
      <Box display="flex" py={8} pr={8} width="100%" className="content">
        {!hideAvatar && <Avatar src={imgSrc}>{getNameInitials(firstname, lastname)}</Avatar>}
        <Box ml={!hideAvatar && 8} width="100%">
          {renderTitle()}
          <Box mt={4}>
            <Typography
              variant="body2"
              color="textSecondary"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </Box>
          {renderFooter()}
        </Box>
      </Box>
    </Button>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    padding: 0,
    textAlign: 'initial',
    minHeight: 'max-content',
    '&:hover': {
      background: (props) => props.backgroundColor || colors.background,
    },
    '& .content': {
      borderBottom: (props) => (props.noBorder ? 0 : `1px solid ${colors.secondaryLightGrey}`),
    },
  },
  footer: {
    '& button.MuiButtonBase-root': {
      padding: 0,
      textAlign: 'initial',
      minHeight: 'max-content',
    },
    '& .MuiSvgIcon-root': {
      fontSize: fontSizes.medium,
      marginRight: theme.spacing(4),
    },
  },
}));

FeedbackBase.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  creator: PropTypes.shape({
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    imgSrc: PropTypes.string,
  }),
  footerLeftContent: PropTypes.node,
  footerRightContent: PropTypes.node,
  onClick: PropTypes.bool,
  noBorder: PropTypes.bool,
  hideAvatar: PropTypes.bool,
  backgroundColor: PropTypes.string,
};

export default React.memo(FeedbackBase);
