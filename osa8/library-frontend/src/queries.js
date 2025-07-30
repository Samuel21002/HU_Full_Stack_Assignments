import { gql } from "@apollo/client";

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`;

export const ALL_BOOKS = gql`
  query ($genre: String) {
    allBooks(genre: $genre) {
      title
      author {
        name
      }
      genres
      published
    }
  }
`;

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

export const CREATE_BOOK = gql`
  mutation addBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String]
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      title
      author {
        name
        born
        bookCount
      }
      published
      genres
    }
  }
`;

export const GET_CURRENT_USER = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`;

export const EDIT_AUTHOR = gql`
  mutation editAuthor($author: String!, $setBornTo: Int) {
    editAuthor(name: $author, setBornTo: $setBornTo) {
      name
      born
    }
  }
`;

export const BOOKS_BY_GENRE = gql`
  query booksByGenre($genre: String) {
    allBooks(genre: $genre) {
      title
      published
    }
  }
`;
