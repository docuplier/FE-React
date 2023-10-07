import { useRef, useEffect } from 'react';

/**
 * A custom useEffect hook that only triggers on updates, not on initial mount
 * see from: https://stackoverflow.com/a/55075818/1526448
 * @param {Function} effect
 * @param {Array<any>} dependencies
 */
export const useUpdateEffect = (effect, dependencies) => {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      effect();
    }
    // eslint-disable-next-line
  }, dependencies);
};
