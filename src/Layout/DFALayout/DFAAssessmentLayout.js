import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';
import MaxWidthContainer from 'reusables/MaxWidthContainer';
import { colors, fontSizes } from '../../Css';

const DFAAssessmentLayout = (props) => {
  const { headerText, children, withMaxWidth } = props;
  const classes = useStyles();

  const renderBody = () => {
    const content = (
      <Box my={20}>
        {headerText && <Box className="header-text">{headerText}</Box>}
        {children}
      </Box>
    );

    if (withMaxWidth) {
      return <MaxWidthContainer>{content}</MaxWidthContainer>;
    }

    return children;
  };

  return (
    <div className={classes.wrapper}>
      <Box className={classes.mainContent}>{renderBody()}</Box>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  wrapper: {
    background: colors.background,
    width: '100vw',
    minHeight: '100vh',
  },
  header: {
    background: 'linear-gradient(98.68deg, #041E44 14.09%, #0050C8 140.86%)',
    width: '100%',
    color: colors.white,
    minHeight: 51,
  },
  mainContent: {
    width: '100%',
    minHeight: '100vh',
    height: '100%',
    '& .header-text': {
      color: colors.primary,
      fontSize: fontSizes.large,
      marginBottom: 24,
    },
  },
}));

DFAAssessmentLayout.propTypes = {
  headerText: PropTypes.node,
  children: PropTypes.element,
  withMaxWidth: PropTypes.bool,
};

DFAAssessmentLayout.defaultProps = {
  withMaxWidth: true,
};

export default DFAAssessmentLayout;
