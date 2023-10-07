import React, { useState } from 'react';
import RegistrationLayout from 'Layout/RegistrationLayout';
import { useHistory, Switch } from 'react-router-dom';

import LoadingView from 'reusables/LoadingView';
import VerticalTabs from 'reusables/VerticalTabs';
import Sessions from 'components/Institutions/SchoolManagement/Sessions';
import AcademicProgramTab from 'components/Institutions/SchoolManagement/AcademicProgramTab';
import PrivateRoute from 'routes/PrivateRoute';
import { PrivatePaths } from 'routes';

const SchoolManagement = () => {
  const history = useHistory();
  const [activeTab, setActiveTab] = useState(0);

  const handleClose = () => {
    history.goBack();
  };

  const handleNextTab = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  const renderContent = () => {
    return (
      <Switch>
        <PrivateRoute
          path={`${PrivatePaths.INSTITUTIONS}/:institutionId/school-management`}
          exact={true}
          component={AcademicProgramTab}
        />
        <PrivateRoute
          path={`${PrivatePaths.INSTITUTIONS}/:institutionId/school-management/programs/:programId`}
          exact={true}
          component={Sessions}
        />
      </Switch>
    );
  };

  return (
    <LoadingView isLoading={false}>
      <RegistrationLayout onClose={handleClose} title="School Management" hasHeaderButton={false}>
        <VerticalTabs
          handleNextTab={handleNextTab}
          activeTab={activeTab}
          tabList={[
            {
              label: 'Academic Programs',
              component: renderContent(),
            },
          ]}
        />
      </RegistrationLayout>
    </LoadingView>
  );
};

export default React.memo(SchoolManagement);
