import React, { useState, useEffect, useMemo } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import { makeStyles } from '@material-ui/core/styles';
import { useNotification } from 'reusables/NotificationBanner';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import PropTypes from 'prop-types';
import { fontSizes } from '../Css';

const defaultProps = {
  htmlContent: '<p></p>',
};

function WYSIWYG({ onChange, value: valueFromProps, maxLength }) {
  const classes = useStyles();
  const notification = useNotification();
  const [valueFromState, setValueFromState] = useState({
    html: null,
    editorState: null,
  });

  const handleBeforeInput = () => {
    if (!maxLength) return;
    if (maxLength) {
      if (
        draftToHtml(convertToRaw(value.editorState.getCurrentContent())).length >=
        maxLength + 8
      ) {
        return 'handled';
      }
    }
  };

  const handlePastedText = (val) => {
    if (!maxLength) return;
    const textLength = value.editorState.getCurrentContent().getPlainText().length;

    if (val.length + textLength >= maxLength) {
      notification.error({
        message: 'Pasting the text will exceed the maximum character of 250',
      });
      return 'handled';
    }

    return 'not-handled';
  };

  const value = useMemo(() => {
    return valueFromProps !== undefined ? valueFromProps : valueFromState;
  }, [valueFromState, valueFromProps]);

  useEffect(() => {
    if (!value?.editorState) {
      const html = value?.html || defaultProps.htmlContent;
      const contentBlock = htmlToDraft(html);

      if (contentBlock) {
        let editorState = convertToEditorState(contentBlock);

        //We added an optional parameter (defer) because there are cases where
        //the valueFromProps of this reusable is not correctly set because an initial
        //value managed by the component quickly overrides this value. Hence to be sure,
        //we defer the time to set the editorValue if not available
        //Also note that having 0 doesn't mean it runs immediately.
        //It is still an async operation but will run in the earliest time possible
        //determined by the Js scheduler (event loop)
        setTimeout(() => {
          changeEditorValue(editorState, html, true);
        }, 0);
      }
    }
    // eslint-disable-next-line
  }, [value]);

  const convertToEditorState = (contentBlock) => {
    const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
    const editorState = EditorState.createWithContent(contentState);
    return editorState;
  };

  const changeEditorValue = (editorState, html) => {
    setValueFromState({
      editorState,
      html,
    });
    onChange?.({
      html,
      editorState,
    });
  };

  const onEditorStateChange = (editorState) => {
    const html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    changeEditorValue(editorState, html);
  };

  return (
    <Editor
      editorState={value?.editorState}
      toolbarClassName="toolbarClassName"
      wrapperClassName="wrapperClassName"
      editorClassName={classes.editorClassName}
      handleBeforeInput={handleBeforeInput}
      onEditorStateChange={onEditorStateChange}
      handlePastedText={handlePastedText}
      toolbar={{
        options: [
          'inline',
          'blockType',
          'fontSize',
          'list',
          'textAlign',
          'history',
          'link',
          'image',
        ],
        inline: { inDropdown: true },
        list: { inDropdown: true },
        textAlign: { inDropdown: true },
        link: { inDropdown: true },
        history: { inDropdown: false },
      }}
    />
  );
}

WYSIWYG.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.shape({
    html: PropTypes.string,
    editorState: PropTypes.any,
  }),
};

const useStyles = makeStyles(() => ({
  editorClassName: {
    border: '1px solid #f1f1f1',
    height: 'auto',
    minHeigth: 300,
    padding: 5,
    fontFamily: 'inherit !important',
    fontSize: fontSizes.medium,
  },
}));

export default React.memo(WYSIWYG);
