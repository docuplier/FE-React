import { Box, Paper, Typography } from '@material-ui/core';
import Empty from 'reusables/Empty';
import { Link } from 'react-router-dom';

import LecturerRatingItem from 'reusables/LecturerRatingItem';
import LoadingView from 'reusables/LoadingView';
import { fontWeight } from '../../../Css';
import { PrivatePaths } from 'routes';

const LecturerRatingList = ({ ratingProps, onClickViewAll, isLoading, hasMoreResults }) => {
  return (
    <Box component={Paper} elevation={0} p={12}>
      <Box display="flex" justifyContent="space-between" mb={8}>
        <Typography color="textPrimary" variant="body1" style={{ fontWeight: fontWeight.bold }}>
          Lecturers rating
        </Typography>
        {hasMoreResults && (
          <Typography variant="subtitle1" style={{ cursor: 'pointer' }} onClick={onClickViewAll}>
            View more
          </Typography>
        )}
      </Box>
      <LoadingView isLoading={isLoading}>
        {ratingProps?.length > 0 ? (
          ratingProps?.map((rating) => {
            return (
              <Link
                key={rating?.id}
                style={{ textDecoration: 'none' }}
                to={`${PrivatePaths.USERS}/instructors/${rating?.id}`}>
                <Box mb={8}>
                  <LecturerRatingItem
                    name={rating?.name}
                    titleProps={{
                      variant: 'subtitle2',
                    }}
                    avatarProps={{
                      size: 'md',
                    }}
                    ratingProps={{
                      useNumberedLabel: true,
                      readOnly: true,
                      value: rating?.value,
                      size: 'small',
                    }}
                  />
                </Box>
              </Link>
            );
          })
        ) : (
          <Empty title="Lecturer Rating Not Available" />
        )}
      </LoadingView>
      {/* {} */}
    </Box>
  );
};

export default LecturerRatingList;
