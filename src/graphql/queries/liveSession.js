import { gql } from '@apollo/client';
import { CORE_LIVE_EVENT_FIELDS } from '../fragments';

export const GET_ATTENDEES = gql`
  query searchAttendees($search: String, $offset: Int, $limit: Int) {
    searchAttendees(search: $search, offset: $offset, limit: $limit) {
      courses {
        id
        title
      }
      faculties {
        id
        name
      }
      departments {
        id
        name
      }
    }
  }
`;

export const GET_LIVE_SESSION_BY_ID = gql`
  ${CORE_LIVE_EVENT_FIELDS}
  query getLiveEventById($liveEventId: UUID) {
    liveEvent(liveEventId: $liveEventId) {
      ...LiveEventPart
      attendeeTypes {
        id
        type
        typeId
        typeTitle
      }
    }
  }
`;

export const GET_LIVE_EVENTS = gql`
  ${CORE_LIVE_EVENT_FIELDS}
  query getLiveEvents(
    $startDatetime: DateTime
    $endDatetime: DateTime
    $search: String
    $courseId: UUID
  ) {
    liveEvents(
      startDatetime: $startDatetime
      endDatetime: $endDatetime
      search: $search
      courseId: $courseId
    ) {
      ...LiveEventPart
    }
  }
`;
