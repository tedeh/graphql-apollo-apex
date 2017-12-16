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

class AddChannel extends React.Component {

  state = {
    name: '',
  }

  handleChange = ev => {
    const { name, value } = ev.target;
    this.setState({[name]: value});
  }

  handleSubmit = ev => {
    ev.preventDefault();
    const { match, mutate } = this.props;
    const { name } = this.state;
    mutate({ 
      variables: { name },
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
          name,
          id: Math.round(Math.random() * -10000),
        },
      },
    }).then(() => {
      this.setState({name: ''});
    });
  }

  render() {
    const { name } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="New channel"
            name="name"
            value={name}
            onChange={this.handleChange}
          />
          <div className="input-group-btn">
            <button className="btn btn-primary">Create</button>
          </div>
        </div>
      </form>
    );
  }
}

const AddChannelWithMutation = graphql(addChannelMutation)(AddChannel);
export default AddChannelWithMutation;
