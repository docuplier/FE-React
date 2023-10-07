import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { ReactComponent as Cancel } from 'assets/svgs/cancel.svg';
import { Button, Box, Paper, Typography, useMediaQuery } from '@material-ui/core';
import { spaces, fontWeight, fontSizes } from '../Css.js';
import LoadingButton from 'reusables/LoadingButton';
import MaxWidthContainer from 'reusables/MaxWidthContainer';

const RegistrationLayout = ({ children, title, hasHeaderButton, headerButtons, onClose }) => {
  const classes = useStyles();
  const theme = useTheme();
  const isXsScreen = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.header} square>
        <MaxWidthContainer>
          <Box
            display="flex"
            alignItems={isXsScreen ? 'flex-start' : 'center'}
            justifyContent="space-between"
            flexDirection={isXsScreen ? 'column' : 'row'}
          >
            <Box display="flex" alignItems="center">
              <Button variant="text" onClick={onClose} style={{ padding: 0, minWidth: 'auto' }}>
                <Cancel />
              </Button>
              <Typography variant="h6" className="header-text">
                {title}
              </Typography>
            </Box>
            {hasHeaderButton && (
              <div className="header-btns" display="flex">
                {headerButtons.map((headerButton, index) => (
                  <LoadingButton
                    className={classes.btn}
                    key={index}
                    disabled={headerButton.disabled}
                    variant={headerButton.variant}
                    color={headerButton.color}
                    onClick={headerButton.onClick}
                    isLoading={headerButton.isLoading}
                    disableElevation
                  >
                    {headerButton.text}
                  </LoadingButton>
                ))}
              </div>
            )}
          </Box>
        </MaxWidthContainer>
      </Paper>
      <MaxWidthContainer spacing="lg">{children}</MaxWidthContainer>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  wrapper: {
    width: '100%',
    height: '100vh',
    position: 'relative',
  },
  header: {
    padding: '15px 0px',
    '& .header-text': {
      wordWrap: 'normal',
      fontWeight: fontWeight.medium,
      marginLeft: 18,
      [theme.breakpoints.down('xs')]: {
        marginLeft: theme.spacing(4),
        fontSize: fontSizes.large,
      },
    },
    '& .header-btns': {
      '& > :last-child': {
        marginLeft: spaces.small,
      },
    },
  },
  btn: {
    [theme.breakpoints.down('xs')]: {
      marginBottom: theme.spacing(4),
      '&:nth-child(1)': {
        marginLeft: theme.spacing(2),
      },
      padding: '5px',
      fontSize: fontSizes.medium,
    },
  },
}));

RegistrationLayout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  hasHeaderButton: PropTypes.bool,
  headerButtons: PropTypes.arrayOf(
    PropTypes.shape({
      ...LoadingButton.propTypes,
      text: PropTypes.string,
    }),
  ),
  onClose: PropTypes.func.isRequired,
};

RegistrationLayout.defaultProps = {
  hasHeaderButton: false,
};

export default RegistrationLayout;
