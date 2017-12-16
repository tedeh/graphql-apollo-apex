const { withFilter, PubSub } = require('graphql-subscriptions');

const channels = [{
  id: '1',
  name: 'soccer',
  messages: [],
}, {
  id: '2',
  name: 'baseball',
  messages: [],
}];

const channelById = id => channels.find(ch => ch.id === id);

let nextId = 3
let nextMessageId = 1;

const pubsub = new PubSub();

const resolvers = {
  Query: {
    channels: () => {
      return channels;
    },
    channel: (root, args) => {
      return channelById(args.id);
    },
  },
  Mutation: {
    addChannel: (root, args) => {
      const newChannel = { id: String(nextId++), name: args.name, messages: [] };
      channels.push(newChannel);
      return newChannel;
    },
    addMessage: (root, {message}) => {
      const ch = channelById(message.channelId);
      if(!ch) {
        throw new Error(`Channel with id ${message.channelId} does not exist`);
      }

      const newMessage = { id: String(nextMessageId++), text: message.text};
      ch.messages.push(newMessage);

      pubsub.publish('messageAdded', {
        messageAdded: newMessage,
        channelId: message.channelId,
      });

      return newMessage;
    },
  },
  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('messageAdded'),
        (payload, variables) => {
          return payload.channelId === variables.channelId;
        }
      ),
    },
  },
};

module.exports = resolvers;
