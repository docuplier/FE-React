import React, { useState } from 'react';
import { Box, Grid, Typography, Button } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import { useQuery } from '@apollo/client';

import { fontWeight } from '../../../Css';
import LoadingButton from 'reusables/LoadingButton';
import { InstitutionTypes } from 'utils/constants';
import SchoolTypeCard from './SchoolTypeCard';
import { convertToSentenceCase } from 'utils/TransformationUtils';
import AcademicProgram from 'components/Institutions/AcademicProgram';
import AcademicProgramDrawer from '../AcademicProgramDrawer';
import { GET_PROGRAMS_QUERY } from 'graphql/queries/institution';
import LoadingView from 'reusables/LoadingView';

const AcademicProgramTab = ({
  handleNextTab,
  activeTab,
  fieldInputs,
  handleInputChange,
  handleUpsert,
  isEditMode,
  institutionId,
}) => {
  const [academicProgramToEdit, setAcademicProgramToEdit] = useState(null);

  const { data, loading, refetch } = useQuery(GET_PROGRAMS_QUERY, {
    variables: { institutionId, limit: 100 },
    skip: !institutionId,
  });

  const handleGoBack = () => {
    handleNextTab(activeTab - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpsert();
  };

  const renderFooter = () => {
    return (
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Button variant="outlined" onClick={handleGoBack}>
          Back
        </Button>
        {!isEditMode && (
          <LoadingButton
            type="submit"
            variant="contained"
            color="primary"
            endIcon={<ArrowForwardIosIcon />}
            onClick={handleSubmit}>
            Save & Next
          </LoadingButton>
        )}
      </Box>
    );
  };

  const renderEditAcademicProgramButtonText = () => (
    <>
      <Box display="flex">
        <Box mr={5}>
          <CreateOutlinedIcon />
        </Box>
        Edit
      </Box>
    </>
  );

  return (
    <>
      <Box>
        <Box mb={8}>
          <Typography variant="h6" color="textPrimary" style={{ fontWeight: fontWeight.bold }}>
            School type
          </Typography>
        </Box>
        <Grid container spacing={6}>
          {Object.values(InstitutionTypes).map((type) => (
            <Grid item xs={3}>
              <SchoolTypeCard
                key={type}
                name="type"
                label={convertToSentenceCase(type)}
                value={type}
                schoolType={fieldInputs.type}
                onSelect={() => handleInputChange({ type })}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box mt={12} mb={15}>
        <LoadingView isLoading={loading}>
          <AcademicProgram
            institutionId={institutionId}
            card={{
              actionButton: {
                text: renderEditAcademicProgramButtonText(),
                onClick: (program) => setAcademicProgramToEdit(program.id),
              },
            }}
            refetchPrograms={refetch}
            programs={data?.programs?.results || []}
          />
        </LoadingView>
      </Box>
      {renderFooter()}
      <AcademicProgramDrawer
        open={Boolean(academicProgramToEdit)}
        onClose={() => setAcademicProgramToEdit(null)}
        programId={academicProgramToEdit}
        institutionId={institutionId}
        onOKSuccess={refetch}
      />
    </>
  );
};

export default React.memo(AcademicProgramTab);
