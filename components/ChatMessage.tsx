
import React from 'react';
import { ChatMessage } from '../types';
import Markdown from 'react-markdown'; // A simple markdown renderer

interface ChatMessageProps {
  message: ChatMessage;
}

const ChatMessageComponent: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const isError = message.role === 'error';

  const containerClasses = isUser
    ? 'flex justify-end mb-4'
    : 'flex justify-start mb-4';

  const bubbleClasses = `max-w-[70%] px-4 py-2 rounded-lg shadow-md break-words ${
    isUser
      ? 'bg-blue-600 text-white rounded-br-none'
      : isError
      ? 'bg-red-700 text-red-100 rounded-bl-none'
      : 'bg-gray-700 text-gray-100 rounded-bl-none'
  }`;

  return (
    <div className={containerClasses}>
      <div className={bubbleClasses}>
        <Markdown>{message.content}</Markdown>
      </div>
    </div>
  );
};

export default ChatMessageComponent;
