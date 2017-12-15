import React from 'react';
import gql from 'graphql-tag';
import { withRouter } from 'react-router';
import { graphql } from 'react-apollo';
import { channelDetailsQuery } from './ChannelDetails';

const addMessageMutation = gql`
  mutation addMessage($message: MessageInput!) {
    addMessage(message: $message) {
      id
      text
    }
  }
`;

const AddMessage = ({mutate, match}) => {
  const handleKeyUp = (evt) => {
    if (evt.keyCode === 13) {
      evt.persist();
      mutate({ 
        variables: {
          message: {
            text: evt.target.value,
            channelId: match.params.channelId,
          }
        },
        update: (store, { data: { addMessage } }) => {
          // Read the data from the cache for this query.
          const data = store.readQuery({
            query: channelDetailsQuery,
            variables: {
              channelId: match.params.channelId,
            }
          });
          // Add our Message from the mutation to the end.
          if(!data.channel.messages.find((msg) => msg.id === addMessage.id))
          {
            // Add our Message from the mutation to the end.
            data.channel.messages.push(addMessage);
          }
          // Write the data back to the cache.
          store.writeQuery({
            query: channelDetailsQuery,
            variables: {
              channelId: match.params.channelId,
            },
            data
          });
        },
        // optimisticResponse: {
        //   addMessage: {
        //     __typename: 'Message',
        //     text: evt.target.value,
        //     id: String(Math.round(Math.random() * -10000)),
        //   },
        // },
      });
      evt.target.value = '';  
    }
  };
  return (
    <input
      type="text"
      placeholder="New message"
      onKeyUp={handleKeyUp}
    />
  );
}

const AddMessageWithMutation = graphql(
  addMessageMutation,
)(withRouter(AddMessage));
export default AddMessageWithMutation;
