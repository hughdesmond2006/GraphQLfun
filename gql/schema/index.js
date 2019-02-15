const {buildSchema} = require('graphql');

//----------- GraphQL -----------------------------
//String = list of strings, ! = not null
//Query named as 'objectname' EG. events
//Mutation named as 'actionObjectname' EG. createEvent()
//Resolver named same as above, they must match! EG. events
//....................
//note: args can be passed to both queries and mutations
//note: GQL not need comma after a line
//ID = GQL's ID, similar to mongo's
//date type does not exist in GQL, store as a string
//input = shorthand for GQL take multiple args
//...................
//The resolver states how to handle all data, but behind
// the scenes GQL filters to only send the queried data
//----------------------------------------------------
module.exports = buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
            creator: User!
        }
        
        type User {
            _id: ID!
            email: String!
            password: String
            createdEvents: [Event!]
        }
        
        type AuthData {
            userId: ID!
            token: String!
            tokenExpiration: Int!
        }
        
        type Booking {
            _id: ID!
            event: Event!
            user: User!
            createdAt: String!
            updatedAt: String!
        }
        
        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        
        input UserInput {
            email: String!
            password: String!
        }
        
        type RootQuery {
            events: [Event!]!
            bookings: [Booking!]!
            login(email: String!, password: String!): AuthData!
        }
        
        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
            bookEvent(eventId: ID!): Booking!
            cancelBooking(bookingId: ID!): Event!
        }
        
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `);