
// import React from 'react';

// interface CodeEditorProps {
//   code: string;
//   onCodeChange: (newCode: string) => void;
//   readOnly?: boolean;
// }

// const CodeEditor: React.FC<CodeEditorProps> = ({ code, onCodeChange, readOnly = false }) => {
//   return (
//     <div className="relative h-full w-full bg-gray-800 rounded-lg overflow-hidden">
//       <textarea
//         className="font-mono-code text-sm w-full h-full p-4 bg-transparent text-gray-200 resize-none outline-none border-none leading-relaxed"
//         value={code}
//         onChange={(e) => onCodeChange(e.target.value)}
//         spellCheck="false"
//         autoCapitalize="off"
//         autoCorrect="off"
//         readOnly={readOnly}
//         placeholder="Your generated code will appear here..."
//       />
//     </div>
//   );
// };

// export default CodeEditor;


import React from 'react';

interface CodeEditorProps {
  htmlCode: string;
  cssCode: string;
  jsCode: string;
  setHtmlCode: (code: string) => void;
  setCssCode: (code: string) => void;
  setJsCode: (code: string) => void;
  activeTab: 'html' | 'css' | 'js';
  setActiveTab: (tab: 'html' | 'css' | 'js') => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  htmlCode,
  cssCode,
  jsCode,
  setHtmlCode,
  setCssCode,
  setJsCode,
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className="relative h-full w-full bg-gray-800 rounded-lg overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setActiveTab('html')}
          className={`px-4 py-2 font-semibold ${
            activeTab === 'html' ? 'bg-gray-700 text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:bg-gray-700'
          }`}
        >
          index.html
        </button>
        <button
          onClick={() => setActiveTab('css')}
          className={`px-4 py-2 font-semibold ${
            activeTab === 'css' ? 'bg-gray-700 text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:bg-gray-700'
          }`}
        >
          styles.css
        </button>
        <button
          onClick={() => setActiveTab('js')}
          className={`px-4 py-2 font-semibold ${
            activeTab === 'js' ? 'bg-gray-700 text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:bg-gray-700'
          }`}
        >
          index.js
        </button>
      </div>

      {/* Code Area */}
      <textarea
        className="font-mono-code text-sm w-full h-[calc(100%-2.5rem)] p-4 bg-transparent text-gray-200 resize-none outline-none border-none leading-relaxed"
        value={activeTab === 'html' ? htmlCode : activeTab === 'css' ? cssCode : jsCode}
        onChange={(e) => {
          if (activeTab === 'html') setHtmlCode(e.target.value);
          else if (activeTab === 'css') setCssCode(e.target.value);
          else setJsCode(e.target.value);
        }}
        spellCheck="false"
        autoCapitalize="off"
        autoCorrect="off"
        placeholder={`Enter ${activeTab} code here...`}
      />
    </div>
  );
};

export default CodeEditor;