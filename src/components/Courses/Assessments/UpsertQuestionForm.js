import { memo, useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Paper,
  makeStyles,
  Typography,
  Box,
  IconButton,
  Radio,
  Button,
  TextField,
} from '@material-ui/core';
import { useForm, Controller } from 'react-hook-form';
import DragIndicatorOutlinedIcon from '@material-ui/icons/DragIndicatorOutlined';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import AddIcon from '@material-ui/icons/Add';

import { borderRadius, colors } from '../../../Css';
import { AssessmentQuestionType } from 'utils/constants';
import { getFormError } from 'utils/formError';
import Wysiwyg from 'reusables/Wysiwyg';
import { useNotification } from 'reusables/NotificationBanner';

const CurrentPanel = {
  DETAILS: `DETAILS`,
  UPSERT: `UPSERT`,
};

const UpsertQuestionForm = ({ data, onChange, onRemove }) => {
  const classes = useStyles();
  const { id: questionId, type, score, body } = data;
  const [currentPanel, setCurrentPanel] = useState(null);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [optionIds, setOptionIds] = useState([]);
  const { control, errors, reset, handleSubmit } = useForm();
  const questionType =
    type === AssessmentQuestionType.MULTI_CHOICE ? 'MULTI CHOICE' : 'TEXT & ESSAY';
  const notification = useNotification();

  useEffect(() => {
    if (data.body) {
      setCurrentPanel(CurrentPanel.DETAILS);
      return;
    }
    setCurrentPanel(CurrentPanel.UPSERT);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setSelectedOptionId(data?.options?.find((option) => option.isAnswer)?.id);

    const { hooksFormOptions, stateOptions } = getHooksFormAndStateOptionsOnMount();
    const wysiwygHooksState = setWYSIWYGHooksStateOnMount();
    setOptionIds(stateOptions);

    reset({
      body: type === AssessmentQuestionType.MULTI_CHOICE ? body : wysiwygHooksState,
      score,
      ...hooksFormOptions,
    });
    // eslint-disable-next-line
  }, []);

  const setWYSIWYGHooksStateOnMount = () => {
    if (type === AssessmentQuestionType.TEXT_ESSAY) {
      return {
        html: body,
        editorState: null,
      };
    }
    return { html: null, editorState: null };
  };

  const getHooksFormAndStateOptionsOnMount = () => {
    const hooksFormOptions = {};
    const stateOptions = [];

    data.options.forEach((option) => {
      hooksFormOptions[`option-${option.id}`] = option.body;
      stateOptions.push({ new: option.new, id: option.id });
    });

    return { hooksFormOptions, stateOptions };
  };

  const getOptions = (values) => {
    return optionIds.map((optionId) => ({
      id: optionId.id,
      body: values[`option-${optionId.id}`],
      isAnswer: optionId.id === selectedOptionId,
      new: optionId.new,
    }));
  };

  const onSubmit = (values) => {
    if (!selectedOptionId && type === AssessmentQuestionType.MULTI_CHOICE) {
      notification.error({
        message: 'Please select an option',
      });
      return;
    }

    onChange({
      id: questionId,
      type,
      body: type === AssessmentQuestionType.MULTI_CHOICE ? values.body : values.body.html,
      score: values.score,
      options: getOptions(values),
      new: data.new,
    });
    setCurrentPanel(CurrentPanel.DETAILS);
  };

  const handleAddOption = () => {
    setOptionIds((prevState) => [...prevState, { id: `${Date.now()}`, new: true }]);
  };

  const handleCancel = () => {
    setCurrentPanel(CurrentPanel.DETAILS);
    !body && onRemove();
  };

  const renderActionButtonsForDetailsPanel = () => {
    return (
      <Box display="flex" alignItems="flex-end" justifyContent="space-between">
        <Typography color="textSecondary" variant="caption">
          {type === AssessmentQuestionType.MULTI_CHOICE ? `${optionIds.length} options` : ''}
        </Typography>
        <Box display="flex">
          <IconButton size="small" onClick={() => setCurrentPanel(CurrentPanel.UPSERT)}>
            <CreateOutlinedIcon />
          </IconButton>
          <Box ml={2}>
            <IconButton size="small" onClick={() => onRemove(questionId)}>
              <DeleteOutlinedIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    );
  };

  const renderDetailsPanel = () => {
    return (
      <Box
        style={{ display: currentPanel === CurrentPanel.DETAILS ? 'block' : 'none' }}
        p={8}
        component={Paper}
        elevation={0}
        className={classes.container}
      >
        <Box display="flex">
          <Typography color="textSecondary">
            <DragIndicatorOutlinedIcon />
          </Typography>
          <Box width="100%">
            <Typography color="textSecondary" variant="caption">
              {questionType}
            </Typography>
            <Typography
              color="textSecondary"
              variant="body1"
              dangerouslySetInnerHTML={{ __html: body }}
            />
            {renderActionButtonsForDetailsPanel()}
          </Box>
        </Box>
      </Box>
    );
  };

  const renderActionButtonsForUpsertPanel = () => {
    return (
      <Box
        component={Paper}
        elevation={0}
        p={4}
        display="flex"
        square
        justifyContent="flex-end"
        style={{ borderTop: `1px solid ${colors.secondaryLightGrey}` }}
      >
        <Button
          disableElevation
          onClick={handleCancel}
          style={{ border: `1px solid ${colors.secondaryLightGrey}` }}
        >
          Cancel
        </Button>
        <Box ml={4}>
          <Button
            variant="contained"
            color="primary"
            disableElevation
            onClick={handleSubmit(onSubmit)}
          >
            {body ? 'Update' : 'Add'} Question
          </Button>
        </Box>
      </Box>
    );
  };

  const renderOption = (optionId, index) => {
    return (
      <Box
        display="flex"
        alignItems="center"
        py={4}
        style={{ borderBottom: `1px solid ${colors.secondaryLightGrey}` }}
      >
        <Controller
          name={`option-${optionId.id}`}
          control={control}
          rules={{
            required: { value: true, message: 'option is required' },
          }}
          render={({ ref, ...rest }) => (
            <TextField
              {...rest}
              inputRef={ref}
              fullWidth
              variant="outlined"
              label="Add an option here"
              error={getFormError(`option-${optionId.id}`, errors).hasError}
              helperText={getFormError(`option-${optionId.id}`, errors).message}
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}
        />
        <Box ml={4}>
          <Radio
            checked={selectedOptionId === optionId.id}
            onChange={(evt) => setSelectedOptionId(evt.target.value)}
            value={optionId.id}
            color="primary"
            name={`option ${index}`}
            inputProps={{ 'aria-label': `option ${index}` }}
          />
        </Box>
      </Box>
    );
  };

  const renderMultiChoiceOptions = () => {
    return (
      <Box>
        <Typography color="textSecondary" variant="caption">
          OPTIONS
        </Typography>
        {optionIds.length > 0 && (
          <Paper elevation={0} square>
            <Box px={4}>
              {optionIds?.map((optionId) => (
                <Fragment key={optionId.id}>{renderOption(optionId)}</Fragment>
              ))}
            </Box>
          </Paper>
        )}
        <Box mt={8} display="flex" justifyContent="flex-end">
          <Button color="primary" onClick={handleAddOption} startIcon={<AddIcon />}>
            Add new option
          </Button>
        </Box>
      </Box>
    );
  };

  const renderEssayForm = () => {
    return (
      <Box mt={8}>
        <Controller
          name="body"
          control={control}
          rules={{
            required: true,
            validate: (editorValue) => Boolean(editorValue.html),
          }}
          render={({ onChange, value }) => {
            return <Wysiwyg value={value} onChange={(value) => onChange(value)} />;
          }}
        />
        <Box mt={8}>
          <Controller
            name="score"
            control={control}
            rules={{
              required: true,
              min: { value: 0, message: 'Value cannot be less than 0' },
            }}
            render={({ ref, ...rest }) => (
              <TextField
                {...rest}
                type="number"
                inputRef={ref}
                fullWidth
                variant="outlined"
                label="Score"
                error={getFormError('score', errors).hasError}
                helperText={getFormError('score', errors).message}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        </Box>
      </Box>
    );
  };

  const renderMultiChoiceForm = () => {
    return (
      <Box mt={8}>
        <Controller
          name="body"
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
              label="Question"
              error={getFormError('body', errors).hasError}
              helperText={getFormError('body', errors).message}
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}
        />
        <Box mt={8}>{renderMultiChoiceOptions()}</Box>
      </Box>
    );
  };

  const renderUpsertPanel = () => {
    return (
      <Box
        style={{ display: currentPanel === CurrentPanel.UPSERT ? 'block' : 'none' }}
        borderRadius={borderRadius.default}
        className={classes.container}
      >
        <Box p={4} className="greyBackground">
          <Box display="flex">
            <Typography color="textSecondary">
              <DragIndicatorOutlinedIcon />
            </Typography>
            <Box width="100%">
              <Typography color="textSecondary" variant="caption">
                {questionType}
              </Typography>
              {type === AssessmentQuestionType.MULTI_CHOICE
                ? renderMultiChoiceForm()
                : renderEssayForm()}
            </Box>
          </Box>
        </Box>
        {renderActionButtonsForUpsertPanel()}
      </Box>
    );
  };

  return (
    <>
      {renderDetailsPanel()}
      {renderUpsertPanel()}
    </>
  );
};

const useStyles = makeStyles({
  container: {
    border: `1px solid ${colors.secondaryLightGrey}`,
    '& .greyBackground': {
      background: colors.background,
    },
  },
});

UpsertQuestionForm.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    score: PropTypes.number,
    body: PropTypes.string,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        isAnswer: PropTypes.bool.isRequired,
        new: PropTypes.bool,
      }),
    ),
  }),
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default memo(UpsertQuestionForm);
