import { ApolloServer, gql } from "apollo-server";
import { NoUnusedVariablesRule } from "graphql";

// GET /title
// GET /text
// GET /films

// fake DB
let tweets = [
    {
        id: "1",
        text: "hello",
        author: {
            id: "5112",
            username: "Ongs",
            firstName: "O",
            lastName: "ngs",
        },
    },
    {
        id: "2",
        text: "nice2meetU",
        author: {
            id: "5112",
            username: "Ongs",
            firstName: "O",
            lastName: "ngs",
        },
    },
];

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

// resolver 선언: 데이터베이스에 액세스한 다음 실행되는 함수(return)
// typeDefs 내의 각 타입 속성마다 resolver를 만들어줘야 함
const resolvers = {
    Query: {
        allTweets() {
            return tweets;
        },
        // arguments의 첫 번째 인자는 root 고정임
        tweet(_, { id }) {
            // arguments를 받아서 DB 처리 진행 (SQL이나 NoSQL 등 필요 기능을 진행하면됨)
            return tweets.find((tweet) => tweet.id === id);
        },
    },
    Mutation: {
        postTweet(_, { text, userId }) {
            const newTweet = {
                id: tweets.length + 1,
                text,
                author: {
                    id: userId,
                    userName: "test",
                    firstName: "te",
                    lastName: "st",
                },
            };
            tweets.push(newTweet);
            return newTweet;
        },
        deleteTweet(_, { id }) {
            const tweet = tweets.find((tweet) => tweet.id === id);

            if (!tweet) return false;
            tweets = tweets.filter((tweet) => tweet.id !== id);
            return true;
        },
    },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
    console.log(`Running on ${url}`);
});
