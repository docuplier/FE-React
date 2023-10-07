import { gql } from '@apollo/client';
import { CORE_LIVE_EVENT_FIELDS } from 'graphql/fragments';

export const CREATE_LIVE_SESSION = gql`
  ${CORE_LIVE_EVENT_FIELDS}
  mutation createLiveEvent($newLiveevent: CreateLiveEventInputType!) {
    createLiveEvent(newLiveevent: $newLiveevent) {
      ok
      errors {
        messages
        field
      }
      liveevent {
        ...LiveEventPart
      }
    }
  }
`;

export const UPDATE_LIVE_SESSION = gql`
  ${CORE_LIVE_EVENT_FIELDS}
  mutation updateLiveEvent($newLiveevent: UpdateLiveEventInputType!, $liveEventId: ID!) {
    updateLiveEvent(newLiveevent: $newLiveevent, id: $liveEventId) {
      ok
      errors {
        messages
        field
      }
      liveevent {
        ...LiveEventPart
      }
    }
  }
`;
