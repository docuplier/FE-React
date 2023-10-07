import { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { TextField, Box, Typography } from '@material-ui/core';
import { useMutation, useQuery } from '@apollo/client';

import Modal from 'reusables/Modal';
import Rating from 'reusables/Rating';
import { fontWeight } from '../../../Css';
import { UPSERT_RATING } from 'graphql/mutations/courses';
import { useNotification } from 'reusables/NotificationBanner';
import { GET_RATINGS } from 'graphql/queries/courses';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import { RatingType } from 'utils/constants';
import LoadingView from 'reusables/LoadingView';

const CourseRatingModal = ({ open, onClose, course, onOkSuccess }) => {
  const notification = useNotification();
  const { userDetails } = useAuthenticatedUser();
  const [courseRating, setCourseRating] = useState({
    note: '',
    rating: 0,
  });

  const { loading: isLoadingRatings } = useQuery(GET_RATINGS, {
    variables: {
      institutionId: userDetails?.institution.id,
      rateType: RatingType.COURSE,
      courseId: course?.id,
    },
    skip: !open,
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
    onCompleted: ({ ratings: { results } }) => {
      const { rate = 0, review } = results?.[0] || {};
      handleChangeCourseRating({
        rating: rate,
        note: review,
      });
    },
  });

  const [upsertRating, { loading: isLoadingUpsertRating }] = useMutation(UPSERT_RATING, {
    onCompleted: ({ createRating: { ok, errors } }) => {
      if (ok) {
        notification.success({
          message: 'Review submitted successfully',
        });
        onOkSuccess?.();
        onClose();
      } else {
        notification.error({
          message: errors?.messages || errors?.map((error) => error.messages).join('. '),
        });
      }
    },
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
  });

  const handleChangeCourseRating = (changeset) => {
    setCourseRating((prevState) => ({
      ...prevState,
      ...changeset,
    }));
  };

  const handleSubmitReview = () => {
    upsertRating({
      variables: {
        rateInput: {
          rate: courseRating.rating,
          review: courseRating.note,
          courseId: course.id,
          rateType: RatingType.COURSE,
        },
      },
    });
  };

  const renderContent = () => {
    let { name, department } = course;

    return (
      <Box>
        <TextField
          variant="outlined"
          placeholder="Describe your experience while taking the course"
          fullWidth
          multiline
          rows={5}
          value={courseRating.note}
          onChange={(evt) => handleChangeCourseRating({ note: evt.target.value })}
        />
        <Box mt={12} display="flex" alignItems="center" justifyContent="space-between">
          <Box width="70%">
            <Typography color="textPrimary" variant="body1" style={{ fontWeight: fontWeight.bold }}>
              {name}
            </Typography>
            <Typography color="textSecondary" variant="body2">
              {department}
            </Typography>
          </Box>
          <Rating
            value={courseRating.rating}
            onChange={(_evt, rating) => handleChangeCourseRating({ rating })}
          />
        </Box>
      </Box>
    );
  };

  return (
    <Modal
      title="Rating"
      okText="Publish Review"
      fullWidth
      okButtonProps={{
        isLoading: isLoadingUpsertRating,
        onClick: () => handleSubmitReview(),
      }}
      open={open}
      onClose={onClose}>
      <LoadingView isLoading={isLoadingRatings}>
        <Box mt={8}>{renderContent()}</Box>
      </LoadingView>
    </Modal>
  );
};

CourseRatingModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  course: PropTypes.shape({
    department: PropTypes.string,
    name: PropTypes.string,
    id: PropTypes.string,
  }),
  onOkSuccess: PropTypes.func,
};

export default memo(CourseRatingModal);
