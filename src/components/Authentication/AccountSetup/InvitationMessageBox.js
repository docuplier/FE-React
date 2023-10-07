import { makeStyles, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import { convertToSentenceCase } from 'utils/TransformationUtils';
import { colors, fontSizes, fontWeight } from '../../../Css';
import { UserRoles } from 'utils/constants';

export const InvitationMessageBox = ({ userRole, schoolName, schools, schoolAbbreviation }) => {
  const classes = useStyles();

  const getSchoolsInvitedToText = () => {
    if (userRole === UserRoles.EXECUTIVE) {
      let _schoolName = schools[0]?.name;
      let _schoolAbbreviation = schools[0]?.abbreviation;
      let suffix = schools?.length > 1 ? ` and ${schools.length - 1} other institutions.` : '.';

      return `${_schoolName} (${_schoolAbbreviation})${suffix}`;
    }

    return `${schoolName} (${schoolAbbreviation}).`;
  };

  return (
    <div className={classes.container}>
      <Typography variant="h4" className={classes.textContent}>
        You have been invited as a <strong>{convertToSentenceCase(userRole)}</strong> on the
        Learning Management System for <strong>{getSchoolsInvitedToText()}</strong> Complete your
        account setup by filling the required information
      </Typography>
    </div>
  );
};

InvitationMessageBox.propTypes = {
  userRole: PropTypes.string,
  schoolName: PropTypes.string,
  schoolAbbreviation: PropTypes.string,
  schools: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ),
};

const useStyles = makeStyles((theme) => ({
  container: {
    background: '#F0F5FF',
    border: '1px solid #80ACFF',
    boxSizing: 'border-box',
    borderRadius: '4px',
    padding: '0.75rem',
    margin: '.25rem 0 .5rem 0',
  },
  textContent: {
    fontWeight: fontWeight.regular,
    fontSize: fontSizes.medium,
    color: colors.textLight,
    lineHeight: '150%',
  },
}));
