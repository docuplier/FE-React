import React, { useState } from 'react';
import logoSvg from 'assets/svgs/dslmsLogo.jpeg';
import { PublicPaths } from 'routes';
import AuthLayout from 'Layout/AuthLayout';
import { Box, makeStyles, Typography, Paper, TextField, Checkbox } from '@material-ui/core';
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';

import { colors, spaces } from '../../Css';
import LoadingButton from 'reusables/LoadingButton';
import { useHistory, useLocation } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { useNotification } from 'reusables/NotificationBanner';
import { GET_EXISTING_USER } from 'graphql/queries/auth';
import LoadingView from 'reusables/LoadingView';
import { UPDATE_EXISTING_USER } from 'graphql/mutations/users';
import useSubdomain from 'hooks/useSubDomain';

const defaultValue = { firstname: '', lastname: '', email: '', phone: '' };
const ExistingUserDataVerifyPage = () => {
  const classes = useStyles();
  const [userData, setUserData] = useState(defaultValue);
  const [checkboxValue, setCheckboxValue] = useState(false);
  const history = useHistory();
  const urlParams = new URLSearchParams(useLocation().search);
  const identifier = urlParams.get('identifier');
  const existing = urlParams.get('exiting');
  const notification = useNotification();
  const { domainObject } = useSubdomain();
  const institutionId = domainObject?.id;

  const { data: existingUserData, loading: isLoadingExistingUser } = useQuery(GET_EXISTING_USER, {
    variables: {
      accountType: existing ? 'MIGRATION' : 'USER',
      identifier,
      institutionId,
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
    onCompleted: ({ existingUser }) => {
      if (existingUser) {
        setUserData({
          firstname: existingUser?.firstname,
          lastname: existingUser?.lastname,
          email: existingUser?.email,
          phone: existingUser?.phone,
        });
      }
    },
  });

  const [updateUser, { loading }] = useMutation(UPDATE_EXISTING_USER, {
    onCompleted: (data) => {
      notification.success({
        message: 'user information updated successfully',
      });
      history.push(
        `${PublicPaths.EXISTING_USER_OTP_VERIFICATION}/?identifier=${identifier}&existingUser=true`,
      );
    },
    onError: (error) => {
      notification.error({
        message: error.message,
      });
    },
  });

  const onProceed = () => {
    updateUser({
      variables: {
        existingUserEmail: userData?.email,
        existingUserId: existingUserData?.existingUser?.id,
        existingUserPhone: userData?.phone,
      },
    });
  };

  const renderMatricNumber = () => {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        component={Paper}
        elevation={0}
        py={4}
        mb={12}
        className={classes.matricNumber}>
        <Typography component="span" color="textPrimary" variant="body2">
          {identifier}
        </Typography>
        <Box ml={2}>
          <CheckCircleOutlineOutlinedIcon className="checkIcon" />
        </Box>
      </Box>
    );
  };

  return (
    <AuthLayout
      imageSrc={logoSvg}
      title="Setup your account"
      description="Enter your details to proceed">
      <LoadingView isLoading={isLoadingExistingUser}>
        <Box>
          {renderMatricNumber()}
          <form className={classes.form}>
            <TextField
              variant="outlined"
              fullWidth
              style={{ backgroundColor: '#F6F7F7' }}
              disabled
              label="First Name"
              value={userData.firstname}
              onChange={(e) => setUserData({ ...userData, firstname: e.target.value })}
            />
            <TextField
              variant="outlined"
              fullWidth
              disabled
              style={{ backgroundColor: '#F6F7F7' }}
              label="Last Name"
              value={userData.lastname}
              onChange={(e) => setUserData({ ...userData, lastname: e.target.value })}
            />
            <TextField
              variant="outlined"
              fullWidth
              label="Email address"
              type="email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            />
            <TextField
              variant="outlined"
              fullWidth
              label="Phone no"
              type="phone"
              value={userData.phone}
              onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
            />
            <Box display="flex" justifyContent="flex-start" alignItems="center">
              <Checkbox
                color="primary"
                value={checkboxValue}
                onChange={(e) => setCheckboxValue(!checkboxValue)}
                size="small"
                style={{ marginRight: 16 }}
              />
              <Typography color="textPrimary" variant="subtitle1">
                I hereby confirm that the information above is correct
              </Typography>
            </Box>
            <LoadingButton
              disabled={!checkboxValue || loading}
              isLoading={loading}
              fullWidth
              color="primary"
              onClick={onProceed}>
              Proceed
            </LoadingButton>
          </form>
        </Box>
      </LoadingView>
    </AuthLayout>
  );
};

export default ExistingUserDataVerifyPage;

const useStyles = makeStyles((theme) => ({
  matricNumber: {
    background: '#F6F7F7',
    border: `1px solid ${colors.seperator}`,
    '& .checkIcon': {
      color: colors.successBg,
      marginLeft: theme.spacing(2),
    },
  },
  form: {
    '& > *': {
      marginBottom: spaces.medium,
    },
  },
}));
