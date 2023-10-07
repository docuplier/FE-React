import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Button, withStyles, styled, Tab, Tabs, Tooltip } from '@material-ui/core';
import { DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_OFFSET } from 'utils/constants';
import { ReactComponent as BlueDraft } from 'assets/svgs/published-blue.svg';
import { ReactComponent as DarkDraft } from 'assets/svgs/published-dark.svg';
import { ReactComponent as GlobalExit } from 'assets/svgs/globalExitButtonDark.svg';
import LoadingView from 'reusables/LoadingView';
import MaxWidthContainer from 'reusables/MaxWidthContainer';
import AllAssessments from 'components/Assessments/AllAssessments';
import { PrivatePaths } from 'routes';
import { GET_ALL_ASSESSMENTS } from 'graphql/queries/courses';
import { useQueryPagination } from 'hooks/useQueryPagination';
import { useNotification } from 'reusables/NotificationBanner';
import AssessmentTabs from './AssessmentTabs';
import 'react-modern-calendar-datepicker/lib/DatePicker.css';

const a11yProps = (index) => {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
};
export default function Index() {
  const history = useHistory();
  const notification = useNotification();

  const [value, setValue] = React.useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [assessmentData, setAssessmentData] = useState([]);
  const [publishedData, setPublishedData] = useState([]);
  const [publishedCount, setPublishedCount] = useState(0);
  const [draftData, setDraftData] = useState([]);
  const [draftCount, setDraftCount] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [queryParams, setQueryParams] = useState({
    search: '',
    offset: DEFAULT_PAGE_OFFSET,
    limit: DEFAULT_PAGE_LIMIT,
    isGlobalAssessment: true,
    status: null,
    startDate: null,
    dueDate: null,
  });
  const handleChangeQueryParams = (changeset) => {
    setQueryParams((prevState) => ({
      ...prevState,
      ...changeset,
    }));
  };

  const { data, loading } = useQueryPagination(GET_ALL_ASSESSMENTS, {
    variables: {
      ...queryParams,
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  useEffect(() => {
    if (data) {
      setTotalCount(data.assessments.results.length ?? 0);
      setAssessmentData(data.assessments.results || []);
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      const publishedData = data.assessments.results.filter(
        (assessment) => assessment.status === 'PUBLISHED',
      );
      setPublishedCount(publishedData.length);
      setPublishedData(publishedData);
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      const draftData = data.assessments.results.filter(
        (assessment) => assessment.status === 'DRAFT',
      );
      setDraftCount(draftData.length);
      setDraftData(draftData);
    }
  }, [data]);

  const TabList = [
    {
      label: `All Assessments ( ${totalCount} )`,
      component: (
        <AllAssessments
          data={assessmentData}
          handleChangeQueryParams={handleChangeQueryParams}
          queryParams={queryParams}
        />
      ),
    },
    {
      label: 'Published',
      component: (
        <AllAssessments
          data={publishedData}
          handleChangeQueryParams={handleChangeQueryParams}
          queryParams={queryParams}
        />
      ),
    },
    {
      label: 'Draft',
      component: (
        <AllAssessments
          data={draftData}
          handleChangeQueryParams={handleChangeQueryParams}
          queryParams={queryParams}
        />
      ),
    },
  ];
  const renderBox = (icon, number, title) => {
    return (
      <Box
        bgcolor="#fafafa"
        border={'1px solid #E7E7ED'}
        padding={12}
        borderRadius={'8px'}
        minWidth="217px"
      >
        <Box display="flex" alignItems="center">
          {icon}
          <Box ml={5}>
            <Typography
              style={{
                fontWeight: 600,
                fontSize: '24px',
              }}
            >
              {number}
            </Typography>

            <Typography color="#6B6C7E">{title}</Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <>
      <Box
        position="fixed"
        left={{ xs: '10px', md: '90px' }}
        bottom="100px"
        height="40px"
        width="40px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        borderRadius="50%"
      >
        <div
          style={{
            position: 'fixed',
            cursor: 'pointer',
          }}
        >
          <Tooltip
            arrow
            placement="right-center"
            style={{
              fontSize: '20px',
            }}
            title="Exit to users page"
          >
            <GlobalExit onClick={() => history.push('/')} />
          </Tooltip>
        </div>
      </Box>
      <MaxWidthContainer>
        <>
          <Box display="flex" mb={25} alignItems="center" justifyContent={'space-between'} mt={20}>
            <Typography
              style={{
                fontSize: '24px',
                fontWeight: '700',
              }}
            >
              Assessments
            </Typography>
            <Button
              variant="contained"
              color="primary"
              disableElevation
              onClick={() => history.push(`${PrivatePaths.ASSESSMENTS}/create-assessment`)}
            >
              Add Assessments
            </Button>
          </Box>

          <Box display="flex" alignItems="center" overflow={'auto'}>
            <Box mr={10}>{renderBox(<BlueDraft />, `${publishedCount}`, 'Published')}</Box>
            <Box>{renderBox(<DarkDraft />, `${draftCount}`, 'Draft')}</Box>
          </Box>
        </>
      </MaxWidthContainer>
      <Box mt={15}>
        <MaxWidthContainer>
          <Box>
            <StyledTabs
              textColor="primary"
              indicatorColor="primary"
              value={value}
              onChange={handleChange}
              aria-label="tabs"
            >
              {TabList.map(({ label }, index) => (
                <StyledTab label={label} {...a11yProps(index)} />
              ))}
            </StyledTabs>
          </Box>
        </MaxWidthContainer>
        <Box bgcolor="#f6f7f7" pt={8} p={6}>
          <MaxWidthContainer>
            <LoadingView isLoading={loading}>
              <AssessmentTabs tabs={TabList} value={value} />
            </LoadingView>
          </MaxWidthContainer>
        </Box>
      </Box>
    </>
  );
}

const StyledTabs = withStyles((theme) => ({
  root: {
    height: '100%',
    [theme.breakpoints.down('sm')]: {
      paddingRight: 20,
    },
    '& .MuiTabs-scroller': {
      overflowX: 'auto !important',
      scrollbarWidth: 'thin',
      scrollbarColor: '#F1F2F6',
    },
    '& .MuiTabs-scroller::-webkit-scrollbar-track': {
      background: 'white',
    },
    '& .MuiTabs-scroller::-webkit-scrollbar-thumb ': {
      backgroundColor: '#F1F2F6',
      borderRadius: 8,
    },
    '& .MuiTabs-scroller::-webkit-scrollbar': {
      width: 5,
    },
  },
}))((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const StyledTab = styled((props) => <Tab disableRipple {...props} />)(({ theme }) => ({
  textTransform: 'none',
  marginRight: theme.spacing(8),
  color: theme.palette.text.main,
  fontSize: theme.typography.fontSizeSmall,
  '&.Mui-selected': {
    color: theme.palette.primary.main,
  },
  '&.Mui-focusVisible': {
    backgroundColor: 'rgba(100, 95, 228, 0.32)',
  },
}));
