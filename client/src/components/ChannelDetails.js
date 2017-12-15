import React from 'react';
import NotFound from './NotFound';
import MessageList from './MessageList';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import ChannelPreview from './ChannelPreview';

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
    if(error) return <div>{error.message}</div>;
    if(channel === null) return <NotFound />;
    return (
      <div>
        <div className="channelName">
          {channel.name}
        </div>
        Messages:<br />
        <MessageList messages={channel.messages}/>
      </div>
    );
  }

}

export default (graphql(channelDetailsQuery, {
  options: props => ({
    variables: { channelId: props.match.params.channelId },
  }),
}))(ChannelDetails);
