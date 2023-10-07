import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { getSubdomain } from 'utils/getTenant';
import { VERIFY_DOMAIN } from 'graphql/queries/domain';

const useSubdomain = () => {
  let domainObject = localStorage.getItem('domainObject');
  let [isDomainInvalid, setIsDomainInvalid] = useState(false);

  const domain = getSubdomain();

  const { loading } = useQuery(VERIFY_DOMAIN, {
    skip: Boolean(domainObject) || domain === 'admin' || domain === 'select',
    variables: { domain },
    onCompleted: (data) => {
      localStorage.setItem('domainObject', JSON.stringify(data.domainVerification.institution));
    },
    onError: (error) => {
      setIsDomainInvalid(true);
    },
  });

  return { loading, domainObject: JSON.parse(domainObject), isDomainInvalid };
};

export default useSubdomain;
