const typeDefs = require("./gqlSchema");
const resolvers = require("./gqlResolvers");
const jwt = require("jsonwebtoken");

const { expressMiddleware } = require("@as-integrations/express4");
const {
  ApolloServerPluginDrainHttpServer,
} = require("@apollo/server/plugin/drainHttpServer");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const express = require("express");
const cors = require("cors");
const http = require("http");

const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/lib/use/ws");

const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
require("dotenv").config();

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const User = require("./models/user");

const MONGODB_URI = process.env.MONGODB_URI;
console.log("connecting to", MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });

/*
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: process.env.PORT },
  introspection: true,
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.startsWith("Bearer ")) {
      const decodedToken = jwt.verify(
        auth.substring(7),
        process.env.JWT_SECRET,
      );
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
*/

// setup is now within a function
const start = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/",
  });

  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });
  await server.start();
  app.use(
    "/",
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const auth = req?.headers?.authorization || null;
        if (auth && auth.startsWith("Bearer ")) {
          try {
            const decodedToken = jwt.verify(
              auth.substring(7),
              process.env.JWT_SECRET,
            );
            const currentUser = await User.findById(decodedToken.id);
            return { currentUser };
          } catch (err) {
            console.error("JWT error:", err);
            return {}; // Still return an object
          }
        }
        return {}; // Ensure something is always returned
      },
    }),
  );
  const PORT = 4000;
  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}`),
  );
};
start();
