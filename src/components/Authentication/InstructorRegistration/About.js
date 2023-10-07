import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
//import { useHistory } from 'react-router-dom';

import { fontWeight, fontSizes, fontFamily, colors, spaces, borderRadius } from '../../../Css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import WYSIWYG from 'reusables/Wysiwyg';
import { ReactComponent as AngleRight } from 'assets/svgs/angle-right.svg';
import LoadingButton from 'reusables/LoadingButton';
import { UPDATE_USER_INFORMATION } from 'graphql/mutations/instrustorsRegistration';
import useNotification from 'reusables/NotificationBanner/useNotification';
import { LOGGED_IN_USER } from 'graphql/queries/instructorsReg';

const About = () => {
  const classes = useStyles();
  const [aboutText, setAboutText] = useState('');
  const notification = useNotification();

  const onChange = (value) => {
    setAboutText(value.html);
  };

  const onSubmit = () => {
    createAbout({
      variables: {
        newUserInformation: { about: aboutText },
        id: loggedInUser?.loggedInUser?.userinformation?.id,
      },
    });
  };

  const [createAbout, { loading: isLoading }] = useMutation(UPDATE_USER_INFORMATION, {
    onCompleted: () => {
      notification.success({
        message: 'Data created successfully',
      });
      return onChange;
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const { data: loggedInUser } = useQuery(LOGGED_IN_USER);

  return (
    <React.Fragment>
      <div className={classes.container}>
        <div className={classes.header}>
          <Typography className="header-text">
            About <span className="optional">(optional)</span>
          </Typography>
        </div>
        <WYSIWYG onChange={onChange} />
        <LoadingButton
          endIcon={<AngleRight />}
          className={classes.btn}
          type="submit"
          isLoading={isLoading}
          color="primary"
          onClick={onSubmit}>
          Complete registration
        </LoadingButton>
      </div>
    </React.Fragment>
  );
};

const useStyles = makeStyles(() => ({
  container: {
    maxWidth: 800,
    margin: 'auto',
    padding: spaces.medium,
  },
  header: {
    '& .header-text': {
      fontWeight: fontWeight.medium,
      fontSize: fontSizes.title,
      fontFamilly: fontFamily.primary,
      color: colors.dark,
      paddingBottom: spaces.large,
    },
    '& .optional': {
      fontWeight: fontWeight.regular,
      color: colors.grey,
    },
  },
  editor: {
    width: '100%',
    border: 'solid 2px black',
  },
  btn: {
    width: 230,
    height: 44,
    borderRadius: borderRadius.default,
    float: 'right',
    marginTop: 50,
  },
}));
export default About;
