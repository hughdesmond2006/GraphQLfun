const express = require('express');
const bodyParser = require('body-parser');
const graphHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphQLSchema = require('./gql/schema/index');
const graphQLResolvers = require('./gql/resolvers/index');

const app = express();

app.use(bodyParser.json());



app.use('/graphql', graphHttp({
    schema: graphQLSchema,
    rootValue: graphQLResolvers,
    graphiql: true
}));

mongoose.connect(
    `mongodb://${process.env.MONGO_ATLAS_USER}:${process.env.MONGO_ATLAS_PW}@scoopycluster-shard-00-00-qdudo.mongodb.net:27017,scoopycluster-shard-00-01-qdudo.mongodb.net:27017,scoopycluster-shard-00-02-qdudo.mongodb.net:27017/${process.env.MONGO_ATLAS_DB}?ssl=true&replicaSet=scoopycluster-shard-0&authSource=admin&retryWrites=true`,
    {
        useNewUrlParser: true
    }
)
    .then(() => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });

mongoose.Promise = global.Promise;