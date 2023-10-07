import { useMutation, useQuery } from '@apollo/client';
import AcademicProgramTab from 'components/Institutions/SchoolCreation/AcademicProgramTab';
import Administrator from 'components/Institutions/SchoolCreation/Administrator';
import BrandAssets from 'components/Institutions/SchoolCreation/BrandAssets';
import ContactDetails from 'components/Institutions/SchoolCreation/ContactDetails';
import SchoolProfile from 'components/Institutions/SchoolCreation/SchoolProfile';
import {
  CREATE_INSTITUTION,
  CREATE_INSTITUTION_ADMIN,
  UPDATE_INSTITUTION,
} from 'graphql/mutations/institution';
import { GET_INSTITUTIONS_BY_ID } from 'graphql/queries/institution';
import RegistrationLayout from 'Layout/RegistrationLayout';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import LoadingView from 'reusables/LoadingView';
import { useNotification } from 'reusables/NotificationBanner';
import VerticalTabs from 'reusables/VerticalTabs';
import { PrivatePaths } from 'routes';
import { InstitutionStatus } from 'utils/constants';
import { parseUrl } from 'utils/TransformationUtils';
import { UPDATE_USER } from 'graphql/mutations/users';

const defaultInput = {
  name: '',
  abbreviation: '',
  type: 'UNIVERSITY',
  description: '',
  url: '',
  subDomain: '',
  address: '',
  address2: '',
  city: '',
  zipCode: '',
  state: '',
  lga: '',
  email: '',
  phone: '',
  firstName: '',
  lastName: '',
  adminEmail: '',
  logo: null,
  favicon: null,
  status: null,
  schoolType: null,
};

const Mode = {
  DRAFT: `draft`,
  EDIT: `edit`,
  NEW: `new`,
};

const SchoolCreation = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [fieldInputs, setFieldInputs] = useState(defaultInput);
  const history = useHistory();
  const { search, pathname } = useLocation();
  const params = new URLSearchParams(search);
  const institutionId = params.get('institutionId');
  const mode = params.get('mode');
  const notification = useNotification();
  const isEditMode = mode === Mode.EDIT;
  const isDraftMode = mode === Mode.DRAFT;

  const { data, loading: isLoadingGetInstitution } = useQuery(GET_INSTITUTIONS_BY_ID, {
    variables: { institutionId },
    skip: !!institutionId === false,
    // fetchPolicy: 'network-only',
  });

  const [updateAdminName] = useMutation(UPDATE_USER, {
    onCompleted: (data) => {
      if (data?.updateUser?.ok) {
        notification.success({
          message: 'admin updated successfully',
        });
        handleClose();
      }
    },
    onError: (error) => {
      notification.error({
        message: error.message,
      });
    },
  });

  const updateAdmin = () => {
    updateAdminName({
      variables: {
        id: data?.institution?.administrator?.id,
        newUser: {
          firstname: fieldInputs.firstName,
          lastname: fieldInputs.lastName,
        },
      },
    });
  };

  const [createInstititution, { data: newInstitution, loading }] = useMutation(CREATE_INSTITUTION, {
    onCompleted() {
      notification.success({
        message: 'Sucess!',
        description: 'Institution Successfully Created',
      });
      handleNextTab(activeTab + 1);
    },
    onError(error) {
      notification.error({
        message: 'Error!',
        description: error?.message,
      });
    },
  });

  const [updateInstititution, { loading: updateRequestLoading }] = useMutation(UPDATE_INSTITUTION, {
    onCompleted: (response) => {
      const { ok, errors } = response?.updateInstitution;
      if (ok) {
        notification.success({
          message: 'Sucess!',
          description: 'Institution Successfully Updated',
        });
      } else {
        notification.error({
          message: 'Error!',
          description: errors?.messages,
        });
      }
      if (activeTab !== 4) {
        handleNextTab(activeTab + 1);
      }
    },
    onError: (error) => {
      notification.error({
        message: 'Error!',
        description: error?.message,
      });
    },
  });

  const [createInstititutionAdmin, { loading: createInstititutionAdminRequestLoading }] =
    useMutation(CREATE_INSTITUTION_ADMIN, {
      onError() {
        notification.error({
          message: 'Error!',
          description: 'Institution Administrator Creation Failed',
        });
      },
    });

  useEffect(() => {
    if (!!institutionId && !!data) {
      setFieldInputs({
        ...data?.institution,
        firstName: data?.institution?.administrator?.firstname,
        lastName: data?.institution?.administrator?.lastname,
        adminEmail: data?.institution?.administrator?.email,
        subDomain: data?.institution?.subdomain,
      });
    }
  }, [institutionId, data]);

  const getHeaderButtonProps = () => {
    if (!isEditMode && activeTab !== 0 && activeTab !== 4) {
      return [
        {
          text: 'Save & Exit',
          variant: 'outlined',
          onClick: handleSaveAndExit,
        },
      ];
    } else if (isEditMode) {
      return [
        {
          text: 'Update',
          variant: 'contained',
          color: 'primary',
          onClick: activeTab === 4 ? () => updateAdmin() : () => handleUpsert(true),
        },
      ];
    }
    return [];
  };

  const createInstitutionMutationRequest = (variables) => {
    createInstititution({
      variables: {
        ...variables,
        status: InstitutionStatus.DRAFT,
      },
    }).then(({ data }) => {
      const institutionId = data?.createInstitution?.institution?.id;
      history.push(`${pathname}?institutionId=${institutionId}&mode=draft`);
    });
  };

  const createInstititutionAdminMutationRequest = (adminVariables, updateVariables) => {
    createInstititutionAdmin({
      variables: adminVariables,
    }).then(() => {
      updateInstititution({
        variables: {
          ...updateVariables,
          status: isDraftMode ? InstitutionStatus.ACTIVE : updateVariables.status,
        },
      }).then(() => {
        handleClose();
      });
    });
  };

  const updateInstititutionMutationRequest = (variables, shouldExit) => {
    updateInstititution({
      variables: {
        ...variables,
        status: activeTab === 4 && !isEditMode ? InstitutionStatus.ACTIVE : variables.status,
      },
    }).then(() => {
      if (shouldExit) {
        handleClose();
      }
    });
  };

  const handleInputChange = (changeset) => {
    setFieldInputs((prevState) => ({
      ...prevState,
      ...changeset,
    }));
  };

  const handleNextTab = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  const formatUpdateVariables = (values) => {
    // The update endpoint only accepts File object types and not strings.
    if (typeof values?.logo === 'string') {
      delete values?.logo;
    }

    if (typeof values?.favicon === 'string') {
      delete values?.favicon;
    }
  };

  const handleSaveAndExit = () => {
    //@todo
    //Too many repeated logic between broker functions like this and handleUpsert
    //Hence we need to refactor and properly collocate logic
    //A huge part of the refactoring should also be to store the state of our values
    //within react-hooks-form. The current fieldInputs is not sustainable
    const variables = {
      institutionId: institutionId || newInstitution?.createInstitution?.institution?.id || null,
      ...fieldInputs,
      isActive: false,
      subdomain: fieldInputs?.subDomain,
      url: parseUrl(fieldInputs?.subDomain),
      status: InstitutionStatus.DRAFT,
    };

    formatUpdateVariables(variables);

    updateInstititution({
      variables,
    }).then(() => handleClose());
  };

  const handleUpsert = (shouldExit) => {
    const creationVariables = {
      ...fieldInputs,
      isActive: false,
      subdomain: fieldInputs?.subDomain,
      url: parseUrl(fieldInputs?.subDomain),
    };
    const updateVariables = {
      institutionId: institutionId || newInstitution?.createInstitution?.institution?.id || null,
      ...fieldInputs,
      isActive: false,
      subdomain: fieldInputs?.subDomain,
      url: parseUrl(fieldInputs?.subDomain),
    };

    formatUpdateVariables(updateVariables);

    const createAdminVariables = {
      institutionId: institutionId || newInstitution?.createInstitution?.institution?.id || null,
      firstname: fieldInputs?.firstName,
      lastname: fieldInputs?.lastName,
      email: fieldInputs?.adminEmail,
    };

    if (!isEditMode && !isDraftMode && activeTab === 0) {
      createInstitutionMutationRequest(creationVariables);
    } else if (!isEditMode && activeTab === 4) {
      createInstititutionAdminMutationRequest(createAdminVariables, updateVariables);
    } else {
      updateInstititutionMutationRequest(updateVariables, shouldExit);
    }
  };

  const handleClose = () => {
    isEditMode ? history.goBack() : history.push(PrivatePaths.INSTITUTIONS);
  };

  return (
    <LoadingView
      isLoading={
        loading ||
        updateRequestLoading ||
        createInstititutionAdminRequestLoading ||
        isLoadingGetInstitution
      }
      size={60}>
      <RegistrationLayout
        onClose={handleClose}
        title={isEditMode ? 'Edit School' : 'School creation'}
        hasHeaderButton
        headerButtons={getHeaderButtonProps()}>
        <VerticalTabs
          handleNextTab={handleNextTab}
          activeTab={activeTab}
          tabList={[
            {
              label: 'Profile',
              component: (
                <SchoolProfile
                  handleNextTab={handleNextTab}
                  activeTab={activeTab}
                  handleInputChange={handleInputChange}
                  fieldInputs={fieldInputs}
                  handleUpsert={handleUpsert}
                  isEditMode={isEditMode}
                />
              ),
            },
            {
              label: 'Academic program',
              component: (
                <AcademicProgramTab
                  handleNextTab={handleNextTab}
                  activeTab={activeTab}
                  handleInputChange={handleInputChange}
                  fieldInputs={fieldInputs}
                  handleUpsert={handleUpsert}
                  isEditMode={isEditMode}
                  setFieldInputs={setFieldInputs}
                  institutionId={institutionId}
                />
              ),
            },
            {
              label: 'Contact',
              component: (
                <ContactDetails
                  handleNextTab={handleNextTab}
                  activeTab={activeTab}
                  handleInputChange={handleInputChange}
                  fieldInputs={fieldInputs}
                  handleUpsert={handleUpsert}
                  isEditMode={isEditMode}
                />
              ),
            },
            {
              label: 'Brand assets',
              component: (
                <BrandAssets
                  handleNextTab={handleNextTab}
                  activeTab={activeTab}
                  handleInputChange={handleInputChange}
                  fieldInputs={fieldInputs}
                  handleUpsert={handleUpsert}
                  isEditMode={isEditMode}
                />
              ),
            },
            {
              label: 'Administrator',
              component: (
                <Administrator
                  handleNextTab={handleNextTab}
                  activeTab={activeTab}
                  handleInputChange={handleInputChange}
                  fieldInputs={fieldInputs}
                  handleUpsert={handleUpsert}
                  isEditMode={isEditMode}
                />
              ),
            },
          ]}
        />
      </RegistrationLayout>
    </LoadingView>
  );
};

export default React.memo(SchoolCreation);
