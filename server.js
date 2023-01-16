import { ApolloServer, gql } from "apollo-server";

// GET /title
// GET /text
// GET /films

// graphql schema
// type에 느낌표!를 추가하여 Non-null 설정
const typeDefs = gql`
    type User {
        id: ID!
        username: String!
        firstName: String!
        lastName: String
    }
    type Tweet {
        id: ID!
        text: String!
        author: User!
    }
    type Query {
        allTweets: [Tweet!]!
        tweet(id: ID!): Tweet
    }
    type Mutation {
        postTweet(text: String!, userId: ID!): Tweet!
        deleteTweet(id: ID!): Boolean!
    }
`;

const server = new ApolloServer({ typeDefs });

server.listen().then(({ url }) => {
    console.log(`Running on ${url}`);
});
