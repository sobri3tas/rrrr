const { ApolloServer, gql } = require('apollo-server');
const products = require('./backend/products.json'); // Ваш JSON-файл с товарами
console.log(products);

const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    price: Int!
    description: String!
    category: [String!]!
  }

  type Query {
    products: [Product!]!
  }
`;

const resolvers = {
  Query: {
    products: () => products,
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`GraphQL сервер запущен на ${url}`);
});