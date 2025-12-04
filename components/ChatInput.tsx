
// import React, { useState, useRef, useEffect } from 'react';

// interface ChatInputProps {
//   onSendMessage: (message: string) => void;
//   isLoading: boolean;
// }

// const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
//   const [input, setInput] = useState('');
//   const textareaRef = useRef<HTMLTextAreaElement>(null);

//   const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     setInput(e.target.value);
//   };

//   const handleSend = () => {
//     if (input.trim() && !isLoading) {
//       onSendMessage(input.trim());
//       setInput('');
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   // Auto-resize textarea
//   useEffect(() => {
//     if (textareaRef.current) {
//       textareaRef.current.style.height = 'auto';
//       textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
//     }
//   }, [input]);

//   return (
//     <div className="flex items-end p-4 border-t border-gray-700 bg-gray-800 sticky bottom-0 z-10">
//       <textarea
//         ref={textareaRef}
//         className="flex-grow min-h-[48px] max-h-[160px] p-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-y-auto font-mono-code scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-800"
//         value={input}
//         onChange={handleInputChange}
//         onKeyDown={handleKeyDown}
//         placeholder={isLoading ? 'AI is thinking...' : 'Type your prompt here...'}
//         rows={1}
//         disabled={isLoading}
//       />
//       <button
//         onClick={handleSend}
//         className={`ml-4 px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
//           isLoading || !input.trim()
//             ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
//             : 'bg-blue-600 hover:bg-blue-700 text-white'
//         }`}
//         disabled={isLoading || !input.trim()}
//       >
//         {isLoading ? (
//           <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//           </svg>
//         ) : (
//           'Send'
//         )}
//       </button>
//     </div>
//   );
// };

// export default ChatInput;

import React, { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  return (
    <div className="p-4 border-t border-gray-700 bg-gray-800 sticky bottom-0 z-10">
      <div className="relative">
        <textarea
          ref={textareaRef}
          className="w-full h-32 min-h-[48px] max-h-[200px] p-4 pr-12 border border-gray-600 rounded-xl bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-y-auto font-mono scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-800 placeholder-gray-400"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={isLoading ? 'AI is thinking...' : 'Describe your web app idea... (Enter to send, Shift+Enter for new line)'}
          disabled={isLoading}
        />
        {/* Send Icon Inside Input */}
        <button
          onClick={handleSend}
          className={`absolute bottom-4 right-4 p-2 rounded-full transition-colors duration-200 ${
            isLoading || !input.trim()
              ? 'text-gray-500 cursor-not-allowed'
              : 'text-blue-400 hover:text-blue-300'
          }`}
          disabled={isLoading || !input.trim()}
          title="Send (Enter)"
        >
          <span className="material-symbols-outlined text-lg">
            send
          </span>
        </button>
      </div>
    </div>
  );
};

export default ChatInput;