import React from 'react';

const MessageList = ({ messages }) => {
  return (
    <ul className="list-group" style={{marginBottom: 0}}>
      {messages.map( message => (
        <li key={message.id} className={'message ' + (message.id < 0 ? 'optimistic' : '') + ' list-group-item'}>
          {message.text}
        </li>
      ))}
    </ul>
  );
};
export default MessageList;
