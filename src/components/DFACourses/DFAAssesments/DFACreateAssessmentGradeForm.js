import { memo } from 'react';
import PropTypes from 'prop-types';
import { Box, Paper, TextField, Typography } from '@material-ui/core';
import { Controller } from 'react-hook-form';

import { colors, fontWeight } from '../../../Css';
import { getFormError } from 'utils/formError';
import Banner from 'reusables/Banner';

const DFACreateAssessmentGradeForm = ({ totalObtainableScore, control, errors }) => {
  const renderBannerMessage = () => {
    return (
      <Typography variant="body2" component="span">
        Total obtainable score:{' '}
        <Typography variant="body2" component="span" style={{ fontWeight: fontWeight.bold }}>
          {totalObtainableScore}
        </Typography>
      </Typography>
    );
  };

  return (
    <Box
      component={Paper}
      elevation={0}
      p={8}
      bgcolor="#fafafa"
      style={{ border: `1px solid ${colors.secondaryLightGrey}` }}
    >
      <Typography variant="body1" color="textPrimary" style={{ fontWeight: fontWeight.bold }}>
        Grade
      </Typography>
      <Box mt={8}>
        <Banner severity={'success'} message={renderBannerMessage()} />
      </Box>
      <Box mt={8}>
        <Controller
          name="passMark"
          control={control}
          rules={{
            required: true,
            min: { value: 0, message: 'Value cannot be less than 0' },
            max: {
              value: totalObtainableScore,
              message: `Value cannot be more than ${totalObtainableScore}`,
            },
          }}
          render={({ ref, ...rest }) => (
            <TextField
              {...rest}
              type="number"
              inputRef={ref}
              fullWidth
              variant="outlined"
              label="Pass mark"
              error={getFormError('passMark', errors).hasError}
              helperText={getFormError('passMark', errors).message}
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}
        />
      </Box>
    </Box>
  );
};

DFACreateAssessmentGradeForm.propTypes = {
  control: PropTypes.object.isRequired,
  errors: PropTypes.any,
  totalObtainableScore: PropTypes.number.isRequired,
};

export default memo(DFACreateAssessmentGradeForm);
