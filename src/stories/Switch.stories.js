import React from 'react';

import Switch from 'reusables/Switch';

export default {
  title: 'Switch',
  component: Switch,
};

export const SwitchStory = () => {
  const [isOn, setSwitchState] = React.useState(true);

  const toggleSwitch = (event) => {
    setSwitchState(event.target.checked);
  };

  return <Switch isOn={isOn} handleChange={toggleSwitch} />;
};
