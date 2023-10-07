import { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { TextField, Box } from '@material-ui/core';
import { useMutation, useQuery } from '@apollo/client';

import Modal from 'reusables/Modal';
import LecturerRatingItem from 'reusables/LecturerRatingItem';
import { UPSERT_RATING } from 'graphql/mutations/courses';
import { useNotification } from 'reusables/NotificationBanner';
import { GET_RATINGS } from 'graphql/queries/courses';
import LoadingView from 'reusables/LoadingView';
import { useAuthenticatedUser } from 'hooks/useAuthenticatedUser';
import { RatingType } from 'utils/constants';

const InstructorRatingModal = ({ open, onClose, instructor, courseId, onOkSuccess }) => {
  const notification = useNotification();
  const { userDetails } = useAuthenticatedUser();
  const [instructorRating, setInstructorRating] = useState({
    note: '',
    rating: 0,
  });

  const { loading: isLoadingRatings } = useQuery(GET_RATINGS, {
    variables: {
      institutionId: userDetails?.institution.id,
      rateType: RatingType.LECTURER,
      courseId,
      instructorId: instructor?.id,
    },
    skip: !open || !instructor?.id,
    onError: (error) => {
      notification.error({
        message: error?.message,
      });
    },
    onCompleted: ({ ratings: { results } }) => {
      const { rate = 0, review } = results?.[0] || {};
      handleChangeInstructorRating({
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

  const handleChangeInstructorRating = (changeset) => {
    setInstructorRating((prevState) => ({
      ...prevState,
      ...changeset,
    }));
  };

  const handleSubmitReview = () => {
    upsertRating({
      variables: {
        rateInput: {
          rate: instructorRating.rating,
          review: instructorRating.note,
          courseId,
          instructorId: instructor?.id,
          rateType: RatingType.LECTURER,
        },
      },
    });
  };

  const renderContent = () => {
    let { lastname, firstname, image, department } = instructor || {};
    let fullname = `${firstname} ${lastname} `;

    return (
      <Box>
        <Box mb={6}>
          <LecturerRatingItem
            name={fullname}
            department={department}
            avatarProps={{
              size: 'lg',
              src: image,
            }}
            ratingProps={{
              value: instructorRating.rating,
              onChange: (_evt, rating) => handleChangeInstructorRating({ rating }),
            }}
          />
        </Box>
        <TextField
          variant="outlined"
          placeholder="Describe your experience with the instructor"
          fullWidth
          multiline
          rows={5}
          value={instructorRating.note}
          onChange={(evt) => handleChangeInstructorRating({ note: evt.target.value })}
        />
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

InstructorRatingModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  instructor: PropTypes.shape({
    id: PropTypes.string.isRequired,
    lastname: PropTypes.string,
    firstname: PropTypes.string,
    image: PropTypes.string,
    department: PropTypes.string,
  }),
  courseId: PropTypes.string.isRequired,
  onOkSuccess: PropTypes.func,
};

export default memo(InstructorRatingModal);
