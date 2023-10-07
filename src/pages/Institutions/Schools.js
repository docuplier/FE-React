import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import { Typography, TextField, MenuItem, Box, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { PrivatePaths } from 'routes';
import NavigationBar from 'reusables/NavigationBar';
import BasicResourceCard from 'reusables/BasicResourceCard';
import MaxWidthContainer from 'reusables/MaxWidthContainer';
import { useNotification } from 'reusables/NotificationBanner';
import FilterControl from 'reusables/FilterControl';
import StatisticCard from 'reusables/StatisticCard';
import Empty from 'reusables/Empty';
import { OffsetLimitBasedPagination } from 'reusables/Pagination';
import { ReactComponent as EmptyIcon } from 'assets/svgs/EmptySearchResults.svg';
import { fontSizes, colors } from '../../Css';
import { GET_INSTITUTIONS } from 'graphql/queries/institution';
import { convertToSentenceCase } from 'utils/TransformationUtils';
import {
  DEFAULT_PAGE_OFFSET,
  MULTIPLE_OF_NINE_DEFAULT_PAGE_LIMIT,
  InstitutionStatus,
} from 'utils/constants';
import { useQueryPagination } from 'hooks/useQueryPagination';
import LoadingView from 'reusables/LoadingView';

function Institution() {
  const history = useHistory();
  const [offset, setOffset] = useState(DEFAULT_PAGE_OFFSET);
  const [limit, setLimit] = useState(MULTIPLE_OF_NINE_DEFAULT_PAGE_LIMIT);
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('all');
  const notification = useNotification();
  const classes = useStyles();
  const { data, loading } = useQueryPagination(GET_INSTITUTIONS, {
    variables: {
      search: searchTerm,
      status: status && status !== 'all' ? status : null,
      offset,
      limit,
      showInstitutionsStats: true,
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });
  const institutions = data?.institutions?.results;

  const getChipProp = (institution) => {
    if (institution?.status === InstitutionStatus.DRAFT) {
      return {
        color: 'secondary',
        label: convertToSentenceCase(institution?.status?.toLowerCase()),
      };
    }

    const representationalEntity =
      institution?.status === InstitutionStatus.ACTIVE ? 'active' : 'inactive';
    return {
      color: representationalEntity,
      label: `School is ${representationalEntity}`,
    };
  };

  const getResourceCardPath = (school) => {
    if (school.status === InstitutionStatus.DRAFT) {
      return `${PrivatePaths.INSTITUTIONS}/create-school?institutionId=${school?.id}&mode=draft`;
    }

    return `${PrivatePaths.INSTITUTIONS}/${school?.id}`;
  };

  const handleAddNewSchool = () => {
    history.push(`${PrivatePaths.INSTITUTIONS}/create-school?mode=new`);
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    setOffset(DEFAULT_PAGE_OFFSET);
  };

  const handleSelection = (e) => {
    setStatus(e.target.value);
    setOffset(DEFAULT_PAGE_OFFSET);
  };

  const renderCustomFilters = () => {
    return (
      <>
        <Grid item xs={2} className={classes.customFilter}>
          <TextField
            select
            label="Status"
            value={status}
            variant="outlined"
            onChange={handleSelection}
            fullWidth>
            <MenuItem key={'ALL'} value="all">
              {convertToSentenceCase('All')}
            </MenuItem>
            {Object.values(InstitutionStatus).map((status) => (
              <MenuItem key={status} value={status}>
                {convertToSentenceCase(status?.toLowerCase())}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </>
    );
  };

  const renderEmptyState = () => {
    return (
      <Empty
        title={'No Institutions'}
        description={
          'You currrently have no registered institution. Click the button below to add new.'
        }
        icon={<EmptyIcon />}>
        <Button variant="contained" onClick={handleAddNewSchool}>
          Add New
        </Button>
      </Empty>
    );
  };

  const renderBasicResourceCardList = () => {
    return Boolean(institutions?.length) ? (
      <>
        <Grid container spacing={10} className="grid-container">
          {institutions.map((institution, i) => (
            <Grid item xs={4} className="grid-item">
              <BasicResourceCard
                path={getResourceCardPath(institution)}
                statusChip={{
                  ...getChipProp(institution),
                  roundness: 'md',
                }}
                imageSrc={institution?.logo}
                title={institution?.name}
                description={institution?.description}
                metaList={[
                  {
                    label: 'Students',
                    count: `${institution?.studentCount}`,
                  },
                  {
                    label: 'Lecturers',
                    count: institution?.lecturerCount,
                  },
                ]}
                creator={{
                  name: institution?.administrator
                    ? `${institution?.administrator?.firstname} ${institution?.administrator?.lastname}`
                    : 'n/a',
                  imageSrc: institution?.administrator?.image,
                  chip: {
                    label: convertToSentenceCase(institution?.administrator?.roles[0] || ''),
                    size: 'sm',
                  },
                }}
              />
            </Grid>
          ))}
        </Grid>
        <Box className="pagination-wrapper">
          <OffsetLimitBasedPagination
            total={data?.institutions?.totalCount}
            offset={offset}
            limit={limit}
            onChangeOffset={(offset, _limit) => setOffset(offset)}
            onChangeLimit={(_offset, limit) => {
              setLimit(limit);
              setOffset(0);
            }}
            limitOptions={[9, 18, 45, 99]}
          />
        </Box>
      </>
    ) : (
      renderEmptyState()
    );
  };

  return (
    <Box className={classes.pageLayout}>
      <NavigationBar />
      <MaxWidthContainer spacing="md" className={classes.content}>
        <Typography variant="h6" className="header-title">
          Institutions
        </Typography>
        <Box className="header-card-wrapper">
          <StatisticCard
            title="Total institutions"
            description={data?.institutions?.totalCount}
            data={[
              { label: `${data?.institutions?.active || 0} active`, color: 'success' },
              { label: `${data?.institutions?.inactive || 0} inactive`, color: 'error' },
              { label: `${data?.institutions?.draft || 0} Draft`, color: 'draft' },
            ]}
          />
        </Box>
        <FilterControl
          okButtonProps={{
            isLoading: false,
            children: 'Add New School',
            color: 'primary',
            onClick: handleAddNewSchool,
          }}
          searchInputProps={{ onChange: handleChange }}
          renderCustomFilters={renderCustomFilters()}
        />
        <LoadingView isLoading={loading}>{renderBasicResourceCardList()}</LoadingView>
      </MaxWidthContainer>
    </Box>
  );
}

export default Institution;

const useStyles = makeStyles((theme) => ({
  pageLayout: {
    background: colors.background,
    height: '100%',
    minHeight: '100vh',
  },
  content: {
    background: colors.background,
    '& .header-title': {
      fontSize: fontSizes.xlarge,
      marginBottom: 24,
    },
    '& .header-card-wrapper': {
      width: 360,
      height: 113,
      marginBottom: 34,
    },
    '& .grid-container': {
      marginTop: 24,
    },
    '& .pagination-wrapper': {
      marginTop: theme.spacing(12),
    },
  },
  customFilter: {
    '& .MuiOutlinedInput-root': {
      background: colors.white,
    },
  },
}));
