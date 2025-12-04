
// import React from 'react';

// export interface ChatMessage {
//   id: string;
//   role: 'user' | 'model' | 'error';
//   content: string;
// }

// export interface StoredData {
//   code: string;
//   chatHistory: ChatMessage[];
// }

// // Type for a React component that can be dynamically loaded
// export type DynamicReactComponent = React.FC | null;


export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'error';
  content: string;
}

export interface StoredData {
  htmlCode: string;
  cssCode: string;
  jsCode: string;
  chatHistory: ChatMessage[];
}