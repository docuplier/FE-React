export const otpExpiryCountDownTimer = (callbackFunc) => {
  let expiresIn = 300;

  let intervalRef = setInterval(() => {
    if (expiresIn === 0) {
      clearInterval(intervalRef);
      callbackFunc({ expiresIn, done: true });
      return;
    }

    expiresIn -= 1;
    callbackFunc({ expiresIn, done: false });
  }, 1000);

  return intervalRef;
};
