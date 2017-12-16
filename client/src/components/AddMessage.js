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

class AddMessage extends React.Component {

  state = {
    text: '',
  }

  handleChange = ev => {
    const { name, value } = ev.target;
    this.setState({[name]: value});
  }

  handleSubmit = ev => {
    ev.preventDefault();
    const { match, mutate } = this.props;
    const { text } = this.state;
    mutate({
      variables: {
        message: {
          text,
          channelId: match.params.channelId,
        }
      },
      update: (store, { data: { addMessage } }) => {
        // Read the data from the cache for this query.
        const data = store.readQuery({
          query: channelDetailsQuery,
          variables: {channelId: match.params.channelId},
        });
        // Add our Message from the mutation to the end.
        if(!data.channel.messages.find((msg) => msg.id === addMessage.id)) {
          // Add our Message from the mutation to the end.
          data.channel.messages.push(addMessage);
        }
        // Write the data back to the cache.
        store.writeQuery({
          query: channelDetailsQuery,
          variables: {channelId: match.params.channelId},
          data,
        });
      },
      optimisticResponse: {
        addMessage: {
          __typename: 'Message',
          text,
          id: String(Math.round(Math.random() * -10000)),
        },
      },
    }).then(() => {
      this.setState({text: ''});
    });
  }

  render() {
    const { text } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="New message"
            name="text"
            value={text}
            onChange={this.handleChange}
          />
          <div className="input-group-btn">
            <button className="btn btn-primary">Post</button>
          </div>
        </div>
      </form>
    );
  }

}

const AddMessageWithMutation = graphql(
  addMessageMutation,
)(withRouter(AddMessage));
export default AddMessageWithMutation;
