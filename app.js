const express = require('express');
const bodyParser = require('body-parser');
const graphHttp = require('express-graphql');
const {buildSchema} = require('graphql');    //es6 object destructuring: stores values of props to equally named vars

const app = express();

app.use(bodyParser.json());

//----------- GraphQL -----------------
//String = list of strings, ! = not null
//Query named as 'objectname' EG. events
//Mutation named as 'actionObjectname' EG. createEvent()
//Resolver named same as above, they must match! EG. events
//note: args can be passed to both queries and mutations
app.use('/graphql', graphHttp({
    schema: buildSchema(`
        type RootQuery {
            events: [String!]!
        }
        
        type RootMutation {
            createEvent(name: String): String
        }
        
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return ['mtbing', 'poker', 'gaming'];
        },
        createEvent: (args) => {
            const eventName = args.name;
            return eventName;
        }
    },
    graphiql: true
}));

app.listen(3000);