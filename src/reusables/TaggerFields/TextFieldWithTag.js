import { memo, useMemo, useState } from 'react';
import { Box, TextField } from '@material-ui/core';

import Tags from './Tags';

const TextFieldTagger = ({ onChange, value: tagsFromProps, ...rest }) => {
  const [currentTagValue, setCurrentTagValue] = useState('');
  const [tagsFromState, setTagsFromState] = useState([]);

  const tags = useMemo(() => {
    return tagsFromProps !== undefined ? tagsFromProps : tagsFromState;
  }, [tagsFromProps, tagsFromState]);

  const handleEnter = (evt) => {
    if (evt.keyCode === 13 && !evt.shiftKey) {
      const newTags = [...tags, evt.target.value];
      onChange(newTags);

      setTagsFromState(newTags);
      setCurrentTagValue('');
    }
  };

  const handleDeleteTag = (removedTag) => {
    const newTags = tags?.filter((tag) => tag !== removedTag);
    onChange(newTags);
  };

  return (
    <Box>
      <TextField
        fullWidth
        variant="outlined"
        InputLabelProps={{
          shrink: true,
        }}
        {...rest}
        value={currentTagValue}
        onChange={(evt) => setCurrentTagValue(evt.target.value)}
        onKeyUp={handleEnter}
      />
      <Box display="flex" flexWrap="wrap" mt={4}>
        <Tags
          data={tags?.map((tag) => ({
            label: tag,
            value: tag,
          }))}
          onDelete={handleDeleteTag}
        />
      </Box>
    </Box>
  );
};

TextFieldTagger.propTypes = {
  ...TextField.propTypes,
};

export default memo(TextFieldTagger);
