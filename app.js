const express = require('express');
const bodyParser = require('body-parser');
const graphHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphQLSchema = require('./gql/schema/index');
const graphQLResolvers = require('./gql/resolvers/index');
const isAuth = require('./middleware/is-auth');

const app = express();

//-----------------------

function scaleImage(width, height, maxdim) {
    let scale = (maxdim / height < maxdim / width) ? (maxdim / height) : (maxdim / width);
    return [scale * width, scale * height];
}

console.log(scaleImage(100, 400, 800))

//----------------------


//-----------------
let x = 2;
let y = 8;
const a = function(b) {
    return function(c) {
        return x + y + Math.abs(b) + c;
    }
};

y = 4;

const fn = a(x);
x = 4;
console.log(fn(Math.random() * 10));
//------------------------





app.use(bodyParser.json());

//this sets CORs so the client can communicate with the server from a different domain
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','POST, GET, OPTIONS');            //browser auto sends options with post req, so important to allow
    res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');            //browser auto sends options with post req, so important to allow
    if(req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(isAuth);

app.use('/graphql', graphHttp({
    schema: graphQLSchema,
    rootValue: graphQLResolvers,
    graphiql: true
}));

mongoose.connect(
    `mongodb://${process.env.MONGO_ATLAS_USER}:${process.env.MONGO_ATLAS_PW}@scoopycluster-shard-00-00-qdudo.mongodb.net:27017,scoopycluster-shard-00-01-qdudo.mongodb.net:27017,scoopycluster-shard-00-02-qdudo.mongodb.net:27017/${process.env.MONGO_ATLAS_DB}?ssl=true&replicaSet=scoopycluster-shard-0&authSource=admin&retryWrites=true`,
    {
        useNewUrlParser: true,
        socketTimeoutMS: 30000,
        keepAlive: true,
        reconnectTries: 30000
    }
)
    .then(() => {
        app.listen(8000);
    })
    .catch(err => {
        console.log(err);
    });

mongoose.Promise = global.Promise;