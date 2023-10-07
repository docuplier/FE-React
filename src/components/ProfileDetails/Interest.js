import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid, Button, Box } from '@material-ui/core';
import { fontSizes, fontWeight, colors, fontFamily, borderRadius, spaces } from '../../Css.js';
import { useMutation, useQuery } from '@apollo/client';
import { GET_FIELD_OF_INTERESTS } from 'graphql/queries/library.js';
import useNotification from 'reusables/NotificationBanner/useNotification.jsx';
import { useState } from 'react';
import { UPDATE_USER } from 'graphql/mutations/users';
import LoadingView from 'reusables/LoadingView.js';

const Interest = ({ data: userData, onCompletedCallback }) => {
  const classes = useStyles();
  const notification = useNotification();
  const [isEditing, setIsEditing] = useState(false);
  const interestIds = userData?.interests?.map((interest) => interest.id);
  const [selectedInterests, setSelectedInterests] = useState(interestIds);

  const { data: interests, loading } = useQuery(GET_FIELD_OF_INTERESTS, {
    onError: (error) => {
      notification.error({
        message: error.message,
      });
    },
  });
  const allInterest = interests?.fieldOfInterests?.results || [];

  const [updateInterest] = useMutation(UPDATE_USER, {
    onCompleted: (data) => {
      if (data?.updateUser?.ok) {
        notification.success({
          message: 'interest added successfully',
        });
        onCompletedCallback();
      }
    },
    onError: (error) => {
      notification.error({
        message: error.message,
      });
    },
  });

  const addInterest = (id) => {
    if (isEditing) {
      setSelectedInterests((prevState) => {
        if (prevState.indexOf(id) === -1) {
          return [...prevState, id];
        } else {
          return prevState.filter((interestId) => interestId !== id);
        }
      });
    }
  };

  const handleAddFieldOfInterest = () => {
    if (isEditing) {
      updateInterest({
        variables: {
          id: userData?.id,
          newUser: {
            interests: selectedInterests,
          },
        },
      });
      setIsEditing(false);
    }
  };

  const activeInterests = (interestId) => {
    const selected = selectedInterests?.find((interest) => interest === interestId);
    if (selected !== undefined) return true;
  };

  return (
    <div style={{ margin: '50px 0' }}>
      <Box className={classes.divider}>
        <Typography variant="body2" color="textSecondary" className={classes.topic}>
          Interests
        </Typography>
        {!isEditing ? (
          <Button color="primary" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        ) : (
          <Button color="primary" onClick={handleAddFieldOfInterest}>
            Save
          </Button>
        )}
      </Box>
      <LoadingView isLoading={loading}>
        <Grid container spacing={8} style={{ marginBottom: 20 }}>
          {(isEditing ? allInterest : userData?.interests)?.map((option) => {
            return (
              <Grid item key={option?.id} md={3} sm={4} xs={6}>
                <Button
                  className={classes.checked}
                  variant={activeInterests(option?.id) ? 'contained' : 'outlined'}
                  color="primary"
                  onClick={() => addInterest(option?.id)}>
                  {option?.name}
                </Button>
              </Grid>
            );
          })}
        </Grid>
      </LoadingView>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
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
    alignItems: 'center',
    width: '100%',
    marginBottom: spaces.medium,
  },
  topic: {
    width: 200,
  },
  line: {
    margin: 'auto',
    width: '88%',
  },
  checked: {
    width: '100%',
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
