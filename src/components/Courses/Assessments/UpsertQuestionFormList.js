import { memo } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Divider, Typography, makeStyles } from '@material-ui/core';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { colors } from '../../../Css';
import { AssessmentQuestionType } from 'utils/constants';
import UpsertQuestionForm from './UpsertQuestionForm';

const UpsertQuestionFormList = ({ value = [], onChange, deleteQuestion }) => {
  const classes = useStyles();

  const handleAddQuestion = (type) => () => {
    onChange([
      ...value,
      {
        id: `${Date.now()}`,
        type,
        options: [],
        new: true,
      },
    ]);
  };

  const handleRemoveQuestion = (questionId) => () => {
    let result = { newQuestions: [], questionToRemove: null };

    value.forEach((question) => {
      if (question.id !== questionId) {
        result.newQuestions.push(question);
      } else {
        result.questionToRemove = question;
      }
    });

    if (!result.questionToRemove.new) {
      deleteQuestion({
        variables: {
          id: result.questionToRemove.id,
        },
      });
    }
    onChange(result.newQuestions);
  };

  const handleUpdateQuestion = (updatedQuestion) => {
    const newQuestions = value.map((question) => {
      if (question.id === updatedQuestion.id) {
        return updatedQuestion;
      }
      return question;
    });

    onChange(newQuestions);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const dataList = Array.from(value);
    const [removed] = dataList.splice(result.source.index, 1);

    dataList.splice(result.destination.index, 0, removed);
    onChange(dataList);
  };

  const renderQuestionList = () => {
    return (
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <Box
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getQuestionListStyle(snapshot.isDraggingOver)}
            >
              {value?.map((question, index) => (
                <Draggable key={question.id} draggableId={question.id} index={index}>
                  {(provided) => (
                    <Box
                      mb={6}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <UpsertQuestionForm
                        key={question.id}
                        data={question}
                        onChange={handleUpdateQuestion}
                        onRemove={handleRemoveQuestion(question.id)}
                      />
                    </Box>
                  )}
                </Draggable>
              ))}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    );
  };

  return (
    <Box>
      {renderQuestionList()}
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography color="textSecondary" variant="body2">
          Question type
        </Typography>
        <Box ml={4} width="80%">
          <Divider className={classes.divider} />
        </Box>
      </Box>
      <Box display="flex" justifyContent="flex-end" mt={8}>
        <Button
          className={classes.borderedButton}
          onClick={handleAddQuestion(AssessmentQuestionType.MULTI_CHOICE)}
          startIcon={<AddOutlinedIcon />}
        >
          Add multiple choice question
        </Button>
        <Box ml={8}>
          <Button
            className={classes.borderedButton}
            onClick={handleAddQuestion(AssessmentQuestionType.TEXT_ESSAY)}
            startIcon={<AddOutlinedIcon />}
          >
            Add text or essay question
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

const useStyles = makeStyles({
  divider: {
    width: '100%',
  },
  borderedButton: {
    border: `1px solid ${colors.secondaryLightGrey}`,
  },
});

const getQuestionListStyle = (isDraggingOver) => ({
  marginBottom: isDraggingOver && 133,
});

UpsertQuestionFormList.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.arrayOf(
    PropTypes.shape({
      ...UpsertQuestionForm.propTypes,
    }),
  ),
  deleteQuestion: PropTypes.func.isRequired,
  isDeletingQuestion: PropTypes.bool.isRequired,
};

export default memo(UpsertQuestionFormList);
