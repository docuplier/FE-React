import React from 'react';
import { Typography, Box, IconButton, Collapse } from '@material-ui/core';
import { Controller } from 'react-hook-form';

import { colors } from '../../../Css';
import { daysOfTheWeek } from 'utils/constants';

export default function RenderWeeklyInterval({ useFormUtils, isSelectedInterval }) {
  const { control, watch, setValue } = useFormUtils;
  const { weekDays = [] } = watch();

  function handleSelectWeekDays(day) {
    if (weekDays.includes(day)) {
      const filteredArray = [...weekDays].filter((el) => el !== day);
      setValue('weekDays', filteredArray);
    } else {
      setValue('weekDays', [...weekDays, day]);
    }
  }

  return (
    <Controller
      name="weekDays"
      control={control}
      rules={{
        required: isSelectedInterval ? 'Select days of the week' : false,
      }}
      render={() => {
        return (
          <Collapse in={isSelectedInterval}>
            <Box display="flex" alignItems="center">
              {daysOfTheWeek.map((day) => {
                const isSelected = weekDays.includes(day.value);
                return (
                  <Box key={day.value} mr={10}>
                    <IconButton
                      color="inherit"
                      onClick={() => handleSelectWeekDays(day.value)}
                      style={{
                        background: isSelected && colors.primary,
                        height: 40,
                        width: 40,
                      }}>
                      <Typography
                        variant="body2"
                        style={{
                          color: isSelected && colors.white,
                        }}>
                        {day.name}
                      </Typography>
                    </IconButton>
                  </Box>
                );
              })}
            </Box>
          </Collapse>
        );
      }}
    />
  );
}
