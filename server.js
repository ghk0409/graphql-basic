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
        userId: "2",
    },
    {
        id: "2",
        text: "nice2meetU",
        userId: "1",
    },
];

let users = [
    {
        id: "1",
        firstName: "Ong",
        lastName: "HHHH",
    },
    {
        id: "2",
        firstName: "secondeOng",
        lastName: "holymoly",
    },
];

// graphql schema
// type에 느낌표!를 추가하여 Non-null 설정
const typeDefs = gql`
    type User {
        id: ID!
        firstName: String!
        lastName: String
        """
        this is the sum of firstName + lastName as a String
        """
        fullName: String!
    }
    """
    Tweet Object represents a resource for a Tweet!
    """
    type Tweet {
        id: ID!
        text: String!
        author: User!
    }
    type Query {
        allUsers: [User!]!
        allTweets: [Tweet!]!
        tweet(id: ID!): Tweet
    }
    type Mutation {
        postTweet(
            """
            text는 반드시 String 타입
            """
            text: String!
            userId: ID!
        ): Tweet!
        """
        Deletes a Tweet, if found, else returns false
        """
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
        tweet(root, { id }) {
            // arguments를 받아서 DB 처리 진행 (SQL이나 NoSQL 등 필요 기능을 진행하면됨)
            return tweets.find((tweet) => tweet.id === id);
        },
        allUsers(root) {
            return users;
        },
    },
    Mutation: {
        postTweet(_, { text, userId }) {
            // userId에 해당하는 user가 존재하는지 체크
            const check = users.find((user) => user.id === userId);
            // 존재할 경우, tweet 생성 | 존재하지 않을 경우, 에러 메시지 출력
            if (!check) {
                throw new Error("Please Check userId, userId not exist!");
            }
            const newTweet = {
                id: tweets.length + 1,
                text,
                userId,
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
    User: {
        // 첫 번째 인자인 root 안에 User 객체가 담겨있음
        fullName({ firstName, lastName }) {
            return `${firstName} ${lastName}`;
        },
    },
    Tweet: {
        author({ userId }) {
            // Tweet의 userId에 해당하는 user 데이터 가져오기 (join)
            return users.find((user) => user.id === userId);
        },
    },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
    console.log(`Running on ${url}`);
});
