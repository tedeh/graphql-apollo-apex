const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { execute, subscribe } = require('graphql');
const http = require('http');
const fs = require('fs');
const schema = require('./schema');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { PORT = 4000 } = process.env;

var app = express();


app.use('*', cors({ origin: 'http://localhost:3000' }));
// app.use('/graphql', bodyParser.json(), graphqlExpress({schema}));
app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: 'ws://localhost:4000/subscriptions',
}));
app.use(express.static('client'));
app.use('*', (req, res) => {
  console.log(req.url);
  res.status(404).send('not found');
});

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`GraphQL server running on port ${PORT}.`)
  new SubscriptionServer({
    execute,
    subscribe,
    schema,
  }, {
    server,
    path: '/graphql',
  });
});
