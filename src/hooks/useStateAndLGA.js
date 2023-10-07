import NaijaStates from 'naija-state-local-government';

export default function useStateAndLGA(state) {
  const values = {
    states: NaijaStates.states(),
    LGAs: state ? NaijaStates.lgas(state).lgas : [],
  };

  return values;
}
