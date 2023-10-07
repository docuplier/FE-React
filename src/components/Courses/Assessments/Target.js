import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Paper } from '@material-ui/core';
import { Controller } from 'react-hook-form';
import { colors, fontSizes, fontWeight } from '../../../Css';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import { useNotification } from 'reusables/NotificationBanner';
import { getFormError } from 'utils/formError';

import { GET_DEPARTMENTS_QUERY, GET_LEVELS_QUERY } from 'graphql/queries/institution';
import { useQuery } from '@apollo/client';

import SelectAllDropDown from 'reusables/SelectAllDropDown';

const Target = ({ control, watch, setValue, errors, data }) => {
  const notification = useNotification();

  const { userDetails } = useAuthenticatedUser();
  const institutionId = userDetails?.institution?.id;

  const { data: departmentsData } = useQuery(GET_DEPARTMENTS_QUERY, {
    variables: {
      institutionId,
      active: true,
    },
    skip: !institutionId,
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const departments = useMemo(() => departmentsData?.departments?.results || [], [departmentsData]);
  const { data: levelsData } = useQuery(GET_LEVELS_QUERY, {
    variables: {
      active: true,
      institutionId,
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });
  const levels = useMemo(() => levelsData?.levels?.results || [], [levelsData]);
  const transformedData = useMemo(() => {
    const selectedIdSet = new Set(
      data?.assessment?.assessmentTargets?.targetDepartments?.map((item) => item.id),
    );

    if (departments) {
      let allDepartments = departments;
      const allAdded = allDepartments.find((item) => item.id === 'all');
      if (!allAdded) {
        allDepartments?.unshift({
          name: 'All',
          id: 'all',
        });
      }
      return allDepartments?.map((item) => ({
        title: item.name,
        isChecked: data?.assessment?.assessmentTargets?.isAllDepartment
          ? item.id === 'all'
          : selectedIdSet.has(item.id),
        id: item.id,
      }));
    }
  }, [departments, data]);
  const transformedLevel = useMemo(() => {
    const selectedIdSet = new Set(
      data?.assessment?.assessmentTargets?.targetLevels?.map((item) => item.id),
    );
    if (levels) {
      let allLevels = levels;
      const allAdded = allLevels.find((item) => item.id === 'all');
      if (!allAdded) {
        allLevels?.unshift({
          name: 'All',
          id: 'all',
        });
      }
      return allLevels?.map((item) => ({
        title: item.name,
        isChecked: data?.assessment?.assessmentTargets?.isAllLevels
          ? item.id === 'all'
          : selectedIdSet.has(item.id),
        id: item.id,
      }));
    }
  }, [levels, data]);
  return (
    <Box
      component={Paper}
      elevation={0}
      p={8}
      bgcolor="#fafafa"
      style={{ border: `1px solid ${colors.secondaryLightGrey}` }}
    >
      <Typography variant="body1" color="textPrimary" style={{ fontWeight: fontWeight.bold }}>
        Target
      </Typography>
      <Typography
        style={{
          fontSize: fontSizes.small,
        }}
      >
        Assessment will be taken by this category.
      </Typography>
      <Controller name="isGlobalAssessment" control={control} defaultValue={true} />
      <Controller name="isAllLevels" control={control} defaultValue={false} />
      <Controller name="isAllDepartment" control={control} defaultValue={false} />
      <Controller
        name="targetDepartments"
        control={control}
        defaultValue={[]}
        rules={{
          required: true,
          validate: (value) => value?.length > 0,
        }}
        render={({ field }) => (
          <>
            {transformedData && transformedData.length > 0 && (
              <>
                <SelectAllDropDown
                  data={transformedData}
                  setValue={setValue}
                  title="Departments"
                  label="Select Departments"
                  error={getFormError('targetDepartments', errors).hasError}
                  helperText={getFormError('targetDepartments', errors).message}
                  {...field}
                />
                <Typography style={{ fontSize: fontSizes.small, color: '#f44336' }}>
                  {getFormError('targetDepartments', errors).hasError &&
                    'Target Department is required'}
                </Typography>
              </>
            )}
          </>
        )}
      />
      <div>
        <Controller
          name="targetLevels"
          control={control}
          defaultValue={[]}
          rules={{
            required: true,
            validate: (value) => value?.length > 0,
          }}
          render={({ field }) => (
            <>
              {transformedLevel && transformedLevel.length > 0 && (
                <>
                  <SelectAllDropDown
                    data={transformedLevel}
                    setValue={setValue}
                    title="Levels"
                    label="Select Level"
                    error={getFormError('targetLevels', errors).hasError}
                    helperText={getFormError('targetLevels', errors).message}
                    {...field}
                  />
                  <Typography style={{ fontSize: fontSizes.small, color: '#f44336' }}>
                    {getFormError('targetLevels', errors).hasError && 'Target level is required'}
                  </Typography>
                </>
              )}
            </>
          )}
        />
      </div>
    </Box>
  );
};

Target.propTypes = {
  control: PropTypes.object.isRequired,
};

export default memo(Target);
