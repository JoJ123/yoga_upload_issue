import * as express from "express";
import { createServer } from 'http';
import { createServer as createYogaServer } from '@graphql-yoga/node'

const app = express();
const server = createServer(app);

const yogaServer = createYogaServer({
    schema: {
        typeDefs: /* GraphQL */ `
            scalar File

            type Query {
                greetings: String!
            }
            type Mutation {
                readTextFile(file: File!): String!
            }
        `,
        resolvers: {
            Query: {
                greetings: () => 'Hello World!',
            },
            Mutation: {
                readTextFile: async (_, { file }: { file: File }) => {
                    const textContent = await file.text()
                    return textContent
                },
            }
        }
    }
});

app.use(express.urlencoded({ extended: false }))
app.use(express.json({ limit: '50mb', type: 'application/json' }))

// Bind GraphQL Yoga to `/graphql` endpoint
app.use(
    '/graphql',
    async (req, res, next) => {
        // Comment this line it will work, will not work with this line.
        await new Promise(resolve => setTimeout(() => resolve(true), 5000))
        next();
    }, 
    yogaServer
)

server.listen(4000, () => {
    console.log('Running a GraphQL API server at http://localhost:4000/graphql')
})