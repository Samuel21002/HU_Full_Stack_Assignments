import { gql } from '@apollo/client';

export const AUTHENTICATE_USER = gql`
  mutation authenticate(
    $username: String!
    $password: String!
  ) {
    authenticate(credentials: { username: $username, password: $password }) {
      accessToken
    }
  }
`;
