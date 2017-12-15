import React from 'react';
import NotFound from './NotFound';
import MessageList from './MessageList';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import ChannelPreview from './ChannelPreview';
import AddMessage from './AddMessage';

export const channelDetailsQuery = gql`
  query ChannelDetailsQuery($channelId: ID!) {
    channel(id: $channelId) {
      id
      name
      messages {
        id
        text
      }
    }
  }
`;

export const messagesSubscription = gql`
  subscription messageAdded($channelId: ID!) {
    messageAdded(channelId: $channelId) {
      id
      text
    }
  }
`;

export const Wrap = ({children, title}) => (
  <div className="panel panel-default">
    {title && <div className="panel-heading">
      <h2 className="panel-title">{title}</h2>
    </div>}
    <div className="panel-body">
      {children}
    </div>
    <div className="panel-footer">
      <AddMessage />
    </div>
  </div>
);

class ChannelDetails extends React.Component {

  componentWillMount() {
    this.props.data.subscribeToMore({
      document: messagesSubscription,
      variables: {
        channelId: this.props.match.params.channelId,
      },
      updateQuery: (prev, {subscriptionData}) => {
        if (!subscriptionData.data) {
          return prev;
        }
        const newMessage = subscriptionData.data.messageAdded;
        // don't double add the message
        if (!prev.channel.messages.find((msg) => msg.id === newMessage.id)) {
          return {...prev, channel: {...prev.channel, messages: [...prev.channel.messages, newMessage]}};
        } else {
          return prev;
        }
      }
    });
  }

  render() {
    const {data: {loading, error, channel}, match} = this.props;
    if(loading) return <ChannelPreview channelId={match.params.channelId} />;
    if(error) return <Wrap><p>Error: {error.message}</p></Wrap>;
    if(channel === null) return <Wrap><NotFound /></Wrap>;
    return (
      <Wrap title={channel.name}>
        <MessageList messages={channel.messages}/>
      </Wrap>
    );
  }

}

export default (graphql(channelDetailsQuery, {
  options: props => ({
    variables: { channelId: props.match.params.channelId },
  }),
}))(ChannelDetails);
