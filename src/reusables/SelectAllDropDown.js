import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Checkbox, TextField, IconButton } from '@material-ui/core';

import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

const SelectAllDropDown = ({ data, title, label, setValue, helperText }) => {
  const [openDropDown, setOpenDropDown] = useState(false);

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" color="#000" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" color="#000" />;
  const [arrItems, setArrItems] = useState([]);

  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    setArrItems(data);
    setFilteredItems(data);
  }, [data]);

  const dropdownRef = useRef(null);

  // Event listener to detect clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropDown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const updateCheck = (id, checked) => {
    let updatedItems;
    let values;

    if (id === 'all') {
      updatedItems = arrItems.map((item) => {
        if (item.id === id) {
          return { ...item, isChecked: checked };
        } else {
          return { ...item, isChecked: false };
        }
      });
      values = arrItems
        .filter((val) => val.id !== 'all')
        .map((item) => {
          return { ...item, isChecked: checked };
        });
    } else {
      updatedItems = arrItems.map((item) => {
        if (item.id === id && item.id !== 'all') {
          return { ...item, isChecked: checked };
        }
        if (item.id === 'all') {
          return { ...item, isChecked: false };
        }
        return item;
      });
    }
    if (id === 'all' && checked) {
      title === 'Departments' && setValue('isAllDepartment', checked);
      title === 'Levels' && setValue('isAllLevels', checked);
    } else {
      title === 'Departments' && setValue('isAllDepartment', false);
      title === 'Levels' && setValue('isAllLevels', false);
    }
    setArrItems(updatedItems);
    setFilteredItems(updatedItems);

    let checker;
    if (id === 'all') {
      checker = Array.isArray(values)
        ? Array.from(
            new Set(values.filter((item) => item.isChecked === true).map((item) => item.id)),
          )
        : [];
    } else {
      checker = Array.isArray(updatedItems)
        ? Array.from(
            new Set(updatedItems.filter((item) => item.isChecked === true).map((item) => item.id)),
          )
        : [];
    }

    title === 'Departments' && setValue('targetDepartments', checker);
    title === 'Levels' && setValue('targetLevels', checker);
  };

  return (
    <>
      <Box
        onClick={() => {
          if (openDropDown) return;
          setOpenDropDown(true);
        }}
        borderRadius={'10px'}
        border={helperText ? '1px solid #f44336' : '1px solid #e3e4e9'}
        mt={5}
        style={{
          position: 'relative',
          padding: '15px',
          cursor: 'pointer',
        }}
      >
        <Box display="flex" alignItems={'center'} justifyContent={'space-between'}>
          <Typography>{title}</Typography>
          <ArrowDropDownIcon />
        </Box>
        <Typography
          style={{
            position: 'absolute',
            top: '-5px',
            left: '8px',
            fontSize: '8px',
            background: 'white',
            padding: '2px',
            borderRadius: '4px',
          }}
        >
          {label}
        </Typography>
        {openDropDown && (
          <div ref={dropdownRef}>
            <Box
              position="absolute"
              top="130px"
              bgcolor="#fff"
              zIndex={1222222}
              borderRadius={'4px'}
              p={8}
            >
              <TextField
                // fullWidth
                placeholder="Label"
                variant="outlined"
                InputProps={{
                  startAdornment: <SearchIcon />,
                }}
                onChange={(e) => {
                  const inputValue = e.target.value.toString().toLowerCase();

                  const filteredItems = arrItems.filter((item) => {
                    const itemTitle = item.title.toLowerCase();

                    if (inputValue === '') {
                      return true;
                    }

                    return itemTitle.includes(inputValue);
                  });

                  setFilteredItems(filteredItems);
                }}
              />
              {filteredItems?.map(({ title, isChecked, id }) => (
                <Box display="flex" alignItems="center" my={2} key={id}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 2 }}
                    checked={isChecked}
                    onChange={(e) => {
                      updateCheck(id, e.target.checked);
                    }}
                  />
                  <Typography
                    style={{
                      fontWeight: 'bold',
                      width: '80%',

                      wordBreak: 'break-all',
                      height: 'auto',
                    }}
                  >
                    {title}
                  </Typography>
                </Box>
              ))}
              {filteredItems?.length === 0 && (
                <Typography
                  style={{
                    textAlign: 'center',
                    marginTop: '10px',
                  }}
                >
                  Search item not found
                </Typography>
              )}
            </Box>
          </div>
        )}
        {filteredItems.length !== 0 && (
          <Box display="flex" flexWrap="wrap" mt={5}>
            {filteredItems
              .filter((item) => item.isChecked)
              .map(({ title, id }) => (
                <Box
                  border={'1px solid #CDCED9'}
                  display="flex"
                  alignItems="center"
                  bgcolor={'#fff'}
                  pl={5}
                  p={1}
                  borderRadius="4px"
                  key={title}
                  m={1}
                >
                  <Typography
                    style={{
                      wordBreak: 'break-all',
                      height: 'auto',
                    }}
                    fontSize="8px"
                  >
                    {title}{' '}
                  </Typography>
                  <IconButton onClick={() => updateCheck(id, false)}>
                    <ClearIcon
                      style={{
                        fontSize: '16px',
                      }}
                    />
                  </IconButton>
                </Box>
              ))}
          </Box>
        )}
      </Box>
    </>
  );
};

export default SelectAllDropDown;
