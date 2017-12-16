const express = require('express');
const bodyParser = require('body-parser');
const { graphiqlExpress, graphqlExpress } = require('apollo-server-express');
const { execute, subscribe } = require('graphql');
const http = require('http');
const schema = require('./schema');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { PORT = 4000, BASEPATH = '' } = process.env;

var app = express();

app.use('/graphiql', graphiqlExpress({
  endpointURL: BASEPATH + '/graphql',
}));
app.use('/graphql', bodyParser.json(), graphqlExpress({schema}));
app.use(express.static('build'));

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`GraphQL server running on port ${PORT}.`);
  new SubscriptionServer({
    execute,
    subscribe,
    schema,
  }, {
    server,
    path: '/graphql',
  });
});
