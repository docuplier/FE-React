import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { makeStyles } from '@material-ui/core/styles';
import { Add as AddIcon } from '@material-ui/icons';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';

import MaxWidthContainer from 'reusables/MaxWidthContainer';
import Empty from 'reusables/Empty';
import { getFormError } from 'utils/formError';
import LoadingView from 'reusables/LoadingView';
import AccessControl from 'reusables/AccessControl';
import BlueHeaderPageLayout from 'Layout/BlueHeaderPageLayout';
import FilterControl from 'reusables/FilterControl';
import { DEFAULT_PAGE_OFFSET, DEFAULT_PAGE_LIMIT, UserRoles } from 'utils/constants';
import LoadingButton from 'reusables/LoadingButton';
import { colors, fontSizes, fontWeight } from '../Css';
import { formatUserNameWithMiddleName } from 'utils/UserUtils';
import { OffsetLimitBasedPagination } from 'reusables/Pagination';
import AnnouncementModal from 'components/Announcement/AnnouncementModal';
import AnnouncementCard from 'reusables/AnnouncementCard';
import { GET_ANNOUNCEMENTS } from 'graphql/queries/announcement';
import { useQueryPagination } from 'hooks/useQueryPagination';
import { useNotification } from 'reusables/NotificationBanner';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import RecipientAutocompleteField from 'components/Announcement/RecipientAutocompleteField';
import { PrivatePaths } from 'routes';

const Announcement = () => {
  const [openModal, setOpenModal] = useState(false);
  const notification = useNotification();
  const { userDetails } = useAuthenticatedUser();
  const institutionId = userDetails?.institution?.id || '';
  const { control, errors, handleSubmit, reset, register, watch } = useForm();
  const { startDate, endDate } = watch();
  const theme = useTheme();
  const isSmScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const classes = useStyles();
  const [queryParams, setQueryParams] = useState({
    typeIds: [],
    search: '',
    offset: DEFAULT_PAGE_OFFSET,
    limit: DEFAULT_PAGE_LIMIT,
    datePublished: undefined,
    startDate: null,
    endDate: null,
  });

  const { data, loading, refetch } = useQueryPagination(GET_ANNOUNCEMENTS, {
    variables: {
      ...queryParams,
    },
    onError: (error) => {
      notification.error({
        message: 'An error occurred, please try again',
      });
    },
  });
  const announcementData = data?.announcements?.results;

  const handleChangeQueryParams = (changeset) => {
    setQueryParams((prevState) => ({
      ...prevState,
      ...changeset,
    }));
  };

  const resetFilters = () => {
    reset({
      recipients: [],
      startDate: null,
      endDate: null,
    });
    setQueryParams({
      ...queryParams,
      typeIds: [],
      startDate: null,
      endDate: null,
      offset: DEFAULT_PAGE_OFFSET,
      limit: DEFAULT_PAGE_LIMIT,
    });
    refetch();
  };

  const onSubmit = (formValue) => {
    const { startDate, endDate, recipients } = formValue;
    const typeIds = recipients?.map((recipient) => recipient?.id) || [];

    setQueryParams((prevState) => ({
      ...prevState,
      startDate: startDate || null,
      endDate: endDate || null,
      typeIds,
    }));
  };

  const renderEmptyState = () => {
    return <Empty title={'No Announcements'} description={'No announcements found'}></Empty>;
  };

  const renderBannerMetaInfo = () => {
    return (
      <Typography>
        <strong>{data?.announcements?.totalCount || 0}</strong> total
      </Typography>
    );
  };

  const renderBannerRightContent = () => {
    return (
      <AccessControl allowedRoles={[UserRoles.LECTURER, UserRoles.SCHOOL_ADMIN]}>
        <Button
          startIcon={<AddIcon />}
          style={{ background: '#fff' }}
          onClick={() => setOpenModal(true)}
          variant="contained">
          Add Announcement
        </Button>
      </AccessControl>
    );
  };

  const renderCustomFilters = () => {
    return (
      <Paper className={classes.filterContainer}>
        <Typography className={classes.filterText}>Filter</Typography>
        <form noValidate autoComplete="off" onSubmit={handleSubmit((values) => onSubmit(values))}>
          {!userDetails?.roles?.includes(UserRoles.GLOBAL_ADMIN) && (
            <Box mt={10}>
              <RecipientAutocompleteField
                errors={errors}
                control={control}
                rules={{ required: false }}
                label="Select Courses"
              />
            </Box>
          )}
          <Typography style={{ marginTop: 15, color: colors.textHeader }}>
            Published Date
          </Typography>
          <Box mt={6} alignItems="center">
            <Grid container spacing={5}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  name="startDate"
                  variant="outlined"
                  label="Start date"
                  InputLabelProps={{ shrink: true }}
                  inputRef={register({ required: endDate && !startDate ? true : false })}
                  error={getFormError('startDate', errors).hasError}
                  helperText={getFormError('startDate', errors).message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  name="endDate"
                  variant="outlined"
                  label="End date"
                  InputLabelProps={{ shrink: true }}
                  inputRef={register({ required: startDate && !endDate ? true : false })}
                  error={getFormError('endDate', errors).hasError}
                  helperText={getFormError('endDate', errors).message}
                />
              </Grid>
            </Grid>
          </Box>
          <Box mt={10}>
            <LoadingButton type="submit" variant="contained" color="primary" fullWidth>
              Search
            </LoadingButton>
          </Box>
        </form>
      </Paper>
    );
  };

  const renderAnnouncementBody = () => {
    return announcementData?.map(({ createdBy, createdAt, title, body }, index) => {
      return (
        <Box className={classes.announcementBody}>
          <AnnouncementCard
            key={index}
            announcement={{
              title,
              posterAvatar: createdBy?.image,
              poster: formatUserNameWithMiddleName(
                createdBy?.firstname,
                createdBy?.middlename,
                createdBy?.lastname,
              ),
              datePosted: createdAt,
              descriptionHtml: body,
            }}
          />
        </Box>
      );
    });
  };

  const renderMainBody = () => {
    return (
      <Box mt={10}>
        <Grid
          container
          spacing={10}
          direction={isSmScreen ? 'column-reverse' : 'row'}
          className={classes.wrapper}>
          <Grid item xs={12} md={8}>
            <FilterControl
              searchInputProps={{
                colSpan: {
                  xs: 12,
                },
                onChange: (evt) => handleChangeQueryParams({ search: evt.target.value }),
              }}
            />
            {announcementData?.length ? (
              <>
                <Box mt={12} height={500} className="container">
                  {renderAnnouncementBody()}
                </Box>
                <Box mt={10}>
                  <OffsetLimitBasedPagination
                    total={data?.announcements?.totalCount}
                    onChangeLimit={(_offset, limit) =>
                      handleChangeQueryParams({
                        offset: DEFAULT_PAGE_OFFSET,
                        limit,
                      })
                    }
                    onChangeOffset={(offset) => handleChangeQueryParams({ offset })}
                    offset={queryParams.offset}
                    limit={queryParams.limit}
                  />
                </Box>
              </>
            ) : (
              <>{renderEmptyState()}</>
            )}
          </Grid>
          <Grid xs={12} md={4}>
            {renderCustomFilters()}
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <BlueHeaderPageLayout
      isTabBarHidden={true}
      title="Announcement"
      description="Announcements! Announcements!! Announcements!!! Get latest and accurate updates regarding your school work and departmental activities"
      rightContent={renderBannerRightContent()}
      otherInformation={renderBannerMetaInfo()}
      isPageLoaded={true}
      links={[
        { title: 'Home', to: `${PrivatePaths.DASHBOARD}` },
        { title: 'Institution', to: `${PrivatePaths.INSTITUTIONS}/${institutionId}` },
      ]}>
      <MaxWidthContainer spacing="lg">
        <LoadingView isLoading={loading}>
          {renderMainBody()}
          <AnnouncementModal
            isVisible={openModal}
            onClose={() => {
              setOpenModal(false);
            }}
            onCompletedCallback={resetFilters}
          />
        </LoadingView>
      </MaxWidthContainer>
    </BlueHeaderPageLayout>
  );
};

const useStyles = makeStyles((theme) => ({
  filterContainer: {
    padding: 16,
    boxSizing: 'border-box',
    marginBottom: theme.spacing(20),
  },
  filterText: {
    fontSize: fontSizes.xlarge,
    fontWeight: fontWeight.bold,
    color: colors.textHeader,
  },
  announcementBody: {
    marginBottom: theme.spacing(20),
    '&:last-Child': {
      marginBottom: theme.spacing(10),
    },
  },
  wrapper: {
    overflow: 'hidden',
    '& .container': {
      overflowY: 'auto',
      scrollbarWidth: 'thin',
      scrollbarColor: '#757575',
    },
    '& .container::-webkit-scrollbar-thumb ': {
      backgroundColor: '#757575',
      borderRadius: 8,
    },
    '& .container::-webkit-scrollbar': {
      width: 7,
    },
  },
}));

export default Announcement;
