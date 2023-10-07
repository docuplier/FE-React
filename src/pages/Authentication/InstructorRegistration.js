import React, { useState } from 'react';
import RegistrationLayout from 'Layout/RegistrationLayout';
import VerticalTabs from 'reusables/VerticalTabs';
import Welcome from 'components/Authentication/InstructorRegistration/Welcome';
import Contact from 'components/Authentication/InstructorRegistration/Contact';
import About from 'components/Authentication/InstructorRegistration/About';

const Layout = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleNextTab = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  return (
    <RegistrationLayout title="Registration">
      <VerticalTabs
        handleNextTab={handleNextTab}
        activeTab={activeTab}
        tabList={[
          {
            label: 'Welcome',
            component: <Welcome handleNextTab={handleNextTab} activeTab={activeTab} />,
          },
          {
            label: 'Contact details',
            component: <Contact handleNextTab={handleNextTab} activeTab={activeTab} />,
          },
          {
            label: 'About',
            component: <About handleNextTab={handleNextTab} activeTab={activeTab} />,
          },
        ]}
      />
    </RegistrationLayout>
  );
};

export default Layout;
