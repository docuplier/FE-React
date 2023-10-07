import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React from 'react';
import MaxWidthContainer from 'reusables/MaxWidthContainer';
import { colors, fontSizes } from '../../Css';
import DFABreadcrumb from 'reusables/DFABreadcrumb';

const DFAAssignmentDetailLayout = (props) => {
  const { links, headerText, children, isLoading, withMaxWidth } = props;
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
      <Box className={classes.header}>
        <MaxWidthContainer spacing="sm">
          {!isLoading && <DFABreadcrumb links={links} />}
        </MaxWidthContainer>
      </Box>
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
    background: 'linear-gradient(100deg, #267939 28.96%, #3EBB5A 147.29%)',
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

DFAAssignmentDetailLayout.propTypes = {
  headerText: PropTypes.node,
  children: PropTypes.element,
  links: DFABreadcrumb.propTypes,
  withMaxWidth: PropTypes.bool,
};

DFAAssignmentDetailLayout.defaultProps = {
  withMaxWidth: true,
};

export default DFAAssignmentDetailLayout;
