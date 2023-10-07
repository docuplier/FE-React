import { Box, Divider, makeStyles, Paper, Typography } from '@material-ui/core';
import React from 'react';

import MaxWidthContainer from 'reusables/MaxWidthContainer';
import { convertToSentenceCase } from 'utils/TransformationUtils';
import { colors, fontWeight, spaces } from '../../../Css';

const PersonalData = ({ data }) => {
  const classes = useStyles();
  const learnersData = {
    personaldata: [
      { name: 'BIRTHDAY', value: data?.user?.userinformation?.dateOfBirth || 'N/A' },
      { name: 'GENDER', value: convertToSentenceCase(data?.user?.gender) || 'N/A' },
      { name: 'NATIONALITY', value: data?.user?.userinformation?.nationality || 'N/A' },
      { name: 'STATE OF ORIGIN', value: data?.user?.userinformation?.stateOfOrigin || 'N/A' },
      { name: 'LGA OF ORIGIN', value: data?.user?.userinformation?.lgaOfOrigin || 'N/A' },
    ],
    contactData: [
      { name: 'PHONE NUMBER', value: data?.user?.phone || 'N/A' },
      { name: 'EMAIL ADDRESS', value: data?.user?.email || 'N/A' },
      { name: 'RESIDENTIAL ADDRESS', value: data?.user?.userinformation?.address || 'N/A' },
    ],
  };

  const renderPersonalData = () => {
    return (
      <Box
        component={Paper}
        square
        py={24}
        px={24}
        mt={40}
        mb={15}
        className={classes.personaldata}>
        <Typography color="textPrimary" variant="h5" className="title">
          Personal Data
        </Typography>
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
                <Box
                  display="flex"
                  justifyContent="flex-start"
                  alignItems="center"
                  key={index}
                  className={classes.result}>
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
      <Box pb={40}>
        <Box component={Paper} square py={24} px={24} className={classes.personaldata}>
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
                  <Box
                    display="flex"
                    justifyContent="flex-start"
                    alignItems="center"
                    key={index}
                    className={classes.result}>
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
    <MaxWidthContainer>
      {renderPersonalData()}
      {renderContactData()}
    </MaxWidthContainer>
  );
};

const useStyles = makeStyles(() => ({
  personaldata: {
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
    '& .name': {
      width: 250,
      marginRight: 100,
      minWidth: 'max-content',
    },
  },
}));

export default PersonalData;
