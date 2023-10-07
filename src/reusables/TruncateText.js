import React from 'react';
import TruncateMarkup from 'react-truncate-markup';
import { Box } from '@material-ui/core';
import PropTypes from 'prop-types';

/*
 * The reusable simply truncates strings (both html or non-html strings) depending on the number of lines specified and adds elipses to the end.
 */
const TruncateText = (props) => {
  const { lines, text } = props;

  function stripHtml(html) {
    let element = document.createElement('DIV');
    element.innerHTML = html;
    return element.textContent || element.innerText || '';
  }
  return (
    <TruncateMarkup lines={lines}>
      <Box width="100%" {...props}>
        {stripHtml(text)}
      </Box>
    </TruncateMarkup>
  );
};

TruncateText.propTypes = {
  ...Box.propTypes,
  lines: PropTypes.number,
  text: PropTypes.string,
};

TruncateText.defaultProps = {
  lines: 2,
  text: '<p><p>',
};

export default TruncateText;
