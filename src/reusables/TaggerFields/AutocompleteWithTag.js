import { memo, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, makeStyles } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import Tags from './Tags';

const AutocompleteWithTag = ({
  onChange,
  value: tagsFromProps,
  textFieldProps,
  getTagLabel,
  scrollable,
  ...rest
}) => {
  const classes = useStyles();
  const [tagsFromState, setTagsFromState] = useState([]);

  const tags = useMemo(() => {
    return tagsFromProps !== undefined ? tagsFromProps : tagsFromState;
  }, [tagsFromProps, tagsFromState]);

  const handleChange = (_evt, newValue) => {
    onChange(newValue);
    setTagsFromState(newValue);
  };

  const handleDeleteTag = (removedTag) => {
    const newTags = tags?.filter((tag) => tag.id !== removedTag);

    setTagsFromState(newTags);
    onChange(newTags);
  };

  return (
    <Box className={classes.container}>
      <Autocomplete
        multiple
        onChange={(evt, newValue) => {
          handleChange(evt, newValue);
        }}
        value={tags}
        disableCloseOnSelect
        ListboxComponent="p"
        renderInput={(params) => (
          <TextField {...params} fullWidth type="search" variant="outlined" {...textFieldProps} />
        )}
        renderTags={() => null}
        {...rest}
      />

      <Box display="flex" mt={4} maxWidth="100%" className={scrollable && 'tag-container'}>
        <Tags
          wrap={scrollable ? false : true}
          data={tags?.map((tag) => ({
            label: getTagLabel?.(tag) || tag?.name,
            value: tag.id,
          }))}
          onDelete={handleDeleteTag}
        />
      </Box>
    </Box>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    paddingRight: 5,
    '& .tag-container': {
      padding: '15px',
      overflowY: 'hidden',
      overflowX: 'auto',
      scrollbarWidth: 'thin',
      scrollbarColor: '#757575',
    },
    '& .tag-container::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '& .tag-container::-webkit-scrollbar-thumb ': {
      backgroundColor: '#757575',
      borderRadius: 20,
    },
    '& .tag-container::-webkit-scrollbar': {
      width: 7,
    },
  },
}));

AutocompleteWithTag.propTypes = {
  ...Autocomplete.propTypes,
  scrollable: PropTypes.bool,
  textFieldProps: PropTypes.shape({
    ...TextField.propTypes,
  }),
  getTagLabel: PropTypes.func,
};

export default memo(AutocompleteWithTag);
