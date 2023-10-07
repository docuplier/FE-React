import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  Menu,
  Paper,
  TextField,
  Typography,
  makeStyles,
} from '@material-ui/core';
import React, { useState } from 'react';
import MaxWidthContainer from 'reusables/MaxWidthContainer';
import { fontSizes, fontWeight, colors, spaces } from '../../Css';
import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET } from 'utils/constants';
import { useQueryPagination } from 'hooks/useQueryPagination';
import ResourceTable from 'reusables/ResourceTable';
import { format } from 'date-fns';
import { useNotification } from 'reusables/NotificationBanner';
import { GET_ACTIVITY_LOG } from 'graphql/queries/activtylog';
import { ArrowDropDown } from '@material-ui/icons';
import { useEffect } from 'react';
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import { Calendar } from 'react-modern-calendar-datepicker';
import { ReactComponent as CalendarIcon } from '../../assets/svgs/Icon-calendar-16.svg';
import { activityTypes, convertUnderscoreToTitleCase } from 'utils/ActitvityLogUtils';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';

const HomePage = () => {
  const notification = useNotification();
  const classes = useStyles();
  const { userDetails } = useAuthenticatedUser();
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const institutionId = userDetails?.institution?.id;

  const [selectedDayRange, setSelectedDayRange] = useState({
    from: null,
    to: null,
  });
  const [queryParams, setQueryParams] = useState({
    search: '',
    offset: DEFAULT_PAGE_OFFSET,
    limit: DEFAULT_PAGE_LIMIT,
    ordering: null,
    institution_id: institutionId,
    activityTypes: selectedCheckboxes,
  });

  const { loading, data } = useQueryPagination(GET_ACTIVITY_LOG, {
    variables: queryParams,
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const handleChangeQueryParams = (changeset) => {
    setQueryParams((prevState) => ({
      ...prevState,
      ...changeset,
    }));
  };

  useEffect(() => {
    handleChangeQueryParams({ activityTypes: selectedCheckboxes });
  }, [selectedCheckboxes]);
  useEffect(() => {
    if (selectedDayRange.from && selectedDayRange.to) {
      handleChangeQueryParams({
        startDate: format(
          new Date(
            selectedDayRange.from.year,
            selectedDayRange.from.month - 1,
            selectedDayRange.from.day,
          ),
          'yyyy-MM-dd',
        ),
        endDate: format(
          new Date(
            selectedDayRange.to.year,
            selectedDayRange.to.month - 1,
            selectedDayRange.to.day,
          ),
          'yyyy-MM-dd',
        ),
      });
    }
  }, [selectedDayRange]);

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setSelectedCheckboxes((prevSelectedCheckboxes) => {
      if (checked) {
        return [...prevSelectedCheckboxes, value];
      } else {
        return prevSelectedCheckboxes.filter((item) => item !== value);
      }
    });
  };

  const renderFilterControl = () => {
    return (
      <Grid container mt={12} spacing={8}>
        <Grid item xs={12} md={6}>
          <TextField
            defaultValue=""
            placeholder="Search"
            fullWidth
            variant="outlined"
            onChange={(evt) => handleChangeQueryParams({ search: evt.target.value })}
          />
        </Grid>
        <Grid item container xs={12} md={6} spacing={8}>
          <Grid item xs={12} md={2}>
            <Box display="flex" alignItems="center" height="100%">
              <Typography>Filter by: </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box
              className={classes.activityType}
              onClick={(event) => setAnchorEl(event.currentTarget)}
            >
              <Typography>Activity Type</Typography>
              <ArrowDropDown />
            </Box>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              style={{ marginTop: 80 }}
            >
              <Box elevation={0} className={classes.activtyBody}>
                {activityTypes.map((v) => {
                  return (
                    <Box className={classes.activityMenu}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            key={v.value}
                            value={v.value}
                            color="primary"
                            onChange={handleCheckboxChange}
                            style={{ marginRight: 8 }}
                          />
                        }
                        label={v.label}
                      />
                    </Box>
                  );
                })}
              </Box>
            </Menu>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box style={{ position: 'relative' }}>
              <Box className={classes.activityType} onClick={() => setOpenCalendar(!openCalendar)}>
                <Typography>Filter by date</Typography>
                <CalendarIcon />
              </Box>
              {openCalendar && (
                <Box style={{ position: 'absolute' }}>
                  <Calendar
                    value={selectedDayRange}
                    colorPrimary={colors.primary}
                    colorPrimaryLight={colors.primaryLight}
                    onChange={setSelectedDayRange}
                  />
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  const renderNameCell = (user) => {
    const fullName = `${user.firstname} ${user.lastname}`;

    return (
      <Box display="flex" alignItems="center">
        <Typography style={{ marginLeft: spaces.small }}>{fullName}</Typography>
      </Box>
    );
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'user',
      render: renderNameCell,
    },

    {
      title: 'Activity Type',
      dataIndex: 'message',
      render: (text, data) => (
        <Typography style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
          {text
            ? convertUnderscoreToTitleCase(text || '--')
            : convertUnderscoreToTitleCase(data?.activityType)}
        </Typography>
      ),
      sorter: true,
    },
    {
      title: 'Timestamp',
      dataIndex: 'createdAt',
      render: (createdAt) => (
        <Typography>
          {format(new Date(createdAt), 'LLL dd, yyyy')} • {format(new Date(createdAt), 'hh:mm aaa')}
        </Typography>
      ),
      sorter: true,
    },
  ];
  return (
    <>
      <Box minHeight="100vh" style={{ background: colors.background }}>
        <Paper className={classes.headBody}>
          <MaxWidthContainer spacing={'sm'}>
            <Box display="flex" alignItems="center" height="100%">
              <Typography className={classes.head}>Activity Log</Typography>
            </Box>
          </MaxWidthContainer>
          <MaxWidthContainer spacing={'sm'}>
            <Box mt={30}>{renderFilterControl()}</Box>
            <ResourceTable
              loading={loading}
              columns={columns}
              dataSource={data?.allActivities?.results ?? []}
              // onChangeSort={(_order, property) => null}
              onChangeSort={(_order, property) => handleChangeQueryParams({ ordering: property })}
              pagination={{
                total: data?.allActivities?.totalCount,
                onChangeLimit: (_offset, limit) =>
                  handleChangeQueryParams({ limit, offset: DEFAULT_PAGE_OFFSET }),
                onChangeOffset: (offset) => handleChangeQueryParams({ offset }),
                limit: queryParams.limit,
                offset: queryParams.offset,
              }}
            />
          </MaxWidthContainer>
        </Paper>
      </Box>
    </>
  );
};
const useStyles = makeStyles((theme) => ({
  headBody: {
    height: 76,
    background: colors.white,
    borderRadius: 0,
  },
  head: {
    fontWeight: fontWeight.extraBold,
    fontSize: fontSizes.title,
    color: colors.black,
  },
  filterInput: {
    '& .MuiOutlinedInput-root': {
      background: '#F1F2F6',
    },
  },
  activityType: {
    border: '1px solid #CDCED9',
    height: '100%',
    borderRadius: '8px',
    background: '#F1F2F6',
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    padding: '10px',
    justifyContent: 'space-between',
    cursor: 'pointer',
  },
  activityMenu: {
    width: 'auto',
    padding: '10px',
  },
  activtyBody: {
    height: '300px',
    overflow: 'auto',
  },
}));
export default HomePage;
