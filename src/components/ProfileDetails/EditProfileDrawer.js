import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import Drawer from 'reusables/Drawer';
import useStateAndLGA from 'hooks/useStateAndLGA.js';
import { TextField, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { spaces } from '../../Css';
import { useMutation, useQuery } from '@apollo/client';
import {
  CREATE_USER_INFORMATION,
  UPDATE_USER_INFORMATION,
  UPDATE_USER,
} from 'graphql/mutations/users';
import useNotification from 'reusables/NotificationBanner/useNotification';
import { GET_USER_LEVEL } from 'graphql/queries/users';
import { getFormError } from 'utils/formError';

const EditProfileDrawer = ({ onClose, visible, userData, onCompletedCallback }) => {
  const classes = useStyles();
  const { register, handleSubmit, errors } = useForm();
  const notification = useNotification();
  const [selectedState, setSelectedState] = useState(
    userData?.user?.userinformation?.stateOfOrigin || 'Abia',
  );
  const { states, LGAs } = useStateAndLGA(selectedState);

  const { data: levels } = useQuery(GET_USER_LEVEL, {
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const [updateUser, { loading }] = useMutation(UPDATE_USER, {
    onCompleted: (data) => {
      if (!data?.updateUser?.ok) {
        notification.error({
          message: data?.updateUser?.errors[0]?.messages[0],
        });
        return;
      }

      notification.success({
        message: 'user information updated successfully',
      });
      onCompletedCallback();
      onClose();
    },
    onError: (error) => {
      notification.error({
        message: error.message,
      });
    },
  });

  const [createUserInformation, { loading: isCreatingUserInformation }] = useMutation(
    CREATE_USER_INFORMATION,
    {
      onCompleted: (data) => {
        if (!data?.createUserInformation?.ok) {
          notification.error({
            message: data?.createUserInformation?.errors[0]?.messages[0],
          });
          return;
        }
      },
      onError: (error) => {
        notification.error({
          message: error.message,
        });
      },
    },
  );

  const [updateUserInformation, { loading: isLoadingUserInformation }] = useMutation(
    UPDATE_USER_INFORMATION,
    {
      onCompleted: (data) => {
        if (!data?.updateUserInformation?.ok) {
          notification.error({
            message: data?.updateUserInformation?.errors[0]?.messages[0],
          });
          return;
        }
      },
      onError: (error) => {
        notification.error({
          message: error.message,
        });
      },
    },
  );

  const upsertUserInformation = (formData) => {
    let newUserinformation = {
      address: formData.address || undefined,
      nationality: formData.nationality || undefined,
      stateOfOrigin: formData.state || undefined,
      dateOfBirth: formData.dob || undefined,
      lgaOfOrigin: formData.lga || undefined,
    };

    if (!userData?.user?.userinformation) {
      return createUserInformation({
        variables: {
          newUserinformation,
        },
      });
    }
    updateUserInformation({
      variables: {
        id: userData?.user?.userinformation?.id,
        newUserinformation,
      },
    });
  };

  const onSubmit = (data) => {
    upsertUserInformation(data);
    updateUser({
      variables: {
        id: userData?.user?.id,
        image: data.image[0],
        newUser: {
          firstname: data.firstname,
          lastname: data.lastname,
          middlename: data.middlename,
          gender: data.gender,
          level: data.level,
          phone: data.phone,
        },
      },
    });
  };

  return (
    <Drawer
      okText="Update"
      okButtonProps={{
        isLoading: loading || isLoadingUserInformation || isCreatingUserInformation,
      }}
      onOk={handleSubmit(onSubmit)}
      cancelText="Cancel"
      title="Edit"
      open={visible}
      onClose={onClose}>
      <Box className={classes.form}>
        <TextField
          inputRef={register}
          label="Select image"
          name="image"
          type="file"
          accept="jpeg, png, jpg"
          variant="outlined"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          inputRef={register}
          label="First Name"
          defaultValue={userData?.user?.firstname}
          name="firstname"
          variant="outlined"
          fullWidth
        />
        <TextField
          inputRef={register({ required: false })}
          label="Middle Name"
          fullWidth
          error={getFormError('middlename', errors).hasError}
          defaultValue={userData?.user?.middlename}
          name="middlename"
          helperText={getFormError('middlename', errors).message}
          variant="outlined"
        />
        <TextField
          inputRef={register}
          label="Phone No"
          fullWidth
          defaultValue={userData?.user?.phone}
          name="phone"
          type="number"
          variant="outlined"
        />
        <TextField
          inputRef={register}
          label="Last Name"
          fullWidth
          defaultValue={userData?.user?.lastname}
          name="lastname"
          variant="outlined"
        />
        <TextField
          inputRef={register}
          label="Nationality"
          fullWidth
          defaultValue={userData?.user?.userinformation?.nationality}
          name="nationality"
          variant="outlined"
        />
        <TextField
          inputRef={register}
          label="State of origin"
          fullWidth
          defaultValue={userData?.user?.userinformation?.stateOfOrigin}
          name="state"
          variant="outlined"
          onChange={(event) => setSelectedState(event.target.value)}
          SelectProps={{
            native: true,
          }}
          select>
          {states?.map((state) => (
            <option value={state} key={state}>
              {state}
            </option>
          ))}
        </TextField>
        <TextField
          inputRef={register}
          label="L.G.A"
          fullWidth
          defaultValue={userData?.user?.userinformation?.lgaOfOrigin}
          name="lga"
          variant="outlined"
          SelectProps={{
            native: true,
          }}
          select>
          <option value={userData?.user?.userinformation?.lgaOfOrigin}>
            {userData?.user?.userinformation?.lgaOfOrigin}
          </option>
          {LGAs?.map((lga) => (
            <option value={lga} key={lga}>
              {lga}
            </option>
          ))}
        </TextField>
        <TextField
          inputRef={register}
          label="Address"
          fullWidth
          defaultValue={userData?.user?.userinformation?.address}
          name="address"
          variant="outlined"
        />
        <TextField
          inputRef={register({
            validate: (value) => new Date(value) < new Date(),
          })}
          label="Date of birth"
          fullWidth
          defaultValue={userData?.user?.userinformation?.dateOfBirth}
          name="dob"
          type="date"
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
          error={getFormError('dob', errors).hasError}
          helperText={errors?.dob ? "Date of birth cannot be more than today's date" : ''}
        />
        <TextField
          select
          inputRef={register}
          label="Gender"
          name="gender"
          fullWidth
          defaultValue={userData?.user?.gender && userData?.user?.gender}
          SelectProps={{
            native: true,
          }}
          variant="outlined">
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </TextField>
        <TextField
          select
          inputRef={register}
          label="Level"
          fullWidth
          name="level"
          SelectProps={{
            native: true,
          }}
          variant="outlined">
          <option value={userData?.user?.level?.id}>{userData?.user?.level?.name}</option>
          {levels?.levels?.results?.map((level) => (
            <option value={level?.id}>{level?.name}</option>
          ))}
        </TextField>
      </Box>
    </Drawer>
  );
};

const useStyles = makeStyles(() => ({
  form: {
    '& > *': {
      marginBottom: spaces.medium,
    },
  },
}));
export default EditProfileDrawer;
