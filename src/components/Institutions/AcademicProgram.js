import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, Typography, Button } from '@material-ui/core';

import { fontWeight } from '../../Css';
import InstitutionRegistrationCard from 'reusables/InstitutionRegistrationCard';
import AddNewResourceCard from 'reusables/AddNewResourceCard';
import AcademicProgramDrawer from './AcademicProgramDrawer';

const AcademicProgram = ({ institutionId, titleProps, card, refetchPrograms, programs }) => {
  const [isAcademicProgramDrawerVisible, setIsAcademicProgramDrawerVisible] = useState(false);

  const renderActionButton = (academicProgram) => {
    let {
      actionButton: { text, onClick },
    } = card;

    return (
      <Button color="primary" onClick={() => onClick(academicProgram)}>
        {text}
      </Button>
    );
  };

  const renderAcademicProgramHeader = (academicProgram) => {
    let { name, abbreviation } = academicProgram;

    return (
      <Typography variant="body2" style={{ fontWeight: fontWeight.medium }}>
        {name} ({abbreviation})
      </Typography>
    );
  };

  const renderAcademicProgramFooter = (academicProgram) => {
    let { levels } = academicProgram;

    return (
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" component="span">
          Level: {levels?.length || 0}
        </Typography>
        <Box>{renderActionButton(academicProgram)}</Box>
      </Box>
    );
  };

  const renderAcademicPrograms = () => {
    return (
      <Box mt={16}>
        <Grid container spacing={6}>
          {programs.map((program) => {
            return (
              <Grid item key={program.id} xs={4}>
                <InstitutionRegistrationCard
                  topComponent={renderAcademicProgramHeader(program)}
                  bottomComponent={renderAcademicProgramFooter(program)}
                />
              </Grid>
            );
          })}
          <Grid item xs={4}>
            <AddNewResourceCard
              title="Add new program"
              onClick={() => setIsAcademicProgramDrawerVisible(true)}
            />
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <>
      <Typography
        style={{ fontWeight: fontWeight.bold }}
        color="textPrimary"
        variant="body1"
        {...titleProps}>
        Academic program
      </Typography>
      <Typography color="textSecondary" variant="body2">
        Configure the academic programmes offered by the Institution being created...
      </Typography>
      {renderAcademicPrograms()}
      <AcademicProgramDrawer
        open={isAcademicProgramDrawerVisible}
        onClose={() => setIsAcademicProgramDrawerVisible(false)}
        institutionId={institutionId}
        onOKSuccess={refetchPrograms}
      />
    </>
  );
};

AcademicProgram.propTypes = {
  institutionId: PropTypes.string.isRequired,
  titleProps: PropTypes.shape({
    ...Typography.propTypes,
  }),
  card: PropTypes.shape({
    actionButton: PropTypes.shape({
      text: PropTypes.node.isRequired,
      onClick: PropTypes.func.isRequired,
    }),
  }),
  refetchPrograms: PropTypes.func.isRequired,
  programs: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default React.memo(AcademicProgram);
