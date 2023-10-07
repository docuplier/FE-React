import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useMutation, useQuery } from '@apollo/client';
import { Typography, Grid, Divider, Button, Box } from '@material-ui/core';
import { fontSizes, fontWeight, colors, fontFamily, borderRadius, spaces } from '../../../Css.js';

import LoadingButton from 'reusables/LoadingButton.jsx';
import { ReactComponent as ChevronRight } from 'assets/svgs/chevron-right.svg';
import { UPDATE_USER_INFORMATION } from 'graphql/mutations/instrustorsRegistration';
import { useNotification } from 'reusables/NotificationBanner';
import { LOGGED_IN_USER } from 'graphql/queries/instructorsReg';

const interestOptions = [
  'Personal development',
  'Management',
  'Finance',
  'Accounting',
  'Career development',
  'Goal development',
];

const Interest = () => {
  const classes = useStyles();
  const [topTech, setTopTech] = React.useState([]);
  const [topBussiness, setTopBussiness] = React.useState([]);
  const notification = useNotification();

  const handleTopTech = (option) => {
    if (topTech.indexOf(option) === -1) {
      setTopTech((prevState) => [...prevState, option]);
      return;
    } else {
      setTopTech((prevState) => prevState.filter((opt) => opt !== option));
    }
  };

  const handleToBussiness = (option) => {
    if (topBussiness.indexOf(option) === -1) {
      setTopBussiness((prevState) => [...prevState, option]);
      return;
    }
    setTopBussiness((prevState) => prevState.filter((opt) => opt !== option));
  };

  const isInTechArray = (interest) => {
    const selected = topTech.find((tech) => tech === interest);
    if (selected !== undefined) return true;
  };

  const isInBussinessArray = (interest) => {
    const selected = topBussiness.find((tech) => tech === interest);
    if (selected !== undefined) return true;
  };

  const onSubmit = () => {
    interest({
      variables: {
        newUserInformation: { interest: [...topBussiness, ...topTech] },
        id: loggedInUser?.loggedInUser?.userinformation?.id,
      },
    });
  };

  const [interest, { loading: isLoading }] = useMutation(UPDATE_USER_INFORMATION, {
    onCompleted: () => {
      notification.success({
        message: 'Contact data created successfully',
      });
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const { data: loggedInUser } = useQuery(LOGGED_IN_USER);

  return (
    <div className={classes.wrapper}>
      <Typography className={classes.title}>Interests</Typography>
      <Box className={classes.divider}>
        <Typography variant="body2" color="textSecondary">
          Top business topics
        </Typography>
        <Divider classes={{ root: classes.line }} />
      </Box>
      <Grid container spaces={2}>
        {interestOptions.map((option) => {
          return (
            <Grid item>
              <Button
                key={option}
                onClick={() => handleTopTech(option)}
                className={classes.checked}
                variant={isInTechArray(option) && 'contained'}
                color={isInTechArray(option) && 'primary'}>
                {option}
              </Button>
            </Grid>
          );
        })}
      </Grid>
      <Box className={classes.divider}>
        <Typography variant="body2" color="textSecondary">
          Top tech topics
        </Typography>
        <Divider classes={{ root: classes.line }} />
      </Box>
      <Grid container spaces={2}>
        {interestOptions.map((option) => {
          return (
            <Grid item>
              <Button
                key={option}
                onClick={() => handleToBussiness(option)}
                className={classes.checked}
                variant={isInBussinessArray(option) && 'contained'}
                color={isInBussinessArray(option) && 'primary'}>
                {option}
              </Button>
            </Grid>
          );
        })}
      </Grid>
      <div className={classes.foot}>
        <LoadingButton
          endIcon={<ChevronRight />}
          className="btn"
          type="submit"
          color="primary"
          onClick={onSubmit}
          isLoading={isLoading}>
          Complete Registration
        </LoadingButton>
      </div>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  wrapper: {
    maxWidth: 800,
    margin: 'auto',
    padding: spaces.medium,
  },
  title: {
    fontWeight: fontWeight.medium,
    fontSize: fontSizes.title,
    fontFamilly: fontFamily.primary,
    color: colors.dark,
    marginBottom: theme.spacing(10),
  },
  divider: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: spaces.medium,
    marginTop: spaces.small,
  },
  line: {
    margin: 'auto',
    width: '75%',
  },
  foot: {
    display: 'flex',
    marginTop: theme.spacing(25),
    '& .btn': {
      marginLeft: 'auto',
      width: 250,
      height: 44,
    },
  },
  checked: {
    width: 230,
    height: 63,
    borderRadius: borderRadius.small,
    fontSize: fontSizes.small,
    fontFamily: fontFamily.primary,
    display: 'grid',
    placeItems: 'center',
    border: `solid 1px ${colors.primary}`,
    cursor: 'pointer',
    marginBottom: spaces.medium,
    marginRight: spaces.medium,
  },
}));

export default React.memo(Interest);
