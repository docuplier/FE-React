import XLSX from 'xlsx';
const { AssessmentQuestionType } = require('./constants');

export const readAssessmentCSV = (file) => {
  return new Promise((resolve, reject) => {
    try {
      let reader = new FileReader();

      reader.onload = function (e) {
        let data = new Uint8Array(e.target.result);
        let workbook = XLSX.read(data, { type: 'array' });
        let records = workbook.SheetNames.reduce((acc, sheet) => {
          let worksheet = workbook.Sheets[sheet];
          let record = XLSX.utils.sheet_to_json(worksheet, {
            raw: false,
            defval: '',
            blankrows: true,
          });
          return [...acc, ...record];
        }, []);

        resolve(records);
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      reject(err);
    }
  });
};

export const calculateTotalObtainableScore = (questions) => {
  return (
    questions?.reduce((acc, question) => {
      if (question.type === AssessmentQuestionType.TEXT_ESSAY) {
        return acc + Number(question.score || 0);
      }

      return acc + 1;
    }, 0) || 0
  );
};

export const formatAssessmentSubmissionResponse = (submissions) => {
  return submissions?.reduce((acc, submission) => {
    acc[submission.question.id] = {
      selectedOptionId: submission?.option?.id,
      questionType: submission.question.type,
      reviewedScore: submission.score,
      answer: submission.answer,
    };

    return acc;
  }, {});
};

export const formatAssessmentGradeResponse = (assessmentGrade = {}) => {
  return {
    student: {
      firstname: assessmentGrade?.user?.firstname,
      lastname: assessmentGrade?.user?.lastname,
      id: assessmentGrade?.user?.id,
    },
    gradeStatus: assessmentGrade?.gradeStatus,
    earnedScore: assessmentGrade?.score,
    assessment: {
      id: assessmentGrade?.assessment?.id,
      title: assessmentGrade?.assessment?.title,
      passMark: assessmentGrade?.assessment?.passMark,
      totalObtainableScore: assessmentGrade?.assessment?.totalObtainableScore,
    },
    questionStats: {
      total: assessmentGrade?.assessment?.totalQuestions,
      totalMultiChoiceQuestions: assessmentGrade?.assessment?.multichoiceQuestionCount,
      textQuestionCount: assessmentGrade?.assessment?.textQuestionCount,
    },
    assessmentQuestions: parseAssessmentQuestions(assessmentGrade?.assessment?.assessmentQuestions),
  };
};
export const createTargetObject = (v) => {
  return {
    targetDepartments: v?.targetDepartments,
    targetLevels: v?.targetLevels,
    isAllLevels: v?.isAllLevels,
    isAllDepartment: v?.isAllDepartment,
  };
};
export const formatQuestionsToRequestFormat = (questions) => {
  return questions.reduce((acc, question) => {
    const options = question.options.map((option) => {
      let _option = { ...option };
      if (_option.new) _option.id = undefined;
      delete _option.new;

      return _option;
    });

    let _question = { ...question };
    if (_question.new) _question.id = undefined;
    delete _question.new;

    acc.push({ ..._question, options });
    return acc;
  }, []);
};

export const parseQuestionsResponse = (questions) => {
  return questions.reduce((acc, question) => {
    const options = question.options.map((option) => {
      return {
        id: option.id,
        body: option.body,
        isAnswer: option.isAnswer,
        new: false,
      };
    });

    acc.push({
      id: question.id,
      body: question.body,
      score: question.score,
      type: question.type,
      new: false,
      options,
    });

    return acc;
  }, []);
};

const parseAssessmentQuestions = (assessmentQuestions) => {
  return (
    assessmentQuestions?.map((question) => ({
      id: question.id,
      body: question.body,
      attainableScore: question.score,
      type: question.type,
      options: question?.options?.map((option) => ({
        id: option.id,
        body: option.body,
        isAnswer: option.isAnswer,
      })),
    })) || []
  );
};
