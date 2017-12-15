import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const ChannelPreview = ({ data: {loading, error, channel } }) => {  
return (
    <div>
      <div className="channelName">
        {channel ? channel.name : 'Loading...'}
      </div>
      <div>Loading Messages</div>
    </div>
  );
};
export const channelQuery = gql`
  query ChannelQuery($channelId : ID!) {
    channel(id: $channelId) {
      id
      name
    }
  }
`;
export default (graphql(channelQuery, {
  options: (props) => ({
    variables: { channelId: props.channelId },
  }),
})(ChannelPreview));
