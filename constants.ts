
// export const LOCAL_STORAGE_CODE_KEY = 'aiCodeEditor_code';
// export const LOCAL_STORAGE_CHAT_HISTORY_KEY = 'aiCodeEditor_chatHistory';

// export const GEMINI_MODEL_CODE_GENERATION = ''; // Suitable for complex code tasks
// export const GEMINI_MODEL_ERROR_ANALYSIS = 'gemini-2.5-flash'; // Flash is good for quick analysis

// export const INITIAL_CODE_SNIPPET = `import React from 'react';

// export const PreviewComponent: React.FC = () => {
//   return (
//     <div className="p-4 bg-gray-700 text-white min-h-screen flex flex-col items-center justify-center">
//       <h1 className="text-4xl font-bold mb-4">Hello AI Code Studio!</h1>
//       <p className="text-lg">Start coding with AI assistance.</p>
//       <button className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold">
//         Click Me!
//       </button>
//     </div>
//   );
// };`;

export const LOCAL_STORAGE_CODE_KEY = 'aiCodeEditor_code';
export const LOCAL_STORAGE_CHAT_HISTORY_KEY = 'aiCodeEditor_chatHistory';

// Use Gemini 2.5 Flash everywhere — fast, cheap, and code-smart (stable as of Dec 2025)
export const GEMINI_MODEL = 'gemini-2.5-flash';  // One model rules all (or swap to 'gemini-2.5-pro' for max quality)

// Legacy aliases (update your services to use GEMINI_MODEL)
export const GEMINI_MODEL_CODE_GENERATION = GEMINI_MODEL;
export const GEMINI_MODEL_ERROR_ANALYSIS = GEMINI_MODEL;

export const INITIAL_CODE_SNIPPET = `import React from 'react';

export const PreviewComponent: React.FC = () => {
  return (
    <div className="p-4 bg-gray-700 text-white min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Hello AI Code Studio!</h1>
      <p className="text-lg">Start coding with AI assistance.</p>
      <button className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold">
        Click Me!
      </button>
    </div>
  );
};`;