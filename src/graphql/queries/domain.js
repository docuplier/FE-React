import { gql } from '@apollo/client';
import { CORE_INSTITUTION_FIELDS } from 'graphql/fragments';

export const VERIFY_DOMAIN = gql`
  ${CORE_INSTITUTION_FIELDS}
  query verifyDomain($domain: String) {
    domainVerification(domain: $domain) {
      ok
      institution {
        ...InstitutionPart
      }
    }
  }
`;
