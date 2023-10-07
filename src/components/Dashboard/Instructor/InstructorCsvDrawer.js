import { Box, Button, Checkbox, FormControlLabel, FormGroup } from '@material-ui/core';
import React, { useState } from 'react';
import Drawer from 'reusables/Drawer';
import LoadingButton from 'reusables/LoadingButton';
import { CSVLink } from 'react-csv';

const CsvDownloadDrawer = ({ setCsv, open, onCloseDrawer }) => {
  const [csvFile, setCsvFile] = useState([]);

  const handleChange = (e, csv) => {
    let isChecked = e.target.checked;
    if (isChecked) {
      return setCsvFile((prev) => [csv, ...prev]);
    } else {
      const filtered = csvFile?.filter((val) => {
        return JSON.stringify(val) !== JSON.stringify(csv);
      });
      return setCsvFile(filtered);
    }
  };

  const handleCloseDrawer = () => {
    setCsvFile([]);
    onCloseDrawer();
  };

  const onSelectAll = (e) => {
    const allSelected = Object.values(setCsv);
    if (e.target.checked) {
      return setCsvFile(allSelected);
    }
    return setCsvFile([]);
  };

  const renderCheckBox = () => {
    return (
      <FormGroup>
        <FormControlLabel
          label="Select All"
          control={
            <Checkbox
              color="primary"
              onChange={onSelectAll}
              indeterminate={csvFile?.length !== 5}
            />
          }
        />
        {Object.keys(setCsv).map((key) => {
          return (
            <FormControlLabel
              label={key}
              key={key}
              control={
                <Checkbox
                  name={key}
                  checked={csvFile?.indexOf(setCsv[key]) !== -1}
                  color="primary"
                  onChange={(e) => handleChange(e, setCsv[key])}
                />
              }
            />
          );
        })}
      </FormGroup>
    );
  };

  const renderCsv = () => {
    return (
      <Box display="flex" justifyContent="flex-end" mr={16} mt={8}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box mr={16}>
            <Button variant="outlined" color="inherit" onClick={handleCloseDrawer}>
              Cancel
            </Button>
          </Box>
          <CSVLink
            filename={'Dashboard_data.csv'}
            data={csvFile?.flat() ?? ['Data is empty']}
            separator={','}>
            <LoadingButton color="primary" isLoading={false}>
              Export
            </LoadingButton>
          </CSVLink>
        </Box>
      </Box>
    );
  };
  return (
    <Drawer cancelText="Cancel" title="Export as .csv" open={open} footer={renderCsv()}>
      {renderCheckBox()}
    </Drawer>
  );
};

export default CsvDownloadDrawer;
