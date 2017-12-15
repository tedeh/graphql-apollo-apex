import React from 'react';
import { graphql } from 'react-apollo';
import { Link } from 'react-router-dom';
import AddChannel from './AddChannel';
import gql from 'graphql-tag';

const urlBase = process.env.PUBLIC_URL || '';

export const Wrap = ({children}) => (
  <div className="panel panel-default">
    <div className="panel-heading">
      <h2 className="panel-title">Available channels</h2>
    </div>
    <div className="panel-body">
      {children}
    </div>
    <div className="panel-footer">
      <AddChannel />
    </div>
  </div>
);

const ChannelsList = ({data: {loading, error, channels}}) => {
  if(loading) {
    return <Wrap><p>Loading ...</p></Wrap>;
  }
  if(error) {
    return <Wrap><p>Error: {error.message}</p></Wrap>;
  }
  return (
    <Wrap>
      <ul className="list-group" style={{marginBottom: 0}}>
        {channels.map(ch => (
          <li className={'channel ' + (ch.id < 0 ? 'optimistic' : '') + ' list-group-item'} key={ch.id}>
            <Link to={`${urlBase}/channel/${ch.id}`}>{ch.name}</Link>
          </li>
        ))}
      </ul>
    </Wrap>
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
