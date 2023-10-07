import { memo } from 'react';
import PropTypes from 'prop-types';
import { Box, Radio, Button, Typography, makeStyles } from '@material-ui/core';

import { ReactComponent as EnvelopeIcon } from 'assets/svgs/envelope-outlined.svg';
import { ReactComponent as PhoneIcon } from 'assets/svgs/phone-outlined.svg';
import { convertToSentenceCase } from 'utils/TransformationUtils';

export const AuthenticationMethod = {
  EMAIL: 'EMAIL',
  PHONE: 'PHONE',
};

const AuthenticationMethodPanel = ({ method, checked, onClick, value }) => {
  const classes = useStyles();

  return (
    <Button
      className={classes.container}
      variant="outlined"
      color={checked ? 'primary' : 'default'}
      onClick={() => onClick(!checked)}>
      <Box p={12}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {method === AuthenticationMethod.EMAIL ? <EnvelopeIcon /> : <PhoneIcon />}
          <Radio color="primary" checked={checked} />
        </Box>
        <Box my={6}>
          <Typography variant="body1" color="textPrimary">
            {convertToSentenceCase(method)} Authentication
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Send OTP to the{' '}
            {method === AuthenticationMethod.EMAIL ? 'email address' : 'phone number'} below
          </Typography>
        </Box>
        <Box mt={6}>
          <Typography variant="body2" color="textPrimary">
            {value}
          </Typography>
        </Box>
      </Box>
    </Button>
  );
};

const useStyles = makeStyles({
  container: {
    padding: 0,
    width: '100%',
    height: '100%',
    textAlign: 'initial',
  },
});

AuthenticationMethodPanel.propTypes = {
  method: PropTypes.oneOf(Object.values(AuthenticationMethod)),
  checked: PropTypes.bool,
  onClick: PropTypes.func,
  value: PropTypes.string.isRequired,
};

export default memo(AuthenticationMethodPanel);
