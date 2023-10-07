import { AssessmentCompletionStatus, AssessmentQuestionType } from './constants';

export const AssessmentFailureReasons = {
  START_DATE_NOT_REACHED: 'START_DATE_NOT_REACHED',
  END_DATE_PASSED: 'END_DATE_PASSED',
  CANNOT_TAKE_MORE_THAN_ONCE: 'CANNOT_TAKE_MORE_THAN_ONCE',
  TIME_ELAPSED: 'TIME_ELAPSED',
};

export const canTakeAssessment = ({
  startDate,
  startTime,
  dueDate,
  dueTime,
  completionStatus,
  startedAt,
  duration,
}) => {
  let isCurrentTimeWithinAssessmentDateRangeResult = isCurrentTimeWithinAssessmentDateRange({
    startDate,
    startTime,
    dueDate,
    dueTime,
  });
  let hasAssessmentBeenCompletedResult = hasAssessmentBeenCompleted(completionStatus);
  let hasTimeElapsedResult = hasTimeElapsed(startedAt, duration);

  let result = [
    isCurrentTimeWithinAssessmentDateRangeResult,
    hasAssessmentBeenCompletedResult,
    hasTimeElapsedResult,
  ].find((validator) => !validator.value);

  if (result) return result;
  return {
    value: true,
    reason: null,
  };
};

export const countDownTimer = (startedAt, duration, callbackFunction) => {
  let totalDurationInSeconds = Number(
    ((getActualEndTime({ startedAt, duration }) - Date.now()) / 1000).toFixed(),
  );
  let secondsCount = 0;

  let intervalRef = setInterval(() => {
    if (totalDurationInSeconds <= secondsCount) {
      callbackFunction({ durationLeftInSeconds: 0, done: true });
      clearInterval(intervalRef);
      return;
    }

    let durationLeftInSeconds = totalDurationInSeconds - secondsCount;
    callbackFunction({ durationLeftInSeconds, done: false });
    secondsCount++;
  }, 1000);

  return intervalRef;
};

export const formatAssessmentSubmissionsResponse = (submissions) => {
  return submissions?.reduce((acc, submission) => {
    let {
      question: { type: questionType, id: questionId },
      option,
      answer,
    } = submission;

    acc[questionId] =
      questionType === AssessmentQuestionType.MULTI_CHOICE
        ? option?.id
        : {
            html: answer,
            editorState: null,
          };
    return acc;
  }, {});
};

export const isCurrentTimeWithinAssessmentDateRange = ({
  startDate,
  startTime,
  dueDate,
  dueTime,
}) => {
  const actualStartDate = new Date(`${startDate} ${startTime}`).getTime();
  const actualDueDate = new Date(`${dueDate} ${dueTime}`).getTime();
  const currentDate = Date.now();
  const startTimeDifference = actualStartDate - currentDate;
  const endTimeDifference = actualDueDate - currentDate;

  if (startTimeDifference > 0) {
    return { value: false, reason: AssessmentFailureReasons.START_DATE_NOT_REACHED };
  } else if (endTimeDifference <= 0) {
    return { value: false, reason: AssessmentFailureReasons.END_DATE_PASSED };
  }

  return {
    value: true,
    reason: null,
  };
};

export const randomizeOptions = (options = []) => {
  let results = [];
  let copiedOptions = [...options];

  for (let i = 0; i < options.length; i++) {
    let selectedIndex = Math.ceil(Math.random() * (copiedOptions.length - 1));
    results.push(copiedOptions[selectedIndex]);

    copiedOptions.splice(selectedIndex, 1);
  }

  return results;
};

const hasAssessmentBeenCompleted = (completionStatus) => {
  if (completionStatus === AssessmentCompletionStatus.COMPLETED) {
    return { value: false, reason: AssessmentFailureReasons.CANNOT_TAKE_MORE_THAN_ONCE };
  }

  return {
    value: true,
    reason: null,
  };
};

const hasTimeElapsed = (startedAt, duration) => {
  let actualEndTime = getActualEndTime({ startedAt, duration });
  let currentTime = Date.now();

  if (currentTime >= actualEndTime) {
    return {
      value: false,
      reason: AssessmentFailureReasons.TIME_ELAPSED,
    };
  }

  return {
    value: true,
    reason: null,
  };
};

const getActualEndTime = ({ startedAt, duration }) => {
  let startedAtToMilliseconds = new Date(startedAt).getTime();
  let durationToMilliseconds = duration * 60 * 1000;

  return startedAtToMilliseconds + durationToMilliseconds;
};
