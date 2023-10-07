import { memo } from 'react';
import { Box, Drawer, Paper, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';

import { fontWeight } from '../../../Css';

const GenderDistributionDrawer = ({ data, onClose }) => {
  return (
    <Drawer anchor="right" open={Boolean(data)} onClose={onClose}>
      <Box component={Paper} elevation={0} square px={12} py={8} minWidth={378}>
        <Typography variant="h6" color="textPrimary" style={{ fontWeight: fontWeight.bold }}>
          {data?.facultyName}
        </Typography>
      </Box>
      <Box bgcolor="#F6F7F7" height={'100%'} px={8} pt={12}>
        {data?.departments?.map((department, index) => {
          return (
            <Box px={12} py={8} mb={8} component={Paper} square elevation={0} key={index}>
              <Box display="flex" justifyContent="space-between" pb={8}>
                <Typography variant="body1" color="textPrimary">
                  {department?.name}
                </Typography>
                <Typography variant="body1" color="textPrimary">
                  {department?.total}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="flex-start">
                <Typography variant="body1" color="textSecondary" style={{ paddingRight: 30 }}>
                  Male: {department?.maleCount}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Female: {department?.femaleCount}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Drawer>
  );
};

GenderDistributionDrawer.propTypes = {
  onClose: PropTypes.func,
  data: PropTypes.shape({
    facultyName: PropTypes.string.isRequired,
    departments: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        maleCount: PropTypes.number,
        femaleCount: PropTypes.number,
        total: PropTypes.number,
      }),
    ),
  }),
};

export default memo(GenderDistributionDrawer);
