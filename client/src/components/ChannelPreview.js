import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Wrap } from './ChannelDetails';

const ChannelPreview = ({ data: {loading, error, channel } }) => {  
return (
    <Wrap title={`Loading messages for ${channel ? channel.name : '...'}`}></Wrap>
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
