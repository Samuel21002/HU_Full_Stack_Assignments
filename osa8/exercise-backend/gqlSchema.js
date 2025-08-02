const typeDefs = `
  type Author {
    name: String
    born: Int
    bookCount: Int
  }

  type Book {
    title: String!
    published: Int!
    author: Author
    genres: [String!]!
    id: ID!
  }

  type Subscription {
    bookAdded: Book!
  }    

  type Query {
    authorCount: Int!
    booksCount: Int!
    allBooks(author:String, genre:String): [Book]!
    allAuthors: [Author]!
    findBook(title: String!): [Book]!
    me: User
  }
  type Mutation {
    addBook(
        title: String!
        published: Int
        author: String!
        genres: [String]
    ): Book!,
    editAuthor(
        name: String!
        setBornTo: Int
    ): Author,
    createUser(
        username: String!
        favoriteGenre: String!
    ): User
    login(
        username: String!
        password: String!
    ): Token
  }
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  type Token {
    value: String!
  }
`;

module.exports = typeDefs;
