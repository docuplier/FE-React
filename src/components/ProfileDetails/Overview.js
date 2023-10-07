import { Box, Divider, makeStyles, Paper, Typography, Button } from '@material-ui/core';
import React from 'react';

import { convertToSentenceCase } from 'utils/TransformationUtils';
import { colors, fontSizes, fontWeight, spaces } from '../../Css';
import EditProfileDrawer from './EditProfileDrawer';

const Overview = ({ data, onClose, visible, setVisible, onCompletedCallback }) => {
  const classes = useStyles();
  const learnersData = {
    personaldata: [
      { name: 'BIRTHDAY', value: data?.user?.userinformation?.dateOfBirth || 'N/A' },
      { name: 'GENDER', value: convertToSentenceCase(data?.user?.gender) || 'N/A' },
      { name: 'ACADEMIC LEVEL', value: data?.user?.level?.name || 'N/A' },
      { name: 'NATIONALITY', value: data?.user?.userinformation?.nationality || 'N/A' },
      { name: 'STATE OF ORIGIN', value: data?.user?.userinformation?.stateOfOrigin || 'N/A' },
      { name: 'LGA OF ORIGIN', value: data?.user?.userinformation?.lgaOfOrigin || 'N/A' },
    ],
    contactData: [
      { name: 'PHONE NUMBER', value: data?.user?.phone || 'N/A' },
      { name: 'EMAIL ADDRESS', value: data?.user?.email || 'N/A' },
    ],
  };

  const renderPersonalData = () => {
    return (
      <Box component={Paper} square py={12} px={12} mt={20} mb={8} className={classes.personaldata}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography color="textPrimary" variant="h5" className="title">
            Personal Data
          </Typography>
          <Box display="flex" justifyContent="flex-end" my={8}>
            <Button color="primary" onClick={() => setVisible(true)}>
              Edit
            </Button>
          </Box>
        </Box>
        <Typography>
          Some info may be visible to other people using LMS services.{' '}
          <Typography component="span" className="span">
            Learn more
          </Typography>
        </Typography>
        <Box>
          {learnersData?.personaldata?.map((data, index) => {
            return (
              <Box>
                <Box key={index} className={classes.result}>
                  <Typography className="name">{data.name}</Typography>
                  <Typography className="value" color="textPrimary">
                    {data.value}
                  </Typography>
                </Box>
                {index === learnersData?.personaldata.length - 1 ? '' : <Divider />}
              </Box>
            );
          })}
        </Box>
      </Box>
    );
  };

  const renderContactData = () => {
    return (
      <Box pb={40} mt={16}>
        <Box component={Paper} square py={12} px={12} className={classes.personaldata}>
          <Typography color="textPrimary" variant="h5" className="title">
            Contact Data
          </Typography>
          <Typography>
            Some info may be visible to other people using LMS services.{' '}
            <Typography component="span" className="span">
              Learn more
            </Typography>
          </Typography>
          <Box>
            {learnersData?.contactData?.map((data, index) => {
              return (
                <Box>
                  <Box key={index} className={classes.result}>
                    <Typography className="name">{data.name}</Typography>
                    <Typography className="value" color="textPrimary">
                      {data.value}
                    </Typography>
                  </Box>
                  {index === learnersData?.contactData.length - 1 ? '' : <Divider />}
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <div>
      {renderPersonalData()}
      {renderContactData()}
      <EditProfileDrawer
        onClose={onClose}
        visible={visible}
        userData={data}
        onCompletedCallback={onCompletedCallback}
      />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  personaldata: {
    boxShadow: `0px 1px 3px rgba(0, 0, 0, 0.1)`,
    '& .title': {
      fontWeight: fontWeight.bold,
      paddingBottom: spaces.small,
    },
    '&:last-child': {
      paddingBottom: 0,
    },
    '& .span': {
      color: colors.primary,
      cursor: 'pointer',
    },
  },
  result: {
    padding: spaces.medium,
    paddingLeft: 0,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      display: 'block',
    },
    '& .name': {
      width: 250,
      marginRight: 100,
      minWidth: 'max-content',
      fontSize: fontSizes.medium,
      fontWeight: fontWeight.bold,
      color: colors.textLightAlternative,
    },
    '& .value': {
      fontSize: fontSizes.large,
      fontWeight: fontWeight.regular,
      color: colors.textAlternative,
    },
  },
}));

export default Overview;
