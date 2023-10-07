import React, { useState } from 'react';
import { Box, Paper, TextField, Typography } from '@material-ui/core';
import { ArrowForwardIos } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import Empty from 'reusables/Empty';

import AuthLayout from 'Layout/AuthLayout';
import logoSvg from 'assets/svgs/dslmsLogo.jpeg';
import { makeStyles } from '@material-ui/styles';
import { useQuery } from '@apollo/client';
import { GET_ALL_INSTITUTIONS } from 'graphql/queries/institution';
import LoadingView from 'reusables/LoadingView';
import { navigateToURL } from 'utils/RouteUtils';

const SchoolList = () => {
  const classes = useStyles();
  const [search, setSearch] = useState();
  const { data, loading } = useQuery(GET_ALL_INSTITUTIONS);
  const institutions = data?.allInstitutions;

  const filteredSchoolList = (list = []) => {
    if (Boolean(search)) {
      let filteredList = list.filter((item) => {
        const { name, url } = item;
        let searchfilter = name?.toLowerCase()?.includes(search?.toLowerCase());
        let searchByUrl = url?.toLowerCase()?.includes(search?.toLowerCase());
        return searchfilter || searchByUrl;
      });
      return filteredList;
    }
    return list;
  };

  const cardContent = (name, id, url) => {
    return (
      <Box
        key={id}
        mb={12}
        component={Paper}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        border="1px solid #F5F7FA"
        className={classes.url}
        onClick={() => navigateToURL(url)}>
        <Box p={8} textAlign="left">
          <Typography variant="body1" color="textPrimary">
            {name}
          </Typography>
          <Link style={{ textDecoration: 'none' }} to={{ pathname: url }} target="_self">
            {url}
          </Link>
        </Box>
        <Box>
          <ArrowForwardIos className={classes.url} />
        </Box>
      </Box>
    );
  };

  const renderSchoolCard = (schoolListArray) => {
    return filteredSchoolList(schoolListArray)?.length > 0 ? (
      filteredSchoolList(schoolListArray)?.map(({ name, url, id }) => cardContent(name, id, url))
    ) : (
      <Empty description={`No schools avalaible`} />
    );
  };

  return (
    <AuthLayout imageSrc={logoSvg}>
      <Box>
        <TextField
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          label="Search for school...."
          style={{ background: '#F5F7FA' }}
          variant="outlined"
        />
        <Box className={classes.schoolList}>
          <LoadingView isLoading={loading}>
            <Box maxHeight={500} overflow="auto" mt={12} className={'container'}>
              {renderSchoolCard(institutions)}
            </Box>
          </LoadingView>
        </Box>
      </Box>
    </AuthLayout>
  );
};

const useStyles = makeStyles(() => ({
  schoolList: {
    '& .container': {
      overflowY: 'auto',
      scrollbarWidth: 'thin',
      scrollbarColor: '#757575',
    },
    '& .container::-webkit-scrollbar-track': {
      background: 'white',
    },
    '& .container::-webkit-scrollbar-thumb ': {
      backgroundColor: '#757575',
      borderRadius: 8,
    },
    '& .container::-webkit-scrollbar': {
      width: 7,
    },
  },
  url: {
    cursor: 'pointer',
    textDecoration: 'none',
    color: 'grey',
  },
}));

export default SchoolList;
