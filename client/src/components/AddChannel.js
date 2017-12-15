import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { channelsListQuery } from './ChannelsList';

const addChannelMutation = gql`
  mutation addChannel($name: String!) {
    addChannel(name: $name) {
      id
      name
    }
  }
`;

const AddChannel = ({mutate}) => {
 const handleKeyUp = (evt) => {
    if (evt.keyCode === 13) {
      evt.persist();
      mutate({ 
        variables: { name: evt.target.value },
        update: (store, { data: { addChannel } }) => {
          // Read the data from the cache for this query.
          const data = store.readQuery({query: channelsListQuery });
          // Add our channel from the mutation to the end.
          data.channels.push(addChannel);
          // Write the data back to the cache.
          store.writeQuery({ query: channelsListQuery, data });
        },
        optimisticResponse: {
          addChannel: {
            __typename: 'Channel',
            name: evt.target.value,
            id: Math.round(Math.random() * -10000),
          },
        },
      })
      .then( res => {
        evt.target.value = '';  
      });
    }
  };
  return (
    <input
      type="text"
      placeholder="New channel"
      onKeyUp={handleKeyUp}
    />
  );
};

const AddChannelWithMutation = graphql(addChannelMutation)(AddChannel);
export default AddChannelWithMutation;
