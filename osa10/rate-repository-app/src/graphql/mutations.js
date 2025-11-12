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

export const CREATE_REVIEW = gql`
  mutation createReview($review: CreateReviewInput!) {
    createReview(review: $review) {
      id
      text
      rating
      createdAt
      repositoryId
      user {
        id
        username
      }
    }
  }
`;

export const SIGN_UP = gql`
  mutation createUser($username: String!, $password: String!) {
    createUser(user: { username: $username, password: $password }) {
      id
      username
      createdAt
    }
  }
`;
