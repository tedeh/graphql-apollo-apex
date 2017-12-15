import React, { Component } from 'react';
import { ApolloClient } from 'apollo-client';
import { concat } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import { toIdValue } from 'apollo-utilities';
import {
  BrowserRouter,
  Route,
  Switch,
  Link,
} from 'react-router-dom';
import ChannelsListWithData from './components/ChannelsList';
import ChannelDetails from './components/ChannelDetails';
import NotFound from './components/NotFound';
import { WebSocketLink } from 'apollo-link-ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { format } from 'url';
import './App.css';

const wsComponents = {
  protocol: process.env.REACT_APP_WS_PROTOCOL || 'ws',
  port: process.env.REACT_APP_WS_PORT || '4000',
  pathname: process.env.REACT_APP_WS_PATHNAME || '/graphql',
  hostname: process.env.REACT_APP_WS_HOSTNAME || 'localhost',
  slashes: true,
};

if(process.env.REACT_APP_WS_HOSTNAME_LOCATION === '1') {
  wsComponents.hostname = window.location.hostname;
}

const wsUrl = format(wsComponents);

const wsClient = new SubscriptionClient(wsUrl, {reconnect: true});
const wsLink = new WebSocketLink(wsClient);

const timeoutMiddleware = setContext(request => new Promise((success, fail) => {
  setTimeout(() => success(), 500);
}));

const dataIdFromObject = result => {
  if (result.__typename) {
    if (result.id !== undefined) {
      return `${result.__typename}:${result.id}`;
    }
  }
  return null;
};

const client = new ApolloClient({
  link: concat(timeoutMiddleware, wsLink),
  cache: new InMemoryCache(),
  dataIdFromObject,
  customResolvers: {
    Query: {
      channel: (something, args) => {
        return toIdValue(dataIdFromObject({
          __typename: 'Channel',
          id: args['id'],
        }));
      }
    },
  },
});

const urlBase = process.env.PUBLIC_URL || '';

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <BrowserRouter>
          <div className="App container">
            <div className="page-header">
              <Link to={`${urlBase}/`} className="navbar">
                <h1>graphql-apollo-apex</h1>
              </Link>
            </div>
            <Switch>
              <Route exact path={`${urlBase}/`} component={ChannelsListWithData} />
              <Route path={`${urlBase}/channel/:channelId`} component={ChannelDetails} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </BrowserRouter>
      </ApolloProvider>
    );
  }
}
export default App;
