import React from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import AcademicProgram from '../AcademicProgram';
import { GET_PROGRAMS_QUERY } from 'graphql/queries/institution';
import LoadingView from 'reusables/LoadingView';

const AcademicProgramTab = () => {
  const { institutionId } = useParams();
  const history = useHistory();
  const { pathname } = useLocation();

  const { data, loading, refetch } = useQuery(GET_PROGRAMS_QUERY, {
    variables: { institutionId, limit: 100 },
    skip: !institutionId,
  });

  return (
    <LoadingView isLoading={loading}>
      <AcademicProgram
        titleProps={{
          variant: 'h4',
        }}
        institutionId={institutionId}
        card={{
          actionButton: {
            text: 'More',
            onClick: (program) => history.push(`${pathname}/programs/${program.id}`),
          },
        }}
        refetchPrograms={refetch}
        programs={data?.programs?.results || []}
      />
    </LoadingView>
  );
};

export default React.memo(AcademicProgramTab);
