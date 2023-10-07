import { memo, useState } from 'react';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import {
  Grid,
  Typography,
  Box,
  TextField,
  Divider,
  makeStyles,
  withStyles,
  styled,
  Tabs,
  Tab,
  Tooltip,
} from '@material-ui/core';

import { ReactComponent as GlobalExit } from 'assets/svgs/globalExitButton.svg';
import { ReactComponent as PlaygroundButton } from 'assets/svgs/playgroundButton.svg';

import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQuery } from '@apollo/client';

import RegistrationLayout from 'Layout/RegistrationLayout';
import { fontWeight, colors } from '../../Css';
import { getFormError } from 'utils/formError';
import { AssessmentStatus, WorksheetUploadFormats } from 'utils/constants';
import FileUpload from 'reusables/FileUpload';
import CreateAssessmentSettingsForm from 'components/Courses/Assessments/CreateAssessmentSettingsForm';
import CreateAssessmentGradeForm from 'components/Courses/Assessments/CreateAssessmentGradeForm';
import UpsertQuestionFormList from 'components/Courses/Assessments/UpsertQuestionFormList';
import AssessmentCSVSample from 'assets/csv/assessment-csv-sample.csv';
import {
  calculateTotalObtainableScore,
  formatQuestionsToRequestFormat,
  createTargetObject,
  parseQuestionsResponse,
  readAssessmentCSV,
} from 'utils/AssessmentUtils';

import {
  CREATE_GLOBAL_ASSESSMENT,
  CREATE_COURSE_ASSESSMENT,
  DELETE_COURSE_ASSESSMENT_QUESTION,
} from 'graphql/mutations/courses';
import { useNotification } from 'reusables/NotificationBanner';
import LoadingView from 'reusables/LoadingView';
import { GET_COURSE_ASSESSMENT_BY_ID } from 'graphql/queries/courses';
import { PrivatePaths } from 'routes';
import Target from 'components/Courses/Assessments/Target';

const AssessmentEntry = {
  SINGLE: `Single entry`,
  BULK: `Bulk entry`,
};

const AssessmentCreation = () => {
  const classes = useStyles();
  const history = useHistory();
  const { courseId } = useParams();
  const { search, pathname } = useLocation();
  const { control, errors, handleSubmit, watch, reset, setValue } = useForm();
  const params = new URLSearchParams(search);
  const notification = useNotification();
  const [currentAssessmentEntryTab, setCurrentAssessmentEntryTab] = useState(0);
  const [questionsFromBulkEntry, setQuestionsFromBulkEntry] = useState(null);
  const questionsFromSingleEntry = watch('singleEntry');
  const GlobalAssessment = watch('isGlobalAssessment');
  const isGlobalAssessment = GlobalAssessment ? GlobalAssessment : false;
  const tabs = Object.values(AssessmentEntry);
  const isSingleEntry = tabs[currentAssessmentEntryTab] === AssessmentEntry.SINGLE;
  const questions = (isSingleEntry ? questionsFromSingleEntry : questionsFromBulkEntry) || [];
  const assessmentId = params.get('id');
  const location = useLocation();
  const isDfa = location?.pathname?.startsWith('/dfa');
  const [createAssessment, { loading }] = useMutation(CREATE_COURSE_ASSESSMENT, {
    onCompleted: (response) => {
      let {
        createAssessment: { ok, errors },
      } = response;

      if (ok) {
        notification.success({
          message: 'Assessment created successfully',
        });
        // conditionally render the views for the global and course
        history.push(`${PrivatePaths.COURSES}/${courseId}`);

        return;
      }

      notification.error({
        message: errors?.map((error) => error.messages).join('. '),
      });
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const [createGlobalAssessment, { loading: loadingGlobalAssessment }] = useMutation(
    CREATE_GLOBAL_ASSESSMENT,
    {
      onCompleted: (response) => {
        let {
          createGlobalAssessment: { ok, errors },
        } = response;

        if (ok) {
          notification.success({
            message: 'Global Assessment created successfully',
          });
          // conditionally render the views for the global and course
          history.push(`${PrivatePaths.ASSESSMENTS}`);

          return;
        }

        notification.error({
          message: errors?.map((error) => error.messages).join('. '),
        });
      },
      onError: (error) => {
        notification.error({
          message: error?.message,
        });
      },
    },
  );
  const [deleteQuestion] = useMutation(DELETE_COURSE_ASSESSMENT_QUESTION, {
    onCompleted: () => {
      notification.success({
        message: 'Question deleted successfully',
      });
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const { loading: isLoadingAssessment, data } = useQuery(GET_COURSE_ASSESSMENT_BY_ID, {
    variables: {
      assessmentId,
    },
    skip: !assessmentId,
    onCompleted: (data) => {
      const assessment = data.assessment;

      const targetLevels = Array.isArray(assessment.assessmentTargets?.targetLevels)
        ? Array.from(new Set(assessment.assessmentTargets?.targetLevels?.map((item) => item.id)))
        : [];
      const targetDepartments = Array.isArray(assessment.assessmentTargets?.targetDepartments)
        ? Array.from(
            new Set(assessment.assessmentTargets?.targetDepartments?.map((item) => item.id)),
          )
        : [];
      reset({
        dueDate: assessment.dueDate,
        duration: assessment.duration,
        dueTime: assessment.dueTime,
        passMark: assessment.passMark,
        startDate: assessment.startDate,
        startTime: assessment.startTime,
        title: assessment.title,
        isGlobalAssessment: assessment.isGlobalAssessment,
        isAllDepartment: assessment.assessmentTargets?.isAllDepartment,
        isAllLevels: assessment.assessmentTargets?.isAllLevels,
        targetDepartments: targetDepartments,
        targetLevels: targetLevels,
        target: assessment.target,
        totalObtainableScore: assessment.totalObtainableScore,
        singleEntry: parseQuestionsResponse(assessment.assessmentQuestions),
      });
    },
  });

  const getHeaderButtonProps = () => {
    return [
      {
        text: 'Save as draft',
        variant: 'outlined',
        onClick: handleSubmit((values) => onSubmit(values, AssessmentStatus.DRAFT)),
      },
      {
        text: 'Publish',
        variant: 'contained',
        color: isDfa ? '' : 'primary',
        disabled: questions?.length < 1,
        onClick: handleSubmit((values) => onSubmit(values, AssessmentStatus.PUBLISHED)),
      },
    ];
  };

  const onSubmit = (values, status) => {
    const assessmentDetails = {
      id: assessmentId ? assessmentId : undefined,
      dueDate: values.dueDate,
      duration: Number(values.duration),
      dueTime: values.dueTime,
      passMark: Number(values.passMark),
      startDate: values.startDate,
      startTime: values.startTime,
      title: values.title,
      isGlobalAssessment: isGlobalAssessment,
      course: courseId,
      status,
      totalObtainableScore: calculateTotalObtainableScore(questions),
      questions: isSingleEntry ? formatQuestionsToRequestFormat(values.singleEntry) : undefined,
      file: isSingleEntry ? undefined : values.bulkEntry,
      targets: isGlobalAssessment ? createTargetObject(values) : null,
    };

    if (isGlobalAssessment) {
      createGlobalAssessment({ variables: { newAssessment: assessmentDetails } });
    } else {
      createAssessment({ variables: { newAssessment: assessmentDetails } });
    }
  };

  const handleChangeFile = (callbackFn) => async (file) => {
    callbackFn(file);

    const questionsFromBulkEntry = file ? await readAssessmentCSV(file) : [];
    setQuestionsFromBulkEntry(questionsFromBulkEntry);
  };

  const renderAssessmentEntry = () => {
    return (
      <>
        <Box style={{ display: isSingleEntry ? 'block' : 'none' }}>
          <Controller
            name="singleEntry"
            control={control}
            rules={{ required: { value: isSingleEntry } }}
            render={({ ...rest }) => (
              <UpsertQuestionFormList {...rest} deleteQuestion={deleteQuestion} isDfa={isDfa} />
            )}
          />
        </Box>
        <Box style={{ display: isSingleEntry ? 'none' : 'block' }}>
          <Controller
            name="bulkEntry"
            control={control}
            rules={{ required: { value: !isSingleEntry } }}
            render={({ onChange, value, ...rest }) => (
              <FileUpload
                accept={WorksheetUploadFormats}
                onChange={handleChangeFile(onChange)}
                fileSample={AssessmentCSVSample}
                file={value}
                {...rest}
              />
            )}
          />
        </Box>
      </>
    );
  };

  const renderAssessmentDetails = () => {
    return (
      <Box>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography color="textSecondary" variant="body2">
            Assessment details
          </Typography>
          <Box ml={4} width="80%">
            <Divider className={classes.divider} />
          </Box>
        </Box>
        <Box my={12}>
          <Box style={{ borderBottom: `1px solid ${colors.secondaryLightGrey}` }}>
            <StyledTabs
              isDfa={isDfa}
              textColor="primary"
              indicatorColor="primary"
              value={currentAssessmentEntryTab}
              onChange={(_evt, value) => setCurrentAssessmentEntryTab(value)}
            >
              {Object.values(AssessmentEntry).map((tab) => (
                <StyledTab disableRipple isDfa={isDfa} label={tab} key={tab} />
              ))}
            </StyledTabs>
          </Box>

          <Box py={12}>{renderAssessmentEntry()}</Box>
        </Box>
      </Box>
    );
  };

  const renderCreateAssessmentSection = () => {
    return (
      <Box>
        <Typography color="textPrimary" variant="h5" style={{ fontWeight: fontWeight.medium }}>
          Create Assessment
        </Typography>
        <Typography color="textPrimary" variant="body1">
          The Prunedge Smart Toolbar groups all actions by scope into 4 categories.
        </Typography>
        <Box my={16}>
          <Controller
            name="title"
            control={control}
            rules={{
              required: true,
            }}
            render={({ ref, ...rest }) => (
              <TextField
                {...rest}
                inputRef={ref}
                fullWidth
                variant="outlined"
                label="Assessment title"
                error={getFormError('title', errors).hasError}
                helperText={getFormError('title', errors).message}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        </Box>
        {renderAssessmentDetails()}
      </Box>
    );
  };
  const isCreateGlobalAssessmentPage =
    pathname === '/assessments/create-assessment' ||
    pathname === '/dfa-assessments/create-assessment';

  const renderRightSection = () => {
    return (
      <Box height={'80vh'} overflow={'auto'} position="static">
        {/* render only if you want to create global assessment */}
        {isCreateGlobalAssessmentPage && (
          <Target control={control} watch={watch} setValue={setValue} errors={errors} data={data} />
        )}
        <Box mt={12}>
          <CreateAssessmentSettingsForm control={control} errors={errors} watch={watch} />
        </Box>
        <Box mt={12}>
          <CreateAssessmentGradeForm
            isDfa={isDfa}
            control={control}
            errors={errors}
            totalObtainableScore={calculateTotalObtainableScore(questions)}
          />
        </Box>
      </Box>
    );
  };

  return (
    <>
      <Box
        position="fixed"
        left="90px"
        bottom="150px"
        height="40px"
        width="40px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        style={{
          cursor: 'pointer',
        }}
        borderRadius="50%"
      >
        <div
          style={{
            position: 'fixed',
            cursor: 'pointer',
          }}
        >
          <Tooltip
            arrow
            placement="right-center"
            style={{
              fontSize: '20px',
            }}
            title="Exit to users page"
          >
            <GlobalExit style={{ cursor: 'pointer' }} />
          </Tooltip>
        </div>
      </Box>
      <Box
        position="fixed"
        left="90px"
        bottom="60px"
        height="40px"
        width="40px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        style={{
          cursor: 'pointer',
        }}
        borderRadius="50%"
      >
        <div
          style={{
            position: 'fixed',
            cursor: 'pointer',
          }}
        >
          <Tooltip
            arrow
            placement="right-center"
            style={{
              fontSize: '20px',
            }}
            title="Exit to users page"
          >
            <PlaygroundButton style={{ cursor: 'pointer' }} />
          </Tooltip>
        </div>
      </Box>
      <RegistrationLayout
        onClose={() => history.goBack()}
        title="Add New"
        hasHeaderButton
        isDfa={isDfa}
        headerButtons={getHeaderButtonProps()}
      >
        <LoadingView isLoading={loading || isLoadingAssessment || loadingGlobalAssessment}>
          <Grid container>
            <Grid item xs={12} md={8}>
              {renderCreateAssessmentSection()}
            </Grid>
            <Grid item xs={0} md={1} />
            <Grid item xs={12} md={3}>
              {renderRightSection()}
            </Grid>
          </Grid>
        </LoadingView>
      </RegistrationLayout>
    </>
  );
};

const useStyles = makeStyles({
  divider: {
    width: '100%',
  },
});
const StyledTabs = withStyles((theme) => ({
  root: {
    height: '100%',
    [theme.breakpoints.down('sm')]: {
      paddingRight: 20,
    },
    '& .MuiTabs-scroller': {
      overflowX: 'auto !important',
      scrollbarWidth: 'thin',
      scrollbarColor: '#F1F2F6',
    },
    '& .MuiTabs-scroller::-webkit-scrollbar-track': {
      background: 'white',
    },
    '& .MuiTabs-scroller::-webkit-scrollbar-thumb ': {
      backgroundColor: '#F1F2F6',
      borderRadius: 8,
    },
    '& .MuiTabs-scroller::-webkit-scrollbar': {
      width: 5,
    },
  },
}))((props) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ style: { background: props.isDfa && '#3CAE5C' }, children: <span /> }}
  />
));

const StyledTab = styled((props) => (
  <Tab style={{ color: props.isDfa ? '#3CAE5C' : 'primary' }} disableRipple {...props} />
))(({ theme }) => ({
  textTransform: 'none',
  marginRight: theme.spacing(8),
  fontSize: theme.typography.fontSizeSmall,
  '&.Mui-selected': {
    color: theme.palette.primary.main,
  },
  '&.Mui-focusVisible': {
    backgroundColor: 'rgba(100, 95, 228, 0.32)',
  },
}));

export default memo(AssessmentCreation);
