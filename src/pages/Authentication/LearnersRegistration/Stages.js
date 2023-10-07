import React, { useState } from 'react';
import RegistrationLayout from 'Layout/RegistrationLayout';
import VerticalTabs from 'reusables/VerticalTabs';
import PersonalData from 'components/Authentication/LearnersRegistration/PersonalData';
import ContactData from 'components/Authentication/LearnersRegistration/ContactData';
// import Documents from 'components/Authentication/LearnersRegistration/Documents';
import Interest from 'components/Authentication/LearnersRegistration/Interest';

const Stages = () => {
  const [activeTab, setActiveTab] = useState(0);
  // const [documents, setDocuments] = useState({
  //   certificateOfOrigin: '',
  //   birthCertificate: '',
  // });
  const handleNextTab = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  // const handleDocumentChange = (input) => (file) => {
  //   setDocuments({ ...documents, [input]: file });
  // };

  return (
    <RegistrationLayout title="Learner's Registration" onClose={() => {}}>
      <VerticalTabs
        handleNextTab={handleNextTab}
        activeTab={activeTab}
        tabList={[
          {
            label: 'Personal Data',
            component: <PersonalData handleNextTab={handleNextTab} activeTab={activeTab} />,
          },
          {
            label: 'Contact Data',
            component: <ContactData handleNextTab={handleNextTab} activeTab={activeTab} />,
          },
          {
            label: 'Interest',
            component: <Interest handleNextTab={handleNextTab} activeTab={activeTab} />,
          },
          // {
          //   label: 'Documents',
          //   component: (
          //     <Documents
          //       handleNextTab={handleNextTab}
          //       activeTab={activeTab}
          //       documents={documents}
          //       handleDocumentChange={handleDocumentChange}
          //     />
          //   ),
          // },
        ]}
      />
    </RegistrationLayout>
  );
};

export default Stages;
