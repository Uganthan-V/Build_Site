
// import React from 'react';
// import Markdown from 'react-markdown';

// interface ErrorDisplayProps {
//   errorMessage: string | null;
//   aiAnalysis: string | null;
//   onClearError: () => void;
// }

// const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ errorMessage, aiAnalysis, onClearError }) => {
//   if (!errorMessage) return null;

//   return (
//     <div className="absolute inset-x-0 bottom-0 p-4 bg-red-900 text-red-100 rounded-t-lg shadow-lg z-20">
//       <div className="flex justify-between items-center mb-2">
//         <h3 className="text-lg font-semibold flex items-center">
//           <svg className="h-6 w-6 mr-2 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//           </svg>
//           Error Detected!
//         </h3>
//         <button
//           onClick={onClearError}
//           className="p-1 rounded-full text-red-300 hover:bg-red-800 hover:text-white transition-colors duration-200"
//         >
//           <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//           </svg>
//         </button>
//       </div>
//       <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-red-600 scrollbar-track-red-900">
//         <p className="font-mono text-sm mb-4">
//           <strong className="block mb-1">Message:</strong>
//           {errorMessage}
//         </p>
//         {aiAnalysis && (
//           <div>
//             <strong className="block mb-1">AI Analysis & Suggestions:</strong>
//             <div className="prose prose-sm max-w-none text-red-100 font-mono-code text-sm">
//               <Markdown>{aiAnalysis}</Markdown>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ErrorDisplay;


// components/ErrorDisplay.tsx
import React from 'react';

interface ErrorDisplayProps {
  errorMessage: string;
  aiAnalysis?: string | null;   // ← Now optional
  onClearError: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ errorMessage, aiAnalysis, onClearError }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-red-900 border border-red-600 p-5 rounded-xl shadow-2xl max-w-lg">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-red-100 text-lg">Build Error</h3>
        <button onClick={onClearError} className="text-red-300 hover:text-white text-xl">×</button>
      </div>

      <pre className="text-sm bg-black/30 p-3 rounded overflow-x-auto text-red-200">
        {errorMessage}
      </pre>

      {aiAnalysis && (
        <div className="mt-4 p-4 bg-amber-900/50 border border-amber-600 rounded-lg">
          <p className="font-semibold text-amber-200 mb-2">AI Suggested Fix:</p>
          <p className="text-amber-100 text-sm leading-relaxed">{aiAnalysis}</p>
        </div>
      )}

      <button
        onClick={onClearError}
        className="mt-4 w-full py-2 bg-red-700 hover:bg-red-600 rounded-lg font-medium transition"
      >
        Dismiss
      </button>
    </div>
  );
};

export default ErrorDisplay;