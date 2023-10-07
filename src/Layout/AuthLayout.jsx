import { Box, makeStyles, Paper, Typography } from '@material-ui/core';
import Background from 'assets/svgs/auth-background.svg';
import BackgroundBottom from 'assets/svgs/auth-bottom.svg';
import PropTypes from 'prop-types';
import React from 'react';
import { colors } from '../Css';

const AuthLayout = ({ children, imageSrc, title, description, renderSecondaryContent }) => {
  const classes = useStyles();

  const renderTopSection = () => {
    return (
      <Box className={classes.header}>
        <img src={imageSrc} alt={imageSrc} style={{ width: 200 }} />
        <Typography variant="h5" color="textPrimary" className="title">
          {title}
        </Typography>
        {description && (
          <Typography variant="body1" color="textSecondary" className="description">
            {description}
          </Typography>
        )}
      </Box>
    );
  };

  return (
    <Box width="100%" minHeight="100vh" pt={40} className={classes.container}>
      <Box width="100%" className={classes.contentContainer}>
        <Paper className={classes.formContainer}>
          {renderTopSection()}
          {children}
        </Paper>
        {renderSecondaryContent && (
          <Paper className={classes.secondaryContent}>{renderSecondaryContent}</Paper>
        )}
      </Box>
      <img src={BackgroundBottom} alt="footer layoutImage" className={classes.authBottom} />
    </Box>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'relative',
    background: `url('${Background}') no-repeat`,
    backgroundSize: 'cover',
    boxSizing: 'border-box',
    width: '100%',
    height: '100%',
    '& > *': {
      boxSizing: 'border-box',
    },
  },
  contentContainer: {
    position: 'relative',
    maxWidth: 600,
    margin: 'auto',
    paddingBottom: theme.spacing(15),
    zIndex: 2,
    [theme.breakpoints.down('xs')]: {
      maxWidth: '100%',
    },
  },
  authBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    zIndex: 1,
  },
  formContainer: {
    boxShadow: ' 0px 1px 3px rgba(0, 0, 0, 0.1)',
    padding: theme.spacing(25),
    textAlign: 'center',
    boxSizing: 'border-box',
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(10),
    },
  },
  secondaryContent: {
    justifyContent: 'space-between',
    background: colors.white,
    padding: theme.spacing(10),
    marginTop: 10,
    textAlign: 'left',
    borderRadius: 3,
    overflow: 'wrap',
  },

  header: {
    '& .title': {
      paddingTop: theme.spacing(10),
      paddingBottom: theme.spacing(5),
    },
    '& .description': {
      paddingBottom: theme.spacing(15),
    },
  },
}));

AuthLayout.propTypes = {
  children: PropTypes.node,
  imageSrc: PropTypes.string,
  title: PropTypes.node,
  description: PropTypes.node,
  renderSecondaryContent: PropTypes.node,
};

export default React.memo(AuthLayout);
