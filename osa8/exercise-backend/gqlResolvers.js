const { GraphQLError } = require("graphql");
const Author = require("./models/author");
const Book = require("./models/book");

const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();
const User = require("./models/user");
const jwt = require("jsonwebtoken");

const resolvers = {
  Query: {
    authorCount: async () => {
      return await Author.collection.countDocuments();
    },
    booksCount: async () => {
      return await Book.collection.countDocuments();
    },
    allBooks: async (root, args) => {
      const filter = {};

      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        if (!author) return [];
        filter.author = author._id;
      }
      if (args.genre) {
        filter.genres = args.genre;
      }
      return Book.find(filter);
    },
    me: (root, args, context) => {
      return context.currentUser;
    },
    allAuthors: async () => {
      const authorsWithCounts = await Author.aggregate([
        {
          $lookup: {
            from: "books",
            localField: "_id",
            foreignField: "author",
            as: "books",
          },
        },
        {
          $addFields: {
            bookCount: { $size: "$books" },
          },
        },
        {
          $project: {
            name: 1,
            born: 1,
            bookCount: 1,
          },
        },
      ]);
      return authorsWithCounts;
    },
    findBook: async (root, args) => {
      return await Book.find({ title: args.title });
    },
    // books.find((book) => book.title === args.title),
  },
  Book: {
    author: async (root) => {
      if (!root.author) return null;
      const author = await Author.findById(root.author);
      if (!author) {
        console.warn(`Author not found for book ${root.title}`);
        return null;
      }
      return author;
    },
  },
  Author: {
    bookCount: async (root) => {
      if (typeof root.bookCount === "number") return root.bookCount;
      if (!root._id) return 0; // Guard: don't query if no ID
      return await Book.countDocuments({ author: root._id });
    },
    /* bookCount: async (root) => {
      return await Book.countDocuments({ author: root._id });
    },*/
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        });
      }

      let author = await Author.findOne({ name: args.author });

      if (!author) {
        author = new Author({ name: args.author });
        await author.save();
      }

      const book = new Book({
        title: args.title,
        published: args.published,
        genres: args.genres,
        author: author._id,
      });

      try {
        await book.save();
      } catch (error) {
        console.error("Book save error:", error);

        // Extract mongoose validation messages if any
        const validationMessages = error.errors
          ? Object.values(error.errors)
              .map((e) => e.message)
              .join(", ")
          : null;

        throw new GraphQLError("Saving book failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args,
            error: validationMessages || error.message,
          },
        });
      }

      pubsub.publish("BOOK_ADDED", { bookAdded: book });
      return book;
    },

    /*
        if (!authors.find((a) => a.name === args.author)) {
          const newAuthor = {
            name: args.author,
            id: uuid(),
          };
          authors = authors.concat(newAuthor);
        }
        if (books.find((book) => book.title === args.title)) {
          throw new GraphQLError("Title must be unique", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.title,
            },
          });
        }
        const book = { ...args, id: uuid() };
        books = books.concat(book);
        return book;*/
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new GraphQLError("You are not logged in", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
      const author = await Author.findOne({ name: args.name });
      if (!author) {
        return null;
      }
      author.born = args.setBornTo;

      try {
        await author.save();
        return author;
      } catch (error) {
        throw new GraphQLError("Editing birthyear failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.setBornTo,
            error,
          },
        });
      }
      /*
        authors = authors.map((author) =>
          author.name === args.name ? updatedAuthor : author,
        );*/
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });

      return user.save().catch((error) => {
        throw new GraphQLError(`Creating the user "${args.username}" failed`, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error,
          },
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "salasana") {
        throw new GraphQLError("Passwrod not correct", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return {
        value: jwt.sign(userForToken, process.env.JWT_SECRET, {
          expiresIn: 60 * 60 * 24,
        }),
      };
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator("BOOK_ADDED"),
    },
  },
};

module.exports = resolvers;
