import React from 'react';
import { graphql } from 'react-apollo';
import { Link } from 'react-router-dom';
import AddChannel from './AddChannel';
import gql from 'graphql-tag';

const urlBase = process.env.PUBLIC_URL || '';

const ChannelsList = ({data: {loading, error, channels}}) => {
  if(loading) {
    return <p>Loading...</p>;
  }
  if(error) {
    return <p>Error: {error.message}</p>;
  }
  return (
    <div>
      <ul>
        {channels.map(ch => (
          <li className={'channel ' + (ch.id < 0 ? 'optimistic' : '')} key={ch.id}>
            <Link to={`${urlBase}/channel/${ch.id}`}>{ch.name}</Link>
          </li>
        ))}
      </ul>
      <AddChannel />
    </div>
  );
};

export const channelsListQuery = gql`
   query ChannelsListQuery {
     channels {
       id
       name
     }
   }
`;

const ChannelsListWithData = graphql(channelsListQuery, {
  options: {pollInterval: 5000}
})(ChannelsList);

export default ChannelsListWithData;
