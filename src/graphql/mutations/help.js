import { gql } from '@apollo/client';

export const SEND_HELP_MESSAGE = gql`
  mutation sendMessage($message: String!) {
    contactUs(message: $message) {
      ok
      success {
        messages
        field
      }
      errors {
        messages
        field
      }
    }
  }
`;
